// react
import { Key, useCallback, useEffect, useMemo, useState } from 'react';
// next
import Head from 'next/head';
import { Box, Container, Stack, Tab, Button, Tabs, Typography } from '@mui/material';
// layouts
// components
import * as ghf from 'src/utils/globalHelperFunctions';
import { PROJECT_DASHBOARD_TABS } from 'src/utils/constants';
import { useRouter } from 'next/router';
import { PATH_APP } from 'src/routes/paths';
import useTabs from 'src/hooks/useTabs';
import { capitalCase } from 'change-case';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useGetSavedJob, useGetSavedJobsByUserAndCustomer, useGetSavedQuote, useGetSavedSubmittal } from 'src/hooks/useApi';
import { useSettingsContext } from '../../../components/settings';
import DashboardLayout from '../../../layouts/dashboard';
// import sub components
import UnitList from './components/unitlist/UnitList';
// import ProjectDetail from './components/detail/ProjectDetail';
import ProjectQuote from './components/quote/ProjectQuote';
import ProjectSubmittal from './components/submittal/ProjectSubmittal';
import ProjectStatus from './components/status/ProjectStatus';
import ProjectNote from './components/note/ProjectNote';
import ReportDialog from './components/dialog/ReportDialog';
import ProjectDetail from '../components/newProjectDialog/ProjectInfo';


// ----------------------------------------------------------------------

Project.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

// define Types
type ProjectItem = {
  Created_User_Full_Name: string;
  Customer_Name: string;
  Revised_User_Full_Name: string;
  company_contact_name: string;
  company_name: string;
  created_date: string;
  id: number;
  job_name: string;
  reference_no: string;
  revised_date: string;
  revision_no: number;
};

export default function Project() {
  const { themeStretch } = useSettingsContext();
  const { push, query, asPath } = useRouter();
  const { projectId, tab } = query;
  const projectIdNumber = Number(projectId);
  const { data: projects } = useGetSavedJobsByUserAndCustomer(
    {
      intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
      intCustomerId: typeof window !== 'undefined' && localStorage.getItem('customerId'),
    },
    {
      enabled: typeof window !== 'undefined',
    }
  );
  const [projectName, setProjectName] = useState<string | null>(null);
  const [intUAL, setIntUAL] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [tabs, setTabs] = useState<any | null>([]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ualValue = localStorage.getItem('UAL');
      const parsedUAL = ualValue ? parseInt(ualValue, 10) : 0;
      setIntUAL(parsedUAL);
      setIsAdmin(ghf.getIsAdmin(parsedUAL));
    }
  }, []);

  const { data: dbtSavedJob } = useGetSavedJob({intJobId: projectId}); // useGetSavedJob api call returns data and stores in dbtSavedJob
  

  // useTab
  const { currentTab, onChangeTab, setCurrentTab } = useTabs(tab?.toString());

    useEffect(() => {
      if (dbtSavedJob) {
        setProjectName(dbtSavedJob?.[0]?.job_name);
      } else {
        setProjectName(null);
      }
  }, [dbtSavedJob]);

  // useState
  const [openExportDialog, setOpenExportDialog] = useState<boolean>(false);

  const handleOpneExportDialog = () => {
    setOpenExportDialog(true);
  };

  useEffect(() => {
    setCurrentTab(tab?.toString() || '');
  }, [setCurrentTab, tab]);
  
  
  const TABS = useMemo(
    () => [
      {
        value: PROJECT_DASHBOARD_TABS.UNITLIST,
        title: 'Unit list',
        // title: dbtSavedJob?.[0]?.job_name,
        component: <UnitList />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.PROJECT_DETAILS,
        title: 'Project Detail',
        component: (
          <ProjectDetail
            projectId={projectId?.toString()}
            onClose={() => setCurrentTab(PROJECT_DASHBOARD_TABS.UNITLIST)}
          />
        ),
      },
      {
        value: PROJECT_DASHBOARD_TABS.QUOTE,
        title: 'Quote',
        component: <ProjectQuote />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.SUBMITTAL,
        title: 'Submittal',
        component: <ProjectSubmittal />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.STATUS,
        title: 'Status',
        component: <ProjectStatus />,
      },
      {
        value: PROJECT_DASHBOARD_TABS.NOTES,
        title: 'Notes',
        component: <ProjectNote />,
      },
    ],
    [projectId, setCurrentTab]
  );

  const onChangeTabHandle = useCallback(
    (e: any, id: string) => {
      push(PATH_APP.projectDashboard(projectId?.toString() || '', id));
      onChangeTab(e, id);
    },
    [push, onChangeTab, projectId]
  );


  useMemo(() => {
    let selTabs: any = [];

    if (isAdmin) {
      selTabs = TABS;
    } else {
      selTabs = TABS.filter((item) => 
        item.value !== PROJECT_DASHBOARD_TABS.SUBMITTAL &&
        item.value !== PROJECT_DASHBOARD_TABS.STATUS &&
        item.value !== PROJECT_DASHBOARD_TABS.NOTES);
    }

    setTabs(selTabs);

  }, [TABS, isAdmin]);


  const tabData = useMemo(
    // () => TABS.filter((item) => item.value === currentTab)?.[0],
    () => tabs.filter((item: { value: string; }) => item.value === currentTab)?.[0],
    [currentTab, tabs]
  );

  return (
    <>
      <Head>
        <title> {projectName || 'Project'} | Oxygen8 </title>
      </Head>

      {/* <Container maxWidth={themeStretch ? false : 'xl'}> */}
      <Container style={{maxWidth:"100%"}} >
        {/* <Typography sx={{ textAlign: 'center', fontSize: '28px', mt: '4px' }}>
          {projectName && projectName}
        </Typography> */}
        <CustomBreadcrumbs
          // heading={<Typography sx={{fontSize:'28px', color: 'rgb(99, 115, 129)' }}>{projectName || ''}</Typography>}
          heading={<Typography sx={{fontSize:'24px', mt: '0px',fontWeight:'700',color:'#223a5e' }}>{projectName || ''}</Typography>}
          links={[{ name: 'Projects', href: PATH_APP.project }, { name: tabData?.title || '' }]}
          action={
            !asPath.includes('/notes/')  &&          
           <Stack spacing={2} direction="row" alignItems="flex-end" sx={{ mt: 3 }}>
              <Button
                variant="text"
                startIcon={<Iconify icon="bxs:download" />}
                onClick={() => setOpenExportDialog(true)}
              >
                Export report
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                // onClick={() => projectId && push(PATH_APP.newUnit(projectId?.toString()))}
                onClick={() => 

                  projectId && push(PATH_APP.editUnit(projectId?.toString(), '0'))}
              >
                Add new unit
              </Button>
            </Stack>        
          }
        />
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTabHandle}
        >
          {tabs.map((tabItem: { value: Key | null | undefined; title: string; }) => (
            <Tab
              disableRipple
              key={tabItem.value}
              label={capitalCase(tabItem?.title)}
              value={tabItem.value}
              
            />
          ))}
        </Tabs>
        <Box sx={{ my: 3 }}>{tabData?.component || null}</Box>
      </Container>
      <ReportDialog
        isOpen={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        intProjectID={projectId?.toString() || ''}
        // dtSavedJob={dbtSavedJob}
        // dtSavedQuote ={dtSavedQuote}
        // dtSavedSubmittal={dtSavedSubmittal}
      />
    </>
  );
}
