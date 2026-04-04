// Components/FormInput.jsx
import { Controller } from "react-hook-form";
import { TextField, IconButton, InputAdornment, MenuItem } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function FormInput({
  control,
  name,
  label,
  type = "text",
  options = [],
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={type === "number" ? 0 : ""}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          margin="normal"
          label={label}
          error={!!error}
          helperText={error?.message}
          select={type === "select"}
          multiline={type === "textarea"}
          rows={type === "textarea" ? 3 : undefined}
          type={
            type === "password"
              ? show
                ? "text"
                : "password"
              : type === "number"
                ? "number"
                : "text"
          }
          InputProps={
            type === "password"
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShow((show) => !show)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {show ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
          value={field.value || ""}
          onChange={(e) => {
            let value = e.target.value;
            if (type === "number") {
              value = value === "" ? "" : Number(value);
            }
            field.onChange(value);
          }}
        >
          {type === "select" &&
            options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
        </TextField>
      )}
    />
  );
}
