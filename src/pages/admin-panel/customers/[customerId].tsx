import { useEffect, useMemo, useState } from 'react';
// yup
import * as Yup from 'yup';
// mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Container,
  Button,
  Snackbar,
  Alert,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useGetAccountInfo } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import DashboardLayout from 'src/layouts/dashboard/DashboardLayout';
import Users from '../users';
import UserDialog from '../component/userDialog';
import CustomerDialog from '../component/customerDialog';

// ------------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ------------------------------------------------------------------------
UserEdit.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;
// ------------------------------------------------------------------------

export default function UserEdit() {
  const { customerId } = useRouter().query;
  const api = useApiContext();
  const { data: accountInfo, isLoading, refetch } = useGetAccountInfo();
  const { dbtSelCustomerType, dbtSelFOB_Point, dbtSelCountry, dbtSelProvState, dbtSavCustomer } = accountInfo || {
    customers: [],
    fobPoint: [],
  };
  // dbtSelFOB_Point
  const selectedCustomer = dbtSavCustomer?.filter((customer: any) => customer.id === Number(customerId?.toString() || '0'))[0];


  const NewUserSchema = Yup.object().shape({
    txbCustomerName: Yup.string(),
    txbCustomerType: Yup.number(),
    txbCountry: Yup.string(),
    txbAddress: Yup.string(),
    txbContactName: Yup.string(),
    txbFOB_Point: Yup.number(),
    txbShippingFactor: Yup.string(),
    txbCreatedDate: Yup.string(),
  });

  const defaultValues = {
    txbCustomer: selectedCustomer?.name,
    txbCustomerType: selectedCustomer?.customer_type_id,
    txbCountry: selectedCustomer?.country_id,
    txbAddress: selectedCustomer?.address,
    txbContactName: selectedCustomer?.contact_name,
    txbFOB_Point: selectedCustomer?.fob_point_id,
    txbShippingFactor: selectedCustomer?.shipping_factor_percent,
    txbCreatedDate: selectedCustomer?.created_date,
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [addUserDlgOpen, setAddUserDlgOpen] = useState(false);
  const [addCustomerDlgOpen, setAddCustomerDlgOpen] = useState(false);
  const [successDlgOpen, setSuccessDlgOpen] = useState(false);
  const [failDlgOpen, setFailDlgOpen] = useState(false);
  const [successText, setSuccessText] = useState('');
  const [expanded, setExpanded] = useState({ panel1: true, panel2: true });


  // const [ddlCustomerTypeSelId, setDdlCustomerTypeSelId] = useState([]);
  useEffect(() => {
    const fdtCustomer : any = dbtSavCustomer?.filter((e: {id: Number}) => e.id === Number(selectedCustomer?.id))?.[0] || {};
    const value = fdtCustomer?.name;
    setValue("txbCustomer", fdtCustomer?.name || '');

  }, [dbtSavCustomer, dbtSelCustomerType, selectedCustomer?.id, setValue]);


  useEffect(() => {
    const fdtCustomerType : any = dbtSelCustomerType?.filter((e: {id: Number}) => Number(e.id) === Number(selectedCustomer?.customer_type_id))?.[0] || {};
    setValue('txbCustomerType', fdtCustomerType?.items || '');

  }, [dbtSelCustomerType, selectedCustomer?.customer_type_id, setValue]);


  useEffect(() => {

    const fdtCountry = dbtSelCountry?.filter((item: { id: Number }) => item.id === selectedCustomer?.country_id)?.[0] || {};
    setValue('txbCountry', fdtCountry?.items || '');

  }, [dbtSelCountry, selectedCustomer?.country_id, setValue]);


  // useEffect(() => {

  //   const fdtProvState = dbtSelProvState?.filter((item: { prov_state_id_code: string }) => item.prov_state_id_code === selectedCustomer?.prov_state_id_code)?.[0] || {};
  //   setValue('txbProvState', fdtProvState?.items || '');

  // }, [dbtSelProvState, selectedCustomer?.prov_state_id_code, setValue]);

  useEffect(() => {

    const fdtFOB_Point = dbtSelFOB_Point?.filter((e: {id: Number}) => e.id === Number(selectedCustomer?.fob_point_id))?.[0] || {};
    setValue('txbFOB_Point', fdtFOB_Point?.items || '');

  }, [dbtSelFOB_Point, selectedCustomer?.fob_point_id, setValue]);


  const onCloseUserDlg = () => {
    setAddUserDlgOpen(false);
  };

  const onCloseCustomerDlg = () => {
    setAddCustomerDlgOpen(false);
  };

  const onCloseSuccessDlgOpen = () => {
    setSuccessDlgOpen(false);
  };

  const onCloseFailDlgOpen = () => {
    setFailDlgOpen(false);
  };

  const onSuccessAddUser = () => {
    setSuccessText('New user has been added');
    setSuccessDlgOpen(true);
  };

  const onSuccessAddCustomer = () => {
    setSuccessText('New customer has been added');
    setSuccessDlgOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      await api.account.updateCustomer({ ...data, customerId });
      setSuccessText('Successfully Updated');
      setSuccessDlgOpen(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <RootStyle>
      <Container maxWidth={false} sx={{ mt: '20px' }}>
        <CustomBreadcrumbs
          heading={`Customer: ${selectedCustomer?.name}`} 
          links={[{ name: 'Customers', href: '/admin-panel/customers' }, { name: selectedCustomer?.name }]}
        />
        <Stack spacing={2}>
          <Accordion
            expanded={expanded.panel1}
            onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="il:arrow-down" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="primary.main" variant="h6">
                CUSTOMER INFO
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(2, 1fr)' }}>
                  <RHFTextField size="small" InputProps={{ readOnly: true }}  name="txbCustomer" label="Customer Name" />
                  {/* <RHFSelect
                    native
                    size="small"
                    name="customerType"
                    label="Customer type"
                    placeholder=""
                  >
                    {dbtSelCustomerType?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                    {!dbtSelCustomerType && <option value="" />}
                  </RHFSelect> */}
                  <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbCustomerType" label="Customer Type" />
                  <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbAddress" label="Address" />
                  {/* <RHFSelect native size="small" name="countryId" label="Country" placeholder="">
                    {dbtSelCountry?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                    {!dbtSavCustomer && <option value="" />}
                  </RHFSelect> */}
                  <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbCountry" label="Country" />

                  <RHFTextField size="small" InputProps={{ readOnly: true }}  name="txbContactName" label="Contact name" />
                  {/* <RHFSelect native size="small" name="fobPoint" label="FOB point" placeholder="">
                    {dbtSelFOB_Point?.map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.items}
                      </option>
                    ))}
                    {!dbtSelFOB_Point && <option value="" />}
                  </RHFSelect> */}
                  <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbFOB_Point" label="FOB Point" />
                  <RHFTextField size="small" InputProps={{ readOnly: true }}  name="txbCreatedDate" label="Create Date" />
                  <RHFTextField size="small" name="txbShippingFactor" label="Shipping factor(%)" />
                </Box>
                <Stack spacing={2} p={2}>
                  <Stack direction="row" justifyContent="flex-end">
                    <LoadingButton
                      type="submit"
                      loading={isSubmitting}
                      variant="contained"
                      color="primary"
                      sx={{ display: 'none' }}
                      onClick={() => console.log(getValues())}
                    >
                      Update
                    </LoadingButton>
                  </Stack>
                </Stack>
              </FormProvider>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded.panel2}
            onChange={() => setExpanded({ ...expanded, panel2: !expanded.panel2 })}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="il:arrow-down" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="primary.main" variant="h6">
                USER LIST
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Users toolbar={false} checkbox={false} />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Container>
      <Snackbar open={successDlgOpen} autoHideDuration={3000} onClose={onCloseSuccessDlgOpen}>
        <Alert onClose={onCloseSuccessDlgOpen} severity="success" sx={{ width: '100%' }}>
          {successText}
        </Alert>
      </Snackbar>
      <Snackbar open={failDlgOpen} autoHideDuration={3000} onClose={onCloseFailDlgOpen}>
        <Alert onClose={onCloseFailDlgOpen} severity="success" sx={{ width: '100%' }}>
          Server error!
        </Alert>
      </Snackbar>
      <UserDialog
        open={addUserDlgOpen}
        onClose={onCloseUserDlg}
        onSuccess={onSuccessAddUser}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
        rowSelectedCustomer={selectedCustomer}
      />
      <CustomerDialog
        open={addCustomerDlgOpen}
        onClose={onCloseCustomerDlg}
        onSuccess={onSuccessAddCustomer}
        onFail={() => setFailDlgOpen(true)}
        refetch={refetch}
      />
    </RootStyle>
  );
}
