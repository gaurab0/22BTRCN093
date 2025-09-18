import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { isValidUrl } from '../utils/validation';

const ShortenUrls = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validityPeriod: '', shortCode: '' }]);
  const [errors, setErrors] = useState([{}]);
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validityPeriod: '', shortCode: '' }]);
      setErrors([...errors, {}]);
    }
  };

  const handleRemoveUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setUrls(newUrls);
    setErrors(newErrors);
  };

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);

    // Validate input
    const newErrors = [...errors];
    newErrors[index] = { ...newErrors[index] };

    if (field === 'longUrl') {
      if (!value) {
        newErrors[index].longUrl = 'URL is required';
      } else if (!isValidUrl(value)) {
        newErrors[index].longUrl = 'Invalid URL format';
      } else {
        delete newErrors[index].longUrl;
      }
    }

    if (field === 'validityPeriod') {
      if (value && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
        newErrors[index].validityPeriod = 'Validity period must be a positive integer';
      } else {
        delete newErrors[index].validityPeriod;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all URLs
    const hasErrors = errors.some(error => Object.keys(error).length > 0);
    if (hasErrors) {
      return;
    }

    try {
      const response = await urlService.shortenUrls(urls);
      setShortenedUrls(response);
    } catch (error) {
      console.error('Error shortening URLs:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shorten URLs
      </Typography>
      
      {urls.map((url, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={url.longUrl}
                  onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
                  error={!!errors[index]?.longUrl}
                  helperText={errors[index]?.longUrl}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validity Period (minutes)"
                  type="number"
                  value={url.validityPeriod}
                  onChange={(e) => handleChange(index, 'validityPeriod', e.target.value)}
                  error={!!errors[index]?.validityPeriod}
                  helperText={errors[index]?.validityPeriod}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Preferred Short Code (optional)"
                  value={url.shortCode}
                  onChange={(e) => handleChange(index, 'shortCode', e.target.value)}
                />
              </Grid>
              {urls.length > 1 && (
                <Grid item xs={12}>
                  <Button
                    color="error"
                    onClick={() => handleRemoveUrl(index)}
                  >
                    Remove URL
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))}

      {urls.length < 5 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddUrl}
          sx={{ mr: 2, mb: 2 }}
        >
          Add Another URL
        </Button>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
      >
        Shorten URLs
      </Button>

      {shortenedUrls.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Shortened URLs
          </Typography>
          {shortenedUrls.map((result, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">Original URL: {result.originalUrl}</Typography>
                <Typography variant="body1">Short URL: {result.shortUrl}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Expires: {new Date(result.expiryDate).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ShortenUrls;