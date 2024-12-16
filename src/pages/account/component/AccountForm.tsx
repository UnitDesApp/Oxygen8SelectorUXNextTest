import * as Yup from 'yup';
import { useCallback, useMemo, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Grid, Divider, Stack, Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useApiContext } from 'src/contexts/ApiContext';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useGetUser } from 'src/hooks/useApi';
import GroupBox from 'src/components/GroupBox';
import GroupBox2 from 'src/components/GroupBox2';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFTextField, RHFSelect } from 'src/components/hook-form';
import ChangePasswordForm from './ChangePasswordForm';

// ----------------------------------------------------------------------

interface AccountFormProps {
  accountInfo: any;
}

export default function AccountForm({ accountInfo }: AccountFormProps) {
  const { user, updateUser } = useAuthContext();
  const { data: dbtSavedUser } = useGetUser({intUserId: Number(typeof window !== 'undefined' && localStorage.getItem('userId'))}); // useGetSavedJob api call returns data and stores in dbtSavedJob

  const { dbtSelCustomerType, dbtSelFOB_Point, dbtSelCountry, dbtSelProvState, dbtSavCustomer } = accountInfo || {};
  const api = useApiContext();
  const [success, setSuccess] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState('CAN')
  const [fail, setFail] = useState<boolean>(false);
  const [myAccount, setMyAccount] = useState<any>([]);

  const UpdateUserSchema = Yup.object().shape({
    txbFirstName: Yup.string().required('This field is required!'),
    txbLastName: Yup.string().required('This field is required!'),
    txbEmail: Yup.string().required('This field is required!'),
    // txbUsername: Yup.string().required('This field is required!'),
    // txbCustomerType: Yup.string().required('This field is required!'),
    txbJobTile: Yup.string(),
    txbCustomer: Yup.string(),
    txbPhoneNumber: Yup.string(),
    txbAddress1: Yup.string(),
    txbAddress2: Yup.string(),
    txbCity: Yup.string(),
    // ddlCountry: Yup.string(),
    // ddlProvState: Yup.string(),
    // access: Yup.string(),
    // accessLevel: Yup.string(),
    // accessPricing: Yup.string(),
    // txbFob_Point: Yup.string(),
    // createdDate: Yup.string(),
  }); 

  const  userCustomer = dbtSavCustomer?.filter((e: any) => e.id === Number(user?.customerId))?.[0] || {};


  const defaultValues = useMemo(
    () => ({
      txbUsername: user?.username,
      txbFirstName: user?.firstname,
      txbLastName: user?.lastname,
      txbEmail: user?.email,
      txbJobTitle: user?.title,
      // txbCustomerType: dbtSelCustomerType?.[0]?.id,
      txbCustomer: '',
      txbPhoneNumber: user?.phone_number,
      txbAddress1: '',
      txbAddress2: '',
      txbCity: '',
      ddlCountry: 'CAN',
      ddlProvState: 'AB',
      // access: user?.access,
      // accessLevel: 10,
      // accessPricing: user?.accessPricing,
      txbFOB_Point: '',
      // createdDate: user?.createdDate,
    }),
    [user?.email, user?.firstname, user?.title, user?.lastname, user?.phone_number, user?.username]
  );  

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback (
    async (inpData: any) => {
      try {
        inpData = {
          intUserId: user?.userId,
          intIsUpdateMyAccount: 1,
          strFirstName: getValues("txbFirstName"),
          strLastName: getValues("txbLastName"),
          strEmail: getValues("txbEmail"),
          strJobTitle: getValues("txbJobTitle"),
          strPhoneNumber: getValues("txbPhoneNumber"),
          strAddress1: getValues("txbAddress1"),
          strAddress2: getValues("txbAddress2"),
          strCity: getValues("txbCity"),
          // strCountryIdCode: getValues("ddlCountry"),
          // strProvStateIdCode: getValues("ddlProvState")
        }

        // await api.account.updateProfile({ ...inpData, userId: user?.userId });
        const result = await api.account.updateProfile(inpData);
        // await api.account.updateProfile({ data });
        updateUser(inpData);
        setSuccess(true);
      } catch (e) {
        console.log(e);
        setFail(true);
      }
    },
    [user?.userId, getValues, api.account, updateUser]
    // [api.account, updateUser, user?.userId]
  );

  useEffect(() => {
    setMyAccount(dbtSavedUser?.[0]);
  }, [dbtSavedUser])




  useEffect(() => {
    if (myAccount !== null) {
      setValue('txbFirstName', String(myAccount?.first_name) !== 'undefined' && myAccount?.first_name !== "" ? myAccount?.first_name : "");
      setValue('txbLastName', String(myAccount?.last_name) !== 'undefined' && myAccount?.last_name !== "" ? myAccount?.last_name : "");
      setValue('txbEmail', String(myAccount?.email) !== 'undefined' && myAccount?.email !== "" ? myAccount?.email : "");
      setValue('txbUsername', String(myAccount?.username) !== 'undefined' && myAccount?.username !== "" ? myAccount?.username : "");
      // setValue('txbPassword', dbtUser?. !== null ? dbtUser?. : "");
      // setValue('txbConfirmPassword', dbtUser?. !== "" ? dbtUser?. : "");
      setValue('txbJobTitle', String(myAccount?.title) !== 'undefined' && myAccount?.title !== "" ? myAccount?.title : "");
      setValue('txbPhoneNumber', String(myAccount?.phone_number) !== 'undefined' && myAccount?.phone_number !== "" ? myAccount?.phone_number : "");
      setValue('txbAddress1', String(myAccount?.address_1) !== 'undefined' && myAccount?.address_1 !== "" ? myAccount?.address_1 : "");
      setValue('txbAddress2', String(myAccount?.address_2) !== 'undefined' && myAccount?.address_2 !== "" ? myAccount?.address_2 : "");
      setValue('txbCity', String(myAccount?.city) !== 'undefined' && myAccount?.city !== "" ? myAccount?.city : "");
      setValue('txbFOB_Point', String(myAccount?.FOBPoint) !== 'undefined' && myAccount?.FOBPoint !== "" ? myAccount?.FOBPoint : "");
 

      setValue('txbCustomer', String(myAccount?.CustomerName) !== 'undefined' && myAccount?.CustomerName !== "" ? myAccount?.CustomerName : "");
      setValue('ddlCountry', Number(myAccount?.CustomerCountryId) > 0 ? myAccount?.CustomerCountryId : getValues('ddlCountry'));
      setValue('ddlProvState', String(myAccount?.CustomerState) !== 'undefined' && myAccount?.CustomerState !== "" ? myAccount?.CustomerState : "")
    } 
    // else {
    //   // Keep these values in else statement rather than inline if statment
    //   setValue('txbFirstName', '');
    //   setValue('txbLastName', '');
    //   setValue('txbEmail', '');
    //   setValue('txbUsername', '');
    //   setValue('txbJobTitle', '');
    //   // setValue('ddlAccess', 1); // 1: Yes
    //   // setValue('ddlAccessLevel', 1);  // 1: External
    //   // setValue('ddlAccessPricing', 0);  // 0: No
    // }
  }, [myAccount, getValues, setValue]); // <-- empty dependency array - This will only trigger when the component mounts and no-render



  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={7} md={7}>
        <GroupBox2 title="Profile">
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} p={2}>
              <Stack direction="row" justifyContent="space-around" spacing={1}>
                <RHFTextField size="small" name="txbFirstName" label="First Name" />
                <RHFTextField size="small" name="txbLastName" label="Last Name" />
              </Stack>
              <RHFTextField size="small" name="txbEmail" label="Email" />
              <RHFTextField size="small" name="txbCustomer" label="Company Name" disabled/>
              <RHFTextField size="small" name="txbJobTitle" label="Job Title" />
              <RHFTextField size="small" name="txbPhoneNumber" label="Phone Number" />
              <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="txbAddress1" label="Address1" />
                <RHFTextField size="small" name="txbAddress2" label="Address2" />
              </Stack>
              <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="txbCity" label="City" />
                {/* <RHFTextField size="small" name="state/Province" label="Status" /> */}
                <RHFSelect
                      native
                      size="small"
                      name="ddlCountry"
                      label="Country"
                      disabled
                      // // sx={getDisplay(coolingCompInfo?.isVisible)}
                      // onChange={ddlCountryChanged}
                      // // onChange={(e: any) =>{
                      // //   setValue('ddlCountry', e.target.value)
                      // //   // setSelectedCountry(e.target.value)
                      // // } }
                      >
                      {dbtSelCountry?.map((item: any, index: number) => (
                        <option key={index} value={item.value}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                {/* <RHFTextField size="small" name="country" label="Country" /> */}
                <RHFSelect
                      native
                      size="small"
                      name="ddlProvState"
                      label="Province/State"
                      disabled
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      // onChange={ddlProvStateChanged}
                    >
                      {dbtSelProvState?.map((item: any, index: number) => (
                        <option key={index} value={item.value}>
                          {item.items}
                        </option>
                      ))}
                </RHFSelect>
              </Stack>
              <RHFTextField size="small" name="txbFOB_Point" label="FOB point" disabled />
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Stack>
          </FormProvider>
        </GroupBox2>
      </Grid>
      <Grid item xs={5} md={5}>
        <ChangePasswordForm />
      </Grid>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          Account information have been updated!
        </Alert>
      </Snackbar>
      <Snackbar
        open={fail}
        autoHideDuration={6000}
        onClose={() => {
          setFail(false);
        }}
      >
        <Alert
          onClose={() => {
            setFail(false);
          }}
          severity="error"
          sx={{ width: '100%' }}
        >
          Server Error!
        </Alert>
      </Snackbar>
    </Grid>
  );
}
