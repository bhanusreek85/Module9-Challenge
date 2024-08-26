import { Router, type Request, type Response } from 'express';
const router = Router();


// import HistoryService from '../../service/historyService.js';
import HistoryService from  '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  const { cityName } = req.body;
 
  try {
    // GET weather data from city name
    // process.env.cityName = cityName;
    const weatherResponse = await WeatherService.getWeatherForCity(cityName);
    const weatherData = weatherResponse;

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Send response
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data or saving city:', error);
    res.status(500).send('Error fetching weather data or saving city');
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).send('Error fetching search history');
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await HistoryService.removeCity(id);
    res.json({ message: 'City deleted from search history' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).send('Error deleting city from search history');
  }
});

export default router;
