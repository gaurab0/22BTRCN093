import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UrlStatistics = () => {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await urlService.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);

      }
    };

    fetchStatistics();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>
      
      {statistics.map((stat, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              Short URL: {stat.shortUrl}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Original URL: {stat.originalUrl}
            </Typography>
            <Typography variant="body2">
              Created: {new Date(stat.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Expires: {new Date(stat.expiryDate).toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Clicks: {stat.totalClicks}
            </Typography>

            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Click Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stat.clicks.map((click, clickIndex) => (
                        <TableRow key={clickIndex}>
                          <TableCell>
                            {new Date(click.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>{click.source}</TableCell>
                          <TableCell>{click.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {statistics.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No statistics available yet.
        </Typography>
      )}
    </Box>
  );
};

export default UrlStatistics;