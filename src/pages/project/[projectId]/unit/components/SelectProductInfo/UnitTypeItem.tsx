// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Button, Divider, Stack, Container } from '@mui/material';
import CircularProgressLoading from 'src/components/loading';
import Iconify from 'src/components/iconify';
import * as Ids from 'src/utils/ids';
import Image from 'next/image';

// components
// ----------------------------------------------------------------------

const BoxStyle = styled(Button)(() => ({
  borderRadius: '50%',
  border: '1px solid #a3a3a3',
  maxWidth: 300,
  maxHeight: 300,
  margin: 'auto',
}));

// ----------------------------------------------------------------------
type UnitTypeItemProps = {
  label: string;
  onSelectItem: Function;
  id?: number | string;
  active?: boolean;
  productTypeId: number;
  productTypeValue?: string;
  unitTypeDesc: string;
  SetIsOpenSideDescriptionOfProductType: (value: boolean) => void;
};

export default function UnitTypeItem({
  label,
  productTypeId,
  productTypeValue,
  onSelectItem,
  SetIsOpenSideDescriptionOfProductType,
  id,
  active,
  unitTypeDesc,
}: UnitTypeItemProps) {
  const images: Record<string, string> = {
    ERV: '/assets/Images/new_unit_crossflow_erv.png',
    HRV: '/assets/Images/new_unit_counterflow_hrv.png',
  };

  let imageUrl = images[label as keyof typeof images] || '/assets/Images/default_image.png';

  if (label === 'ERV') {
    // if (['Ventum', 'Ventum Lite', 'Ventum+'].includes(productTypeValue || '')) {
    if ([Ids.intProdTypeIdVentum, Ids.intProdTypeIdVentumLite, Ids.intProdTypeIdVentumPlus].includes(productTypeId || 0)) {
      imageUrl = '/assets/Images/new_unit_counterflow_erv.png';
    } else {
      imageUrl = '/assets/Images/new_unit_crossflow_erv.png';
    }
  }  

  return (
    <Box textAlign="center">
      <BoxStyle
        id={id?.toString() || ''}
        onClick={() => onSelectItem(id)}
        sx={{
          // borderColor: active ? 'primary.main' : '#a3a3a3',
        }}
      >
        <Image
          src={imageUrl}
          width={500}
          height={300}
          alt={label}
          loading="eager"
        />
      </BoxStyle>
      <Box sx={{ textAlign: 'center', fontSize: '14px' }} mb={1}>
        <Typography>
          {/* {label} */}
          {unitTypeDesc}
          <span>
            <IconButton aria-label="info" sx={{ padding: '5px', pt: 0 }} onClick={() => SetIsOpenSideDescriptionOfProductType(true)}>
              { }
            </IconButton>
          </span>
        </Typography>
      </Box>
      <Divider />
      <Stack textAlign="center" spacing={2} mt={1}>
        {/* <Typography>ERV</Typography>
        <Typography>Indoor/Outdoor</Typography>
        <Typography>Standard Efficiency</Typography>
        <Typography>VRV Integration</Typography> */}
        {/* {unitTypeDesc} */}
      </Stack>
    </Box>
  );
}
