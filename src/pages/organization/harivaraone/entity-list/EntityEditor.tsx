import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

interface EntityFormValues {
  type: string;
  displayName: string;
  tdsType: string;
  description: string;
  status: boolean;
}

const reference: EntityFormValues = {
  type: "",
  displayName: "",
  tdsType: "",
  description: "",
  status: true,
};

const validationSchema = Yup.object({
  type: Yup.string().required("Required"),
  displayName: Yup.string().required("Required"),
  tdsType: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

export default function EntityEditor({
  mode = "add",
}: {
  mode?: "add" | "edit" | "view";
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<EntityFormValues>(reference);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [tdsTypeOptions, setTdsTypeOptions] = useState<
    { value: string; label: string; description: string }[]
  >([]);
  const [tdsLoading, setTdsLoading] = useState(false);
  const [tdsError, setTdsError] = useState("");

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_BASE_URL}/entity/id/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setInitial({
            type: data.data._id || "",
            displayName: data.data.displayName || "",
            tdsType: data.data.dtsId || "",
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

  useEffect(() => {
    setTdsLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/tds-settings/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch TDS types");
        return res.json();
      })
      .then((json) => {
        console.log(json.data, "json.data.data");
        if (Array.isArray(json.data)) {
          setTdsTypeOptions(
            json.data.map((item: any) => ({
              value: item.tdsType,
              label: `${item.tdsType} (${item.percentage}% -  max ${item.maxCapPrice}%)`,
              description: item.description,
            }))
          );
        } else {
          setTdsTypeOptions([]);
        }
      })
      .catch((err) => setTdsError(err.message))
      .finally(() => setTdsLoading(false));
  }, []);

  const formik = useFormik<EntityFormValues>({
    initialValues: initial,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: EntityFormValues) => {
      try {
        let response;
        if (mode === "edit" && id) {
          // Map form values to API object structure
          const payload = {
            _id: values.type,
            displayName: values.displayName,
            dtsId: values.tdsType, // assuming tdsType is dtsId
            description: values.description,
            status: values.status,
          };
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/entity/`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          if (!response.ok) throw new Error("Failed to update entity");
          setSnackbar({ open: true, message: "Saved!", severity: "success" });
          navigate("/organization/harivaraone/entity-list");
        } else {
          // Add (POST) logic
          const payload = {
            _id: values.type,
            displayName: values.displayName,
            dtsId: values.tdsType, // assuming tdsType is dtsId
            description: values.description,
            status: values.status,
          };
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/entity/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );
          if (!response.ok) throw new Error("Failed to add entity");
          setSnackbar({ open: true, message: "Saved!", severity: "success" });
          navigate("/organization/harivaraone/entity-list");
        }
      } catch (err: any) {
        setSnackbar({ open: true, message: err.message, severity: "error" });
      }
    },
  });

  // // Add useEffect to update description when entityType changes
  // useEffect(() => {
  //   const selected = tdsTypeOptions.find(
  //     (opt) => opt.value === formik.values.tdsType
  //   );
  //   if (selected && formik.values.description !== selected.description) {
  //     formik.setFieldValue("description", selected.description);
  //   }
  //   // Only update if not in view mode
  //   // eslint-disable-next-line
  // }, [formik.values.tdsType]);

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
          <TextField
            fullWidth
            label="Entity Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
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
            label="Entity Display Name"
            name="displayName"
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.displayName && Boolean(formik.errors.displayName)
            }
            helperText={formik.touched.displayName && formik.errors.displayName}
            disabled={isView}
            size="small"
            sx={{
              mb: 3,
              borderRadius: 2,
              background: isView ? "#f5f7ff" : "#fff",
            }}
            InputLabelProps={{ sx: { color: "#7B7B93", fontWeight: 600 } }}
          />
          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel
              id="tds-type-label"
              sx={{ color: "#7B7B93", fontWeight: 600 }}
            >
              Entity TDS Type
            </InputLabel>
            <Select
              labelId="tds-type-label"
              id="tdsType"
              name="tdsType"
              value={formik.values.tdsType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Entity TDS Type"
              disabled={isView || tdsLoading}
              sx={{ borderRadius: 2, background: isView ? "#f5f7ff" : "#fff" }}
              renderValue={(selected) => {
                const opt = tdsTypeOptions.find((o) => o.value === selected);
                return opt ? opt.label : "";
              }}
            >
              {tdsLoading ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : tdsError ? (
                <MenuItem disabled>Error loading TDS types</MenuItem>
              ) : tdsTypeOptions.length === 0 ? (
                <MenuItem disabled>No options</MenuItem>
              ) : (
                tdsTypeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
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
              onClick={() => navigate("/organization/harivaraone/entity-list")}
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
