import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import OrderItem from './OrderItem'
import useApi from './hooks/useApi';

const style = {
  position: 'relative',
  marginTop: '60px',
  bgcolor: 'background.paper',
};

const OrdersList = () =>  {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const response = await api.get('https://randomuser.me/api/?results=10.', {
        params: {
        },
      });
      setData(response?.data?.results);
      setLoading(false);
    };
    fetch();
    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
      fetch();
    }, 50000);
    return () => clearInterval(intervalId);
  }, [api]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
      <CircularProgress />
    </Box>
  )

  return (
    <List style={style}>
      {data?.map((item) => <OrderItem key={item?.email} item={item} />)}
    </List>
  );
}

export default OrdersList;
