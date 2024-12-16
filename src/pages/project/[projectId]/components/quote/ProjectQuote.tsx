import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
  useTheme,
  styled,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import { useGetSavedQuoteInfo } from 'src/hooks/useApi';
import ProjectQuoteForm from './ProjectQuoteForm';

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

export default function ProjectQuote() {
  const { projectId } = useRouter().query;
  const [isNoUnit, setIsNoUnit] = useState<boolean>(false);

  const theme = useTheme();

  const {
    data: quoteInfo, isLoading: isLoadingQuoteInfo, isFetching: isFetchingQuoteInfo 
  } = useGetSavedQuoteInfo({
    intUserId: typeof window !== 'undefined' && localStorage.getItem('userId'),
    intUAL: typeof window !== 'undefined' && localStorage.getItem('UAL'),
    intJobId: Number(projectId),
  });

  if (isLoadingQuoteInfo || isFetchingQuoteInfo) return <LinearProgress color="info" />;
  if (!quoteInfo)
    return (
      <Stack direction="row" alignItems='center' justifyContent="center" sx={{pt: '30px' }}>
        <Box sx={{fontSize: '30px' }}>Unable to load quote data</Box>{' '}
      </Stack>
    );
  return <ProjectQuoteForm projectId={Number(projectId)} quoteInfo={quoteInfo} />;
}
