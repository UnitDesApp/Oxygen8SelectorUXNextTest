// @mui
import { styled } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Stack, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useState } from 'react';
import { useGetAccountInfo } from 'src/hooks/useApi';
import UserDialog from '../../component/userDialog';
// components

// ----------------------------------------------------------------------

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  width: 30,
  height: 30,
  color: theme.palette.primary.main,
}));

// ----------------------------------------------------------------------

interface UserTableRowProps {
  row: any;
  selected: boolean;
  isCheckbox: boolean;
  onEditRow: Function;
  onSelectRow: Function;
  onDeleteRow: Function;
}

export default function UserTableRow({
  row,
  selected,
  isCheckbox = true,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: UserTableRowProps) {
  const {
    username,
    first_name,
    last_name,
    CustomerName,
    email,
    name,
    access,
    access_level,
    access_pricing,
    created_date,
  } = row || {};

  console.log(row);
  const {refetch } = useGetAccountInfo();
  const [addUserDlgOpen, setAddUserDlgOpen] = useState(false);
  const [successDlgOpen, setSuccessDlgOpen] = useState(false);
  const [failDlgOpen, setFailDlgOpen] = useState(false);
  const [successText, setSuccessText] = useState('');

  const onCloseUserDlg = () => {
    setAddUserDlgOpen(false);
  };
  const onSuccessAddUser = () => {
    setSuccessText('New user has been added');
    setSuccessDlgOpen(true);
  };

  return (
    <>
    <TableRow hover sx={{ borderBottom: '1px solid #a7b1bc' }} selected={selected}>
      {isCheckbox && (
        <TableCell  width="2.5%" padding="checkbox">
          <Checkbox checked={selected} onClick={() => onSelectRow()} />
        </TableCell>
      )}
      {/* <CustomTableCell label={first_name} onClick={() => onEditRow()} />
      <CustomTableCell label={last_name} onClick={() => onEditRow()} />
      <CustomTableCell label={name} onClick={() => onEditRow()} />
      <CustomTableCell label={username} onClick={() => onEditRow()} />
      <CustomTableCell label={email} onClick={() => onEditRow()} />
      <CustomTableCell label={access} onClick={() => onEditRow()} />
      <CustomTableCell label={access_level} onClick={() => onEditRow()} />
      <CustomTableCell label={access_pricing} onClick={() => onEditRow()} />
      <CustomTableCell label={created_date} onClick={() => onEditRow()} /> */}

      <TableCell width="15%">{first_name}</TableCell>
      <TableCell width="15%">{last_name}</TableCell>
      <TableCell width="50%">{CustomerName}</TableCell>
      {/* <TableCell width="10%">{name}</TableCell> */}
      <TableCell width="10%">{username}</TableCell>
      <TableCell width="10%">{email}</TableCell>
      <TableCell width="5%">{access}</TableCell>
      <TableCell width="5%">{access_level}</TableCell>
      <TableCell width="5%">{access_pricing}</TableCell>
      <TableCell width="10%">{created_date}</TableCell>
      <TableCell  width="10%" align="right">
        <Stack direction="row">
          <StyledIconButton onClick={() => setAddUserDlgOpen(true)
        }>
            <Iconify icon="fa-solid:pen" />
          </StyledIconButton>
          <StyledIconButton onClick={() => onDeleteRow()}>
            <Iconify icon="eva:trash-2-outline" />
          </StyledIconButton>
        </Stack>
      </TableCell>
    </TableRow>
    <UserDialog
        open={addUserDlgOpen}
        name='edit'
        row = {row}
        onClose={onCloseUserDlg}
        onSuccess={onSuccessAddUser}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
  </>
  );
}

const CustomTableCell = ({ label, onClick }: { label: string; onClick: Function }) => (
  <TableCell
    align="left"
    sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
    onClick={() => onClick()}
  >
    {label}
  </TableCell>
);
