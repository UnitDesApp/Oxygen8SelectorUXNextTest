import { memo, useState, useEffect } from 'react';
// @mui
import { Button, Stack } from '@mui/material';
import * as ghf from 'src/utils/globalHelperFunctions';
// utils
import { hideScrollbarY } from '../../../utils/cssStyles';
//
import { NavSectionProps, NavListProps } from '../types';
import NavList from './NavList';

// ----------------------------------------------------------------------

function NavSectionHorizontal({ data, sx, ...other }: NavSectionProps) {
  const buttonClick = () => {
    window.open("https://old.selection.oxygen8.ca/", "_blank");
  };

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

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mx: 'auto',
        ...hideScrollbarY,
        ...sx,
      }}
      {...other}
    >
      {data.map((group) => (
        <Items key={group.subheader} items={group.items} />
      ))}
      {isAdmin ?
        <Button variant="contained" sx={{ maxHeight: "30px" }} onClick={buttonClick}>
          Go to Selector
        </Button>
        :
        <> </>
      }
    </Stack>
  );
}

export default memo(NavSectionHorizontal);

// ----------------------------------------------------------------------

type ItemsProps = {
  items: NavListProps[];
};

function Items({ items }: ItemsProps) {
  return (
    <>
      {items.map((list) => (
        <NavList key={list.title + list.path} data={list} depth={1} hasChild={!!list.children} />
      ))}
    </>
  );
}
