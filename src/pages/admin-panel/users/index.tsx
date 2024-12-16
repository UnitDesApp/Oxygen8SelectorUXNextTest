import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import { Box, TableContainer, Table, TableBody, TablePagination } from '@mui/material';
import { useGetAccountInfo, useGetUsersByCustomer, useGetUsers} from 'src/hooks/useApi';
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  emptyRows,
  getComparator,
  useTable,
} from 'src/components/table';
import * as ghf from 'src/utils/globalHelperFunctions';
import { useApiContext } from 'src/contexts/ApiContext';
import useTabs from 'src/hooks/useTabs';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import UserTableToolbar from './component/UserTableToolbar';
import TableSelectedActions from '../customers/component/TableSelectedActions';
import UserTableRow from './component/UserTableRow';
import AdminPanelWrapper from '../component/AdminPanelWrapper';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'first_name', label: 'First Name', align: 'left' },
  { id: 'last_name', label: 'Last Name', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'user_name', label: 'Username', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'access', label: 'Access', align: 'left' },
  { id: 'access_level', label: 'Access Level', align: 'left' },
  { id: 'access_pricing', label: 'Access Pricing', align: 'left' },
  { id: 'created_date', label: 'Created Date', align: 'left' },
  { id: '' },
];

// ------------------------------------------------------------------------
Users.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

interface UsersProps {
  toolbar: boolean;
  checkbox: boolean;
}

