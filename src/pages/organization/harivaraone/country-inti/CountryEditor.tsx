import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import countryListJson from "../../../json/ countryList.json";
import Grid from "@mui/material/Grid";

interface CountryFormValues {
  _id?: string;
  id: string;
  iso2: string;
  iso3: string;
  assignedCurrency: string;
  assignedCurrencySymbol: string;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  emoji: string;
  emojiU: string;
  latitude: string;
  longitude: string;
  name: string;
  nonMemberDebitPercentage: number;
  numericCode: string;
  phoneCode: string;
  region: string;
  status: boolean;
  timezoneName?: Array<any>;
  iconUrl?: string;
}

const reference: CountryFormValues = {
  id: "",
  iso2: "",
  iso3: "",
  assignedCurrency: "",
  assignedCurrencySymbol: "",
  currency: "",
  currencyName: "",
  currencySymbol: "",
  emoji: "",
  emojiU: "",
  latitude: "",
  longitude: "",
  name: "",
  nonMemberDebitPercentage: 0,
  numericCode: "",
  phoneCode: "",
  region: "",
  status: true,
  timezoneName: [],
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  iso2: Yup.string().required("Required"),
  iso3: Yup.string().required("Required"),
  assignedCurrency: Yup.string().required("Required"),
  assignedCurrencySymbol: Yup.string().required("Required"),
  currency: Yup.string().required("Required"),
  currencyName: Yup.string().required("Required"),
  currencySymbol: Yup.string().required("Required"),
  latitude: Yup.string().required("Required"),
  longitude: Yup.string().required("Required"),
  numericCode: Yup.string().required("Required"),
  phoneCode: Yup.string().required("Required"),
  region: Yup.string().required("Required"),
  nonMemberDebitPercentage: Yup.number().min(0).required("Required"),
});

