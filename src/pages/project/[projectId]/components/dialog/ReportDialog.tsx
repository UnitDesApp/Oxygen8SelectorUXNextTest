import React, { useCallback, useState, useEffect, useMemo, Key } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Grid,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import * as ghf from 'src/utils/globalHelperFunctions';
import { useApiContext } from 'src/contexts/ApiContext';
import { LoadingButton } from '@mui/lab';
import { useExport } from 'src/hooks/useExport';
import { useGetSavedJob, useGetSavedQuote, useGetSavedSubmittal, useGetSavedUnitGeneralList } from 'src/hooks/useApi';

const EXPORT_OUTPUTS = [
  { label: 'Quote', id: 'quote' },
  { label: 'Selection', id: 'selection' },
  { label: 'Mechanical Schedule', id: 'mech_schedule' },
  { label: 'Revit files', id: 'revit_files' },
  { label: 'Submittal', id: 'submittal' },
];

interface ReportDialogProps {
  isOpen: boolean;
  onClose: Function;
  intProjectID: string;
  // dtSavedJob: any;
  // dtSavedQuote: any;
  // dtSavedSubmittal: any;
}

// export default function ReportDialog({ isOpen, onClose, intProjectID, dtSavedJob, dtSavedQuote, dtSavedSubmittal }: ReportDialogProps) {
export default function ReportDialog({ isOpen, onClose, intProjectID }: ReportDialogProps) {
  const [methods, setMethods] = useState<{ [name: string]: any }>({
    quote: false,
    selection: false,
    mech_schedule: false,
    revit_files: false,
    submittal: false,
  });

  const api = useApiContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSuccessNotify, setOpenSuccessNotify] = useState<boolean>(false);
  const [successNotifyText, setSuccessNotifyText] = useState<string>('');
  const [openFailNotify, setOpenFailNotify] = useState<boolean>(false);
  const [failNotifyText, setFailNotifyText] = useState<string>('');
  const {
    ExportQuotePdf,
    ExportAllUnitsSelectionPdf,
    ExportMechanicalScheduleExcel,
    ExportAllUnitsSelectionRevit,
    ExportSubmittalPdf,
    ExportSubmittalEpicorExcel,
    ErrorMsg,
  } = useExport();

  const [intUAL, setIntUAL] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [exportOutputs, setExportOutputs] = useState<any | null>([]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ualValue = localStorage.getItem('UAL');
      const parsedUAL = ualValue ? parseInt(ualValue, 10) : 0;
      setIntUAL(parsedUAL);
      setIsAdmin(ghf.getIsAdmin(parsedUAL));
    }
  }, []);
  const { data: dtSavedJob } = useGetSavedJob({intJobId: intProjectID}); // useGetSavedJob api call returns data and stores in dbtSavedJob
  // const { data: dtSavedUnitGeneralList } = useGetSavedUnitGeneralList({intJobId: Number(intProjectID),}); 
  // const { data: dtSavedQuote } = useGetSavedQuote({intJobId: Number(intProjectID),}); 
  // const { data: dtSavedSubmittal } = useGetSavedSubmittal({intJobId: intProjectID,});

  // const [dtSavedJob, set_dtSavedJob] = useState<any>([]);
  // const [dtSavedUnitGeneralList, set_dtSavedUnitGeneralList] = useState<any>([]);
  // const [dtSavedQuote, set_dtSavedQuote] = useState<any>([]);
  // const [dtSavedSubmittal, set_dtSavedSubmittal] = useState<any>([]);



  // const setSavedJob = async (data: any) => {
  //   const returnData = await api.project.getSavedJob({intJobId: intProjectID});
  //   set_dtSavedJob(returnData);
  // }
  
  // const setSavedUnitList = async (data: any) => {
  //   const returnData = await api.project.getSavedUnitGeneralList({intJobId: intProjectID});
  //   set_dtSavedUnitGeneralList(returnData);  
  // }

  // const setSavedQuote = async (data: any) => {
  //   const returnData = await api.project.getSavedQuote({intJobId: intProjectID});
  //   set_dtSavedQuote(returnData);  
  // }

  // const setSavedSubmittal = async (data: any) => {
  //   const returnData = await api.project.getSavedSubmittal({intJobId: intProjectID});
  //   set_dtSavedSubmittal(returnData);
  // }


  // const setSavedUnitList = useCallback(async (data: any) => {
  //   setIsProcessingData(true);
    
  //   try {
  //     const returnValue = await api.project.getSavedUnitGeneralList({intJobId: intProjectID});
  //     set_dtSavedUnitGeneralList(returnValue);
  //     // if (returnValue) {
  //     // } else {
  //     //   <></>
  //     // }
  //   } catch (error) {
  //     <></>
  //   }

  //   setIsProcessingData(false);

  // }, [api.project, intProjectID]);



  // const setSavedQuote = useCallback(async (data: any) => {
  //   try {
  //     const returnValue = await api.project.getSavedQuote({intJobId: intProjectID});
  //     set_dtSavedQuote(returnValue);
  //     // if (returnValue) {
  //     // } else {
  //     // }
  //   } catch (error) {
  //     <></>
  //   }
  // }, [api.project, intProjectID]);


  // const setSavedSubmittal = useCallback(async (data: any) => {
  //     try {
  //       const returnValue = await api.project.getSavedSubmittal({intJobId: intProjectID});
  //       set_dtSavedSubmittal(returnValue);
  //       // if (returnValue) {
  //       // } else {
  //       // }
  //     } catch (error) {
  //       <></>
  //     }
  //   }, [api.project, intProjectID]);
  useMemo(() => {
    let selExpOup: any = [];

    if (isAdmin) {
      selExpOup = EXPORT_OUTPUTS;
    } else {
      selExpOup = EXPORT_OUTPUTS.filter((item) =>  item.id !== "submittal");
    }

    setExportOutputs(selExpOup);

  }, [isAdmin]);


  const onChangeMethods = useCallback(
    (label: string, value: any) => {
      setMethods({ ...methods, [label]: !value });
    },
    [methods]
  );

  const onClickExports = useCallback(async () => {
    //  const returnData = await api.project.getSavedJob({intJobId: intProjectID});
    const dtSavedUnitGeneralList = await api.project.getSavedUnitGeneralList({ intJobId: intProjectID });
    const dtSavedQuote = await api.project.getSavedQuote({ intJobId: intProjectID });
    const dtSavedSubmittal = await api.project.getSavedSubmittal({ intJobId: intProjectID });

    setIsLoading(true);

    if (methods.quote) {
      // setSavedUnitList(null);

      if (dtSavedUnitGeneralList?.length <= 0) {
        setSnackbarMessage('No units found for the report. Please click the \'Add New Unit\' button.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      // setSavedQuote(null);

      if (dtSavedQuote?.length <= 0 || Number(dtSavedQuote?.[0]?.quote_id) < 1) {
        setSnackbarMessage('Quote not saved. Please navigate to the Quote section to save it.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }


      const result = await ExportQuotePdf(Number(intProjectID), dtSavedJob, dtSavedUnitGeneralList);
      // if (result === 'server_error') {
      //   setFailNotifyText('Server Error!');
      //   setOpenFailNotify(true);
      // } else if (result === 'fail') {
      //   setFailNotifyText('Quote muste be saved. Please check Quote info!');
      //   setOpenFailNotify(true);
      // }
    }

    const storedArrayString = typeof window !== 'undefined' && localStorage?.getItem('unitlist');
    const storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];

    if (methods.selection) {
      // setSavedUnitList(null);

      if (dtSavedUnitGeneralList?.length <= 0) {
        setSnackbarMessage('No units found for the report. Please click the \'Add New Unit\' button.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      await ExportAllUnitsSelectionPdf(Number(intProjectID), dtSavedJob, dtSavedUnitGeneralList);
    }


    if (methods.mech_schedule) {
      // setSavedUnitList(null);

      if (dtSavedUnitGeneralList?.length <= 0) {
        setSnackbarMessage('No units found for the report. Please click the \'Add New Unit\' button.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      const res = await ExportMechanicalScheduleExcel(Number(intProjectID), dtSavedJob, dtSavedUnitGeneralList);
      // const errMsg = value
      if (ErrorMsg !== '') {
        setSnackbarMessage(ErrorMsg);
        setOpenSnackbar(true);
      }

      const rest2 = "";
    }


    if (methods.revit_files) {
      // setSavedUnitList(null);

      if (dtSavedUnitGeneralList?.length <= 0) {
        setSnackbarMessage('No units found for the report. Please click the \'Add New Unit\' button.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      await ExportAllUnitsSelectionRevit(Number(intProjectID), dtSavedJob, dtSavedUnitGeneralList);
      
      if (ErrorMsg !== '') {
        setSnackbarMessage(ErrorMsg);
        setOpenSnackbar(true);
      }
   }


    if (methods.submittal) {
      // setSavedUnitList(null);

      if (dtSavedUnitGeneralList.length <= 0) {
        setSnackbarMessage('No units found for the report. Please click the \'Add New Unit\' button.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      // setSavedSubmittal(null);
      if (dtSavedSubmittal.length <= 0) {
        setSnackbarMessage('Submittal must be saved. Please navigate to the Submittal section to save it.');
        setOpenSnackbar(true);
        setIsLoading(false);
        return;
      }

      const isSubmittalSuccess = await ExportSubmittalPdf(Number(intProjectID), dtSavedJob, dtSavedUnitGeneralList, dtSavedSubmittal);

      // if (isSubmittalSuccess) {
      //   setSuccessNotifyText('Success export report for Submitall!');
      //   setOpenSuccessNotify(true);
      // } else if (!isSubmittalSuccess) {
      //   setFailNotifyText('Unfortunately, fail in downloading Submttal Data.! Submittal must be saved!');
      //   setOpenFailNotify(true);
      // // } else if (!isSubmitallEpicorSuccess) {
      // //   setFailNotifyText(
      // //     'Unfortunately, fail in downloading file, please check  Submttal and Quote data!'
      // //   );
      // //   setOpenFailNotify(true);
      // } else {
      //   setFailNotifyText('Please check the project submittal!');
      //   setOpenFailNotify(true);
      // }
    }


    setIsLoading(false);
    // onClose()
  }, [intProjectID,
    methods.quote,
    methods.selection,
    methods.mech_schedule,
    methods.revit_files,
    methods.submittal,
    dtSavedJob,
    // dtSavedUnitGeneralList, 
    // dtSavedQuote, 
    // dtSavedSubmittal,
    // setSavedUnitList,
    // setSavedQuote,
    // setSavedSubmittal, 
    api.project,
    ExportQuotePdf,
    ExportAllUnitsSelectionPdf,
    ExportMechanicalScheduleExcel,
    ExportAllUnitsSelectionRevit,
    ExportSubmittalPdf,
    ErrorMsg,
    // onClose
    ]);


  const onCloseDialog = useCallback(() => {
    setIsLoading(false);
    onClose();
  }, [onClose]);


  const handleCloseNotify = useCallback((key: string) => {
    if (key === 'success') {
      setOpenSuccessNotify(false);
    } else if (key === 'fail') {
      setOpenFailNotify(false);
    }
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose && onClose()}
      aria-labelledby="responsive-dialog-title"
    >
      <Box sx={{ width: '100%', minWidth: 450 }}>
        <DialogTitle id="responsive-dialog-title" sx={{ px: '40px' }}>
          Select report(s) to export
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {exportOutputs.map((e: { id: string; label: string; }) => (
              <ListItem key={e.id}>
                <ListItemButton
                  role={undefined}
                  onClick={() => onChangeMethods(e.id, methods[e.id])}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={methods[e.id]}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': 'checkbox-list-label-selection' }}
                    />
                  </ListItemIcon>
                  <ListItemText id="checkbox-list-label-selection" primary={e.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Grid container sx={{ width: '100%' }} spacing={3}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={onCloseDialog}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6}>
              <LoadingButton
                loading={isLoading}
                fullWidth
                onClick={onClickExports}
                variant="contained"
                autoFocus
              >
                Export
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
        <Snackbar
          open={openSuccessNotify}
          autoHideDuration={3000}
          onClose={() => handleCloseNotify('success')}
        >
          <Alert
            onClose={() => handleCloseNotify('success')}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successNotifyText}
          </Alert>
        </Snackbar>
        <Snackbar
          open={openFailNotify}
          autoHideDuration={3000}
          onClose={() => handleCloseNotify('warning')}
        >
          <Alert
            onClose={() => handleCloseNotify('fail')}
            severity="warning"
            sx={{ width: '100%' }}
          >
            {failNotifyText}
          </Alert>
        </Snackbar>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
