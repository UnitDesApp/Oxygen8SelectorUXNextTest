// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import * as ghf from 'src/utils/globalHelperFunctions';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

export const TABLE_HEAD: {
  id: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
  width: number;
}[] = [
  { id: 'project_internal_id', label: 'Project ID', align: 'left', width: 40 },
  { id: 'job_name', label: 'Project Name', align: 'left', width: 250 },
  // { id: 'reference_no', label: 'Ref no.', align: 'left', width: 80 },
  { id: 'revision_no', label: 'Rev no.', align: 'left', width: 25 },
  { id: 'status', label: 'status', align: 'left', width: 175 },
  { id: 'Company_Name', label: 'Rep', align: 'left', width: 175 },
  { id: 'CompanyContact_Name', label: 'Contact Name', align: 'left', width: 175},

  // { id: 'Created_User_Full_Name', label: 'Created By', align: 'left', width: 100 },
  { id: 'RevisedUserFullName', label: 'Revised By', align: 'left', width: 175 },
  // { id: 'created_date', label: 'Date created', align: 'left', width: 140 },
  { id: 'revised_date', label: 'Date revised', align: 'left', width: 25 },
  // { id: '', label: 'Actions', align: 'center', width: 30 },
  { id: '', label: 'Actions', align: 'center', width: 20 },
  // { id: '', width: 5 },
];

// ----------------------------------------------------------------------

type TableHeadCustomProps = {
  onSort: Function;
  orderBy: string;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: Function;
  order: 'asc' | 'desc';
  isCheckbox?: boolean;
  sx?: object;
};

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  isCheckbox = true,
  sx,
}: TableHeadCustomProps) {
  
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

  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows && isCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

{TABLE_HEAD.map((headCell, key) => (
  <TableCell
    key={key}
    align={headCell?.align || 'left'}
    sortDirection={orderBy === headCell.id ? order : false}
    sx={{
      width: headCell.width,
      minWidth: headCell.width,
      whiteSpace: 'nowrap',
      display: headCell.id === "status" && !isAdmin ? 'none' : 'table-cell'
    }}
  >
    {onSort ? (
      <TableSortLabel
        hideSortIcon
        active={orderBy === headCell.id}
        direction={orderBy === headCell.id ? order : 'asc'}
        onClick={() => onSort(headCell.id)}
        sx={{ textTransform: 'capitalize' }}
      >
        {headCell.label}
        
        {orderBy === headCell.id ? (
          <Box sx={{ ...visuallyHidden }}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </Box>
        ) : null}
      </TableSortLabel>
    ) : (
      headCell.label
    )}
  </TableCell>
))}
      </TableRow>
    </TableHead>
  );
}