export default function CountryEditor({
  mode = "add",
  onSubmit,
}: {
  mode?: "add" | "edit" | "view";
  onSubmit?: (values: CountryFormValues) => void;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<CountryFormValues>(reference);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_BASE_URL}/country/id/${id}`)
        .then((res) => res.json())
        .then((data) =>
          setInitial({
            id: id || "",
            name: data.data.name || "",
            iso2: data.data.iso2 || "",
            iso3: data.data.iso3 || "",
            assignedCurrency: data.data.assignedCurrency || "",
            assignedCurrencySymbol: data.data.assignedCurrencySymbol || "",
            currency: data.data.currency || "",
            currencyName: data.data.currencyName || "",
            currencySymbol: data.data.currencySymbol || "",
            emoji: data.data.emoji || "",
            emojiU: data.data.emoji_u || "",
            latitude: data.data.latitude || "",
            longitude: data.data.longitude || "",
            numericCode: data.data.numericCode || "",
            phoneCode: data.data.phoneCode || "",
            region: data.data.region || "",
            status: data.data.status ?? true,
            nonMemberDebitPercentage: data.data.nonMemberDebitPercentage || 0,
            timezoneName: data.data.timezones || "",
          })
        )
        .catch((err) =>
          setSnackbar({ open: true, message: err.message, severity: "error" })
        )
        .finally(() => setLoading(false));
    } else {
      setInitial(reference);
    }
  }, [mode, id]);

  const formik = useFormik<CountryFormValues>({
    initialValues: initial,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: CountryFormValues) => {
      try {
        let response;
        if (mode === "add") {
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/country/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
        } else if (mode === "edit" && id) {
          delete values._id;
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/country/`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
        }
        if (!response?.ok) throw new Error("Failed to save country");
        setSnackbar({ open: true, message: "Saved!", severity: "success" });
        navigate("/organization/harivaraone/country-inti");
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
  console.log(formik.values.timezoneName, "timezoneName");
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
        <Grid container spacing={3} justifyContent="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 3, minHeight: 500 }}>
              {/* General country/currency fields */}
              <TextField
                fullWidth
                label="Country Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={isView}
                size="small"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  background: isView ? "#f5f7ff" : "#fff",
                }}
                InputLabelProps={{ sx: { color: "#7B7B93", fontWeight: 600 } }}
              />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Country ISO 1"
                    name="iso2"
                    value={formik.values.iso2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.iso2 && Boolean(formik.errors.iso2)}
                    helperText={formik.touched.iso2 && formik.errors.iso2}
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Country ISO 2"
                    name="iso3"
                    value={formik.values.iso3}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.iso3 && Boolean(formik.errors.iso3)}
                    helperText={formik.touched.iso3 && formik.errors.iso3}
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Numeric Code"
                    name="numericCode"
                    value={formik.values.numericCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.numericCode &&
                      Boolean(formik.errors.numericCode)
                    }
                    helperText={
                      formik.touched.numericCode && formik.errors.numericCode
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Country ISD Code"
                    name="phoneCode"
                    value={formik.values.phoneCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.phoneCode &&
                      Boolean(formik.errors.phoneCode)
                    }
                    helperText={
                      formik.touched.phoneCode && formik.errors.phoneCode
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Default Currency"
                    name="currency"
                    value={formik.values.currency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.currency && Boolean(formik.errors.currency)
                    }
                    helperText={
                      formik.touched.currency && formik.errors.currency
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Assigned Currency"
                    name="assignedCurrency"
                    value={formik.values.assignedCurrency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.assignedCurrency &&
                      Boolean(formik.errors.assignedCurrency)
                    }
                    helperText={
                      formik.touched.assignedCurrency &&
                      formik.errors.assignedCurrency
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Assigned Currency Symbol"
                    name="assignedCurrencySymbol"
                    value={formik.values.assignedCurrencySymbol}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.assignedCurrencySymbol &&
                      Boolean(formik.errors.assignedCurrencySymbol)
                    }
                    helperText={
                      formik.touched.assignedCurrencySymbol &&
                      formik.errors.assignedCurrencySymbol
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Currency Name"
                    name="currencyName"
                    value={formik.values.currencyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.currencyName &&
                      Boolean(formik.errors.currencyName)
                    }
                    helperText={
                      formik.touched.currencyName && formik.errors.currencyName
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Currency Symbol"
                    name="currencySymbol"
                    value={formik.values.currencySymbol}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.currencySymbol &&
                      Boolean(formik.errors.currencySymbol)
                    }
                    helperText={
                      formik.touched.currencySymbol &&
                      formik.errors.currencySymbol
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Region"
                    name="region"
                    value={formik.values.region}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.region && Boolean(formik.errors.region)
                    }
                    helperText={formik.touched.region && formik.errors.region}
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Non Member Debit %"
                    name="nonMemberDebitPercentage"
                    type="number"
                    value={formik.values.nonMemberDebitPercentage}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "nonMemberDebitPercentage",
                        Number(e.target.value)
                      )
                    }
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.nonMemberDebitPercentage &&
                      Boolean(formik.errors.nonMemberDebitPercentage)
                    }
                    helperText={
                      formik.touched.nonMemberDebitPercentage &&
                      formik.errors.nonMemberDebitPercentage
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 3, minHeight: 500 }}>
              {/* Right box: timezone, lat/lng, icon, flag */}
              <Box
                sx={{
                  mb: 3,
                  minHeight: 180,
                  maxHeight: 260,
                  overflowY: "auto",
                  bgcolor: "#f5f7ff",
                  borderRadius: 2,
                }}
              >
                {formik.values.timezoneName && (
                  <div>
                    {formik.values.timezoneName.map(
                      (item: any, index: number) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: "#f5f7ff",
                            borderRadius: 2,
                          }}
                        >
                          {Object.entries(item).map(([key, value]) => (
                            <Box
                              key={key}
                              sx={{
                                fontSize: 14,
                                color: "#222",
                                marginBottom: 1,
                              }}
                            >
                              <b>
                                {key
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                                :
                              </b>{" "}
                              {String(value)}
                            </Box>
                          ))}
                        </Box>
                      )
                    )}
                  </div>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    name="latitude"
                    value={formik.values.latitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.latitude && Boolean(formik.errors.latitude)
                    }
                    helperText={
                      formik.touched.latitude && formik.errors.latitude
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="longitude"
                    value={formik.values.longitude}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.longitude &&
                      Boolean(formik.errors.longitude)
                    }
                    helperText={
                      formik.touched.longitude && formik.errors.longitude
                    }
                    disabled={isView}
                    size="small"
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      background: isView ? "#f5f7ff" : "#fff",
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
              </Grid>

              {formik.values.iconUrl && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 100,
                    bgcolor: "#f5f7ff",
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <img
                    src={formik.values.iconUrl}
                    alt="icon"
                    style={{ maxHeight: 60, maxWidth: "100%" }}
                  />
                </Box>
              )}
              {formik.values.emoji && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 100,
                    bgcolor: "#f5f7ff",
                    borderRadius: 2,
                    mt: 2,
                  }}
                >
                  <span style={{ fontSize: 48 }}>{formik.values.emoji}</span>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate("/organization/harivaraone/country-inti")}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 4,
              textTransform: "none",
              fontSize: 18,
              color: "#5F79D9",
            }}
          >
            Go Back
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
