import React, { useCallback } from 'react';
import { Stack, ToggleButtonGroup, ToggleButton, Typography,Paper, Button, Box } from '@mui/material';
import Iconify from 'src/components/iconify';
import { styled } from '@mui/material/styles';

type ResourceHeaderProps = {
  curValue: string;
  updateCurValue: Function;
};

const ResourceHeader = ({ curValue, updateCurValue }: ResourceHeaderProps) => {
  const handleAlignment = useCallback(
    (e: any, newValue: any) => {
      if (newValue) updateCurValue(newValue);
    },
    [updateCurValue]
  );

  const buttonClick = () => {
    window.open("https://oxygen8.ca/lti/", "_blank");

  };
  
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

  return (
    <Box sx={{display:'flex',justifyContent:'space-between'}}>
    <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={5}>
      <ToggleButtonGroup
        color="primary"
        value={curValue}
        exclusive
        onChange={handleAlignment}
        aria-label="Platform"
        >
        <ToggleButton value="all">
          {curValue === 'all' && (
            <Iconify icon="material-symbols:check-circle-outline" sx={{ marginRight: '10px' }} />
          )}
          <Typography>All</Typography>
        </ToggleButton>
        <ToggleButton value="nova">
          {curValue === 'nova' && (
            <Iconify icon="material-symbols:check-circle-outline" sx={{ marginRight: '10px' }} />
          )}
          <Typography>Nova</Typography>
        </ToggleButton>
        <ToggleButton value="ventum">
          {curValue === 'ventum' && (
            <Iconify icon="material-symbols:check-circle-outline" sx={{ marginRight: '10px' }} />
          )}
          <Typography>Ventum</Typography>
        </ToggleButton>
        <ToggleButton value="ventum_plus">
          {curValue === 'ventum_plus' && (
            <Iconify icon="material-symbols:check-circle-outline" sx={{ marginRight: '10px' }} />
          )}
          <Typography>Ventum Plus</Typography>
        </ToggleButton>
        <ToggleButton value="terra">
          {curValue === 'terra' && (
            <Iconify icon="material-symbols:check-circle-outline" sx={{ marginRight: '10px' }} />
          )}
          <Typography>Terra</Typography>
        </ToggleButton>
        <ToggleButton value="ventum_lite">
          {curValue === 'ventum_lite' && (
            <Iconify icon="material-symbols:check-circle-outline" sx={{ marginRight: '10px' }} />
          )}
          <Typography>Ventum lite</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
    <Item sx={{ width: { md: '20%', xs: '100%' } }}>
      <Button variant="contained" onClick={buttonClick}>
     View Lead Time Indicator
    </Button>
    </Item>
          </Box>
  );
};

export default ResourceHeader;
