// react
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
// next
import Head from 'next/head';
import {
  Alert,
  Box,
  Container,
  Snackbar,
  Stack,
  Table,
  Button,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableLoadingData,
} from 'src/components/table';
import * as ghf from 'src/utils/globalHelperFunctions';
import { ROLE_OPTIONS } from 'src/utils/constants';
import { useAuthContext } from 'src/auth/useAuthContext';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';
import {
  useGetSavedJobs,
  useGetJobSelTables,
  useGetSavedJobsByUserAndCustomer,
} from 'src/hooks/useApi';
import { PATH_APP } from 'src/routes/paths';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import ConfirmDialog from 'src/components/dialog/ConfirmDialog';
import { useApiContext } from 'src/contexts/ApiContext';
import * as IDs from 'src/utils/ids';
import { isDeepStrictEqual } from 'util';
import { isNull, isNumber } from 'lodash';
import ProjectTableToolbar from './components/table/ProjectTableToolbar';
import ProjectTableRow from './components/table/ProjectTableRow';
import { useSettingsContext } from '../../components/settings';
import DashboardLayout from '../../layouts/dashboard';
import TableHeadCustom from './components/table/TableHeadCustom';
import ProjectInfoDialog from './components/newProjectDialog/ProjectInfoDialog';

// ----------------------------------------------------------------------

