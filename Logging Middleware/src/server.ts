import express from 'express';
import cors from 'cors';
import { LoggingMiddleware } from './LoggingMiddleware';

const app = express();
const port = 3000;

const logger = new LoggingMiddleware('your-auth-token-here');

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.log('backend', 'info', 'handler', `Incoming ${req.method} request to ${req.path}`);
  next();
});

app.post('/api/shorten', (req, res) => {
  try {
    const urls = req.body;
    const shortenedUrls = urls.map((url: any) => ({
      originalUrl: url.longUrl,
      shortUrl: `http://localhost:3000/s/${Math.random().toString(36).substr(2, 6)}`,
      expiryDate: url.validityPeriod 
        ? new Date(Date.now() + parseInt(url.validityPeriod) * 60000).toISOString()
        : new Date(Date.now() + 24 * 60 * 60000).toISOString()
    }));

    logger.log('backend', 'info', 'handler', 'URLs shortened successfully');
    res.json(shortenedUrls);
  } catch (error: any) {
    logger.log('backend', 'error', 'handler', `Error shortening URLs: ${error.message}`);
    res.status(500).json({ error: 'Failed to shorten URLs' });
  }
});

app.get('/api/statistics', (req, res) => {
  try {
    const statistics = [
      {
        shortUrl: 'http://localhost:3000/s/abc123',
        originalUrl: 'https://example.com',
        createdAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 24 * 60 * 60000).toISOString(),
        totalClicks: 5,
        clicks: [
          {
            timestamp: new Date().toISOString(),
            source: 'Chrome/Windows',
            location: 'New York, USA'
          }
        ]
      }
    ];

    logger.log('backend', 'info', 'handler', 'Statistics retrieved successfully');
    res.json(statistics);
  } catch (error: any) {
    logger.log('backend', 'error', 'handler', `Error retrieving statistics: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});
app.listen(port, () => {
  logger.log('backend', 'info', 'handler', `Server running at http://localhost:${port}`);
});