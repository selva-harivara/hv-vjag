import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  Snackbar,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TDS_TYPES = [
  "Rental Land and Buildings",
  "Individual Contractor",
  "Other Rental Machinery",
  "Commission Based",
  "Business on Contract",
  "Professional",
  "Interest on Money",
];

interface TdsSettingsFormValues {
  tdsType: string;
  percentage: number;
  maxCapPrice: number;
  description: string;
  status: boolean;
}

const reference: TdsSettingsFormValues = {
  tdsType: "",
  percentage: 0,
  maxCapPrice: 0,
  description: "",
  status: true,
};

const validationSchema = Yup.object({
  tdsType: Yup.string().required("Required"),
  percentage: Yup.number().min(0).required("Required"),
  maxCapPrice: Yup.number().min(0).required("Required"),
  description: Yup.string().required("Required"),
});

export default function TdsSettingsEditor({
  mode = "add",
}: {
  mode?: "add" | "edit" | "view";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<TdsSettingsFormValues>(reference);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      fetch(`${API_BASE_URL}/tds-settings/id/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setInitial({
            tdsType: data.data.tdsType || "",
            percentage: data.data.percentage ?? 0,
            maxCapPrice: data.data.maxCapPrice ?? 0,
            description: data.data.description || "",
            status: data.data.status ?? true,
          });
        })
        .catch((err) =>
          setSnackbar({ open: true, message: err.message, severity: "error" })
        )
        .finally(() => setLoading(false));
    } else {
      setInitial(reference);
    }
  }, [mode, id]);

  const formik = useFormik<TdsSettingsFormValues>({
    initialValues: initial,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: TdsSettingsFormValues) => {
      try {
        let response;
        if (mode === "add") {
          response = await fetch(`${API_BASE_URL}/tds-settings/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
        } else if (mode === "edit" && id) {
          response = await fetch(`${API_BASE_URL}/tds-settings/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, _id: id }),
          });
        }
        if (!response?.ok) throw new Error("Failed to save TDS setting");
        setSnackbar({ open: true, message: "Saved!", severity: "success" });
        //navigate("/organization/tdssettings/tds");
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message, severity: "error" });
      }
    },
  });

  const isView = mode === "view";
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 0 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        p: 3,
        fontFamily: "Inter, Poppins, Arial, sans-serif",
        background: "#fafbff",
        minHeight: "100vh",
      }}
    >
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 500, mx: "auto" }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="#222"
              flex={1}
            >
              Status
            </Typography>
            <Switch
              checked={formik.values.status}
              onChange={formik.handleChange}
              name="status"
              color="primary"
              disabled={isView}
            />
          </Box>
          <FormControl
            fullWidth
            size="small"
            error={formik.touched.tdsType && Boolean(formik.errors.tdsType)}
            sx={{ mb: 3 }}
          >
            <InputLabel
              id="tds-type-label"
              sx={{ color: "#7B7B93", fontWeight: 600 }}
            >
              TDS Type
            </InputLabel>
            <Select
              labelId="tds-type-label"
              name="tdsType"
              value={formik.values.tdsType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isView}
              label="TDS Type"
              sx={{
                borderRadius: 2,
                background: isView ? "#f5f7ff" : "#fff",
              }}
            >
              {TDS_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.tdsType && formik.errors.tdsType && (
              <Typography color="error" variant="caption">
                {formik.errors.tdsType}
              </Typography>
            )}
          </FormControl>
          <TextField
            fullWidth
            label="Percentage (%)"
            name="percentage"
            type="number"
            value={formik.values.percentage}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.percentage && Boolean(formik.errors.percentage)
            }
            helperText={formik.touched.percentage && formik.errors.percentage}
            disabled={isView}
            size="small"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: isView ? "#f5f7ff" : "#fff",
            }}
            InputLabelProps={{ sx: { color: "#7B7B93", fontWeight: 600 } }}
          />
          <TextField
            fullWidth
            label="Max. Cap price (INR)"
            name="maxCapPrice"
            type="number"
            value={formik.values.maxCapPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maxCapPrice && Boolean(formik.errors.maxCapPrice)
            }
            helperText={formik.touched.maxCapPrice && formik.errors.maxCapPrice}
            disabled={isView}
            size="small"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: isView ? "#f5f7ff" : "#fff",
            }}
            InputLabelProps={{ sx: { color: "#7B7B93", fontWeight: 600 } }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            disabled={isView}
            size="small"
            multiline
            minRows={3}
            sx={{
              mb: 2,
              borderRadius: 2,
              background: isView ? "#f5f7ff" : "#fff",
            }}
            InputLabelProps={{ sx: { color: "#7B7B93", fontWeight: 600 } }}
          />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate("/organization/tds-settings/tds")}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                px: 4,
                textTransform: "none",
                fontSize: 18,
                color: "#5F79D9",
              }}
            >
              Cancel
            </Button>
            {isView ? null : (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 4,
                  boxShadow: "0 4px 24px 0 rgba(95, 121, 217, 0.12)",
                  textTransform: "none",
                  fontSize: 18,
                  background: "#5F79D9",
                  "&:hover": { background: "#4663c6" },
                }}
              >
                Save
              </Button>
            )}
          </Box>
        </Paper>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
