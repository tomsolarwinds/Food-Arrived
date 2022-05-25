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

const FIVE_MINUTES = 5 * 60 * 1000;

const OrdersList = () =>  {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const api = useApi();
  const onRemoveOrder = (email) => setData(data.filter(item => item?.email !== email))
  const setAllToFalse = async () => api.put('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/setArrived', {});
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const response = await api.get('http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/orders', {});
        setData(response?.data);
        setLoading(false);
      } catch {
        setLoading(false);
        setData(null);
      }
    };
    fetch();
    const intervalId = setInterval(() => {
      fetch();
    }, FIVE_MINUTES);
    return () => clearInterval(intervalId);
  }, [api]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
      <CircularProgress />
    </Box>
  );
  if (!data || !data?.length) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
      <>אין הזמנות פעילות</>
      <button onClick={setAllToFalse}>אפס הזמנות</button>
    </Box>
  )
  return (
    <List style={style}>
      {data?.map((item) => <OrderItem key={item?.email} item={item} onRemoveOrder={onRemoveOrder} />)}
    </List>
  );
}

export default OrdersList;
