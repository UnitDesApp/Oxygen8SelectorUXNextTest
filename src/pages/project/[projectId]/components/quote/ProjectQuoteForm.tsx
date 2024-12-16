import * as Yup from 'yup';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails, 
  LinearProgress,
  IconButton,
  Checkbox,
} from '@mui/material';
import {
  useTable,

} from 'src/components/table';
import * as ghf from 'src/utils/globalHelperFunctions';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState  } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useCallback, useEffect, useMemo, useState, MouseEventHandler } from 'react';
import { useApiContext } from 'src/contexts/ApiContext';
import { LoadingButton } from '@mui/lab';
import { useGetQuoteSelTables, useGetSavedJob, useGetSavedQuote, useGetSavedQuoteInfo } from 'src/hooks/useApi';
import * as Ids from 'src/utils/ids';
import CircularProgressLoading from 'src/components/loading/CircularProgressLoading';

// import QuoteMiscDataTable from './QuoteMiscDataTable';
// import QuoteNoteDataTable from './QuoteNoteDataTable';

// --------------------------------------------------------------
const CustomGroupBoxBorder = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  flexDirection: 'column',
  position: 'relative',
  minWidth: '0',
  padding: '10px',
  margin: '0',
  verticalAlign: 'top',
  width: '100%',
  border: `1px solid ${theme.palette.grey[500]}`,
  borderRadius: '8px',
}));

const CustomGroupBoxTitle = styled(Typography)(() => ({
  lineHeight: '1.4375em',
  fontSize: '25px',
  fontFamily: '"Public Sans", sans-serif',
  fontWeight: 400,
  display: 'block',
  transformOrigin: 'left top',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 'calc(133% - 24px)',
  position: 'absolute',
  left: '0px',
  top: '0px',
  transform: 'translate(40px, -12px) scale(0.75)',
  transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms',
  zIndex: 100,
  background: 'white',
  paddingLeft: '10px',
  paddingRight: '10px',
}));

const TableHeaderCellStyled = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  boxShadow: 'none!important',
}));

// -------------------------------------------------------------------------------

type CustomGroupBoxProps = {
  title?: string;
  children?: any;
  bordersx?: object;
  titlesx?: object;
};

function CustomGroupBox({ title, children, bordersx, titlesx }: CustomGroupBoxProps) {
  return (
    <CustomGroupBoxBorder sx={{ ...bordersx }}>
      <CustomGroupBoxTitle sx={{ ...titlesx }}>{title}</CustomGroupBoxTitle>
      <Box sx={{ padding: '20px' }}>{children}</Box>
    </CustomGroupBoxBorder>
  );
}

type ProjectQuoteFormProps = {
  projectId: number;
  quoteInfo: any;
  // refetch?: Function;
};

export default function ProjectQuoteForm({ projectId, quoteInfo }: ProjectQuoteFormProps) {
  const api = useApiContext();
  // const { data: quoteInfo, isLoading: isLoadingQuoteInfo, isFetching: isFetchingQuoteInfo  } = useGetSavedQuoteInfo({intJobId: projectId}); // useGetSavedJob api call returns data and stores in dbtSavedJob

  // status
  const [success, setSuccess] = useState<boolean>(false);
  const [fail, setFail] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dbQuoteSelTables, setDbQuoteSelTables] = useState<any>([]);
  const [dbtSavedJob, setDbtSavedJob] = useState<any>([]);
  const [dbtSavedQuote, setDbtSavedQuote] = useState<any>([]);

  const [currQuoteInfo, setCurrQuoteInfo] = useState<any>([]);
  // const [isLoadingQuoteInfo, setIsLoadingQuoteInfo] = useState(true);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [miscNo, setMiscNo] = useState('');
  const [miscList, setMiscList] = useState<any>([]);
  const [notesNo, setNotesNo] = useState('');
  const [notesList, setNotesList] = useState<any>([]);
  const theme = useTheme();
  const [quoteStageOptions, setQuoteStageOptions] = useState<any>([]);
  const [fobPointInfo, setFOBPointInfo] = useState<any>([]);
  const [countryInfo, setCountryInfo] = useState<any>([]);
  // let dbtSelQuoteStage = useState<any>([]);

  // Form Schemar
  const QuoteFormSchema = Yup.object().shape({
    txbRevisionNo: Yup.string().required('This field is required!'),
    ddlQuoteStage: Yup.number(),
    txbProjectName: Yup.string(),
    txbCompanyName: Yup.string(),
    txbQuoteNo: Yup.string(),
    ddlFOBPoint: Yup.number(),
    txbTerms: Yup.string(),
    txbCreatedDate: Yup.string(),
    txbRevisedDate: Yup.string(),
    txbValidDate: Yup.string(),
    ddlCountry: Yup.number(),
    txbCurrencyRate: Yup.number(),
    txbShippingFactor: Yup.number(),
    ddlShippingType: Yup.number(),
    txbDiscountFactor: Yup.number(),
    ddlDiscountType: Yup.number(),
    txbPriceAllUnits: Yup.number(),
    txbPriceMisc: Yup.number(),
    txbPriceShipping: Yup.number(),
    txbPriceSubtotal: Yup.number(),
    txbPriceDiscount: Yup.number(),
    txbPriceFinalTotal: Yup.number(),
  });

  const {selected, onSelectRow,} = useTable();
  
  const defaultValues = useMemo(() => ({
    txbRevisionNo: '0',
    ddlQuoteStage: 1,
    txbProjectName: '',
    txbCompanyName: '',
    txbQuoteNo: '0',
    ddlFOBPoint: 1,
    txbTerms: 'Net 30',
    // txbCreatedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    // txbRevisedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
    // txbValidDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate() + 60}`,
    txbCreatedDate: '',
    txbRevisedDate: '',
    txbValidDate: '',
    ddlCountry: 0,
    txbCurrencyRate: '1.00',
    txbShippingFactor: '9.8',
    ddlShippingType: 1,
    txbDiscountFactor: '0.0',
    ddlDiscountType: 2,
    txbPriceAllUnits: '0.00',
    txbPriceMisc: '0.00',
    txbPriceShipping: '0.00',
    txbPriceSubtotal: '0.00',
    txbPriceDiscount: '0.00',
    txbPriceFinalTotal: '0.00',
    txbMisc: '',
    txbMiscQty: '1',
    txbMiscPrice: '0.00',
    txbNotes: '',
  }),
    []
  );

  // form setting using useForm
  const methods = useForm({
    resolver: yupResolver(QuoteFormSchema),
    defaultValues,
  });

  const {
    setValue,
    getValues,
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;


  const [intUAL, setIntUAL] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [isUALExternal, setIsUALExternal] = useState<boolean>(false); 
  const [tabs, setTabs] = useState<any | null>([]);
  

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ualValue = localStorage.getItem('UAL');
      const parsedUAL = ualValue ? parseInt(ualValue, 10) : 0;
      setIntUAL(parsedUAL);
      setIsAdmin(ghf.getIsAdmin(parsedUAL));
      setIsUALExternal(ghf.getIsUALExternal(parsedUAL));
    }
  }, []);



  const getQuoteInputs = useCallback(() => {
    //   // const jsonData = '{"name":"John", "age":30, "city":"London"}';
    //   // let oUnitInputs;
    // formCurrValues = getValues(); // Do not use watch, must use getValues with the function to get current values.
    let savedDate = quoteInfo?.oQuoteInputs?.strCreatedDate;

    if (savedDate?.includes('/')) {
      const [month, day, year] = savedDate.split('/');
      savedDate = `${year}-${month}-${day}`;
    }

    const today = new Date();
    const newValidDate = new Date();
    newValidDate.setDate(newValidDate.getMonth() + 1);
    newValidDate.setDate(newValidDate.getDate() + 60);

    const oQuoteInputs = {
      oQuoteSaveInputs: {
        intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
        intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
        intJobId: Number(projectId),
        intQuoteId: Number(getValues('txbQuoteNo')),
        intQuoteStageId: getValues('ddlQuoteStage'),
        intRevisionNo: getValues('txbRevisionNo'),
        intFOBPointId: Number(getValues('ddlFOBPoint')),
        intCountryId: Number(getValues('ddlCountry')),
        dblCurrencyRate: getValues('txbCurrencyRate'),
        dblShippingFactor: getValues('txbShippingFactor'),
        intShippingTypeId: Number(getValues('ddlShippingType')),
        dblDiscountFactor: getValues('txbDiscountFactor'),
        intDiscountTypeId: Number(getValues('ddlDiscountType')),
        dblPriceAllUnits: getValues('txbPriceAllUnits'),
        dblPriceMisc: getValues('txbPriceMisc'),
        dblPriceShipping: getValues('txbPriceShipping'),
        dblPriceSubtotal: getValues('txbPriceSubtotal'),
        dblPriceDiscount: getValues('txbPriceDiscount'),
        dblPriceFinalTotal: getValues('txbPriceFinalTotal'),
        // strCreatedDate: currQuoteInfo?.oQuoteSaveInputs?.strCreatedDate ? savedDate : formCurrValues.txbCreatedDate,
        // strRevisedDate: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
        // strValidDate: `${newValidDate.getFullYear()}-${newValidDate.getMonth()}-${newValidDate.getDate()}`,
        strCreatedDate: "",
        strRevisedDate: "",
        strValidDate: "",
      },
    };

    return oQuoteInputs;
  },[getValues, projectId, quoteInfo?.oQuoteInputs?.strCreatedDate]);

  useEffect(() => {
    if (quoteInfo !== null) {

      setCurrQuoteInfo(quoteInfo);
      // setMiscListInfo(quoteInfo?.dbtSavedMisc);

      // if (quoteInfo?.dbtSavedQuote !== null && quoteInfo?.dbtSavedQuote?.length > 0) {  
      //   loadSavedValues(quoteInfo?.dbtSavedQuote);
      // } else 

      // if (quoteInfo?.dtUnsavedQuote !== null && quoteInfo?.dtUnsavedQuote?.length > 0) {
      //   loadSavedValues(quoteInfo?.dtUnsavedQuote);
      // }
    }
  }, [quoteInfo]);

  
  const setMisc = useEffect(() => {
    // const info: { fdtMisc: any } = { fdtMisc: [] };

    // const fdtMisc = quoteInfo?.dbtSavedMisc;
    setMiscList(quoteInfo?.dbtSavedMisc);
  }, [quoteInfo]);


  const setDBQuoteSelTables = useMemo(async () => {
  // const { data: db } = useGetQuoteSelTables({intJobId: projectId}); // useGetQuoteSelTables api call returns data and stores in db
  const dbt = await api.project.getQuoteSelTables({ intJobId: projectId });
  setDbQuoteSelTables(dbt);

  },[api.project, projectId]);


  const setSavedJob = useMemo(async () => {
    // const { data: dbtSavedJob } = useGetSavedJob({intJobId: projectId}); // useGetSavedJob api call returns data and stores in dbtSavedJob
  
    const dbt = await api.project.getSavedJob({ intJobId: projectId });
    setDbtSavedJob(dbt);
  
  },[api.project, projectId]);


  const setSavedQuote = useCallback(async () => {
      // const { data: dbtSavedQuote } = useGetSavedQuote({intJobId: projectId}); // useGetSavedJob api call returns data and stores in dbtSavedJob
    const dbt = await api.project.getSavedQuote({ intJobId: projectId });
    setDbtSavedQuote(dbt);

    
  },[api.project, projectId]);


  // useMemo(() => {
  //   let defaultId = 0;
  //   let fdtQuoteStage: any = [];
  //   fdtQuoteStage = dbQuoteSelTables?.dbtSelQuoteStage;
  //   const selectMsgData = { id: 0, items: "Select Stage", enabled: 1 }
  //   fdtQuoteStage?.unshift(selectMsgData);


  //   setQuoteStageOptions(fdtQuoteStage);
  //   defaultId = fdtQuoteStage?.[0]?.id;

  //   setValue('ddlQuoteStage', defaultId);
  // }, [dbQuoteSelTables, setValue]);
  // // }, [db, setValue]);



