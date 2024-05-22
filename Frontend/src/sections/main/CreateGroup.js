import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFTextField from "../../components/hook-form/RHFTextField";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MEMBERS = ["NAME 1", "NAME 2", "NAME 3"];

const CreateGroupForm = ({ handleClose }) => {
  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    members: Yup.array().min(2, "Must have atleast 2 members"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,

    setError,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      //API call
      console.log("DATA", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="members"
          multiple
          freeSolo
          options={MEMBERS.map((option) => option)}
          chipProps={{ size: "medium" }}
        />
        <Stack
          spacing={2}
          direction="row"
          alignItems={"center"}
          justifyContent="end"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      {/* Title */}

      <DialogTitle sx={{ mb: 3 }}>Create New Group</DialogTitle>

      {/* Content */}

      <DialogContent>
        {/* Form */}
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
