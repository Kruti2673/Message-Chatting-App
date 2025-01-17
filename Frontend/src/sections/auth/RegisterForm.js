// import React, {useState} from "react"
// import * as Yup from 'yup';

// import { useForm } from "react-hook-form";

// import { yupResolver } from "@hookform/resolvers/yup";
// import FormProvider from "../../components/hook-form/FormProvider";
// import { Alert, Button, IconButton, InputAdornment, Stack } from "@mui/material";
// import { Eye, EyeSlash } from "phosphor-react";
// import RHFTextField from "../../components/hook-form/RHFTextField";
// const RegisterForm = () => {

//     const [showPassword, setShowPassword] = useState(false);

//     const RegisterScheme = Yup.object().shape({
//         firstName: Yup.string().required(" First Name is Required"),
//         lastName: Yup.string().required(" Last Name is Required"),
//         email: Yup.string()
//         .required("Email is required")
//         .email("Email must be a valid emial address"),
//         password: Yup.string().required("Password is required"),
//     });

//     const defaultValues = {
//         firstName: "",
//         lastName: "",
//         email: "",
//         password: ""
//     }

//     const methods = useForm({
//         resolver: yupResolver(RegisterScheme),
//         defaultValues,
//     });

//     const {
//         reset,
//         setError,
//         handleSubmit,
//         formState: { errors },
//     } = methods;

//     const onSubmit = async (data) => {
//         try {
//             // submit data to backend
//         }
//         catch (error) {
//             console.log(error);
//             reset();
//             setError("afterSubmit", {
//                 ...error,
//                 message: error.message,
//             });
//         }
//     };

//     return(
//         <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

//             <Stack spacing={3}>
//             {!!errors.afterSubmit &&
//                 (<Alert severity='error'>{errors.afterSubmit.message}</Alert>
//             )}

//             <Stack direction={{ xs: "column", sm: "row"}} spacing={2}>

//                 <RHFTextField  name="firstName" label="First Name" />
//                 <RHFTextField  name="lastName" label="Last Name" />

//             </Stack>

//             <RHFTextField  name="email" label="Email" />
//             <RHFTextField  name="password" type={showPassword ? "text" : "password"} label="Password" InputProps={{
//                     endAdornment: (
//                         <InputAdornment>
//                             <IconButton onClick={() => {
//                                 setShowPassword(!showPassword);
//                             }}
//                         >
//                             {showPassword ? <Eye /> : <EyeSlash />}
//                         </IconButton>
//                     </InputAdornment>
//                     ),
//                 }} />

// <Button fullWidth
//             color="inherit"
//             size="large"
//             type="submit"
//             variant="contained"
//             sx={{
//                 bgcolor: "text.primary",
//                 color: (theme) =>
//                     theme.palette.mode === "light" ? "common.white" : "grey.800",
//                 '&:hover': {
//                   bgcolor: "text.primary",
//                   color: (theme) =>
//                   theme.palette.mode === "light" ? "common.white" : "grey.800",
//                 }
//                 }}
//             >
//               Create Account
//             </Button>

//             </Stack>

//         </FormProvider>
//     )
// }

// export default RegisterForm

import React, { useState } from "react";
import * as Yup from "yup";
import axios from "axios"; // Import axios for making HTTP requests
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import { Eye, EyeSlash } from "phosphor-react";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../../redux/slices/auth";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const RegisterScheme = Yup.object().shape({
    firstName: Yup.string().required(" First Name is Required"),
    lastName: Yup.string().required(" Last Name is Required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid emial address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterScheme),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      // Make a POST request to your backend API
      dispatch(RegisterUser(data));

      // Handle the response from the backend
      console.log(data);
      navigate("/auth/login"); // Assuming the backend returns data
    } catch (error) {
      console.error(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <RHFTextField name="firstName" label="First Name" />
          <RHFTextField name="lastName" label="Last Name" />
        </Stack>

        <RHFTextField name="email" label="Email" />
        <RHFTextField
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode === "light" ? "common.white" : "grey.800",
            },
          }}
        >
          Create Account
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default RegisterForm;
