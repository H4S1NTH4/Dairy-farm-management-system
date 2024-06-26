import React,{ useState }  from 'react';
import { Container, Box, Button, Popover, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import duvini from '../../assets/Duvini (2).jpeg';
import Sidebar from '../../components/Veterinary/vetNav';
import ReduceStockForm from '../../components/Supplier/ReduceStockForm'
import LeaveForm from "../../components/Employees/leaveform"
import QRCodeScanner from '../../components/Employees/QRCodeScanner';

const vetProfile = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null); 

  const handleLeave = (event) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl); 
  const details = [
    { label: 'Name :', value: 'Duvini Ranaweera' },
    { label: 'NIC :', value: '200237991234' },
    { label: 'Employee ID :', value: 'EM03' },
    { label: 'Gender :', value: 'Female' },
    { label: 'Date of Birth :', value: '2002/05/16' },
    { label: 'Position :', value: 'Veterinary Surgeon' },
    { label: 'Work Experience :', value: 'Over 2 years' },
    { label: 'Address :', value: 'No. 14, Main Street, Colombo' },
  ];

  return (
    <div style={{ display: 'flex', minWidth: '1006px', overflow: 'hidden' }}>
      <Sidebar />
      <Container>
        
        <Box
          style={{
            background: 'white',
            marginLeft: '100px',
            border: '1px solid #ddd',
            padding: '20px',
            width: '100%',
            height: '540px',
            borderRadius: '15px',
            marginTop: '80px',
          }}
        >
          
          <Box style={{ padding: '16px', borderRadius: '8px', marginBottom: '6px' }}>
            <Typography
              variant="h4"
              style={{
                marginBottom: '16px',
                fontFamily: 'Poppins',
                fontWeight: 'bold',
                color: '#252B48',
                fontSize: '32px',
              }}
            >
              Hello, Miss Duvini Ranaweera!
            </Typography>
            <Typography
              variant="h5"
              style={{
                marginBottom: '16px',
                fontFamily: 'Poppins',
                color: '#252B48',
                fontSize: '16px',
              }}
            >
              Take a look at your profile details
            </Typography>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={duvini}
                alt="Profile"
                style={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  marginRight: '16px',
                }}
              />
              <div>
                {details.map(({ label, value }, index) => (
                  <Box key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      variant="h6"
                      style={{
                        color: '#252B48',
                        marginLeft:'120px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        fontFamily: 'Poppins',
                        marginRight: '180px',
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="h6"
                      style={{
                        color: '#252B48',
                        fontSize: '20px',
                        fontFamily: 'Poppins',
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </div>
            </Box>
          </Box>
          <Button
            variant="contained"
            style={{
              marginRight: '86px',
              backgroundColor: '#38775B', 
              color: '#ffffff', 
            }}
            onClick={handleLeave}
          >
            Take a Leave
          </Button>
          <ReduceStockForm />
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box>
              <LeaveForm /> 
            </Box>
          </Popover>
          <div style={{ position: 'fixed', top: '530px', right: '170px' }}>
  <QRCodeScanner />
</div>
        </Box>

      </Container>
     
    </div>
  );
};

export default vetProfile;
