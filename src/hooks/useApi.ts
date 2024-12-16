import { UseQueryOptions, useQuery } from 'react-query';
import { useApiContext } from 'src/contexts/ApiContext';

// export const useGetRH_By_DB_WB = (params: any,config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>(`get-rh-by-db-wb`, () => api.project.getRH_By_DB_WB(params), config);
// };

// export const useGetWB_By_DB_RH = (params: any,config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>(`get-wb-by-db-rh`, () => api.project.getWB_By_DB_RH(params), config);
// };

// User ==================================================================================
export const useGetAccountInfo = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-account-info`], () => api.account.getAccountInfo(), config);
};

export const useGetUsers = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-users`], () => api.account.getUsers(params), config);
};

export const useGetUsersByCustomer = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-users-by-customer`], () => api.account.getUsersByCustomer(params), config);
};

export const useGetUser = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-user`], () => api.account.getUser(params), config);
};

// Job ==================================================================================
export const useGetJobSelTables = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-job-sel-tables`, () => api.project.getJobSelTables(), config);
};

export const useGetSavedJobs = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-saved-jobs`, () => api.project.getSavedJobs(), config);
};


export const useGetSavedJobsByUserAndCustomer = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-jobs-by-user-and-customer`, params], () => api.project.getSavedJobsByUserAndCustomer(params), config);
};

// export const useGetProjectInitInfo = (config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>(`get-job-init-info`, () => api.project.getJobInitInfo(), config);
// };

// export const useGetJobById = (params: { id: number }, config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>([`get-job-by-id`, params], () => api.project.getJobById(params), config);
// };

export const useGetSavedJob = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-job`, params], () => api.project.getSavedJob(params), config);
};


export const useGetSavedJobNotes = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-job-notes`, params], () => api.project.getSavedJobNotes(params), config);
};


// export const useGetOutdoorInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
//   const api = useApiContext();
//   return useQuery<any>([`get-outdoor-info`, params], () => api.project.getOutdoorInfo(params), config);
// };

export const useGetAllUnits = (
  params: { jobId: number },
  config?: UseQueryOptions<any, any, any, any>
) => {
  const api = useApiContext();
  return useQuery<any>([`get-all-units`, params], () => api.project.getUnits(params), config);
};

// Unit ==================================================================================
export const useGetUnitSelTables = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-unit-sel-tables`], () => api.project.getUnitSelTables(), config);
};

export const useGetSavedUnit = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<JSON>([`get-saved-unit`, params], () => api.project.getSavedUnit(params), config);
};


export const useGetSavedUnitGeneral = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-unit-general`, params], () => api.project.getSavedUnitGeneral(params), config);
};


export const useGetSavedUnitGeneralList = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-unit-general-list`, params], () => api.project.getSavedUnitGeneralList(params), config);
};


export const useGetUnitSelection = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(
    [`get-unit-selection`, params],
    () => api.project.getUnitSelection(params),
    config
  );
};

// Quote =================================================================================
export const useGetQuoteSelTables = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-quote-sel-tables`, params], () => api.project.getQuoteSelTables(params), config);
};

export const useGetSavedQuote = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-saved-quote`, () => api.project.getSavedQuote(params), config);
};

export const useGetSavedQuoteInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>(`get-saved-quote-info`, () => api.project.getSavedQuoteInfo(params), config);
};

// Submittal =============================================================================
export const useGetSavedSubmittal = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-submittal`, params], () => api.project.getSavedSubmittal(params), config);
};

export const useGetSubmittalInfo = (params: any, config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-saved-submittal-info`, params], () => api.project.getSavedSubmittalInfo(params), config);
};

// Resources =================================================================================
export const useGetFileList = (config?: UseQueryOptions<any, any, any, any>) => {
  const api = useApiContext();
  return useQuery<any>([`get-resources-files`], () => api.project.getResourcesFiles(), config);
};
