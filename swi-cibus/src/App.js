import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import TopBar from './TopBar'
import OrdersList from './OrdersList'

function App() {
  return (
    <>
      <CssBaseline />
      <Container fixed maxWidth="xl">
        <Box sx={{ flexGrow: 1 }}>
          <TopBar/>
        </Box>
        <Box sx={{ height: '100vh' }}>
          <OrdersList/>
        </Box>
      </Container>
    </>
  );
}

export default App;