// const savedData = useEffect(() => {
//   setSavedQuote();
// },[projectId, setSavedQuote])


  const setQuoteStage = useCallback(() => {
      let defaultId = 0;
    let fdtQuoteStage: any = [];
    fdtQuoteStage = dbQuoteSelTables?.dbtSelQuoteStage;

    if (isAdmin) {
      fdtQuoteStage = fdtQuoteStage?.filter((item: { enabled: Number }) => item.enabled === 1);
    } else {
      fdtQuoteStage = fdtQuoteStage?.filter((item: { enabled_ext_users: Number }) => item.enabled_ext_users === 1);
    }

    const selectMsgData = { id: 0, items: "Select Stage", enabled: 1 }
    fdtQuoteStage?.unshift(selectMsgData);


    setQuoteStageOptions(fdtQuoteStage);
    defaultId = fdtQuoteStage?.[0]?.id;

    setValue('ddlQuoteStage', defaultId);
  },[dbQuoteSelTables?.dbtSelQuoteStage, isAdmin, setValue]);
  // }, [db, setValue]);


  //   const setQuoteStage = useCallback(() => {
  //   let defaultId = 0;
  //   let fdtQuoteStage: any = [];
  //   fdtQuoteStage = dbQuoteSelTables?.dbtSelQuoteStage;
  //   const selectMsgData = { id: 0, items: "Select Stage", enabled: 1 }
  //   fdtQuoteStage?.unshift(selectMsgData);


  //   setQuoteStageOptions(fdtQuoteStage);
  //   defaultId = fdtQuoteStage?.[0]?.id;

  //   setValue('ddlQuoteStage', defaultId);
  // }, [dbQuoteSelTables?.dbtSelQuoteStage, setValue]);
  // // }, [db, setValue]);






  const setFobPoint = useEffect(() => {
    const info: { fdtFOBPoint: any; isVisible: boolean; defaultId: number } = {
      fdtFOBPoint: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtFOBPoint = dbQuoteSelTables?.dbtSelFOBPoint;

    setFOBPointInfo(info);
    info.defaultId = Ids.intFOB_PointIdVancouver;
    // setValue('ddlFOBPoint', info.fdtFOBPoint?.[0]?.id);
    setValue('ddlFOBPoint', Ids.intFOB_PointIdVancouver);
  }, [dbQuoteSelTables?.dbtSelFOBPoint, setValue]);


  const setCountry = useEffect(() => {
    const info: { fdtCountry: any; isVisible: boolean; defaultId: number } = {
      fdtCountry: [],
      isVisible: false,
      defaultId: 0,
    };

    info.fdtCountry = dbQuoteSelTables?.dbtSelCountry;    

    setCountryInfo(info);
    info.defaultId = Ids.intCountryIdUSA;

    // setValue('ddlCountry', info.fdtCountry?.[0]?.id);
    setValue('ddlCountry', info.defaultId);
  }, [dbQuoteSelTables?.dbtSelCountry, quoteInfo, setValue]);


 const setDates = useEffect(() => {
    const today = new Date();
    const newValidDate = new Date();
    newValidDate.setDate(newValidDate.getDate() + 60);

    setValue('txbCreatedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    setValue('txbRevisedDate', `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
    setValue('txbValidDate',`${newValidDate.getFullYear()}-${newValidDate.getMonth() + 1}-${newValidDate.getDate()}`);
  }, [setValue]);

  const setShippingType = useEffect(() => {
    setValue('ddlShippingType', 1);
  }, [setValue]);


  const setDiscountType = useEffect(() => {
    setValue('ddlDiscountType', 2);
  }, [setValue]);


  useEffect(() => {
    setValue('txbProjectName', dbtSavedJob?.[0]?.job_name);
    setValue('txbCompanyName', dbtSavedJob?.[0]?.CompanyName);

    if (Number(getValues('txbQuoteNo')) < 1) {
      const fdtProjectStage = dbQuoteSelTables?.dbtSelBasisOfDesign;
      const projectStageId = dbtSavedJob?.[0]?.basis_of_design_id;
      const projectStageCode = fdtProjectStage?.filter((item: { id: Number }) => item.id === Number(projectStageId))?.[0]?.stage_code;

      const fdtQuoteStage = dbQuoteSelTables?.dbtSelQuoteStage;
      let quoteStageId = 0;
      quoteStageId = fdtQuoteStage?.filter((item: { stage_code: string }) => item.stage_code === projectStageCode)?.[0]?.id || 0;

      if (quoteStageId > 0) {
        setValue('ddlQuoteStage', quoteStageId);
      }
    }

  }, [setValue, dbtSavedJob, dbQuoteSelTables, getValues]);  


  useEffect(() => {
    setValue('ddlCountry', dbQuoteSelTables?.dbtSavCustomer?.[0]?.country_id);
    setValue('txbCurrencyRate', dbQuoteSelTables?.dbtSavCustomer?.[0]?.currency_rate);
    setValue('txbShippingFactor', dbQuoteSelTables?.dbtSavCustomer?.[0]?.shipping_factor_percent);

  }, [setValue, dbQuoteSelTables?.dbtSavCustomer]);  

  
// useMemo(() => {
//   setQuoteStage();
// },[setQuoteStage])


  // *******************************************************************************************************************************************************
  // *******************************************************************************************************************************************************
  useEffect(() => {
    setQuoteStage();
  }, [setQuoteStage]);



  // *******************************************************************************************************************************************************
  // *******************************************************************************************************************************************************

  // Load saved Values
  // useEffect(() => {
  const loadSavedQuoteValues = useCallback(async (_dbtSavedQuote: any) => {

    if (_dbtSavedQuote !== null && _dbtSavedQuote?.length > 0) {
      // if (_dbtSavedQuote?.[0]?.quote_id > 0) {
      //   setValue('txbQuoteNo', _dbtSavedQuote?.[0]?.quote_id);
      // }

      // if (_dbtSavedQuote?.[0]?.revision_no > 0) {
      //   setValue('txbRevisionNo', _dbtSavedQuote?.[0]?.revision_no);
      // }
      
      // if (_dbtSavedQuote?.[0]?.quote_stage_id > 0) {
      //   setValue('ddlQuoteStage', _dbtSavedQuote?.[0]?.quote_stage_id);
      // }

      // if (_dbtSavedQuote?.[0]?.fob_point_id > 0) {
      //   setValue('ddlFOBPoint', _dbtSavedQuote?.[0]?.fob_point_id);
      // }

      // if (_dbtSavedQuote?.[0]?.created_date !== null && _dbtSavedQuote?.[0]?.created_date !== '') {
      //   setValue('txbCreatedDate', _dbtSavedQuote?.[0]?.created_date);
      // }

      // if (_dbtSavedQuote?.[0]?.revised_date !== null && _dbtSavedQuote?.[0]?.revised_date !== '') {
      //   setValue('txbRevisedDate', _dbtSavedQuote?.[0]?.revised_date);
      // }

      // if (_dbtSavedQuote?.[0]?.valid_date !== null && _dbtSavedQuote?.[0]?.valid_date !== '') {
      //   setValue('txbValidDate', _dbtSavedQuote?.[0]?.valid_date);
      // }

      // if (_dbtSavedQuote?.[0]?.country_id > 0) {
      //   setValue('ddlCountry', _dbtSavedQuote?.[0]?.country_id);
      // }

      // if (_dbtSavedQuote?.[0]?.currency_rate > 0) {
      //   setValue('txbCurrencyRate', _dbtSavedQuote?.[0]?.currency_rate?.toFixed(2));
      // }

      // if (_dbtSavedQuote?.[0]?.shipping_type_id > 0) {
      //   setValue('ddlShippingType', _dbtSavedQuote?.[0]?.shipping_type_id);
      // }

      // if (_dbtSavedQuote?.[0]?.shipping_factor > 0) {
      //   setValue('txbShippingFactor', _dbtSavedQuote?.[0]?.shipping_factor?.toFixed(1));
      // }

      // if (_dbtSavedQuote?.[0]?.discount_type_id > 0) {
      //   setValue('ddlDiscountType', _dbtSavedQuote?.[0]?.discount_type_id);
      // }

      // if (_dbtSavedQuote?.[0]?.discount_factor > 0) {
      //   setValue('txbDiscountFactor', _dbtSavedQuote?.[0]?.discount_factor?.toFixed(1));
      // }

      if (_dbtSavedQuote?.[0]?.price_all_units > 0) {
        setValue('txbPriceAllUnits', _dbtSavedQuote?.[0]?.price_all_units?.toFixed(2));
      }

      if (_dbtSavedQuote?.[0]?.price_misc > 0) {
        setValue('txbPriceMisc', _dbtSavedQuote?.[0]?.price_misc?.toFixed(2));
      }

      if (_dbtSavedQuote?.[0]?.price_shipping > 0) {
        setValue('txbPriceShipping', _dbtSavedQuote?.[0]?.price_shipping?.toFixed(2));
      }

      if (_dbtSavedQuote?.[0]?.price_subtotal > 0) {
        setValue('txbPriceSubtotal', _dbtSavedQuote?.[0]?.price_subtotal?.toFixed(2));
      }

      if (_dbtSavedQuote?.[0]?.price_discount > 0) {
        setValue('txbPriceDiscount', _dbtSavedQuote?.[0]?.price_discount?.toFixed(2));
      }

      if (_dbtSavedQuote?.[0]?.price_final_total > 0) {
        setValue('txbPriceFinalTotal', _dbtSavedQuote?.[0]?.price_final_total?.toFixed(2));
      }
    }
  }, [setValue]);


  const loadUnsavedQuoteValues = useCallback(async (_dbtUnsavedQuote: any) => {

    if (_dbtUnsavedQuote !== null && _dbtUnsavedQuote?.length > 0) {
      // if (_dbtSavedQuote?.[0]?.quote_id > 0) {
      //   setValue('txbQuoteNo', _dbtSavedQuote?.[0]?.quote_id);
      // }

      // if (_dbtSavedQuote?.[0]?.revision_no > 0) {
      //   setValue('txbRevisionNo', _dbtSavedQuote?.[0]?.revision_no);
      // }
      
      // if (_dbtSavedQuote?.[0]?.quote_stage_id > 0) {
      //   setValue('ddlQuoteStage', _dbtSavedQuote?.[0]?.quote_stage_id);
      // }

      // if (_dbtSavedQuote?.[0]?.fob_point_id > 0) {
      //   setValue('ddlFOBPoint', _dbtSavedQuote?.[0]?.fob_point_id);
      // }

      // if (_dbtSavedQuote?.[0]?.created_date !== null && _dbtSavedQuote?.[0]?.created_date !== '') {
      //   setValue('txbCreatedDate', _dbtSavedQuote?.[0]?.created_date);
      // }

      // if (_dbtSavedQuote?.[0]?.revised_date !== null && _dbtSavedQuote?.[0]?.revised_date !== '') {
      //   setValue('txbRevisedDate', _dbtSavedQuote?.[0]?.revised_date);
      // }

      // if (_dbtSavedQuote?.[0]?.valid_date !== null && _dbtSavedQuote?.[0]?.valid_date !== '') {
      //   setValue('txbValidDate', _dbtSavedQuote?.[0]?.valid_date);
      // }

      // if (_dbtSavedQuote?.[0]?.country_id > 0) {
      //   setValue('ddlCountry', _dbtSavedQuote?.[0]?.country_id);
      // }

      // if (_dbtSavedQuote?.[0]?.currency_rate > 0) {
      //   setValue('txbCurrencyRate', _dbtSavedQuote?.[0]?.currency_rate?.toFixed(2));
      // }

      // if (_dbtSavedQuote?.[0]?.shipping_type_id > 0) {
      //   setValue('ddlShippingType', _dbtSavedQuote?.[0]?.shipping_type_id);
      // }

      // if (_dbtSavedQuote?.[0]?.shipping_factor > 0) {
      //   setValue('txbShippingFactor', _dbtSavedQuote?.[0]?.shipping_factor?.toFixed(1));
      // }

      // if (_dbtSavedQuote?.[0]?.discount_type_id > 0) {
      //   setValue('ddlDiscountType', _dbtSavedQuote?.[0]?.discount_type_id);
      // }

      // if (_dbtSavedQuote?.[0]?.discount_factor > 0) {
      //   setValue('txbDiscountFactor', _dbtSavedQuote?.[0]?.discount_factor?.toFixed(1));
      // }

      if (_dbtUnsavedQuote?.[0]?.price_all_units > 0) {
        setValue('txbPriceAllUnits', _dbtUnsavedQuote?.[0]?.price_all_units?.toFixed(2));
      }

      if (_dbtUnsavedQuote?.[0]?.price_misc > 0) {
        setValue('txbPriceMisc', _dbtUnsavedQuote?.[0]?.price_misc?.toFixed(2));
      }

      if (_dbtUnsavedQuote?.[0]?.price_shipping > 0) {
        setValue('txbPriceShipping', _dbtUnsavedQuote?.[0]?.price_shipping?.toFixed(2));
      }

      if (_dbtUnsavedQuote?.[0]?.price_subtotal > 0) {
        setValue('txbPriceSubtotal', _dbtUnsavedQuote?.[0]?.price_subtotal?.toFixed(2));
      }

      if (_dbtUnsavedQuote?.[0]?.price_discount > 0) {
        setValue('txbPriceDiscount', _dbtUnsavedQuote?.[0]?.price_discount?.toFixed(2));
      }

      if (_dbtUnsavedQuote?.[0]?.price_final_total > 0) {
        setValue('txbPriceFinalTotal', _dbtUnsavedQuote?.[0]?.price_final_total?.toFixed(2));
      }
    }
  }, [setValue]);


  const onCalculateQuotePricing = useCallback(async () => {
    try {
      // if (Number(getValues('ddlQuoteStage')) === 0) {
      //   setSnackbarMessage('Select a quote stage.');
      //   setOpenSnackbar(true);
      //   return;
      // }

      setIsProcessingData(true);

      // const requestData = {
      //   ...data,
      //   intUserID: localStorage.getItem('userId'),
      //   intUAL: localStorage.getItem('UAL'),
      //   intJobID: projectId,
      // };
      const oQuoteInputs: any = getQuoteInputs();

      const returnData = await api.project.calculateQuotePricing(oQuoteInputs);
      if (returnData) {
        setCurrQuoteInfo(returnData);
        // const dbtSavedQuote1 = returnData?.dbtSavedQuote;
        loadUnsavedQuoteValues(returnData?.dbtUnsavedQuote);

        // setSuccess(true);

        // if (refetch) refetch();
      } else {
        // setFail(true);
      }
    } catch (error) {
      // setFail(true);
    } finally {
      setIsProcessingData(false);
    }
  },[api.project, getQuoteInputs, loadUnsavedQuoteValues]);



  // *******************************************************************************************************************************************************
  // *******************************************************************************************************************************************************
  const ddlCountryChanged = useCallback((e: any) => {
    setValue('ddlCountry', e.target.value);
    const currencyRate = dbQuoteSelTables?.dbtSelCountry?.filter((item: { id: number }) => item.id === Number(e.target.value))?.[0]?.currency_rate;

    setValue('txbCurrencyRate', currencyRate);
    onCalculateQuotePricing();
  }, [dbQuoteSelTables?.dbtSelCountry, onCalculateQuotePricing, setValue]);


  const txbCurrencyRateChanged = useCallback(() => {
    onCalculateQuotePricing();
  }, [onCalculateQuotePricing]);


  const txbShippingFactorChanged = useCallback(() => {
    onCalculateQuotePricing();
  }, [onCalculateQuotePricing]);

  const ddlShippingTypeChanged = useCallback((e: any) => {
    setValue('ddlShippingType', e.target.value);
    onCalculateQuotePricing();
  }, [onCalculateQuotePricing, setValue]);


  const txbDiscountFactorChanged = useCallback(() => {
    onCalculateQuotePricing();
  }, [onCalculateQuotePricing]);


  const ddlDiscountTypeChanged = useCallback((e: any) => {
    setValue('ddlDiscountType', e.target.value);
    onCalculateQuotePricing();
  }, [onCalculateQuotePricing, setValue]);


  // submmit function
  async function onQuoteSubmit(data: any) {
    try {
      if (Number(getValues('ddlQuoteStage')) === 0) {
        setSnackbarMessage('Select a quote stage.');
        setOpenSnackbar(true);
        return;
      }

      setIsProcessingData(true);

      // const requestData = {
      //   ...data,
      //   intUserID: localStorage.getItem('userId'),
      //   intUAL: localStorage.getItem('UAL'),
      //   intJobID: projectId,
      // };
      const oQuoteInputs: any = getQuoteInputs();

      const returnData = await api.project.saveQuote(oQuoteInputs);
      if (returnData) {
        setCurrQuoteInfo(returnData);
        // const dbtSavedQuote1 = returnData?.dbtSavedQuote;
        loadSavedQuoteValues(returnData?.dbtSavedQuote);

        setSuccess(true);

        // if (refetch) refetch();
      } else {
        setFail(true);
      }
    } catch (error) {
      setFail(true);
    } finally {
      setIsProcessingData(false);
    }
  }





  // event handler for adding shipping note
  const addMiscClicked = useCallback(async () => {
    // if (
    //   getValues('txbMisc') === '' ||
    //   getValues('txbMiscQty') === '' ||
    //   getValues('txbMiscPrice') === ''
    // )
    //   return;

    if (quoteInfo?.dbtSavedQuote?.[0]?.intQuoteId < 1 || Number(getValues('txbQuoteNo')) < 1){
      setSnackbarMessage('Quote must be saved before addding misceallaneous.');
      setOpenSnackbar(true);
      return;
    }

    if (getValues('txbMisc').length < 3) {
      setSnackbarMessage('Miscellaneous is required or too short.');
      setOpenSnackbar(true);
      return;
    }

    if (Number(getValues('txbMiscQty')) < 1) {
      setSnackbarMessage('Miscellaneous quantity is required.');
      setOpenSnackbar(true);
      return;
    }

    if (Number(getValues('txbMiscPrice')) < 0) {
      setSnackbarMessage('Miscellaneous price is required.');
      setOpenSnackbar(true);
      return;
    }

    setIsProcessingData(true);


    const data: any = {
      // intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intMiscNo: 0,
      strMisc: getValues('txbMisc'),
      intMiscQty: Number(getValues('txbMiscQty')),
      dblMiscPrice: getValues('txbMiscPrice'),
    };
    const result = await api.project.saveQuoteMisc(data);
    setCurrQuoteInfo(result);
    loadSavedQuoteValues(result?.dbtSavedQuote);
    setMiscList(result?.dbtSavedMisc);

    setValue('txbMisc', '');
    setValue('txbMiscQty', '1');
    setValue('txbMiscPrice', '0.00');

    setIsProcessingData(false);
  }, [api.project, getValues, loadSavedQuoteValues, projectId, quoteInfo?.dbtSavedQuote, setValue]);


  const updateMiscClicked = useCallback(async () => {
    if (
      getValues('txbMisc') === '' ||
      getValues('txbMiscQty') === '' ||
      getValues('txbMiscPrice') === ''
    )
      return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intMiscNo: miscNo,
      strMisc: getValues('txbMisc'),
      intMiscQty: Number(getValues('txbMiscQty')),
      dblMiscPrice: getValues('txbMiscPrice'),
    };
    const result = await api.project.saveQuoteMisc(data);
    setCurrQuoteInfo(result);
    loadSavedQuoteValues(result?.dbtSavedQuote);
    setMiscList(result?.dbtSavedMisc);

    setValue('txbMisc', '');
    setValue('txbMiscQty', '1');
    setValue('txbMiscPrice', '0.00');

    setIsProcessingData(false);
  }, [api.project, getValues, loadSavedQuoteValues, miscNo, projectId, setValue]);


  const deleteMiscClicked = useCallback(
    async (row: any) => {
      setIsProcessingData(true);

      const data: any = {
        // intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intMiscNo: row?.misc_no,
      };
      const result = await api.project.deleteQuoteMisc(data);
      setCurrQuoteInfo(result);
      loadSavedQuoteValues(result?.dbtSavedQuote);
      setMiscList(result?.dbtSavedMisc);

      setValue('txbMisc', '');
      setValue('txbMiscQty', '1');
      setValue('txbMiscPrice', '0.00');

      setIsProcessingData(false);
    },[api.project, loadSavedQuoteValues, projectId, setValue]);


  const editMiscClicked = useCallback(
    (row: any) => {
      setMiscNo(row?.misc_no);
      setValue('txbMisc', row?.misc);
      setValue('txbMiscQty', row?.qty);
      setValue('txbMiscPrice', row?.price);
    },
    [setValue]
  );


  // event handler for addding note
  const addNotesClicked = useCallback(async () => {
    // if (getValues('txbNotes') === '') return;

    if (quoteInfo?.dbtSavedQuote?.[0]?.intQuoteId < 1 || Number(getValues('txbQuoteNo')) < 1){
      setSnackbarMessage('Quote must be saved before addding notes.');
      setOpenSnackbar(true);
      return;
    }

    if (getValues('txbNotes').length < 3) {
      setSnackbarMessage('Notes is required or too short.');
      setOpenSnackbar(true);
      return;
    }

    setIsProcessingData(true);

    const data: any = {
      // intUserId: localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intNotesNo: 0,
      strNotes: getValues('txbNotes'),
    };


    const result = await api.project.saveQuoteNotes(data);

    // const info: { fdtNotes: any } = { fdtNotes: [] };
    // info.fdtNotes = result;
    // setNotesList(result?.dbtSavedNotes);
    setNotesList(result);

    setValue('txbNotes', '');

    setIsProcessingData(false);
  }, [api.project, getValues, projectId, quoteInfo?.dbtSavedQuote, setValue]);


  const updateNotesClicked = useCallback(async () => {
    if (getValues('txbNotes') === '') return;

    setIsProcessingData(true);

    const data: any = {
      // intUserId: localStorage.getItem('userId'),
      // intUAL: localStorage.getItem('UAL'),
      intJobId: projectId,
      intNotesNo: notesNo,
      strNotes: getValues('txbNotes'),
    };
    const result = await api.project.saveQuoteNotes(data);

    // const info: { fdtNotes: any } = { fdtNotes: [] };
    // info.fdtNotes = result;
    // setNotesList(result?.dbtSavedNotes);
    setNotesList(result);

    setValue('txbNotes', '');

    setIsProcessingData(false);
  }, [api.project, getValues, notesNo, projectId, setValue]);


  const editNotesClicked = useCallback(
    (row: any) => {
      setNotesNo(row?.notes_no);
      setValue('txbNotes', row?.notes);
    },
    [setValue]
  );


  const deleteNotesClicked = useCallback(async (row: any) => {
      setIsProcessingData(true);

      const data: any = {
        // intUAL: localStorage.getItem('UAL'),
        intJobId: projectId,
        intNotesNo: row?.notes_no,
      };
      const result = await api.project.deleteQuoteNotes(data);

      // const info: { fdtNotes: any } = { fdtNotes: [] };
      // info.fdtNotes = result;
    // setNotesList(result?.dbtSavedNotes);
    setNotesList(result);

      setValue('txbNotes', '');

      setIsProcessingData(false);
    },
    [api.project, projectId, setValue]
  );



 

  // useEffect(() => {
  //   setQuoteStage();
  // },[db, setQuoteStage] ); // <-- empty dependency array - This will only trigger when the component mounts and no-render


// const setSaveQuote = useEffect(() => {
//     async function fetchData() {
//       const oQuoteInputs: any = {
//         oQuoteSaveInputs: {
//           intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
//           intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
//           intJobId: Number(projectId),
//           intQuoteStageId: getValues('ddlQuoteStage'),
//           intRevisionNo: getValues('txbRevisionNo'),
//           intFOBPointId: Number(getValues('ddlFOBPoint')),
//           intCountryId: Number(getValues('ddlCountry')),
//           dblCurrencyRate: getValues('txbCurrencyRate'),
//           dblShippingFactor: getValues('txbShippingFactor'),
//           intShippingTypeId: Number(getValues('ddlShippingType')),
//           dblDiscountFactor: getValues('txbDiscountFactor'),
//           intDiscountTypeId: Number(getValues('ddlDiscountType')),
//           dblPriceAllUnits: getValues('txbPriceAllUnits'),
//           dblPriceMisc: getValues('txbPriceMisc'),
//           dblPriceShipping: getValues('txbPriceShipping'),
//           dblPriceSubtotal: getValues('txbPriceSubtotal'),
//           dblPriceDiscount: getValues('txbPriceDiscount'),
//           dblPriceFinalTotal: getValues('txbPriceFinalTotal'),
//           strCreatedDate: '',
//           strRevisedDate: '',
//           strValidDate: '',
//           intIsCalcFinalPrice: 0, // not used now
//         },
//       };

//       if (oQuoteInputs !== undefined && oQuoteInputs !== null) {
//         const returnValue = await api.project.getSavedQuoteInfo(oQuoteInputs);
//         setCurrQuoteInfo(returnValue);


//         setIsProcessingData(false);
//       }
//       // if (returnValue) {
//       //   setSuccess(true);
//       //   if (refetch) refetch();
//       // } else {
//       //   setFail(true);
//       // }

//       //   if (refetch) refetch();
//     }

//     fetchData();
//   }, [api.project, getValues, projectId, setValue]);


 const setQuoteNotes = useEffect(() => {
    async function fetchData() {
      const data: any = {
        intJobId: projectId,
      };

      if (data !== undefined && data !== null) {
        const result = await api.project.getSavedQuoteNotes(data);

        // const info: { fdtNotes: any } = { fdtNotes: [] };
        // info.fdtNotes = returnValue;

        setNotesList(result);
      }
    }

    fetchData();
  }, [api.project, projectId]);






  useEffect(() => {
    // if (dbQuoteSelTables === undefined) {
    //   setDBQuoteSelTables();
    // }

    // if (dbQuoteSelTables !== undefined) {
    //   if (dbQuoteSelTables?.dbtSelQuoteStage?.length > 0)
    //   setQuoteStage();
    // }

    setValue('txbQuoteNo', '0');
    setValue('txbRevisionNo', '0');
    // setValue('txbCurrencyRate', '0.00');
    // setValue('txbShippingFactor', '0.00');
    // setValue('txbDiscountFactor', '0.00');
    setValue('txbPriceAllUnits', '0.00');
    setValue('txbPriceMisc', '0.00');
    setValue('txbPriceShipping', '0.00');
    setValue('txbPriceSubtotal', '0.00');
    setValue('txbPriceDiscount', '0.00');
    setValue('txbPriceFinalTotal', '0.00');

    if (currQuoteInfo !== null) {
      if (currQuoteInfo?.dbtSavedQuote !== null && currQuoteInfo?.dbtSavedQuote?.length > 0) {
        if (currQuoteInfo?.dbtSavedQuote?.[0]?.quote_id > 0) {
          setValue('txbQuoteNo', currQuoteInfo?.dbtSavedQuote?.[0]?.quote_id);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.revision_no > 0) {
          setValue('txbRevisionNo', currQuoteInfo?.dbtSavedQuote?.[0]?.revision_no);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.quote_stage_id > 0) {
          setValue('ddlQuoteStage', currQuoteInfo?.dbtSavedQuote?.[0]?.quote_stage_id);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.fob_point_id > 0) {
          setValue('ddlFOBPoint', currQuoteInfo?.dbtSavedQuote?.[0]?.fob_point_id);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.created_date !== null && currQuoteInfo?.dbtSavedQuote?.[0]?.created_date !== '') {
          setValue('txbCreatedDate', currQuoteInfo?.dbtSavedQuote?.[0]?.created_date);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.revised_date !== null && currQuoteInfo?.dbtSavedQuote?.[0]?.revised_date !== '') {
          setValue('txbRevisedDate', currQuoteInfo?.dbtSavedQuote?.[0]?.revised_date);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.valid_date !== null && currQuoteInfo?.dbtSavedQuote?.[0]?.valid_date !== '') {
          setValue('txbValidDate', currQuoteInfo?.dbtSavedQuote?.[0]?.valid_date);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.country_id > 0) {
          setValue('ddlCountry', currQuoteInfo?.dbtSavedQuote?.[0]?.country_id);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.currency_rate > 0) {
          setValue('txbCurrencyRate', currQuoteInfo?.dbtSavedQuote?.[0]?.currency_rate?.toFixed(2));
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.shipping_type_id > 0) {
          setValue('ddlShippingType', currQuoteInfo?.dbtSavedQuote?.[0]?.shipping_type_id);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.shipping_factor > 0) {
          setValue('txbShippingFactor', currQuoteInfo?.dbtSavedQuote?.[0]?.shipping_factor?.toFixed(1));
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.discount_type_id > 0) {
          setValue('ddlDiscountType', currQuoteInfo?.dbtSavedQuote?.[0]?.discount_type_id);
        }

        if (currQuoteInfo?.dbtSavedQuote?.[0]?.discount_factor > 0) {
          setValue('txbDiscountFactor', currQuoteInfo?.dbtSavedQuote?.[0]?.discount_factor?.toFixed(1));
        }

        if (currQuoteInfo?.dbtSavedQuote !== null) {
          setValue('txbPriceAllUnits', currQuoteInfo?.dbtSavedQuote?.[0]?.price_all_units?.toFixed(2));

          setValue('txbPriceMisc', currQuoteInfo?.dbtSavedQuote?.[0]?.price_misc?.toFixed(2));

          setValue('txbPriceShipping', currQuoteInfo?.dbtSavedQuote?.[0]?.price_shipping?.toFixed(2));

          setValue('txbPriceSubtotal', currQuoteInfo?.dbtSavedQuote?.[0]?.price_subtotal?.toFixed(2));

          setValue('txbPriceDiscount', currQuoteInfo?.dbtSavedQuote?.[0]?.price_discount?.toFixed(2));

          setValue('txbPriceFinalTotal', currQuoteInfo?.dbtSavedQuote?.[0]?.price_final_total?.toFixed(2));
        }

      } else if (currQuoteInfo?.dtUnsavedQuote !== null && currQuoteInfo?.dtUnsavedQuote?.length > 0) {
          setValue('txbPriceAllUnits', currQuoteInfo?.dtUnsavedQuote?.[0]?.price_all_units?.toFixed(2));

          setValue('txbPriceMisc', currQuoteInfo?.dtUnsavedQuote?.[0]?.price_misc?.toFixed(2));

          setValue('txbPriceShipping', currQuoteInfo?.dtUnsavedQuote?.[0]?.price_shipping?.toFixed(2));

          setValue('txbPriceSubtotal', currQuoteInfo?.dtUnsavedQuote?.[0]?.price_subtotal?.toFixed(2));

          setValue('txbPriceDiscount', currQuoteInfo?.dtUnsavedQuote?.[0]?.price_discount?.toFixed(2));

          setValue('txbPriceFinalTotal', currQuoteInfo?.dtUnsavedQuote?.[0]?.price_final_total?.toFixed(2));



        // if (quoteInfo?.dbtSavedQuote !== null && quoteInfo?.dbtSavedQuote?.length > 0) {  
        //   loadSavedValues(quoteInfo?.dbtSavedQuote);
        // } else if (quoteInfo?.dtUnsavedQuote !== null && quoteInfo?.dtUnsavedQuote?.length > 0) {
        //   loadSavedValues(quoteInfo?.dtUnsavedQuote);
        // }
      }
    }
  }, [dbQuoteSelTables, currQuoteInfo, setValue]);






  const setValueWithCheck = useCallback(
    (e: any, key: any) => {
      if (e.target.value === '') {
        setValue(key, '');
      } else if (e.target.value[0] === '0') {
        setValue(key, '0');
        return true;
      } else if (!Number.isNaN(+e.target.value)) {
        setValue(key, parseFloat(e.target.value));
        return true;
      }
      return false;
    },
    [setValue]
  );

  const setValueWithCheck1 = useCallback(
    (e: any, key: any) => {
      if (e.target.value === '') {
        setValue(key, '');
      } else if (!Number.isNaN(Number(+e.target.value))) {
        setValue(key, e.target.value);
        return true;
      }
      return false;
    },
    [setValue]
  );


  // if (isLoadingQuoteInfo || isFetchingQuoteInfo) return <LinearProgress color="info" />;
  return (
    // <Container maxWidth={{}} sx={{ mb: '10px' }}>
    <Container style={{maxWidth:"100%"}} >              
      {isProcessingData ? (
      <CircularProgressLoading />
      ) : (
          <FormProvider methods={methods} onSubmit={handleSubmit(onQuoteSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)' }, }}>
                  <Stack direction="column" justifyContent="flex-end">
                    <Typography color="red" variant="body2" sx={{ fontWeight: 600, fontStyle: 'bold', display: Number(getValues('txbQuoteNo')) < 1 ? 'inline-grid' : 'none' }}>
                      -To generate quote select a stage and click save.
                    </Typography>
                  </Stack>
                  <Stack direction="column" justifyContent="flex-start" alignItems="flex-end">
                    <LoadingButton
                      type="submit"
                      startIcon={<Iconify icon="fluent:save-24-regular" />}
                      loading={isSubmitting}
                      sx={{ width: '150px' }}
                    >
                      Save
                    </LoadingButton>
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    {/* <CustomGroupBox title="Quote Information"> */}
                    <Accordion
                      expanded
                    //               expanded={expanded.panel1}
                    // onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
                    >
                      <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography color="primary.main" variant="h6">
                          Quote Information
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                          <RHFTextField size="small" name="txbProjectName" InputProps={{ readOnly: true }} label="Project Name" />
                          <RHFTextField size="small" name="txbCompanyName" InputProps={{ readOnly: true }} label="Rep Name" />
                          <RHFSelect
                            native
                            size="small"
                            name="ddlQuoteStage"
                            label="Stage"
                            placeholder=""
                            onChange={(e: any) => {
                              setValue('ddlQuoteStage', Number(e.target.value));
                            }}
                          >
                            {/* <option value="" selected>
                          Select a Stage
                        </option> */}
                            {quoteStageOptions?.map((e: any, index: number) => (
                              <option key={index} value={e.id}>
                                {e.items}
                              </option>
                            ))}
                            {/* <option value="2">USA</option> */}
                          </RHFSelect>
                          <RHFTextField size="small" name="txbQuoteNo" label="Quote No" InputProps={{ readOnly: true }} />
                          <RHFTextField size="small" name="txbRevisionNo" label="Revision No" />
                          <RHFSelect
                            native
                            size="small"
                            name="ddlFOBPoint"
                            label="F.O.B. Point"
                            placeholder=""
                            onChange={(e: any) => {
                              setValue('ddlFOBPoint', Number(e.target.value));
                            }}
                          >
                            {fobPointInfo?.fdtFOBPoint?.map((e: any, index: number) => (
                              <option key={index} value={e.id}>
                                {e.items}
                              </option>
                            ))}
                          </RHFSelect>
                          <RHFTextField size="small" name="txbTerms" label="Terms" disabled />
                          <RHFTextField
                            size="small"
                            name="txbCreatedDate"
                            label="Quote Created Date"
                            disabled
                          />
                          <RHFTextField
                            size="small"
                            name="txbRevisedDate"
                            label="Quote Revised Date"
                            disabled
                          />
                          <RHFTextField size="small" name="txbValidDate" label="Quote Valid Date" disabled />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    {/* </CustomGroupBox> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} sx={{ display: isAdmin ? 'grid' : 'none' }}>
                    {/* <CustomGroupBox title="Price Setting"> */}
                    <Accordion
                      expanded
                    // onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
                    >
                      <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography color="primary.main" variant="h6">
                          Price Setting
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                          <RHFSelect
                            native
                            size="small"
                            name="ddlCountry"
                            label="Country"
                            placeholder=""
                            // onChange={(e: any) => {setValue('ddlCountry', Number(e.target.value)); }}
                            onChange={ddlCountryChanged}
                          >
                            {countryInfo?.fdtCountry?.map((e: any, index: number) => (
                              <option key={index} value={e.id}>
                                {e.items}
                              </option>
                            ))}
                          </RHFSelect>
                          <RHFTextField
                            size="small"
                            name="txbCurrencyRate"
                            label="Currency Rate"
                            onChange={(e: any) => { setValueWithCheck1(e, 'txbCurrencyRate'); }}
                            onBlur={txbCurrencyRateChanged}
                          />
                          <Stack direction="row">
                            <RHFTextField
                              size="small"
                              name="txbShippingFactor"
                              label="Shipping"
                              onChange={(e: any) => { setValueWithCheck1(e, 'txbShippingFactor'); }}
                              onBlur={txbShippingFactorChanged}
                            />
                            <RHFSelect
                              native
                              size="small"
                              name="ddlShippingType"
                              label="Unit"
                              placeholder=""
                              // onChange={(e: any) => {setValue('ddlShippingType', Number(e.target.value));}}
                              onChange={ddlShippingTypeChanged}
                            >
                              <option value="1" selected>
                                %
                              </option>
                              <option value="2">$</option>
                            </RHFSelect>
                          </Stack>
                          <Stack direction="row">
                            <RHFTextField
                              size="small"
                              name="txbDiscountFactor"
                              label="Discount"
                              // onChange={(e: any) => { setValueWithCheck1(e, 'txbDiscountFactor'); }}
                              onBlur={txbDiscountFactorChanged}
                            />
                            <RHFSelect
                              native
                              size="small"
                              name="ddlDiscountType"
                              label="Unit"
                              placeholder=""
                              // onChange={(e: any) => {setValue('ddlDiscountType', Number(e.target.value));}}
                              onChange={ddlDiscountTypeChanged}
                            >
                              <option value="1">%</option>
                              <option value="2" selected>
                                $
                              </option>
                            </RHFSelect>
                          </Stack>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    {/* </CustomGroupBox> */}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} sx={{ display: isAdmin ? 'grid' : 'none' }}>
                    {/* <CustomGroupBox title="Final Pricing"> */}
                    <Accordion
                      expanded
                    // onChange={() => setExpanded({ ...expanded, panel1: !expanded.panel1 })}
                    >
                      <AccordionSummary
                        // expandIcon={<Iconify icon="il:arrow-down" />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography color="primary.main" variant="h6">
                          Final Pricing
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'grid', rowGap: 1, columnGap: 1 }}>
                          <RHFTextField
                            size="small"
                            InputProps={{ readOnly: true }}
                            name="txbPriceAllUnits"
                            label="Price All Units ($)"
                          />
                          <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbPriceMisc" label="Price Misc ($)" />
                          <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbPriceShipping" label="Shipping ($)" />
                          <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbPriceSubtotal" label="Sub Total ($)" />
                          <RHFTextField size="small" InputProps={{ readOnly: true }} name="txbPriceDiscount" label="Discount ($)" />
                          <RHFTextField
                            size="small"
                            InputProps={{ readOnly: true }}
                            name="txbPriceFinalTotal"
                            label="Final Total ($)"
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    {/* </CustomGroupBox> */}
                  </Grid>
                </Grid>
              </Grid>
              {/* <Stack sx={{rowGap: 1, columnGap: 1,  display: isAdmin || Number(currQuoteInfo?.dbtSavedQuote?.[0]?.quote_id) > 1 ? 'inline-flex' : 'none' }}> */}
              <Grid item xs={12} sx={{ rowGap: 2, columnGap: 1, display: isAdmin || Number(getValues('txbQuoteNo')) > 0 ? 'inline-grid' : 'none' }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomGroupBox title="">
                      <TableContainer component={Paper}>
                        <Scrollbar>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" align="left">
                                  NOTES
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  F.O.B. POINT
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  TERMS
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {/* {gvPricingGeneral?.gvPricingGeneralDataSource?.map((item: any, i: number) => ( */}

                              {currQuoteInfo?.dtPricingGeneral?.map((item: any, i: number) => (
                                <TableRow
                                  key={i}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  <TableCell
                                    dangerouslySetInnerHTML={{ __html: item.notes }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                  />
                                  <TableCell
                                    dangerouslySetInnerHTML={{ __html: item.fob_point }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                  />
                                  <TableCell
                                    dangerouslySetInnerHTML={{ __html: item.terms }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                  />
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Scrollbar>
                      </TableContainer>
                    </CustomGroupBox>
                  </Grid>
                  <Grid item xs={12}>
                    {currQuoteInfo?.dtPricingErrMsg?.map((msg: any) => (
                      <Typography sx={{ color: 'red' }} key={msg.price_error_msg_no}>
                        {msg.price_error_msg}
                      </Typography>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <CustomGroupBox>
                      <TableContainer component={Paper}>
                        <Scrollbar>
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row" align="left" />
                                <TableCell component="th" scope="row" align="left">
                                  No.
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  TAG
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  QTY
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  PRODUCT CODE
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  MODEL NUMBER
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                  DESCRIPTION
                                </TableCell>
                                <TableCell component="th" scope="row" align="right">
                                  UNIT PRICE
                                </TableCell>
                                <TableCell component="th" scope="row" align="right">
                                  AMOUNT
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {currQuoteInfo?.dtPricingUnits?.map((item: any, i: number) => (
                                <TableRow
                                  key={i}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0,
                                      color: parseInt(item.price_error_msg, 10) === 2 ? 'red' : 'black',
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row" align="left">
                                    <Checkbox checked={selected.includes(item.unit_no)} onClick={() => onSelectRow(item.unit_no)} />
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {i + 1}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.tag}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.qty}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.unit_type}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.unit_model}
                                  </TableCell>
                                  <TableCell
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                  />
                                  <TableCell component="th" scope="row" align="right">
                                    {item.unit_price}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="right">
                                    {item.total_price}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableBody>
                              {currQuoteInfo?.dtPricingMisc?.map((item: any, i: number) => (
                                <TableRow>
                                  <TableCell component="th" scope="row" align="left" />
                                  <TableCell component="th" scope="row" align="left">
                                    {i + 1}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.tag}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.qty}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.unit_type}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.unit_model}
                                  </TableCell>
                                  <TableCell
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                  />
                                  <TableCell component="th" scope="row" align="right">
                                    {item.unit_price}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="right">
                                    {item.total_price}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableBody>
                              {currQuoteInfo?.dtPricingShipping?.map((item: any, i: number) => (
                                <TableRow
                                  key={i}
                                  sx={{
                                    '&:last-child td, &:last-child th': {
                                      border: 0,
                                      color: parseInt(item.price_error_msg, 10) === 2 ? 'red' : 'black',
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row" align="left" />
                                  <TableCell component="th" scope="row" align="left">
                                    {i + 1}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.tag}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.qty}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.unit_type}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="left">
                                    {item.unit_model}
                                  </TableCell>
                                  <TableCell
                                    dangerouslySetInnerHTML={{ __html: item.description }}
                                    component="th"
                                    scope="row"
                                    align="left"
                                  />
                                  <TableCell component="th" scope="row" align="right">
                                    {item.unit_price}
                                  </TableCell>
                                  <TableCell component="th" scope="row" align="right">
                                    {item.total_price}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Scrollbar>
                      </TableContainer>
                    </CustomGroupBox>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={9} sx={{ columnGap: 1, display: 'grid' }}>
                        {/* <CustomGroupBox> */}
                        {currQuoteInfo?.dtPricingAddInfo?.map((item: any, i: number) => (
                          <Typography key={i} sx={{ fontWeight: item.is_add_info_bold ? 600 : 300 }}>
                            {item.add_info}
                          </Typography>
                        ))}
                        {/* </CustomGroupBox> */}
                      </Grid>
                      <Grid item xs={3} sx={{ columnGap: 1, display: 'grid' }}>
                        {/* <CustomGroupBox> */}
                        {/* {currQuoteInfo?.dtPricingTotal?.map((item: any, i: number) => (
                <Typography key={i} sx={{ fontWeight: 600 }}>
                  {item.price_label} {item.price} {item.currency} 
                </Typography>
              ))} */}
                        {/* </CustomGroupBox> */}
                        <TableContainer component={Paper}>
                          <Scrollbar>
                            <Table size="small">
                              <TableBody>
                                {currQuoteInfo?.dtPricingTotal?.map((item: any, i: number) => (
                                  <TableRow
                                    key={i}
                                    sx={{
                                      '&:last-child td, &:last-child th': { border: 0 },
                                      fontWeight: 600,
                                      fontStyle: 'bold',
                                    }}
                                  >
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      align="right"
                                      sx={{ fontWeight: 600, fontStyle: 'bold' }}
                                    >
                                      {item.price_label}
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      align="right"
                                      sx={{ fontWeight: 600, fontStyle: 'bold' }}
                                    >
                                      {item.price}
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      align="right"
                                      sx={{ fontWeight: 600, fontStyle: 'bold' }}
                                    >
                                      {item.currency}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Scrollbar>
                        </TableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sx={{ display: isAdmin ? 'inline-grid' : 'none' }}>
                    {/* <CustomGroupBox title="Added Miscellaneous">
              <QuoteMiscDataTable
                // tableData={gvMisc?.gvMiscDataSource}
                tableData={quoteInfo?.dtMisc}
                addRow={addMisc}
                updateRow={updateMisc}
                deleteRow={deleteMisc}
              />
            </CustomGroupBox> */}
                    {/* <Accordion
              expanded={expanded.panel5}
              onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
            > */}
                    <AccordionSummary
                    // expandIcon={<Iconify icon="il:arrow-down" />}
                    // aria-controls="panel1a-content"
                    // id="panel1a-header"
                    >
                      <Typography color="primary.main" variant="h6">
                        Added Miscellaneous
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                        <RHFTextField
                          size="small"
                          name="txbMisc"
                          label="Enter Miscellaneous"
                          sx={{ width: '50%' }}
                        />
                        <RHFTextField
                          size="small"
                          name="txbMiscQty"
                          label="Enter Qty"
                          sx={{ width: '10%' }}
                          onChange={(e: any) => { setValueWithCheck(e, 'txbMiscQty'); }}
                        />
                        <RHFTextField
                          size="small"
                          name="txbMiscPrice"
                          label="Enter Price"
                          sx={{ width: '10%' }}
                          onChange={(e: any) => { setValueWithCheck1(e, 'txbMiscPrice'); }}
                        />
                        <Button
                          sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                          // variant="contained"
                          startIcon={<Iconify icon="fluent:save-24-regular" />}
                          onClick={addMiscClicked}
                        >
                          Add Misc
                        </Button>
                        <Button
                          sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                          // variant="contained"
                          startIcon={<Iconify icon="fluent:save-24-regular" />}
                          onClick={updateMiscClicked}
                        >
                          Update Misc
                        </Button>
                      </Stack>
                      <Box sx={{ pt: '10px' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                No
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="left"
                                sx={{ width: '50%' }}
                              >
                                Miscellaneous
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                Qty
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                Price
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                Edit
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                Delete
                              </TableHeaderCellStyled>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {miscList?.map((row: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{ width: '50%' }}>
                                  {row.misc}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  {row.qty}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  {row.price}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  <IconButton
                                    sx={{ color: theme.palette.success.main }}
                                    onClick={() => editMiscClicked(row)}
                                  >
                                    <Iconify icon="material-symbols:edit-square-outline" />
                                  </IconButton>
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  <IconButton
                                    sx={{ color: theme.palette.warning.main }}
                                    onClick={() => deleteMiscClicked(row)}
                                  >
                                    <Iconify icon="ion:trash-outline" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </AccordionDetails>
                    {/* </Accordion> */}
                  </Grid>
                  <Grid item xs={12} sx={{ display: isAdmin ? 'inline-grid' : 'none' }}>
                    {/* <CustomGroupBox title="Added Note">
              <QuoteNoteDataTable
                // tableData={gvNotes?.gvNotesDataSource}
                tableData={quoteInfo?.dtNotes}
                addRow={addNotes}
                updateRow={updateNotes}
                deleteRow={deleteNotes}
              />
            </CustomGroupBox> */}
                    {/* <Accordion
              expanded={expanded.panel5}
              onChange={() => setExpanded({ ...expanded, panel5: !expanded.panel5 })}
            > */}
                    <AccordionSummary
                    // expandIcon={<Iconify icon="il:arrow-down" />}
                    // aria-controls="panel1a-content"
                    // id="panel1a-header"
                    >
                      <Typography color="primary.main" variant="h6">
                        Added Notes
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                        <RHFTextField
                          size="small"
                          name="txbNotes"
                          label="Enter Notes"
                          sx={{ width: '70%' }}
                        // value={noteInfo}
                        // onChange={(e) => setNote(e.target.value)}
                        />
                        <Button
                          sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                          // variant="contained"
                          startIcon={<Iconify icon="fluent:save-24-regular" />}
                          onClick={addNotesClicked}
                        >
                          Add Note
                        </Button>
                        <Button
                          sx={{ width: '15%', borderRadius: '5px', mt: '1px' }}
                          // variant="contained"
                          startIcon={<Iconify icon="fluent:save-24-regular" />}
                          onClick={updateNotesClicked}
                        >
                          Update Note
                        </Button>
                      </Stack>
                      <Box sx={{ pt: '10px' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                No
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="left"
                                sx={{ width: '70%' }}
                              >
                                Note
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                Edit
                              </TableHeaderCellStyled>
                              <TableHeaderCellStyled
                                component="th"
                                scope="row"
                                align="center"
                                sx={{ width: '10%' }}
                              >
                                Delete
                              </TableHeaderCellStyled>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {notesList?.map((row: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left" sx={{ width: '70%' }}>
                                  {row.notes}
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  <IconButton
                                    sx={{ color: theme.palette.success.main }}
                                    onClick={() => editNotesClicked(row)}
                                  >
                                    <Iconify icon="material-symbols:edit-square-outline" />
                                  </IconButton>
                                </TableCell>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  align="center"
                                  sx={{ width: '10%' }}
                                >
                                  <IconButton
                                    sx={{ color: theme.palette.warning.main }}
                                    onClick={() => deleteNotesClicked(row)}
                                  >
                                    <Iconify icon="ion:trash-outline" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </AccordionDetails>
                    {/* </Accordion> */}
                  </Grid>
                </Grid>
              </Grid>
              {/* </Stack> */}
            </Grid>
          </FormProvider>
      )}
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
          Quote Information Saved!
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

    </Container>
  );
}
