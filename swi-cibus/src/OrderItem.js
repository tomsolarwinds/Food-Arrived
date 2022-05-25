import { useState, forwardRef } from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import useApi from './hooks/useApi';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const OrderItem = ({ item, onRemoveOrder }) =>  {
  const api = useApi();
  const { firstName, lastName, email, imgUrl, restaurant } = item;
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const handleErrorSnackbarOpen = () => setErrorSnackbarOpen(true);
  const handleErrorSnackbarClose = () => setErrorSnackbarOpen(false);
  const handleOrderDelivered = async () => {
    setModalOpen(false);
    try {
      const response = await api.put(`http://ec2-18-192-191-34.eu-central-1.compute.amazonaws.com:3000/order/${email}`, {});
      if (response?.status === 200) {
        onRemoveOrder(email)
        handleSnackbarOpen();
      }
    } catch {
      handleErrorSnackbarOpen()
    }
  }
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return(
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          התראה נשלחה בהצלחה!
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={6000} onClose={handleErrorSnackbarClose}>
        <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ width: '100%' }}>
          התראה נכשלה!
        </Alert>
      </Snackbar>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            האם את בטוחה שההזמנה הגיעה?
          </Typography>
          <Button onClick={handleOrderDelivered}>כן</Button>
          <Button onClick={handleModalClose}>לא</Button>
        </Box>
      </Modal>
      <ListItem
        onClick={handleModalOpen}
        key={`${firstName} ${lastName}`}
        disablePadding
      >
        <ListItemButton>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={imgUrl} />
          </ListItemAvatar>
          <ListItemText id={email} primary={`${firstName} ${lastName} (${restaurant})`} />
        </ListItemButton>
      </ListItem>
    </>
  );
}

export default OrderItem;
