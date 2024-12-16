import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { PATH_AUTH } from 'src/routes/paths';

import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  afterSubmit?: string;
};

export default function AuthLoginForm() {
  const { login } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email or username is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    // email: 'sumith.michaelpillai@unitdes.com',
    // password: 'ud3000_ud',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      let message;
      if (error === 'incorrect_password') {
        message = 'Incorrect password!';
      } else if (error === 'no_user_exist') {
        message = `Your email doesn't exist!`;
      }

      reset();

      setError('afterSubmit', {
        ...error,
        message: message || error.message || error,
      });
    }
  };

  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email / Username" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link href={PATH_AUTH.resetPassowrd} variant="body2" color="inherit" underline="always">
          Forgot Password?
        </Link>
      </Stack>
    <Box sx={{display:"flex", justifyContent:"center"}}>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'grey',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
        >
        Login
      </LoadingButton>   
        </Box>
      <Box sx={{ display: "flex", mt: 2, alignItems: 'center', justifyContent: 'center' }}>
      <Stack direction="row" alignItems="center" sx={{ mt: 2, ml: '5px' }}>
    <Typography component="span">
      Don&apos;t have an account? 
    </Typography>
    <Typography 
      component="span"
      sx={{
        textDecoration: 'underline',
        fontWeight: '600',
        cursor: 'pointer',
        ml: 0.5,
      }}
    >
      Sign up
    </Typography>
  </Stack>
</Box>
    </FormProvider>
  );
}
