// import fs from 'fs';
import { promises as fs } from 'fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const appendFile = promisify(fs.appendFile);
// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) { }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(__dirname, 'searchHistory.json');
      
  // TODO: Define a read method that reads from the searchHistory.json file

  private async ensureFileExists() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await fs.writeFile(this.filePath, JSON.stringify([]));
      } else {
        throw error;
      }
    }
  }

  // private async read() {}
  private async read() {
    try {
      await this.ensureFileExists();
     const data = await fs.readFile(this.filePath, 'utf-8');
      if (!data) {
        return [];
      }
      return JSON.parse(data as string);
    } catch (err) {

      return console.log('Error reading the file', err);
      throw err;

    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]) {
    try {
        // await cities.forEach((city)=>{
      fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
      //  }

    } catch (err) {

      return console.log('Error reading the file', err);
      throw err;

    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    try {
      const cities: City[] = await this.read();
      return cities;
    } catch (error) {
      console.error('Error reading search history file:', error);
      return [];
    }
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string) {
    try {
      const cities = await this.getCities();
      const newCity = new City(uuidv4(), city);
      cities.push(newCity);
      await this.write(cities);
    } catch (error) {
      console.error('Error adding city:', error);
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string) {
    try {
      let cities = await this.getCities();
      cities = cities.filter(city => city.id !== id);
      await this.write(cities);
    } catch (error) {
      console.error('Error removing city:', error);
    }
  }
}

export default new HistoryService();
