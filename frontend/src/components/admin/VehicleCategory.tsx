import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// import ChangePassword from './ChangePassword';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BACKEND_URL } from '@/utils/backend';
import AddCategory from './AddCategory';
import ManageCategory from './ManageCategory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Profiledata = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="profile data tabs">
          <Tab label="Add Category" {...a11yProps(0)} />
          <Tab label="Manage Category" {...a11yProps(1)} />
          
        </Tabs> 
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AddCategory/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ManageCategory />
      </CustomTabPanel>
      
    </Box>
  );
};

export default Profiledata;
