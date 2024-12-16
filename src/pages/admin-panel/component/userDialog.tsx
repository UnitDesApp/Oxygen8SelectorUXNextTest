import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import * as Ids from 'src/utils/ids';
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// form
import { useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { useGetAccountInfo, useGetUsersByCustomer } from 'src/hooks/useApi';
import { useApiContext } from 'src/contexts/ApiContext';
import FormProvider from 'src/components/hook-form/FormProvider';
import { RHFSelect, RHFTextField, RHFCheckbox } from 'src/components/hook-form';
// routes
import { useRouter } from 'next/router';
import { PATH_APP } from '../../../routes/paths';

interface userDialogProps {
  open: boolean;
  onClose: Function;
  onSuccess: Function;
  onFail: Function;
  refetch: Function;
  name?: String;
  row?: any;
  rowSelectedCustomer?: any;
}

export default function UserDialog({
  open,
  onClose,
  onSuccess,
  onFail,
  refetch,
  row,
  name,
  rowSelectedCustomer

}: userDialogProps) {
  const api = useApiContext();
  const { data: accountInfo, isLoading } = useGetAccountInfo();

  const {   
    dbtSavUser,
    dbtSelCustomerType,
    dbtSelFOB_Point,
    dbtSavCustomer,
    dbtSelCountry,
    dbtSelProvState, } = accountInfo || {};

    const { customerId } = useRouter().query;


  const NewUserSchema = Yup.object().shape({
    txbFirstname: Yup.string(),
    txbLastname: Yup.string(),
    txbEmail: Yup.string(),
    txbUsername: Yup.string(),
    // txbPassword: Yup.string().required('This field is required!'),
    // txbConfirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
    txbPassword: Yup.string(),
    txbConfirmPassword: Yup.string(),
    ddlCustomerType: Yup.string(),
    ddlCustomer: Yup.string(),
    txbPhoneNumber: Yup.string(),
    txbJobTitle: Yup.string(),
    txbAddress1: Yup.string(),
    txbAddress2: Yup.string(),
    txbCity: Yup.string(),
    ddlCountry: Yup.string(),
    ddlProvState: Yup.string(),
    ddlAccess: Yup.string(),
    ddlAccessLevel: Yup.string(),
    ddlAccessPricing: Yup.string(),
    // fobPoint: Yup.string().required('This field is required!'),
    createdDate: Yup.string(),
  });

  
  const [selectedCustomer, setSelectedCustomer] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [customerTypeOptions, setCustomerTypeOptions] = useState([]);
  const [customerTypeId, setCustomerTypeId] = useState<number>(0);
  const [customerOptions, setCustomerOptions] = useState([]);
  // const [customerName, setCustomerName] = useState([]);
  const [customerIdVal, setCustomerIdVal] = useState<number>(0);
  const [accessOptions, setAccessOptions] = useState([]);
  // const [accessId, setAccessId] = useState<number>(0);
  const [accessLevelOptions, setAccessLevelOptions] = useState([]);
  // const [accessLevelId, setAccessLevelId] = useState<number>(0);
  const [accessPricingOptions, setAccessPricingOptions] = useState([]);
  // const [accessPricingId, setAccessPricingId] = useState<number>(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  // useMemo(() => {

  //   // const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(userId))?.[0] || {};
  //   const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(0))?.[0] || {};
  //   setSelectedUser(fdtSelectedUser);
    
  // }, [dbtSavUser]);


  // const { data: dbtSavUsersByCustomer } = useGetUsersByCustomer({intCustomerId: row?.customerId});


  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    // defaultValues: name === 'edit' ? editDefaultValues : newDefaultValues,
  });

  const {
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  
  // const userId = row?.id;
  const intUAL = typeof window !== 'undefined' ? localStorage.getItem('UAL') : 0


// *******************************************************************************************************************************************************
// *******************************************************************************************************************************************************
  const setCutomerType = useCallback (() => {
    let defaultId = 0;

    let  fdtCustomerType : any = dbtSelCustomerType;
    // let  fdtCustomerName : any = dbtSavCustomer;

    if (Number(intUAL) === Number(Ids.intUAL_IntAdmin) || Number(intUAL) === Number(Ids.intUAL_IntLvl_2) || Number(intUAL) === Number(Ids.intUAL_IntLvl_1)) {
      fdtCustomerType = fdtCustomerType?.filter((e: {id: Number}) => 
        Number(e.id) !== Number(Ids.intCustomerTypeIdAll) && Number(e.id) !== Number(Ids.intCustomerTypeIdAdmin));
    }

    // if (Number(intUAL) === Number(Ids.intUAL_IntAdmin) || Number(intUAL) === Number(Ids.intUAL_IntLvl_2) || Number(intUAL) === Number(Ids.intUAL_IntLvl_1)) {
    //   fdtCustomerName = fdtCustomerName?.filter((e: {id: Number}) => 
    //     Number(e.id) !== Number(Ids.intCustomerTypeIdAll) && Number(e.id) !== Number(Ids.intCustomerTypeIdAdmin));
    // }
   
    // if (selectedCustomerVal !== undefined && Number(selectedCustomerVal?.customer_type_id) > 0) {
    //   defaultId = selectedCustomerVal?.customer_type_id;
    //   setCustomerName( selectedCustomerVal?.name)
    // }

    // if (Number(customerTypeId) > 0) {
    //   defaultId = customerTypeId
    // }


    defaultId = fdtCustomerType?.[0]?.id

    setCustomerTypeOptions(fdtCustomerType);
    setValue('ddlCustomerType', defaultId);
    // setCustomerTypeId(defaultId);
    // setCustomerName(fdtCustomerName);

  }, [dbtSelCustomerType, intUAL, setValue]);


  const setCustomer = useCallback (() => {
    let defaultId = 0;
    let fdtCustomer : any = dbtSavCustomer;

    if (Number(getValues('ddlCustomerType')) !== Ids.intCustomerTypeIdAll) {
      fdtCustomer = fdtCustomer?.filter((e: {customer_type_id: Number}) => Number(e.customer_type_id) === Number(getValues('ddlCustomerType')));
    }

    fdtCustomer = fdtCustomer?.sort((a: any, b: any) => a.name.localeCompare(b.name));

    // setDdlCustomerTypeSelId(fdtCustomerType?.[0]?.id);

    // if (customerId > 0) {
    //   fdtCustomer = fdtCustomer?.filter((item: { id: Number }) => Number(item.id) === customerId);
    //   // info.fdtProvState = info.fdtProvState?.filter((item: { country_value: string }) => item.country_value === selectedUser?.conuntry_id);
    // }


    // if (selectedCustomerVal !== undefined && Number(selectedCustomerVal?.id) > 0) {
    //   defaultId = selectedCustomerVal?.id;
    // }

    // if (selectedCustomer !== undefined && Number(selectedCustomer?.id) > 0) {
    //   defaultId = selectedCustomer?.id;
    // }

    // if (Number(customerIdVal) > 0) {
    //   defaultId = customerIdVal;
    // }

    // if (selectedUser !== undefined && Number(selectedUser?.CustomerId) > 0) {
    //   defaultId = selectedUser?.CustomerId;
    // }

    defaultId = fdtCustomer?.[0]?.id

    setCustomerOptions(fdtCustomer);
    setValue('ddlCustomer', defaultId);
    // setCustomerIdVal(defaultId);

  }, [dbtSavCustomer, getValues, setValue]);



  const setAccess = useCallback(() => {
    const AccessOptions: any = [
      { id: 1, items: "Yes" },
      { id: 0, items: "No" }
    ]

    setAccessOptions(AccessOptions);
    setValue('ddlAccess', AccessOptions?.[0]?.id);
  }, [setValue]);


  const setAccessLevel = useCallback(() => {

    const AccessLevelOptions: any = [
      { id: 1, items: "External" },
      { id: 2, items: "Internal 1" },
      { id: 3, items: "Internal 2" },
      { id: 4, items: "Internal Admin" },
      { id: 5, items: "External Special" },
      { id: 10, items: "Admin" },
      { id: 7, items: "Admin Lvl 1" }
    ]

    setAccessLevelOptions(AccessLevelOptions);
    setValue('ddlAccessLevel', AccessLevelOptions?.[0]?.id);
  }, [setValue]);


const setAccessPricing = useCallback(() => {

  const AccessPricingOptions : any = [
    {id: 0, items: "No"},
    {id: 1, items: "Yes"}
  ]

  setAccessPricingOptions(AccessPricingOptions);
  setValue('ddlAccessPricing', AccessPricingOptions?.[0]?.id);
}, [setValue]);



  // useMemo(() => {
  //   const fdtFOB_Point = dbtSelFOB_Point?.filter((e: {id: Number}) => e.id === Number(selectedUser?.fob_point_id));
  //   // setTxbFOB_PointSelItem(fdtFOB_Point?.[0]?.items);
  //   setValue('txbFOB_Point', fdtFOB_Point?.[0]?.items);

  // }, [dbtSelFOB_Point, selectedUser?.fob_point_id, setValue]);



// *******************************************************************************************************************************************************
// *******************************************************************************************************************************************************
const newDefaultValues = useMemo(
  () => ({
    txbFirstName: '',
    txbLastName: '',
    txbEmail: '',
    txbUsername: '',
    txbPassword: '',
    txbConfirmPassword: '',
    ddlCustomerType: 'All',
    ddlCustomer: '1',
    txbPhoneNumber: '',
    txbAddress1: '',
    txbAddress2: '',
    ddlCountry: '',
    ddlProvState: '',
    ddlAccess: '1',
    ddlAccessLevel: '1',
    ddlAccessPricing: '0',
    txbFOB_Point: '',
    txbCreatedDate: '',
  }),
  []
);


useEffect(() => {
  const fdtCustomer = dbtSavCustomer?.filter((e: any) => e.id === Number(customerId?.toString() || '0'))[0];    
  
  if (String(fdtCustomer) !== 'undefined') {
    setSelectedCustomer(fdtCustomer);
    setCustomerIdVal(fdtCustomer?.id);
    // setCustomerTypeId(selectedCustomerVal?.customer_type_id);
  }
}, [customerId, dbtSavCustomer]);


  useEffect(() => {

    const fdtSelectedUser = dbtSavUser?.filter((e: any) => e.id === Number(row?.id))?.[0] || {};
    // const  fdtSelectedUser = dbtSavUser?.filter((user: any) => user.id === Number(0))?.[0] || {};

    setSelectedUser(row);
    if (String(row) !== 'undefined') {
      setCustomerIdVal(fdtSelectedUser?.CustomerId);
      // setCustomerTypeId(fdtSelectedUser?.CustomerTypeId);
    }
  }, [open, row, dbtSavUser]);


  useEffect(() => {
    setCutomerType();
    setCustomer();
    setAccess();
    setAccessLevel();
    setAccessPricing();
  }, [setAccess, setAccessLevel, setAccessPricing, setCustomer, setCutomerType]);


  useEffect(() => {
    if (String(selectedCustomer) !== 'undefined') {
      if (String(selectedCustomer?.id) !== 'undefined' && Number(selectedCustomer?.id) > 0) {
        setCustomerTypeId(selectedCustomer?.customer_type_id);
        setCustomerIdVal(selectedCustomer?.id);
        setValue('ddlCustomerType', selectedCustomer?.customer_type_id);
        setCustomer();
        setValue('ddlCustomer', selectedCustomer?.id);
        setValue('txbFOB_Point', String(selectedCustomer?.FOBPoint) !== 'undefined' && selectedCustomer?.FOBPoint !== "" ? selectedCustomer?.FOBPoint : "");
      }
      
    } else { 
      /* empty */ 
    }
  }, [dbtSavCustomer, open, selectedCustomer, setCustomer, setValue]);


  useEffect(() => {
    if (String(selectedUser) !== 'undefined') {

      if (String(selectedUser?.id) !== 'undefined' && Number(selectedUser?.id) > 0) {
        setCustomerTypeId(selectedUser?.CustomerTypeId);
        setCustomerIdVal(selectedUser?.CustomerId);
        setValue('ddlCustomerType', selectedUser?.CustomerTypeId);
        setCustomer();
        setValue('ddlCustomer', selectedUser?.CustomerId);

        setValue('txbFirstName', String(selectedUser?.first_name) !== 'undefined' && selectedUser?.first_name !== "" ? selectedUser?.first_name : "");
        setValue('txbLastName', String(selectedUser?.last_name) !== 'undefined' && selectedUser?.last_name !== "" ? selectedUser?.last_name : "");
        setValue('txbEmail', String(selectedUser?.email) !== 'undefined' && selectedUser?.email !== "" ? selectedUser?.email : "");
        setValue('txbUsername', String(selectedUser?.username) !== 'undefined' && selectedUser?.username !== "" ? selectedUser?.username : "");
        // setValue('txbPassword', selectedUser?. !== null ? selectedUser?. : "");
        // setValue('txbConfirmPassword', selectedUser?. !== "" ? selectedUser?. : "");
        setValue('txbJobTitle', String(selectedUser?.title) !== 'undefined' && selectedUser?.title !== "" ? selectedUser?.title : "");
        // setValue('txbPhoneNumber', Number(selectedUser?.phone_number) > 0 ? selectedUser?.phone_number : "");
        // setValue('txbAddress1', Number(selectedUser?.shipping_factor_percent) > 0 ? selectedUser?.shipping_factor_percent?.toFixed(1) : 9.8);
        // setValue('txbAddress2', Number(selectedUser?.shipping_factor_percent) > 0 ? selectedUser?.shipping_factor_percent?.toFixed(1) : 9.8);
        // setValue('txbCity', Number(selectedUser?.shipping_factor_percent) > 0 ? selectedUser?.shipping_factor_percent?.toFixed(1) : 9.8);

        // if (Number(selectedUser?.country_id) > 0) {
        //   setValue('ddlCountry', selectedUser?.country_id);
        //   setCountryId(selectedUser?.country_id);
        //   const countryIndex = dbtSelCountry.findIndex((e: { id: number }) => e.id === countryId)
        //   const counVal = dbtSelCountry[countryIndex]?.value;
        //   setCountryValue(counVal);
        // }

        // if (selectedUser?.state !== '') {
        //   setValue('ddlProvState', selectedUser?.state);
        //   setProvStateId(selectedUser?.state);
        // }


        if (String(selectedUser?.access) !== 'undefined' && Number(selectedUser?.access) > -1) {
          setValue('ddlAccess', selectedUser?.access);
        }

        if (String(selectedUser?.access_level) !== 'undefined' && Number(selectedUser?.access_level) > 0) {
          setValue('ddlAccessLevel', selectedUser?.access_level);
        }

        if (String(selectedUser?.access_pricing) !== 'undefined' && Number(selectedUser?.access_pricing) > -1) {
          setValue('ddlAccessPricing', selectedUser?.access_pricing);
        }

        setValue('txbCreatedDate', String(selectedUser?.created_date) !== 'undefined' && selectedUser?.created_date !== "" ? selectedUser?.created_date : "");
      }
    } else {
      // Keep these values in else statement rather than inline if statment
      setValue('txbFirstName', '');
      setValue('txbLastName', '');
      setValue('txbEmail', '');
      setValue('txbUsername', '');
      setValue('txbJobTitle', '');
      // setValue('ddlAccess', 1); // 1: Yes
      // setValue('ddlAccessLevel', 1);  // 1: External
      // setValue('ddlAccessPricing', 0);  // 0: No
    }
  }, [open, selectedUser, setCustomer, setValue]); // <-- empty dependency array - This will only trigger when the component mounts and no-render


// *******************************************************************************************************************************************************
// *******************************************************************************************************************************************************
const ddlCustomerTypeChanged = useCallback((e: any) => {
  setValue('ddlCustomerType', e.target.value);
  setCustomerTypeId(e.target.value);
  setCustomer();
}, [setValue, setCustomer]);


const ddlCustomerChanged = useCallback((e: any) => {
  setValue('ddlCustomer', e.target.value);
  // setSelCountryId(e.target.value);
}, [setValue]);


const ddlAccessChanged = useCallback((e: any) => {
  setValue('ddlAccess', e.target.value);
  // setSelCustomerTypeId(e.target.value);
}, [setValue]);


const ddlAccessLevelChanged = useCallback((e: any) => {
  setValue('ddlAccessLevel', e.target.value);
  // setSelCountryId(e.target.value);
}, [setValue]);


const ddlAccessPricingChanged = useCallback((e: any) => {
  setValue('ddlAccessPricing', e.target.value);
  // setSelCountryId(e.target.value);
}, [setValue]);



const onSubmit = useCallback(async (inpData: any) => {

    if (!inpData.txbFirstName) {
      setSnackbarMessage('First Name is required');
      setOpenSnackbar(true);
      return;
    }

    if (!inpData.txbLastName) {
      setSnackbarMessage('Last Name is required');
      setOpenSnackbar(true);
      return;
    }

    if (!inpData.txbEmail) {
      setSnackbarMessage('Email is required');
      setOpenSnackbar(true);
      return;
    }

    if (!inpData.txbUsername) {
      setSnackbarMessage('Username is required');
      setOpenSnackbar(true);
      return;
    }

    // Set New user password or Update existing user Password
    if (!inpData.txbPassword && (Number(selectedUser?.id) < 1 ||  Number(getValues('ckbUpdatePassword')) === 1)) {
      setSnackbarMessage('Password is required');
      setOpenSnackbar(true);
      return;
    }  
    
    if (!inpData.txbConfirmPassword && (Number(selectedUser?.id) < 1 ||  Number(getValues('ckbUpdatePassword')) === 1)) {
      setSnackbarMessage('Confirm Password is required');
      setOpenSnackbar(true);
      return;
    }  

    if (inpData.txbPassword !== inpData.txbConfirmPassword && (Number(selectedUser?.id) < 1 ||  Number(getValues('ckbUpdatePassword')) === 1)) {
      setSnackbarMessage('Passwords must match');
      setOpenSnackbar(true);
      return;
    }  


    try {
       inpData = {
        intUserId: Number(selectedUser?.id) > 0 ? Number(selectedUser?.id) : 0,
        intIsUpdateMyAccount: 0,
        strUsername: getValues('txbUsername'),
        strPassword: String(selectedUser?.id) === 'undefined' || (Number(selectedUser?.id) < 1 ||  Number(getValues('ckbUpdatePassword')) === 1) ? getValues('txbPassword') : '',
        intIsUpdatePassword: Number(getValues('ckbUpdatePassword')) === 1 ? 1 : 0, 
        strFirstName: getValues('txbFirstName'),
        strLastName: getValues('txbLastName'),
        // strInitials = "",
        strEmail: getValues('txbEmail'),
        strJobTitle: getValues('txbJobTitle'),
        intcustomerId: Number(getValues('ddlCustomer')),
        strPhoneNumber: getValues('txbPhoneNumber'),
        strAddress1: getValues('txbAddress1'),
        strAddress2: getValues('txbAddress2'),
        // strCity: getValues('txbCity'),
        // strCountryIdCode: getValues('txbCountry'),
        // strProvStateIdCode: getValues('txbProvState'),
        intAccessId: Number(getValues('ddlAccess')),
        intAccessLevelId: Number(getValues('ddlAccessLevel')),
        intAccessPricingId: Number(getValues('ddlAccessPricing')),
        // strCreatedDate = DateTime.Now.ToString("yyyy-MM-dd"),
      };
      // if (name){
      //   await api.account.updateUser({ ...data, userId });
      // }
      // else{
      //   await api.account.addNewUser({ ...data, createdDate: '' });
      // }

      await api.account.saveUser(inpData);

      onSuccess();
      reset(newDefaultValues);
      window.location.reload();
      if (refetch) {
        refetch();
      }
      onClose();
    } catch (error) {
      console.error(error);
      onFail();
    }
  },
  // [api.account, onSuccess, reset, newDefaultValues,editDefaultValues, refetch, onClose, onFail]
  [selectedUser?.id, getValues, api.account, onSuccess, reset, newDefaultValues, refetch, onClose, onFail]

);


// *******************************************************************************************************************************************************
// *******************************************************************************************************************************************************
  return (
    <Dialog open={open} onClose={() => onClose && onClose()} sx={{ mt: 10 }}>{
      name? 
      <DialogTitle>Edit user</DialogTitle>
      :
      <DialogTitle>Add new user</DialogTitle>
}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ minWidth: '500px', display: 'grid', rowGap: 3, columnGap: 2 }}>
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              <RHFTextField size="small" name="txbFirstName" label="First Name" />
              <RHFTextField size="small" name="txbLastName" label="Last Name" />
            </Stack>
            <RHFTextField size="small" name="txbEmail" label="Email" />
            <RHFTextField size="small" name="txbUsername" label="User Name" />
            <RHFTextField size="small" name="txbPassword" label="Password" type="password"/>
            <RHFTextField
              size="small"
              type="password"
              name="txbConfirmPassword"
              label="Confirm Password"
            />
            <RHFCheckbox
              label="Update Password"
              name="ckbUpdatePassword"
              sx={{ display: Number(selectedUser?.id) > 0 ? 'block' : 'none' }}
              onChange={(e: any) => setValue('ckbUpdatePassword', Number(e.target.checked))}
            />
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              <RHFSelect
                native
                size="small"
                name="ddlCustomerType"
                label="Customer type"
                placeholder=""
                onChange={ddlCustomerTypeChanged}
              >
                {customerTypeOptions?.map((item: any, index: number) => (
                  <option key={index} value={item.id}>
                    {item.items}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect
                native
                size="small"
                name="ddlCustomer"
                label="Customer name"
                placeholder=""
                onChange={ddlCustomerChanged}
              >
                {customerOptions?.map((item: any, index: number) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
                {/* {!dbtSavCustomer  && <option value="" />} */}
              </RHFSelect>
            </Stack>
              {/* <RHFTextField size="small" name="txbCompanyName" label="Company Name" disabled/> */}
              <RHFTextField size="small" name="txbJobTitle" label="Job Title" />
              {/* <RHFTextField size="small" name="txbPhoneNumber" label="Phone Number" /> */}
              {/* <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="txbAddress1" label="Address1" />
                <RHFTextField size="small" name="txbAddress2" label="Address2" />
              </Stack> */}
              {/* <Stack direction="row" justifyContent="space_around" spacing={1}>
                <RHFTextField size="small" name="txbCity" label="City" />
                <RHFSelect
                      native
                      size="small"
                      name="ddlCountry"
                      label="Country"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      onChange={ddlCountryChanged}
                      // onChange={(e: any) =>{
                      //   setValue('ddlCountry', e.target.value)
                      //   // setSelectedCountry(e.target.value)
                      // } }
                      >
                      {countryInfo?.fdtCountry?.map((item: any, index: number) => (
                        <option key={index} value={item.value}>
                          {item.items}
                        </option>
                      ))}
                    </RHFSelect>
                <RHFSelect
                      native
                      size="small"
                      name="ddlProvState"
                      label="Province/State"
                      // sx={getDisplay(coolingCompInfo?.isVisible)}
                      // onChange={ddlProvStateChanged}
                    >
                      {provStateInfo?.fdtProvState?.map((item: any, index: number) => (
                        <option key={index} value={item.value}>
                          {item.items}
                        </option>
                      ))}
                </RHFSelect>
              </Stack> */}
            <Stack direction="row" justifyContent="space-around" spacing={1}>
              <RHFSelect 
                native 
                size="small" 
                name="ddlAccess" 
                label="Access" 
                placeholder=""
                onChange={ddlAccessChanged}
              >                
              {accessOptions?.map((item: any, index: number) => (
                <option key={index} value={item.id}>
                  {item.items}
                </option>
              ))}

                {/* <option value="1">Yes</option>
                <option value="0">No</option> */}
              </RHFSelect>
              <RHFSelect 
                native 
                size="small" 
                name="ddlAccessLevel" 
                label="Access level" 
                placeholder=""
                onChange={ddlAccessLevelChanged}
              >
                {accessLevelOptions?.map((item: any, index: number) => (
                  <option key={index} value={item.id}>
                    {item.items}
                  </option>
                ))}

                {/* <option value="1">External</option>
                <option value="2">Internal 1</option>
                <option value="3">Internal 2</option>
                <option value="4">Internal Admin</option>
                <option value="5">External Special</option>
                <option value="10">Admin</option> */}
              </RHFSelect>
              <RHFSelect 
                native 
                size="small" 
                name="ddlAccessPricing" 
                label="Access pricing" 
                placeholder=""
                onChange={ddlAccessPricingChanged}
              >
                {accessPricingOptions?.map((item: any, index: number) => (
                  <option key={index} value={item.id}>
                    {item.items}
                  </option>
                ))}
 
                {/* <option value="0">No</option>
                <option value="1">Yes</option> */}
              </RHFSelect>
            </Stack>
            {/* <RHFSelect native size="small" name="fobPoint" label="FOB point" placeholder="">
              {dbtSelFOBPoint?.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.items}
                </option>
              ))}
              {!dbtSelFOBPoint && <option value="" />}
            </RHFSelect> */}
              <RHFTextField size="small" name="txbFOB_Point" label="FOB point" disabled />
              <RHFTextField size="small" name="txbCreatedDate" label="Created Date" disabled />
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Button onClick={() => onClose && onClose()} sx={{ width: '50%' }}>
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={() => console.log(getValues())}
              loading={isSubmitting}
              sx={{ width: '50%' }}
            >
              Save
            </LoadingButton>
          </Stack>
        </DialogActions>
      </FormProvider>
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
    </Dialog>
  );
}
