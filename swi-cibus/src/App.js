import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TopBar from './TopBar'
import rtl from 'jss-rtl';
import { create } from 'jss';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import OrdersList from './OrdersList'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StylesProvider, jssPreset } from '@mui/styles';

function App() {
  const jss = create({
    plugins: [...jssPreset().plugins, rtl()],
  });
  const theme = createTheme({
    direction: 'rtl',
  });
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });
  return (
    <StylesProvider jss={jss}>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container fixed maxWidth="xl">
            <Box sx={{ flexGrow: 1 }}>
              <TopBar/>
            </Box>
            <Box sx={{ height: '100vh' }}>
              <OrdersList/>
            </Box>
          </Container>
        </ThemeProvider>
      </CacheProvider>
    </StylesProvider>
  );
}

export default App;
