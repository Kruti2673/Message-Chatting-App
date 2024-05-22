import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { Alert, Stack, Button } from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import axios from "axios";
import { ForgotPassword } from "../../redux/slices/auth";
import { useDispatch } from "react-redux";

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const ResetPasswordScheme = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid emial address"),
  });

  const defaultValues = {
    email: "demo@tawk.com",
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordScheme),
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
      // Make a POST request to the forgot-password API

      dispatch(ForgotPassword(data));

      // Handle the response as needed, e.g., show success message
      console.log("Password reset request sent successfully:", data);

      // Reset the form
      reset();
    } catch (error) {
      console.log(error);

      // Handle error and display it in the form
      setError("afterSubmit", {
        ...error,
        message: error.message || "Failed to send password reset request",
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
          Send Request
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default ResetPasswordForm;