export default function Users({ toolbar = true, checkbox = true }: UsersProps) {
  const api = useApiContext();
  const { push, query } = useRouter();
  const { data: accountInfo, refetch } = useGetAccountInfo();

  const { customerId } = query || 0
  const { dbtSavUser } = accountInfo || { user: [] };
  const { data: dbtSavUsersByCustomer } = useGetUsersByCustomer({intCustomerId: customerId});
  const dense = true;

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [userId, setUserId] = useState<number>(0);
  const [UAL, setUAL] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [isUALExternal, setIsUALExternal] = useState<boolean>(false);  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [customerType, setCustomerType] = useState<number>();
  const filterRole = 'All';
  // Delete one row
  const [isOneConfirmDialog, setOneConfirmDialogState] = useState(false);
  const [isOpenMultiConfirmDialog, setMultiConfirmDialogState] = useState(false);
  const [deleteRowID, setDeleteRowID] = useState(-1);


  const setUsers = useCallback(() => {
    api.account.getUsers({ intUAL: UAL }).then((data: any) => {
      const dbtUsers = data;
      setTableData(dbtUsers);
    });
  }, [api.account, UAL]
  );


  const setUsersByCustomer = useCallback(() => {
    api.account.getUsersByCustomer({intCustomerId: customerId}).then((data: any) => {
      const dbtUsers = data;
      let filteredUsers: any = [];
      // filteredUsers = dbtSavUser;
      filteredUsers = dbtUsers;
      filteredUsers = filteredUsers?.filter((item: { customer_id: number }) => item.customer_id === Number(customerId));
  
      setTableData(filteredUsers);  setTableData(dbtUsers);
    });
  }, [api.account, customerId]
  );

  // *******************************************************************************************************************************************************
  // *******************************************************************************************************************************************************


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userIdValue =  localStorage.getItem('userId');
      const parsedUserId = userIdValue ? parseInt(userIdValue, 10) : 0;

      const ualValue = localStorage.getItem('UAL');
      const parsedUAL = ualValue ? parseInt(ualValue, 10) : 0;

      setUserId(parsedUserId);
      setUAL(parsedUAL);
      setIsAdmin(ghf.getIsAdmin(parsedUAL));
      setIsUALExternal(ghf.getIsUALExternal(parsedUAL));

    }
  }, [UAL, customerId, setUsers]);

  // const { data: dbtSavUsers } = useGetUsers({ intUAL: UAL });


  useEffect(() => {
    if (Number(customerId) > 0) {
      setUsersByCustomer();
    }
    // else if ((customerId !== undefined || Number(customerId) === 0) && UAL > 0) {
    else if (customerId === undefined && UAL > 0) {
      setUsers();
    }

  }, [UAL, customerId, setUsers, setUsersByCustomer]);



  // useEffect(() => {
  //   let filteredUsers: any = [];
  //   // filteredUsers = dbtSavUser;
  //   filteredUsers = dbtSavUsersByCustomer;
  //   filteredUsers = filteredUsers?.filter((item: { customer_id: number }) => item.customer_id === Number(customerId));

  //   setTableData(filteredUsers);
  // }, [customerId, dbtSavUsersByCustomer]);

  const handleOneConfirmDialogOpen = useCallback((id: number) => {
    setDeleteRowID(id);
    setOneConfirmDialogState(true);
  }, []);

  const handleOneConfirmDialogClose = useCallback(() => {
    setDeleteRowID(-1);
    setOneConfirmDialogState(false);
  }, []);

  const handleDeleteRow = useCallback(async () => {
    const data = await api.account.removeUser({ action: 'DELETE_ONE', userId: deleteRowID, customerId });
    setTableData(data);
    setDeleteRowID(-1);
    handleOneConfirmDialogClose();
  }, [api.account, customerId, deleteRowID, handleOneConfirmDialogClose]);

  const handleMultiConfirmDialogOpen = useCallback(() => {
    setMultiConfirmDialogState(true);
  }, []);

  const handleMultiConfirmDialogClose = useCallback(() => {
    setMultiConfirmDialogState(false);
  }, []);

  // eslint-disable-next-line no-unused-vars
  const { currentTab: filterStatus } = useTabs('All');

  const handleFilterName = useCallback(
    (keyword: string) => {
      setFilterName(keyword);
      setPage(0);
    },
    [setPage]
  );

  const handleDeleteRows = useCallback(async () => {
    if (selected) {
      const data = await api.account.removeUser({ action: 'DELETE_MULTI', userIds: selected });
      setTableData(data);
      setSelected([]);
      setMultiConfirmDialogState(false);
    }
  }, [api.account, selected, setSelected]);

  const handleEditRow = useCallback(
    (row: any) => {
      push(`/admin-panel/users/${row?.id || '0'}`);
    },
    [push]
  );

  const filteredData = useMemo(
    () =>
      applySortFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
        customerType,
      }),
    [filterName, filterRole, filterStatus, order, orderBy, tableData, customerType]
  );

  const denseHeight = useMemo(() => (dense ? 52 : 72), [dense]);

  const isNotFound = useMemo(
    () =>
      (!filteredData?.length && !!filterName) ||
      (!filteredData?.length && !!filterRole) ||
      (!filteredData?.length && !!filterStatus),
    [filterName, filterRole, filterStatus, filteredData?.length]
  );

  const handleFilterByCustomerName = (type: number) => {
    setCustomerType(type);
  };

  return (
    <AdminPanelWrapper currentTab="users" refetch={refetch}>
      {/* {toolbar  ( */}
        <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          onFilterByCustomerName={handleFilterByCustomerName}
          userNum={filteredData?.length}
          onDeleteSelectedData={handleMultiConfirmDialogOpen}
          toolbar={toolbar}
        />
      {/* )} */}
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              numSelected={selected.length}
              onSelectAllRows={onSelectAllRows}
              rowCount={selected.length}
            />
          )}

          <Table size="medium">
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData?.length}
              numSelected={selected.length}
              onSort={onSort}
              isCheckbox={checkbox}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData?.map((row: any) => row.id)
                )
              }
            />

            <TableBody>
              {filteredData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row: any, index: number) => (
                  <UserTableRow
                    key={index}
                    row={row}
                    selected={selected.includes(row.id)}
                    isCheckbox={checkbox}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => handleOneConfirmDialogOpen(row.id)}
                    onEditRow={() => handleEditRow(row)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData?.length)}
              />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>

      <ConfirmDialog
        isOpen={isOneConfirmDialog}
        onClose={handleOneConfirmDialogClose}
        onConfirm={handleDeleteRow}
        isOneRow
      />
      <ConfirmDialog
        isOpen={isOpenMultiConfirmDialog}
        onClose={handleMultiConfirmDialogClose}
        onConfirm={handleDeleteRows}
        isOneRow={false}
      />
    </AdminPanelWrapper>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
  customerType,
}: any) {
  const stabilizedThis = tableData?.map((el: any, index: number) => [el, index]);

  stabilizedThis?.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis?.map((el: any) => el[0]);

  if (filterName) {
    tableData = tableData?.filter(
      (item: any) =>
        item.username.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.first_name.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.last_name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        (item.email && item.email.indexOf(filterName.toLowerCase()) !== -1) ||
        item.created_date.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  if (filterStatus !== 'All') {
    tableData = tableData?.filter((item: any) => item.status === filterStatus);
  }

  if (filterRole !== 'All') {
    tableData = tableData?.filter((item: any) => item.role === filterRole);
  }

  if (customerType && customerType !== '1') {
    tableData = tableData?.filter((item: any) =>
      item.customer_type_id ? item.customer_type_id?.toString() === customerType.toString() : true
    );
  }
  return tableData;
}
