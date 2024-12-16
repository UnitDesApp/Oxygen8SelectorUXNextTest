import { useCallback, useState } from 'react';
import * as React from 'react';
// materials
import {
  Stack,
  InputAdornment,
  TextField,
  Button,
  Paper,
  Divider,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
// components

// ----------------------------------------------------------------------
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const CustomerTypeOptions = [
  { name: 'All', value: '1' },
  { name: 'Admin', value: '2' },
  { name: 'Internal', value: '3' },
  { name: 'Rep Firm', value: '4' },
  { name: 'Specifying Firm', value: '5' },
];

interface UserTableToolbarProps {
  filterName: string;
  onFilterName: Function;
  onFilterByCustomerName: Function;
  userNum: number;
  onDeleteSelectedData: Function;
  toolbar: any;
}

export default function UserTableToolbar({
  filterName,
  onFilterName,
  onFilterByCustomerName,
  userNum,
  onDeleteSelectedData,
  toolbar
}: UserTableToolbarProps) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [customerType, setCustomerType] = useState<number>(1);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: any) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(
    (type: any) => {
      onFilterByCustomerName(type);
      setCustomerType(type);
      setAnchorEl(null);
    },
    [onFilterByCustomerName]
  );

  return (
    <>
    {
      toolbar?

  
    <Stack
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ py: 2.5, px: 3 }}
    >
      <Item sx={{ width: { md: '20%', xs: '100%' } }}>
        <Typography> All users ({userNum}) </Typography>
      </Item>
      <Item sx={{ width: { md: '60%', xs: '100%' } }}>
        <Stack direction="row" justifyContent="left" spacing={3}>
          <Button
            id="filter"
            startIcon={<Iconify icon="ic:outline-filter-alt" />}
            onClick={handleClick}
            >
            {CustomerTypeOptions?.[customerType - 1]?.name || 'Customer Type'}
          </Button>
          <Menu
            id="filter"
            MenuListProps={{
              'aria-labelledby': 'filter',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose(customerType)}
            PaperProps={{
              style: {
                maxHeight: '300px',
                width: '20ch',
              },
            }}
          >
            {CustomerTypeOptions.map((item, key) => (
              <MenuItem
                key={key}
                value={item.value}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
                onClick={(event: any) => handleClose(event.target.attributes.value.value)}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
          {/* <Button startIcon={<Iconify icon={'ic:sharp-sort'} />}>Sort</Button> */}
          <Button
            startIcon={<Iconify icon="ic:outline-delete-outline" />}
            onClick={() => onDeleteSelectedData && onDeleteSelectedData()}
          >
            Delete
          </Button>
        </Stack>
      </Item>
      <Item sx={{ width: { md: '20%', xs: '100%' } }}>
        <TextField
          fullWidth
          size="small"
          value={filterName}
          onChange={(event) => onFilterName(event.target.value)}
          placeholder="Search User"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            ),
          }}
        />
      </Item>
    </Stack>


:
<Stack
spacing={2}
divider={<Divider orientation="vertical" flexItem />}
direction={{ xs: 'column', sm: 'row' }}
sx={{ py: 2.5, px: 3, justifyContent: { sm: 'flex-end', xs: 'flex-start' } }}
>
<Item sx={{ width: { md: '20%', xs: '100%' } }}>
  <TextField
    fullWidth
    size="small"
    value={filterName}
    onChange={(event) => onFilterName(event.target.value)}
    placeholder="Search User"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Iconify
            icon="eva:search-fill"
            sx={{ color: 'text.disabled', width: 20, height: 20 }}
          />
        </InputAdornment>
      ),
    }}
  />
</Item>
</Stack>
}
                  </>
  );
}
