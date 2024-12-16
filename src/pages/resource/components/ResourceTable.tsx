import React, { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Grid, Table, TableBody, TableCell, TableRow, Typography, Stack } from '@mui/material';
import { useApiContext } from 'src/contexts/ApiContext';
import Iconify from 'src/components/iconify';

type propTypes = { 
  key: Number;
  objResources: any[];
  resourceType: string;
  title: string;
  sx: any;};

const ResourceTable = ({ key, objResources, title, resourceType, sx }: propTypes) => {
  const theme = useTheme();
  const api = useApiContext();

  const onDownload = useCallback(
    (fileName: string, filePath: string) => {
      api.project
        .downloadResourcesFile(
          { resourceType, fileName, filePath },
          {
            responseType: 'blob',
          }
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          console.error('Error downloading file:', error);
        });
    },
    [api.project, resourceType]
  );


  // const convertDate = useCallback((date: string) => {
  //   const originalDate = new Date(date);
  //   const isoString = originalDate.toISOString(); // convert to ISO format
  //   const formattedString = isoString.replace('T', ' ').slice(0, -5);
  //   return formattedString;
  // }, []);

  const currentResources = objResources || [];
  const midIndex = Math.ceil(currentResources.length / 2);
  const leftColumn = currentResources.slice(0, midIndex);
  const rightColumn = currentResources.slice(midIndex);

  return (
    <Box sx={{ ...sx, margin: 1, px: '20px' }}>
      <Typography variant="h6" component="div" sx={{ px: '20px' }}>
        {title}
      </Typography>
      <Grid container spacing={2} marginBottom={5}>
        <Grid item xs={12} sm={6}>
          <Table size="small">
            <TableBody>
              {leftColumn.map((resourceRow: { FileName: string, FileType: string; FilePath: string; }, i: any) => (
                <TableRow
                  key={`left-${i}`}
                  hover
                  sx={{
                    borderBottom: '1px solid #a7b1bc',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {resourceRow.FileName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {resourceRow.FileType}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ color: theme.palette.primary.main }}
                      onClick={() => {
                        onDownload(resourceRow.FileName, resourceRow.FilePath);
                      }}
                    >
                      <Iconify icon="ic:baseline-download" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>


        <Grid item xs={12} sm={6}>
          <Table size="small">
            <TableBody>
              {rightColumn.map((resourceRow: { FileName: string; FileType: string; FilePath: string; }, i: any) => (
                <TableRow
                  key={`right-${i}`}
                  hover
                  sx={{
                    borderBottom: '1px solid #a7b1bc',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {resourceRow.FileName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {resourceRow.FileType}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      sx={{ color: theme.palette.primary.main }}
                      onClick={() => {
                        onDownload(resourceRow.FileName, resourceRow.FilePath);
                      }}
                    >
                      <Iconify icon="ic:baseline-download" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        <Stack><></></Stack>
      </Grid>
    </Box>
  );
};

export default ResourceTable;
