import { useState, forwardRef } from 'react'
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Gravatar from 'react-gravatar'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const OrderItem = ({ item }) =>  {
  const { name, email, picture } = item;
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarOpen = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleOrderDelivered = () => {
    setModalOpen(false);
    // Here should call API PUT call and then show snackbar according to the result of the API
    handleSnackbarOpen();
  }
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return(
    <>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Notification has been sent!
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
            Are you sure the order arrived?
          </Typography>
          <Button onClick={handleOrderDelivered}>Yes</Button>
          <Button onClick={handleModalClose}>No</Button>
        </Box>
      </Modal>
      <ListItem
        onClick={handleModalOpen}
        key={name}
        disablePadding
      >
        <ListItemButton>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={picture?.large} />
          </ListItemAvatar>
          <ListItemText id={email} primary={`${name?.first} ${name?.last}`} />
        </ListItemButton>
      </ListItem>
    </>
  );
}

export default OrderItem;
