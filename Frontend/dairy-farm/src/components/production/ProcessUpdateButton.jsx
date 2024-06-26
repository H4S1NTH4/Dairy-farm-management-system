import React, { useState, useEffect } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent,DialogContentText, DialogActions, Button, TextField, Select, MenuItem, Slider, Typography, FormControl, InputLabel, Checkbox, FormControlLabel, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { Edit as EditIcon } from '@mui/icons-material';
import Draggable from 'react-draggable';
import axios from 'axios';

function ProcessUpdateButton({ id , onUpdated }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState('');
  const [milkQuantity, setMilkQuantity] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [status, setStatus] = useState('started');
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch process details when the component mounts
    fetchProcessDetails();
  }, [id]);

  const fetchProcessDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/processCrud/process/${id}`);
      const processData = response.data;
      // Set process details in state to populate the form
      setProduct(processData.product);
      setMilkQuantity(processData.milkQuantity);
      setIngredients(processData.ingredients);
      setSpecialNotes(processData.specialNotes);
      setScheduleDate(processData.scheduleDate);
      setScheduleTime(processData.scheduleTime);
      setStatus(processData.status);
      setIsScheduled(processData.status === 'scheduled'); // Set scheduling checkbox based on status
    } catch (error) {
      console.error('Error fetching process details:', error);
    }
  };

  const maxMilkQuantity = 1000; // Maximum milk quantity limit

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const handleCancelConfirmation = (confirmed) => {
    setShowCancelConfirmation(false);
    if (confirmed) {
      setOpen(false);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Form submitted');
      setOpen(false);
      const formData = {
        product,
        milkQuantity,
        ingredients,
        specialNotes,
        scheduleDateTime: `${scheduleDate} ${scheduleTime}`,
        status: isScheduled ? 'scheduled' : 'started' // Update status based on scheduling checkbox
      };
      await submitFormToDatabase(formData);
      // Reset form fields after successful submission
      setProduct('');
      setMilkQuantity(0);
      setIngredients([]);
      setSpecialNotes('');
      setScheduleDate('');
      setScheduleTime('');
      setStatus('started'); // Reset status to 'started'
      setIsScheduled(false); // Reset scheduling checkbox
      setSuccessMessage('Form submitted successfully');
    } catch (error) {
      console.error('Failed to submit form data:', error);
      setErrorMessage('Failed to submit form data');
    }
  };

  const submitFormToDatabase = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/processCrud/process/${id}`, formData);
      onUpdated();
      return response.data;
      
    } catch (error) {
      throw error.response.data.message || 'Failed to submit form data';
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div>
      <IconButton color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>
      <Draggable>

      <Dialog  open={open} onClose={handleClose} 
               
               sx={{width:'26.6%' ,

                      '& .MuiBackdrop-root': { 
                      backgroundColor: 'transparent',
                      position: 'absolute',
                      }
            
            }}   style={{ left: '33.4%',right:'37%',top:'8%',
          }} 
            
             >

        <DialogTitle align="center">Add New Process</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-label">Product</InputLabel>
            <Select
              labelId="product-label"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              label="Product"
            >
              <MenuItem value="Chocolate Icecream">Chocolate icecream</MenuItem>
              <MenuItem value="Vanilla Icecream">Vanilla icecream</MenuItem>
              <MenuItem value="Milk">Milk</MenuItem>
              <MenuItem value="Yoghurt">Yoghurt</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Typography id="milk-quantity-slider" gutterBottom>
              Milk Quantity: {milkQuantity} (Max: {maxMilkQuantity})
            </Typography>
            <Slider
              aria-labelledby="milk-quantity-slider"
              value={milkQuantity}
              onChange={(e, newValue) => setMilkQuantity(newValue)}
              min={0}
              max={maxMilkQuantity}
            />
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label={`Milk Quantity (Max: ${maxMilkQuantity})`}
            type="number"
            InputProps={{ inputProps: { min: 0, max: maxMilkQuantity } }}
            value={milkQuantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value >= 0 && value <= maxMilkQuantity) {
                setMilkQuantity(value);
              }
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Ingredients"
            select
            SelectProps={{
              multiple: true,
              value: ingredients,
              onChange: (e) => setIngredients(e.target.value),
            }}
          >
            <MenuItem value="Chocolate powder">Chocolate powder</MenuItem>
            <MenuItem value="Heavy cream">Heavy cream</MenuItem>
            <MenuItem value="Sugar">Sugar</MenuItem>
            <MenuItem value="Vanilla">Vanilla</MenuItem>
          </TextField>
          <TextField
            fullWidth
            margin="normal"
            label="Special Notes"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox checked={isScheduled} onChange={(e) => setIsScheduled(e.target.checked)} />}
            label="Schedule"
          />
          {isScheduled && (
            <div>
              <TextField
                fullWidth
                margin="normal"
                label="Schedule Date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Schedule Time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      </Draggable>
      <Dialog
        open={showCancelConfirmation}
        onClose={() => handleCancelConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cancel Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCancelConfirmation(false)} color="primary">
            No
          </Button>
          <Button onClick={() => handleCancelConfirmation(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar 
      open={!!successMessage} 
      autoHideDuration={2000} 
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
          {successMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar 
      open={!!errorMessage} 
      autoHideDuration={2000} 
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default ProcessUpdateButton;
