import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Shorten URLs
        </Button>
        <Button color="inherit" component={RouterLink} to="/statistics">
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;