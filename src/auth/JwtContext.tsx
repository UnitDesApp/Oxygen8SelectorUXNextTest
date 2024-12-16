import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
//
import { useApiContext } from 'src/contexts/ApiContext';
import { useRouter } from 'next/router';
import { isValidToken, setSession } from './utils';
import { ActionMapType, AuthStateType, AuthUserType, JWTContextType } from './types';
// utils
import localStorageAvailable from '../utils/localStorageAvailable';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

enum Types {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  LOGOUT = 'LOGOUT',
  UPDATE = 'UPDATE',
}

type Payload = {
  [Types.INITIAL]: {
    isAuthenticated: boolean;
    user: AuthUserType;
  };
  [Types.LOGIN]: {
    user: AuthUserType;
  };
  [Types.REGISTER]: {
    user: AuthUserType;
  };
  [Types.UPDATE]: {
    user: AuthUserType;
  };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.UPDATE) {
    return {
      ...state,
      user: {
        ...state.user,
        ...action.payload.user,
      },
    };
  }
  if (action.type === Types.INITIAL) {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.REGISTER) {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      isInitialized: true,
      user: null,
    };
  }
  return state;
};




// ----------------------------------------------------------------------

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user: userApi } = useApiContext();

  const { push, query, pathname } = useRouter();

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
      const currentTime = Date.now() / 1000;
      const loggedInProgressTime = typeof window !== 'undefined' ? Number(localStorage.getItem('loggedInProgressTime')) : -1;
      const loggedInactivityTime = Number(currentTime) - Number(loggedInProgressTime); 
      const LOGOUT_INACTIVITY_TIME = 18000;  // 3600 minutes (5 hrs) inactivity time 

      // if (accessToken && isValidToken(accessToken)) {
      if (accessToken && ((Number(loggedInactivityTime) < LOGOUT_INACTIVITY_TIME) || (Number(loggedInProgressTime) === 0))) {
        setSession(accessToken);
        localStorage.setItem("loggedInProgressTime", currentTime.toString());

        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: true,
            user: {
              accessToken: localStorage.getItem('accessToken'),
              userId: localStorage.getItem('userId'),
              username: localStorage.getItem('username'),
              firstname: localStorage.getItem('firstname'),
              lastname: localStorage.getItem('lastname'),
              initials: localStorage.getItem('initials'),
              email: localStorage.getItem('email'),
              customerId: localStorage.getItem('customerId'),
              access: localStorage.getItem('access'),
              UAL: localStorage.getItem('UAL'),
              accessPricing: localStorage.getItem('accessPricing'),
              createdDate: localStorage.getItem('createdDate'),
              verified: localStorage.getItem('verified'),
            },
          },
        });
      } else {
        if (pathname !== '/login' && pathname !== '/reset-password') {
          push('/login');
        }
        dispatch({
          type: Types.INITIAL,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [pathname, push, storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (email: string, password: string) => {
      const response = await userApi.login({
        email,
        password,
      });
      const { action, data, accessToken } = response.data;

      if (action === 'success') {
        setSession(accessToken);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', data[0].id);
        localStorage.setItem('username', data[0].username);
        localStorage.setItem('firstname', data[0].first_name);
        localStorage.setItem('lastname', data[0].last_name);
        localStorage.setItem('initials', data[0].initials);
        localStorage.setItem('email', data[0].email);
        localStorage.setItem('customerId', data[0].customer_id);
        localStorage.setItem('access', data[0].access);
        localStorage.setItem('UAL', data[0].access_level);
        localStorage.setItem('accessPricing', data[0].access_pricing);
        localStorage.setItem('createdDate', data[0].created_date);
        localStorage.setItem('loggedInProgressTime', "0");
        localStorage.setItem('verified', data[0].verified);

        dispatch({
          type: Types.LOGIN,
          payload: {
            user: {
              accessToken,
              userId: data[0].id,
              username: data[0].username,
              firstname: data[0].first_name,
              lastname: data[0].last_name,
              initials: data[0].initials,
              email: data[0].email,
              customerId: data[0].customer_id,
              access: data[0].access,
              UAL: data[0].access_level,
              accessPricing: data[0].access_pricing,
              createdDate: data[0].created_date,
              verified: data[0].verified,
            },
          },
        });
      } else {
        throw response.data.action;
      }
    },
    [userApi]
  );

  // REGISTER
  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      // const response = await axios.post('/api/account/register', {
      //   email,
      //   password,
      //   firstName,
      //   lastName,
      // });
      // const { accessToken, user } = response.data;
      // localStorage.setItem('accessToken', accessToken);
      // dispatch({
      //   type: Types.REGISTER,
      //   payload: {
      //     user,
      //   },
      // });
      // return;
    },
    []
  );

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    localStorage.setItem('accessToken', '');

    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  // UPDATE USER
  const updateUser = useCallback(async (data: any) => {
    dispatch({
      type: Types.UPDATE,
      payload: {
        user: {
          username: data.username,
          firstname: data.first_name,
          lastname: data.last_name,
          email: data.email,
          customerId: data.customer_id,
          access: data.access,
          UAL: data.accessLevel,
          accessPricing: data.accessPricing,
        },
      },
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      register,
      logout,
      updateUser,
      UAL: typeof window !== 'undefined' ? Number(localStorage.getItem('UAL')) : 0,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register, updateUser]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
