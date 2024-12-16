// global helper functions

import tr from "date-fns/esm/locale/tr/index.js";
import { AnyAaaaRecord } from "dns";
// eslint-disable-next-line import/extensions
import * as Ids from 'src/utils/ids';


export const moveArrayItem = (array : any, from : number, to : number) => {
    const item = array?.[from];
    array?.splice(from, 1);
    array?.splice(to, 0, item);
    return array;
  };



  export const getIsAdmin = (UAL : any) => {
    let isAdmin = false;

    switch(Number(UAL)) {
      case Ids.intUAL_Admin:
      case Ids.intUAL_AdminLvl_1:
      case Ids.intUAL_IntAdmin:
      case Ids.intUAL_IntLvl_1:
      case Ids.intUAL_IntLvl_2:
        isAdmin= true;
        break;
      default:  
        isAdmin= false;
        break;
    }

    return isAdmin;
  };


  export const getIsUALExternal = (UAL : any) => {
    let isUALExternal = false;

    switch(Number(UAL)) {
      case Ids.intUAL_External:
      case Ids.intUAL_ExternalSpecial:
        isUALExternal= true;
        break;
      default:  
        isUALExternal= false;
        break;
    }

    return isUALExternal;
  };


  // const setValueWithCheck = useCallback(
  //   (e: any, key: any) => {
  //     if (e.target.value === '') {
  //       setValue(key, '');
  //     } else if (e.target.value[0] === '0') {
  //       setValue(key, '0');
  //       return true;
  //     } else if (!Number.isNaN(+e.target.value)) {
  //       setValue(key, parseFloat(e.target.value));
  //       return true;
  //     }
  //     return false;
  //   },
  //   [setValue]
  // );

  // const setValueWithCheck1 = useCallback(
  //   (e: any, key: any) => {
  //     if (e.target.value === '') {
  //       setValue(key, '');
  //     } else if (!Number.isNaN(Number(+e.target.value))) {
  //       setValue(key, e.target.value);
  //       return true;
  //     }
  //     return false;
  //   },
  //   [setValue]
  // );
