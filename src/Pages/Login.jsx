import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "../components/Controller/FormInput";
import { enqueueSnackbar } from "notistack";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const defaultValues = {
  email: "",
  password: "",
};

export default function Login() {
  const { login, authenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    // register,
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  // useEffect(() => {
  //   if (authenticated) {
  //     navigate("/", { replace: true });
  //   }
  // }, [authenticated]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data);

      if (result.success) {
        enqueueSnackbar("Login successful", { variant: "success" });

        const kycStatus = result.user?.kycStatus;

        if (!kycStatus) {
          navigate("/kyc");
        } else if (kycStatus === "pending") {
          navigate("/kyc-status");
        } else if (kycStatus === "rejected") {
          navigate("/kyc");
        } else if (kycStatus === "approved") {
          navigate("/dashboard");
        } else {
          navigate("/kyc"); // fallback
        }
      } else {
        enqueueSnackbar(result.message, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(err?.message || "Login failed", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        py: { xs: 2, md: 0 },
        background: "linear-gradient(135deg,#667eea,#764ba2)",
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Welcome Back
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} mt={2}>
            {/* <TextField label="Email" {...register("email")} fullWidth />
            <TextField label="Password" type="password" {...register("password")} fullWidth /> */}
            <FormInput
              type="email"
              name="email"
              label="Email"
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
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <Button
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                fontSize: 14,
              }}
            >
              Don’t have an account? Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
