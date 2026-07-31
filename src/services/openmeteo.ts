import axios from 'axios';
import { findCityBySlug } from '../data/cities';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive';

export interface Coordinates {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
}

function resolveLocation(city: string): { query: string; countryCode?: string } {
  const entry = findCityBySlug(city);
  if (entry) {
    return { query: entry.query, countryCode: entry.countryCode };
  }
  return { query: city.trim().replace(/-+/g, ' ') };
}

async function searchLocation(name: string, countryCode?: string) {
  const params: Record<string, string> = { name, count: '1', language: 'en', format: 'json' };
  if (countryCode) {
    params.countryCode = countryCode;
  }
  return axios.get(GEOCODING_URL, { params });
}

export async function geocodeCity(city: string): Promise<Coordinates> {
  const { query, countryCode } = resolveLocation(city);
  let response = await searchLocation(query, countryCode);
  let result = response.data?.results?.[0];
  if (!result && countryCode) {
    response = await searchLocation(query);
    result = response.data?.results?.[0];
  }
  if (!result) {
    throw new Error(`City "${city}" not found`);
  }
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country,
  };
}

export interface CurrentWeather {
  city: string;
  country: string;
  temperature: number;
  feeling: number;
  precipitation: number;
  cloudCover: number;
  humidity: number;
  uvIndex: number;
  visibility: number;
  windSpeed: number;
  windDirection: string;
  weatherCode: number;
  condition: string;
  obsDate: string;
}

const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export function weatherCodeDescription(code: number): string {
  return WEATHER_CODES[code] ?? 'Unknown';
}

export async function getCurrentWeather(city: string): Promise<CurrentWeather> {
  const { latitude, longitude, name, country } = await geocodeCity(city);
  const response = await axios.get(FORECAST_URL, {
    params: {
      latitude,
      longitude,
      current:
        'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,cloud_cover,uv_index,visibility,wind_speed_10m,wind_direction_10m,weather_code',
      timezone: 'auto',
    },
  });
  const current = response.data.current;
  return {
    city: name,
    country: country ?? '',
    temperature: current.temperature_2m,
    feeling: current.apparent_temperature,
    precipitation: current.precipitation,
    cloudCover: current.cloud_cover,
    humidity: current.relative_humidity_2m,
    uvIndex: current.uv_index,
    visibility: current.visibility,
    windSpeed: current.wind_speed_10m,
    windDirection: degreesTo16Point(current.wind_direction_10m),
    weatherCode: current.weather_code,
    condition: weatherCodeDescription(current.weather_code),
    obsDate: current.time,
  };
}

export interface DailyForecast {
  date: string;
  mintempC: number;
  maxtempC: number;
  avgtempC: number;
  uvIndex: number;
  sunHour: number;
  totalSnow_cm: number;
}

export async function getDailyForecast(city: string, days = 7): Promise<DailyForecast[]> {
  const { latitude, longitude } = await geocodeCity(city);
  const response = await axios.get(FORECAST_URL, {
    params: {
      latitude,
      longitude,
      daily: 'temperature_2m_max,temperature_2m_min,uv_index_max,sunshine_duration,snowfall_sum',
      forecast_days: days,
      timezone: 'auto',
    },
  });
  const daily = response.data.daily;
  return daily.time.map((date: string, index: number) => {
    const min = daily.temperature_2m_min[index];
    const max = daily.temperature_2m_max[index];
    return {
      date,
      mintempC: min,
      maxtempC: max,
      avgtempC: (min + max) / 2,
      uvIndex: daily.uv_index_max[index],
      sunHour: daily.sunshine_duration[index] / 3600,
      totalSnow_cm: daily.snowfall_sum[index],
    };
  });
}

export interface AnalyticsItem {
  city: string;
  tempC: number;
  date: string;
  hour: number;
  humidity: number;
  winddir16Point: string;
  windspeedKmph: number;
  precipMM: number;
  chanceofrain: number;
  cloudcover: number;
  uvIndex: number;
}

export const ANALYTICS_CITIES = ['araguari', 'araxa', 'uberlandia'];

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW',
  'W', 'WNW', 'NW', 'NNW',
];

function degreesTo16Point(degrees: number): string {
  const index = Math.round(degrees / 22.5) % 16;
  return COMPASS_POINTS[index];
}

export async function getAnalytics(days = 7): Promise<AnalyticsItem[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const startDate = start.toISOString().split('T')[0];
  const endDate = end.toISOString().split('T')[0];

  const items: AnalyticsItem[] = [];
  for (const city of ANALYTICS_CITIES) {
    const { latitude, longitude, name } = await geocodeCity(city);
    const response = await axios.get(ARCHIVE_URL, {
      params: {
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        hourly:
          'temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_10m,wind_direction_10m,cloud_cover,uv_index',
        timezone: 'auto',
      },
    });
    const hourly = response.data.hourly;
    hourly.time.forEach((time: string, index: number) => {
      items.push({
        city: name,
        tempC: hourly.temperature_2m[index],
        date: time.slice(0, 10),
        hour: Number(time.slice(11, 13)),
        humidity: hourly.relative_humidity_2m[index],
        winddir16Point: degreesTo16Point(hourly.wind_direction_10m[index]),
        windspeedKmph: Math.round(hourly.wind_speed_10m[index]),
        precipMM: hourly.precipitation[index],
        chanceofrain: hourly.precipitation_probability[index] ?? 0,
        cloudcover: hourly.cloud_cover[index],
        uvIndex: hourly.uv_index[index] ?? 0,
      });
    });
  }
  return items;
}
