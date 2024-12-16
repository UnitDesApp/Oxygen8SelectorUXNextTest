import { saveAs } from 'file-saver';
import { useApiContext } from 'src/contexts/ApiContext';
import React, {useState} from 'react';

export const useExport = () => {
  const api = useApiContext();
  const [ErrorMsg, setErrorMsg] = useState('');

  const unitListArray = typeof window !== 'undefined' &&  localStorage?.getItem('unitlist');
  const selectedUnits = unitListArray ? JSON.parse(unitListArray) : [];
  const selectedUnitNoList = selectedUnits.map((item:string|Number) => Number(item));
  

  const getCombinedUnitTagList = (dtSavedUnitGeneralList: any) => {

    const selectedUnitList = dtSavedUnitGeneralList?.filter((e: { unit_no: any }) => selectedUnitNoList?.filter((e_link: { unit_no: any }) => e.unit_no === e_link)?.length > 0);
    const selUnitUnitTagList = selectedUnitList.map((item:any)  => item.tag).join(', ')
    const combinedUnitTagList = selUnitUnitTagList !== "" ? ` - ${selUnitUnitTagList}` : "";

    return combinedUnitTagList.toUpperCase()
  };


  const ExportUnitSelectionPdf = async (jobId: string, unitInfo: any, dtSavedJob: any, dtSavedUnitGeneral: any) => {
    const data = {
      intJobId: jobId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserId: localStorage.getItem('userId'),
    };

    // Do not delete - Working code to receive byteArray by HttpResponseMessage
    // await api.project.downloadUnitSelectionPdf(data).then((response) => {
    //   console.log(response);
    //   // Get File Name
    //   let filename = '';
    //   const disposition = response.headers['content-disposition'];
    //   if (disposition && disposition.indexOf('attachment') !== -1) {
    //     const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //     const matches = filenameRegex.exec(disposition);
    //     if (matches != null && matches[1]) {
    //       filename = matches[1].replace(/['"]/g, '');
    //     }
    //   }

    //   // Save File
    //   saveAs(response.data, `${filename}.pdf`);
    // });
    // Do not delete - Working code to receive byteArray by HttpResponseMessage

    await api.project.downloadUnitSelectionPdf(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'selection.pdf';
      const fileName = `Oxygen8 Selection - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name} - ${dtSavedUnitGeneral?.[0]?.tag} - Rev${dtSavedJob?.[0]?.revision_no}.pdf`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };


  const ExportUnitSelectionExcel = async (jobId: number, unitInfo: any, dtSavedJob: any, dtSavedUnitGeneral: any) => {
    const data = {
      intJobId: jobId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserId: localStorage.getItem('userId'),
    };

    await api.project.downloadUnitSelectionExcel(data).then((response) => {
      // // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'selection.xlsx';
      const fileName = `Oxygen8 Selection - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name} - ${dtSavedUnitGeneral?.[0]?.tag} - Rev${dtSavedJob?.[0]?.revision_no}.xlsx`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };


  const ExportUnitSelectionRevit = async (jobId: number, unitInfo: any, dtSavedJob: any, dtSavedUnitGeneral: any) => {
    const data = {
      intJobId: jobId,
      intUnitNo: unitInfo,
      intUAL: localStorage.getItem('UAL'),
      intUserId: localStorage.getItem('userId'),
    };

    await api.project.downloadUnitSelectionRevit(data).then((response) => {
      // // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'selection_revit.zip';
      const fileName = `Oxygen8 Revit - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name} - ${dtSavedUnitGeneral?.[0]?.tag} - Rev${dtSavedJob?.[0]?.revision_no}.zip`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };


  const ExportAllUnitsSelectionPdf = async (jobId: number, dtSavedJob: any, dtSavedUnitGeneralList: any) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitNoList,
    };


    // Do not delete - Working code to receive byteArray by HttpResponseMessage
    // await api.project.downloadAllUnitsSelectionPdf(data).then((response) => {
    //   if (!response?.data?.size || response?.data?.size === 0) {
    //     return;
    //   }
    //   // Get File Name
    //   let filename = '';
    //   const disposition = response.headers['content-disposition'];
    //   if (disposition && disposition.indexOf('attachment') !== -1) {
    //     const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //     const matches = filenameRegex.exec(disposition);
    //     if (matches != null && matches[1]) {
    //       filename = matches[1].replace(/['"]/g, '');
    //     }
    //   }

    //   // Save File
    //   saveAs(response.data, `${filename}.pdf`);
    // });
    // Do not delete - Working code to receive byteArray by HttpResponseMessage


    // const selectedUnitList = dtSavedUnitGeneralList?.filter((e: { unit_no: any }) => selectedUnitNoList?.filter((e_link: { unit_no: any }) => e.unit_no === e_link)?.length > 0);
    // const selUnitUnitTagList = selectedUnitList.map((item:any)  => item.tag).join(', ')
    // const combinedUnitTagList = selUnitUnitTagList !== "" ? ` - ${selUnitUnitTagList}` : "";

    const combinedUnitTagList = getCombinedUnitTagList(dtSavedUnitGeneralList);

    await api.project.downloadAllUnitsSelectionPdf(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'selection_all.pdf';
      const fileName = `Oxygen8 Selection All - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name}${combinedUnitTagList} -  Rev${dtSavedJob?.[0]?.revision_no}.pdf`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };


  const ExportSubmittalPdf = async (jobId: number, dtSavedJob: any, dtSavedUnitGeneralList: any, dtSavedSubmittal: any) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitNoList,
    };

    // Do not delete - Working code to receive byteArray by HttpResponseMessage
    // const response = await api.project.downloadSubmittalPdf(data);
    // if (response.data.type === 'application/json') {
    //   return false;
    // }

    // // Get File Name
    // let filename = '';
    // const disposition = response.headers['content-disposition'];
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //   const matches = filenameRegex.exec(disposition);
    //   if (matches != null && matches[1]) {
    //     filename = matches[1].replace(/['"]/g, '');
    //   }
    // }

    // // Save File
    // saveAs(response.data, `${filename}`);
    // return true;
    // Do not delete - Working code to receive byteArray by HttpResponseMessage

    const combinedUnitTagList = getCombinedUnitTagList(dtSavedUnitGeneralList);

    await api.project.downloadSubmittalPdf(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'submittal.pdf';
      const fileName = `${dtSavedSubmittal[0]?.project_number} - Oxygen8 Submittal - ${dtSavedJob?.[0]?.CompanyName}${combinedUnitTagList} - ${dtSavedJob?.[0]?.job_name} - Rev${dtSavedJob?.[0]?.revision_no}.pdf`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };


  // export pdf of form data
  const ExportSubmittalEpicorExcel = async (jobId: number, dtSavedJob: any) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitNoList,
    };

    // const response = await api.project.downloadSubmittalEpicorExcel(data);
    // if (response.data.type === 'application/json') {
    //   return false;
    // }

    // // Get File Name
    // let filename = '';
    // const disposition = response.headers['content-disposition'];
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //   const matches = filenameRegex.exec(disposition);
    //   if (matches != null && matches[1]) {
    //     filename = matches[1].replace(/['"]/g, '');
    //   }
    // }

    // // Save File
    // saveAs(response.data, `${filename}`);
    // return true;


    await api.project.downloadSubmittalEpicorExcel(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'submittal_epicor.xlsx';
      const fileName = `Oxygen8 Submittal Epicor - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name} - Rev${dtSavedJob?.[0]?.revision_no}.xlsx`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };


  const ExportMechanicalScheduleExcel = async (jobId: number, dtSavedJob: any, dtSavedUnitGeneralList: any) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitNoList,
    };

    const combinedUnitTagList = getCombinedUnitTagList(dtSavedUnitGeneralList);
    // let errMsg = "";

    await api.project.downloadMechanicalScheduleExcel(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'schedule.xlsx';
      const fileName = `Oxygen8 Mechanical Schedule - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name}${combinedUnitTagList} - Rev${dtSavedJob?.[0]?.revision_no}.xlsx`;

      // Create a temporary URL for the downloaded file
      if (response.data.type === "application/vnd.ms-excel") {
        const url = URL.createObjectURL(new Blob([response.data]));
        // Create a link element and simulate a click to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup: remove the temporary URL and link element
        link?.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        new Blob([response.data]).text().then(value => {
          const errMsg = value 
           setErrorMsg(errMsg);
          //  ErrorMsg = errMsg;
        });
      }
    });
  };


  const ExportAllUnitsSelectionRevit = async (jobId: number, dtSavedJob: any, dtSavedUnitGeneralList: any) => {
    const data: any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitNoList,
    };

    const combinedUnitTagList = getCombinedUnitTagList(dtSavedUnitGeneralList);

    await api.project.downloadAllUnitsSelectionRevit(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'selection_all_revit.zip';
      const fileName = `Oxygen8 Revit - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name}${combinedUnitTagList} - Rev${dtSavedJob?.[0]?.revision_no}.zip`;

      if (response.data.type === "application/zip") {
        // Create a temporary URL for the downloaded file
        const url = URL.createObjectURL(new Blob([response.data]));
        // Create a link element and simulate a click to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup: remove the temporary URL and link element
        link?.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        new Blob([response.data]).text().then(value => {
          const errMsg = value
          setErrorMsg(errMsg);
          //  ErrorMsg = errMsg;
        });
      }
    });
  };


  const ExportQuotePdf = async (jobId: number, dtSavedJob: any, dtSavedUnitGeneralList: any) => {
    const data : any = {
      intUserId: localStorage.getItem('userId'),
      intUAL: localStorage.getItem('UAL'),
      intJobId: jobId,
      lstUnitNo: selectedUnitNoList,
    };

    // const response = await api.project.downloadQuotePdf(data);
    // if (response.data.type === 'application/json') {
    //   if (!response.data.success) return 'fail';
    //   return 'server_error';
    // }

    // // Get File Name
    // let filename = '';
    // const disposition = response.headers['content-disposition'];
    // if (disposition && disposition.indexOf('attachment') !== -1) {
    //   const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    //   const matches = filenameRegex.exec(disposition);
    //   if (matches != null && matches[1]) {
    //     filename = matches[1].replace(/['"]/g, '');
    //   }
    // }

    // // Save File
    // saveAs(response.data, `${filename}.pdf`);
    // return true;


    const combinedUnitTagList = getCombinedUnitTagList(dtSavedUnitGeneralList);

    await api.project.downloadQuotePdf(data).then((response) => {
      // Extract the filename from the response headers
      // const disposition = response.headers['content-disposition'];
      // const regex = /filename="(.+)"/;
      // const matches = regex.exec(disposition);
      // const fileName = matches && matches[1] ? matches[1] : 'CompanyNamequote.pdf';
      const fileName = `Oxygen8 Quote - ${dtSavedJob?.[0]?.CompanyName} - ${dtSavedJob?.[0]?.job_name}${combinedUnitTagList} - Rev${dtSavedJob?.[0]?.revision_no}.pdf`;

      // Create a temporary URL for the downloaded file
      const url = URL.createObjectURL(new Blob([response.data]));
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary URL and link element
      link?.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  
  return {
    ExportUnitSelectionPdf,
    ExportAllUnitsSelectionPdf,
    ExportUnitSelectionExcel,
    ExportUnitSelectionRevit,
    ExportAllUnitsSelectionRevit,
    ExportSubmittalPdf,
    ExportSubmittalEpicorExcel,
    ExportMechanicalScheduleExcel,
    ExportQuotePdf,
    ErrorMsg,
  };
};
