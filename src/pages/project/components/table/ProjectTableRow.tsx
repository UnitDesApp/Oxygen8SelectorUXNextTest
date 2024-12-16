import { useState, useCallback, MouseEventHandler, useEffect } from 'react';
// @mui
import { Checkbox, TableRow, TableCell, MenuItem, Stack, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import * as ghf from 'src/utils/globalHelperFunctions';
import TableMoreMenu from 'src/components/table/TableMoreMenu';


// ----------------------------------------------------------------------
const statusArr = ['draft', 'quoted', 'released', 'closed'];
// const intUAL = typeof window !== 'undefined' ? localStorage.getItem('UAL') : 0
// const isAdmin = ghf.getIsAdmin(intUAL);

type ProjectTableRowProps = {
  row: {
    project_internal_id: string;
    job_name: string;
    reference_no: string;
    revision_no: string;
    JobCompanyName: string;
    JobCompanyContactName: string;
    CurrentUserCustomerName: string;
    CreatedUserFullName: string;
    RevisedUserFullName: string;
    CreatedUserCustomerName: string;
    created_date: string;
    revised_date: string;
    JobStatus: string;
    QuoteStatus: string;
    status: number;    
  };
  selected: boolean;
  onEditRow: () => void;
  onSelectRow: MouseEventHandler<HTMLButtonElement>;
  onDuplicate: () => void;
  onDeleteRow: () => void;
};

export default function ProjectTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDuplicate,
  onDeleteRow,
}: ProjectTableRowProps) {
  const {
    project_internal_id,
    job_name,
    reference_no,
    revision_no,
    JobCompanyName,
    JobCompanyContactName,
    CurrentUserCustomerName,
    CreatedUserFullName,
    RevisedUserFullName,
    CreatedUserCustomerName,
    created_date,
    revised_date,
    // status,
    JobStatus,
    QuoteStatus
  } = row || {};

  // const statusValue = statusArr[status || 0];

  const [intUAL, setIntUAL] = useState<number>(0); 
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ualValue = localStorage.getItem('UAL');
      const parsedUAL = ualValue ? parseInt(ualValue, 10) : 0;
      setIntUAL(parsedUAL);
      setIsAdmin(ghf.getIsAdmin(parsedUAL));
    }
  }, []);


  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = useCallback((event: any) => {
    setOpenMenuActions(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpenMenuActions(null);
  }, []);

  return (
    <TableRow hover sx={{ borderBottom: '1px solid #a7b1bc' }} selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {project_internal_id}
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {job_name}
      </TableCell>

      {/* <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {reference_no}
      </TableCell> */}

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {revision_no}
      </TableCell>

      <TableCell align="left"  sx={{display: isAdmin ? 'block': 'none',cursor: 'pointer' }} onClick={onEditRow}>
        {/* {statusValue} */}
        {(QuoteStatus !== null && QuoteStatus !== '') ? QuoteStatus : JobStatus}
      </TableCell>

      {/* <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {CustomerName}
      </TableCell> */}
      {/* <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {CreatedUserCustomerName}
      </TableCell> */}
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {JobCompanyName}
      </TableCell>
      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {JobCompanyContactName}
      </TableCell>

      {/* <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {CreatedUserFullName}
      </TableCell> */}

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {RevisedUserFullName}
      </TableCell>

      {/* <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {created_date}
      </TableCell> */}

      <TableCell align="left" sx={{ cursor: 'pointer' }} onClick={onEditRow}>
        {revised_date}
      </TableCell>

      <TableCell align="left" sx={{ cursor: 'pointer' }}>
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="duplicate" onClick={onDuplicate}>
            <Iconify icon="ic:outline-file-copy" />
          </IconButton>
          <IconButton aria-label="delete" onClick={onDeleteRow}>
            <Iconify icon="mdi:trash-outline" />
          </IconButton>
        </Stack>
      </TableCell>

      {/* <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <MenuItem sx={{ color: 'info.main' }} onClick={onEditRow}>
              <Iconify icon="akar-icons:eye" />
              View Project
            </MenuItem>
          }
        />
      </TableCell> */}
    </TableRow>
  );
}
