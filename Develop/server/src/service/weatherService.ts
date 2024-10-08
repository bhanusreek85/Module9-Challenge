import dotenv from "dotenv";
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  description: string;

  constructor(
    city: string,
    date: string,
    icon: string,
    tempF: number,
    humidity: number,
    windSpeed: number,
    description: string
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.tempF = tempF;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.description = description;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor(baseURL: string, apiKey: string, cityName = "Irvine") {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.cityName = cityName;
  }

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string): Promise<any> {
    // console.log(`${this.baseURL}/${query}/${this.apiKey}`);
    try {
      const fullurl = `${this.baseURL}/geo/1.0/direct${query}&apikey=${this.apiKey}`;
      console.log(fullurl);
      const response = await fetch(fullurl);
      if (!response.ok) {
        throw new Error(`Error fetching location data:${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.log("Error fetching location data:", err);
      throw err;
    }
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { latitude, longitude } = locationData;
    return { latitude, longitude };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    const query = `?q=${this.cityName}&apikey=${this.apiKey}`;
    return query;
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    console.log(coordinates);
    const { latitude, longitude } = this.destructureLocationData(coordinates);
    return `?lat=${latitude}&lon=${longitude}&apikey=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    try {
      const response = await this.fetchLocationData(query);
      return { latitude: response[0].lat, longitude: response[0].lon };
    } catch (err) {
      console.log("Error fetching location data:", err);
      throw err;
    }
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(query: string) {}
  private async fetchWeatherData(query: string, suburl: string): Promise<any> {
    try {
      const fullurl = `${this.baseURL}/data/2.5/${suburl}${query}`;
      console.log(fullurl);
      const response = await fetch(fullurl);

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.log("Error fetching weather data:", err);
      throw err;
    }
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const currentWeatherData = response;
    const temperatureInKelvin = currentWeatherData.main.temp;
    const temperature = parseFloat(
      (((temperatureInKelvin - 273.15) * 9) / 5 + 32).toFixed(2)
    );
    const humidity = currentWeatherData.main.humidity;
    const windSpeed = currentWeatherData.wind.speed;
    const description = currentWeatherData.weather[0].description;
    const icon = currentWeatherData.weather[0].icon;
    const city = this.cityName;
    const currentday = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return new Weather(
      city,
      currentday,
      icon,
      temperature,
      humidity,
      windSpeed,
      description
    );
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(
    currentWeather: Weather,
    weatherData: any[]
  ): Weather[] {
    const forecastArray: Weather[] = [];
    //First one should be current Weather
    forecastArray.push(currentWeather);

    const dailyData: { [date: string]: any[] } = {};
    // Group data by date
    weatherData.forEach((data) => {
      const date = data.dt_txt.split(" ")[0]; // Extract date part
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(data);
    });

    // Select a representative sample for each day and push to
    //forecastweather
    Object.keys(dailyData)
      .slice(0, 5)
      .forEach((date) => {
        const city = this.cityName;
        const dayData = dailyData[date][1]; // Select the first entry of the day
        const temperatureInKelvin = dayData.main.temp;
        const temperature = parseFloat(
          (((temperatureInKelvin - 273.15) * 9) / 5 + 32).toFixed(2)
        );
        const humidity = dayData.main.humidity;
        const windSpeed = dayData.wind.speed;
        const description = dayData.weather[0].description;
        const icon = dayData.weather[0].icon;
        const date_cal = new Date(dayData.dt_txt);

        // Extract month, day, and year
        const month = (date_cal.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
        const day = date_cal.getDate().toString().padStart(2, "0");
        const year = date_cal.getFullYear();

        // Format the date as MM/DD/YYYY
        const formattedDate = `${month}/${day}/${year}`;

        const weather = new Weather(
          city,
          formattedDate,
          icon,
          temperature,
          humidity,
          windSpeed,
          description
        );
        forecastArray.push(weather);
      });

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string) {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherQuery = this.buildWeatherQuery(coordinates);
      const weatherData = await this.fetchWeatherData(weatherQuery, "weather");
      const currentWeather = this.parseCurrentWeather(weatherData);
      const weatherFcData = await this.fetchWeatherData(
        weatherQuery,
        "forecast"
      );
      const forecastArray = this.buildForecastArray(
        currentWeather,
        weatherFcData.list
      );
      return forecastArray;
    } catch (err) {
      console.log("Error getting weather for city:", err);
      throw err;
    }
  }
}

const baseURL = process.env.API_BASE_URL!;
const apiKey = process.env.API_KEY!;
// const cityName = process.env.CITY_NAME!;
export default new WeatherService(baseURL, apiKey);
