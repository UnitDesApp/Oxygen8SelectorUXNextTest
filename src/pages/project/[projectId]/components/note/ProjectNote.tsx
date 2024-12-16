import { useState, useEffect, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Snackbar, Stack } from '@mui/material';
// component
// hooks
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useGetSavedJobNotes } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';

// ----------------------------------------------------------------------
export default function ProjectNote() {
  const { projectId } = useRouter().query;
  const api = useApiContext();

  const { data: loadedSavedNotes, isLoading: isLoadingJobNotes } = useGetSavedJobNotes({intJobId: projectId});

  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openFail, setOpenFail] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [savedNotes, setSavedNotes] = useState<any>([]);

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  const handleCloseFail = () => {
    setOpenFail(false);
  };

  const projectInfoSchema = Yup.object().shape({
    txbNotes: Yup.string(),
  });

  // hooks
  const defaultValues = {
    txbNotes: '',
  };

  const methods = useForm({
    resolver: yupResolver(projectInfoSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  // const getSavedJobNotes = useMemo(async () => {
  //   // const { data: dbtSavedJob } = useGetSavedJob({intJobId: projectId}); // useGetSavedJob api call returns data and stores in dbtSavedJob
  
  //   const result = await api.project.getSavedJobNotes({ intJobId: projectId });
  //   setSavedNote(result);
  
  // },[api.project, projectId]);
  
  const onSubmit = useCallback(async () => {
    if (Number(projectId) < 1) {
      setSnackbarMessage('Job must be saved before addding notes.');
      setOpenSnackbar(true);
      return;
    }

    if (getValues('txbNotes') === undefined || getValues('txbNotes')?.length < 2) {
      setSnackbarMessage('Notes is required or too short.');
      setOpenSnackbar(true);
      return;
    }

    setIsProcessingData(true);

    try {
      const data: any = {
        // intUserId: localStorage.getItem('userId'),
        // intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intNotesNo: savedNotes?.[0]?.notes_no > 0 ? savedNotes?.[0]?.notes_no : 0,
        strNotes: getValues('txbNotes'),
      };

      const result = await api.project.saveJobNotes(data);
      setSavedNotes(result);
      setOpenSuccess(true);
    } catch (error) {
      setOpenFail(true);
      console.error(error);
    }

    setIsProcessingData(false);
  }, [api.project, getValues, projectId, savedNotes]);


  const deleteNotesClicked = useCallback(async (row: any) => {
      setIsProcessingData(true);

      const data: any = {
        // intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intNotesNo: savedNotes?.[0]?.notes_no,
      };
      const result = await api.project.deleteJobNotes(data);
      setSavedNotes(result);

      // const info: { fdtNotes: any } = { fdtNotes: [] };
      // info.fdtNotes = result;
    // setNotesList(result?.dbtSavedNotes);
    // setNotesList(result);

      setValue('txbNotes', '');

      setIsProcessingData(false);
    },
    [api.project, projectId, savedNotes, setValue]
  );


  useMemo(() => {
    setSavedNotes(loadedSavedNotes);
  }, [loadedSavedNotes]);


  useEffect(() => {
    setValue('txbNotes', savedNotes?.[0]?.notes);
  }, [savedNotes, setValue]);

  return (
    <Box sx={{ paddingTop: 1, width: '100%' }}>
      {/* <Container maxWidth="xl" sx={{ mb: '10px' }}> */}
      {isLoadingJobNotes || isProcessingData ? (
        <CircularProgressLoading />
      ) : (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField
            id="standard-multiline-flexible"
            name="txbNotes"
            label="Notes"
            placeholder="Take a notes..."
            multiline
            maxRows={15}
            rows={15}
            sx={{ width: '100%' }}
          />
          {/* <Box sx={{ display: 'grid', rowGap: 3, columnGap: 3, gridTemplateColumns: { xs: 'repeat(2, 1fr)' }, }}> */}
          <Stack direction="row" justifyContent="right" textAlign="center" marginTop="5px">
          <LoadingButton
                type="submit"
                startIcon={<Iconify icon="fluent:save-24-regular" />}
                loading={isSubmitting}
                sx={{ width: '150px' }}
              >
                Save
              </LoadingButton>
              <LoadingButton
                type="submit"
                startIcon={<Iconify icon="fluent:save-24-regular" />}
                loading={isSubmitting}
                sx={{ width: '150px' }}
                onClick={deleteNotesClicked}
              >
                Delete
              </LoadingButton>
            </Stack>
          {/* </Box> */}
        </FormProvider>
      )}
      <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
        Notes are saved successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={openFail} autoHideDuration={3000} onClose={handleCloseFail}>
        <Alert onClose={handleCloseFail} severity="error" sx={{ width: '100%' }}>
          Server Error!
        </Alert>
      </Snackbar>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
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
    </Box>
  );
}
