import React, { useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/Controller/FormInput";
import { AuthContext } from "../Context/AuthContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { enqueueSnackbar } from "notistack";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      "Must include uppercase, lowercase, number",
    ),
});

export default function Register() {
  const navigate = useNavigate();
  const { createProfile } = useContext(AuthContext);
  const {
    // register,
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    try {
      const result = await createProfile(data);

      if (result.success) {
        enqueueSnackbar("Account created successfully", {
          variant: "success",
        });
        navigate("/login");
      } else {
        enqueueSnackbar(result.message, {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(err?.message || "Registration failed", {
        variant: "error",
      });
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        px: 2,
        py: { xs: 2, md: 0 },
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h5" align="center" fontWeight="bold">
          Create Account
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={3}>
            {/* <TextField label="Name" {...register("name")} fullWidth />
            <TextField label="Email" {...register("email")} fullWidth />
            <TextField label="Password" type="password" {...register("password")} fullWidth /> */}
            <FormInput name="name" label="Name" type="name" control={control} />
            <FormInput
              name="email"
              label="Email"
              type="email"
              control={control}
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              control={control}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.2 }}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </Button>

            <Button onClick={() => navigate("/login")}>
              Already have an account? Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