Project.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function Project() {
  const { themeStretch } = useSettingsContext();
  // router
  const { push } = useRouter();
  // project api
  const { project } = useApiContext();

  // Table State
  const [filterName, setFilterName] = useState<string>('');
  // const [filterRole, setFilterRole] = useState<string>('My Projects');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [newProjectDialogOpen, setNewProjectDialog] = useState<boolean>(false);
  const [isOneConfirmDialog, setOneConfirmDialogState] = useState<boolean>(false);
  const [isOpenMultiConfirmDialog, setMultiConfirmDialogState] = useState<boolean>(false);
  const [deleteRowID, setDeleteRowID] = useState<number>(-1);
  const [isCopied, SetIsCopied] = useState(false)

  // Notification State
  const [openDuplicateSuccess, setOpenDuplicateSuccess] = useState(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);
  const [intUAL, setIntUAL] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [isUALExternal, setIsUALExternal] = useState<boolean>(false); 

  // const { data: projects, isLoading: isLoadingProjects, refetch } = useGetAllProjects();
  // const { data: projects, isLoading: isLoadingProjects, refetch } = useGetSavedJobs();
  const {
    data: projects,
    isLoading: isLoadingProjects,
    refetch,
  } = useGetSavedJobsByUserAndCustomer(
    {
      // oJobs: {
      intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intCustomerId: typeof window !== 'undefined' && localStorage.getItem('customerId'),
      // strSearchBy: filterName,
    },
    {
      enabled: typeof window !== 'undefined',
    }
  );
  const [visibleRows, setVisibleRows] = useState<number>(10);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleLoadMore = () => {
    setVisibleRows((prev) => prev + 10);
  };

  const { data: jobSelTables } = useGetJobSelTables();

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
  } = useTable({
    defaultRowsPerPage: 10,
  });

  const { user } = useAuthContext();


  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ualValue = localStorage.getItem('UAL');
      const parsedUAL = ualValue ? parseInt(ualValue, 10) : 0;
      setIntUAL(parsedUAL);
      setIsAdmin(ghf.getIsAdmin(parsedUAL));
      setIsUALExternal(ghf.getIsUALExternal(parsedUAL));
    }
  }, []);

  useEffect(() => {
    switch (Number(user?.UAL)) {
      case IDs.intUAL_Admin:
      case IDs.intUAL_AdminLvl_1:
        setFilterRole('My Projects');
        break;
      case IDs.intUAL_IntAdmin:
      case IDs.intUAL_IntLvl_1:
      case IDs.intUAL_IntLvl_2:
        setFilterRole('All');
        break;
      case IDs.intUAL_External:
      case IDs.intUAL_ExternalSpecial:
        setFilterRole('My Projects');
        // setFilterRole('All');
        break;
      default:
        break;
    }
  }, [user?.UAL]);

  const handleCloseSuccess = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseFail = (e: any, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenFail(false);
  };

  const handleClickNewProjectDialogOpen = () => {
    setNewProjectDialog(true);
  };

  const handleNewProjectDialogClose = () => {
    setNewProjectDialog(false);
  };

  const handleOneConfirmDialogOpen = (id: number) => {
    setDeleteRowID(id)
;
    setOneConfirmDialogState(true);
  };

  const handleOneConfirmDialogClose = () => {
    setDeleteRowID(-1);
    setOneConfirmDialogState(false);
  };

  const handleDeleteRow = () => {
    project.deleteJob({ action: 'DELETE_ONE', projectId: deleteRowID }).then(() => {
      refetch();
    });
    setSelected([]);
    setDeleteRowID(-1);
    handleOneConfirmDialogClose();
  };

  const handleMultiConfirmDialogOpen = () => {
    setMultiConfirmDialogState(true);
  };

  const handleMultiConfirmDialogClose = () => {
    setMultiConfirmDialogState(false);
  };

  const handleFilterRole = (value: string) => {
    setFilterRole(value);
  };

  const handleDeleteRows = () => {
    project.deleteJob({ action: 'DELETE_MULTIPUL', projectIdData: selected }).then(() => {
      refetch();
    });
    setSelected([]);
    setMultiConfirmDialogState(false);
  };

  const handleDuplicate = (row: any) => {
    SetIsCopied(true)
    project.duplicateJob(row).then(() => refetch());
    setOpenDuplicateSuccess(true);
    setFilterName('');
    handleFilterName('')
  };

  const handleEditRow = (projectid: number) => {
    push(PATH_APP.projectDashboard(projectid.toString(), 'unitlist'));
  };



  const [filteredArray, setFilterArray] = useState<any>();
  const handleFilterName = (name: string) => {
    SetIsCopied(false)
    setFilterName(name);
    const lowerCaseName = name.toLowerCase();
    const array = dataFiltered.filter((item: any) =>
      [
        item.project_internal_id,
        item.job_name,
        item.reference_no,
        item.JobCompanyName,
        item.JobCompanayContactName,
        item.CreatedUserFullName,
        item.RevisedUserFullName,
        item.created_date,
      ].some((field) => field && field.toLowerCase().includes(lowerCaseName))
    );
    setFilterArray(array);
    setPage(0);
  };


  const dataFiltered = useMemo(
    () =>
      projects &&
      applySortFilter({
        tableData: projects.dbtJobList,
        comparator: getComparator(order, orderBy),
        filterName,
        filterRole,
        filterStatus,
        UAL:intUAL,
      }),

    [projects, order, orderBy, filterName, filterRole, filterStatus, intUAL]
  );

  const isNotFound = useMemo(
    () =>
      (!dataFiltered?.length && !!filterName) ||
      (!dataFiltered?.length && !!filterRole) ||
      (!dataFiltered?.length && !!filterStatus),
    [dataFiltered?.length, filterName, filterRole, filterStatus]
  );

  useEffect(() => {
    if (
      (dataFiltered || filteredArray) && visibleRows >= filteredArray?.length
        ? filteredArray
        : dataFiltered && dataFiltered.length
    ) {
      setHasMore(false);
    }
  }, [dataFiltered, filteredArray, visibleRows]);

  return (
    <>
      <Head>
        <title> Projects | Oxygen8 </title>
      </Head>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Alert sx={{ width: '100%', mt: 3, mb: 3 }} severity="info">
          {/* <b>Pricing module is now availble</b> - select Quote after making a selection to review
          and generate a PDF. All values shown are Net prices. */}
          Access all your projects in Configur8. Rerun them for the most accurate and up-to-date results.
        </Alert>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h3" component="h1" paragraph>
            Projects
          </Typography>
        </Stack>


        {!dataFiltered && isLoadingProjects ? (
          <Box>
            <CircularProgressLoading />
          </Box>
        ) : (
          <Box>
            <ProjectTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              onFilterRole={handleFilterRole}
              onOpneDialog={handleClickNewProjectDialogOpen}
              optionsRole={ROLE_OPTIONS}
              selectedRole={filterRole}
            />
            <Scrollbar sx={{ overflow: 'hidden' }}>
              <TableContainer>
                <Table size="small">
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    rowCount={dataFiltered?.length || 0}
                    numSelected={selected?.length || 0}
                    onSort={onSort}
                    onSelectAllRows={(checked: boolean) =>
                      onSelectAllRows(
                        checked,
                        dataFiltered?.map((row: any) => row.id)
                      )
                    }
                  />
                  <TableBody>
                    {(() => {
                      let dataToDisplay = [];

                      // if (filteredArray) {
                      //   dataToDisplay = filteredArray.slice(0, visibleRows);
                      // } else if (dataFiltered) {
                      //   dataToDisplay = dataFiltered.slice(0, visibleRows);
                      // }
                      if (dataFiltered) {
                        dataToDisplay = dataFiltered.slice(0, visibleRows);
                      }
                      return dataToDisplay
                        .sort((a: any, b: any) => getComparator(order, orderBy)(a, b))
                        .map((row: any) => (
                          <ProjectTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleOneConfirmDialogOpen(row.id)}
                            onDuplicate={() =>
                              handleDuplicate({
                                intUserId: localStorage.getItem('userId'),
                                intJobId: row.id,
                              })
                            }
                            onEditRow={() => handleEditRow(row.id)}
                          />
                        ));
                    })()}
                    <TableEmptyRows
                      height={52}
                      emptyRows={emptyRows(page, rowsPerPage, dataFiltered?.length || 0)}
                    />
                    <TableLoadingData isLoading={isLoadingProjects} />
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            {/* {hasMore && dataFiltered?.length > 0 && ( */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined" color="primary" onClick={handleLoadMore}>
                Load More
              </Button>
            </Box>
            {/* )} */}
          </Box>
        )}

        {/* {projects?.jobInitInfo && ( */}
        {jobSelTables && (
          <ProjectInfoDialog
            loadProjectStep="SHOW_FIRST_DIALOG"
            open={newProjectDialogOpen}
            onClose={() => setNewProjectDialog(false)}
            setOpenSuccess={() => setOpenSuccess(true)}
            setOpenFail={() => setOpenFail(true)}
            // initialInfo={projects?.jobInitInfo}
            // initialInfo={projects}
            initialInfo={jobSelTables}
            refetch={refetch}
            savedJob={null}
          />
        )}
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
        <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
          <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Project created successfully!
          </Alert>
        </Snackbar>
        <Snackbar open={openFail} autoHideDuration={3000} onClose={handleCloseFail}>
          <Alert onClose={() => setOpenFail(false)} severity="error" sx={{ width: '100%' }}>
            Project creation failed!
          </Alert>
        </Snackbar>
        <Snackbar
          open={openDuplicateSuccess}
          autoHideDuration={3000}
          onClose={() => setOpenDuplicateSuccess(false)}
        >
          <Alert
            onClose={() => setOpenDuplicateSuccess(false)}
            severity="success"
            sx={{ width: '100%' }}
          >
            Project duplicate successfully!
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

const applySortFilter = ({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
  UAL,
}: {
  tableData: any;
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterStatus: string;
  filterRole: string;
  UAL: Number;
}) => {
  if (!tableData || tableData.length === 0) return [];
  const stabilizedThis = tableData.map((el: any, i: number) => [el, i]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el: any) => el[0]);

  tableData.sort((a: any, b: any) => b.id - a.id);


  // if (filterStatus !== 'All') {
  //   tableData = tableData.filter((item: any) => item.status === filterStatus);
  // }

  // if (filterRole !== 'All') {
  //   if (filterRole === 'My Projects') {
  //       tableData = tableData.filter((item: any) => item.created_user_id.toString() === localStorage.getItem('userId'));
  //   } else {
  //     tableData = tableData.filter((item: any) => item.created_user_id.toString() !== localStorage.getItem('userId'));
  //   }
  // }


switch (Number(UAL)) {
  case IDs.intUAL_Admin:
  case IDs.intUAL_AdminLvl_1:
    switch (filterRole) {
      case 'All':
        break;
      case 'My Projects':
        tableData = tableData.filter((item: any) => item.created_user_id.toString() === localStorage.getItem('userId'));
        break;
      case 'By Others':
        tableData = tableData.filter((item: any) => item.created_user_id.toString() !== localStorage.getItem('userId'));
        break;
      default:
        break;
    }    break;
  case IDs.intUAL_IntAdmin:
  case IDs.intUAL_IntLvl_1:
  case IDs.intUAL_IntLvl_2:
    switch (filterRole) {
      case 'All':
        break;
      case 'My Projects':
          tableData = tableData.filter((item: any) => item.created_user_id.toString() === localStorage.getItem('userId'));
        break;
      case 'By Others':
        tableData = tableData.filter((item: any) => item.created_user_id.toString() !== localStorage.getItem('userId'));
        break;
      default:
        break;
    }
    break;
  case IDs.intUAL_External:
  case IDs.intUAL_ExternalSpecial:
    switch (filterRole) {
      case 'All':
        break;
      case 'My Projects':
          tableData = tableData.filter((item: any) => item.JobCompanyContactId.toString() === localStorage.getItem('userId'));
        break;
      case 'By Others':
        tableData = tableData.filter((item: any) => item.JobCompanyContactId.toString() !== localStorage.getItem('userId'));
        break;
      default:
        break;
    }
    break;
  default:
    break;
}

  
  if (filterName) {
    tableData = tableData.filter(
      (item: {
        project_internal_id: string;
        job_name: string;
        reference_no: string;
        revision_no: string;
        JobCompanyName: string;
        JobCompanyContactName: string;
        CreatedUserFullName: string;
        RevisedUserFullName: string;
        created_date: string;
        revised_date: string;
      }) =>
        (!isNull(item?.reference_no) && item?.project_internal_id?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.reference_no) && item?.job_name?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.reference_no) && item?.reference_no?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.revision_no) && item?.revision_no?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.JobCompanyName) && item?.JobCompanyName?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.JobCompanyContactName) && item?.JobCompanyContactName?.toString().toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.CreatedUserFullName) && item?.CreatedUserFullName?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.RevisedUserFullName) && item?.RevisedUserFullName?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.created_date) && item?.created_date?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1) ||
        (!isNull(item?.revised_date) && item?.revised_date?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
    );
  }

  return tableData;
};