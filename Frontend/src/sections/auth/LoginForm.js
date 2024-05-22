import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Alert, Stack } from "@mui/material";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { IconButton, InputAdornment, Link, Button } from "@mui/material";
import { Eye, EyeSlash } from "phosphor-react";
import { LoginUser } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const LoginScheme = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid emial address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "demo@tawk.com",
    password: "demo1234",
  };

  const methods = useForm({
    resolver: yupResolver(LoginScheme),
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
      // submit data to backend
      dispatch(LoginUser(data));
    } catch (error) {
      console.log(error);
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

        <RHFTextField name="email" label="Email Address" />

        <RHFTextField
          name="password"
          label="password"
          type={showPassword ? "text" : "password"}
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
      </Stack>
      <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to="/auth/reset-password"
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot Password?
        </Link>
      </Stack>
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
        Login
      </Button>
    </FormProvider>
  );
};

export default LoginForm;

// import React, { useState } from "react";
// import { Link as RouterLink } from "react-router-dom";
// import * as Yup from "yup";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import FormProvider from "../../components/hook-form/FormProvider";
// import { Alert, Stack } from "@mui/material";
// import RHFTextField from "../../components/hook-form/RHFTextField";
// import { IconButton, InputAdornment, Link, Button } from "@mui/material";
// import { Eye, EyeSlash } from "phosphor-react";
// import axios from "axios"; // Import axios for making HTTP requests
// import { useNavigate } from "react-router-dom";

// const LoginForm = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const navigate = useNavigate();

//   const LoginScheme = Yup.object().shape({
//     email: Yup.string()
//       .required("Email is required")
//       .email("Email must be a valid email address"),
//     password: Yup.string().required("Password is required"),
//   });

//   const defaultValues = {
//     email: "demo@tawk.com",
//     password: "demo1234",
//   };

//   const methods = useForm({
//     resolver: yupResolver(LoginScheme),
//     defaultValues,
//   });

//   const {
//     reset,
//     setError,
//     handleSubmit,
//     formState: { errors },
//   } = methods;

//   const onSubmit = async (data) => {
//     try {
//       // Make a POST request to your backend API
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         data
//       );

//       console.log(response);
//       // Assuming the backend returns a success status or some indicator of a successful login
//       if (response.statusText) {
//         // Redirect to the specified page
//         //navigate("/app");
//         setLoginSuccess(true);
//       } else {
//         // Handle unsuccessful login
//         reset();
//         // setError("afterSubmit", {
//         //   message: "Login failed. Please check your credentials.",
//         // });
//         setLoginSuccess(false);
//       }
//     } catch (error) {
//       console.error(error);
//       reset();
//       setError("afterSubmit", {
//         ...error,
//         message: error.message,
//       });
//     }
//   };

//   console.log("loginSuccess:", loginSuccess);

//   return (
//     <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//       <Stack spacing={3}>
//         {!!errors.afterSubmit && (
//           <Alert severity="error">{errors.afterSubmit.message}</Alert>
//         )}

//         <RHFTextField name="email" label="Email Address" />

//         <RHFTextField
//           name="password"
//           label="password"
//           type={showPassword ? "text" : "password"}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment>
//                 <IconButton
//                   onClick={() => {
//                     setShowPassword(!showPassword);
//                   }}
//                 >
//                   {showPassword ? <Eye /> : <EyeSlash />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Stack>
//       <Stack alignItems={"flex-end"} sx={{ my: 2 }}>
//         <Link
//           component={RouterLink}
//           to="/auth/reset-password"
//           variant="body2"
//           color="inherit"
//           underline="always"
//         >
//           Forgot Password?
//         </Link>
//       </Stack>
//       <Button
//         fullWidth
//         color="inherit"
//         size="large"
//         type="submit"
//         variant="contained"
//         onClick={() => {
//           if (loginSuccess) {
//             //console.log("Navigating to /app");
//             navigate("/app");
//           } else {
//             //console.log("Navigating to /auth/login");
//             navigate("/auth/login");
//           }
//         }}
//         sx={{
//           bgcolor: "text.primary",
//           color: (theme) =>
//             theme.palette.mode === "light" ? "common.white" : "grey.800",
//           "&:hover": {
//             bgcolor: "text.primary",
//             color: (theme) =>
//               theme.palette.mode === "light" ? "common.white" : "grey.800",
//           },
//         }}
//       >
//         Login
//       </Button>
//     </FormProvider>
//   );
// };

// export default LoginForm;
