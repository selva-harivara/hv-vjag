import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  Grid,
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
interface CurrencyFormValues {
  updatedAt?: any;
  createdAt?: any;
  id?: string;
  country: string;
  currencyName: string;
  currencyCode: string;
  currencySymbol: string;
  currencyType: string;
  paymentMethods: string[];
  voucherValue: number[];
  icon: string;
  status: boolean;
  exchangeRate: number;
  currencyPriceSurgeDebit: number;
  minRechargeAllowedAmount: number;
}

const paymentMethodOptions = ["Credit Card, NetBanking", "UPI"];
const countryOptions = [{ code: "IN", name: "India" }];

const reference: CurrencyFormValues = {
  country: "",
  currencyName: "",
  currencyCode: "",
  currencySymbol: "",
  currencyType: "domestic",
  paymentMethods: [],
  voucherValue: [],
  icon: "",
  status: true,
  exchangeRate: 0,
  currencyPriceSurgeDebit: 0,
  minRechargeAllowedAmount: 0,
};

const validationSchema = Yup.object({
  currencyName: Yup.string().required("Required"),
  currencyCode: Yup.string().required("Required"),
  currencySymbol: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  paymentMethods: Yup.array().min(1, "Select at least one"),
  voucherValue: Yup.array().of(Yup.number()).min(1, "Enter at least one value"),
  icon: Yup.string().url("Must be a valid URL").required("Required"),
});

export default function CurrencyEditor({
  mode = "add",
  onSubmit,
}: {
  mode?: "add" | "edit" | "view";
  onSubmit?: (values: CurrencyFormValues) => void;
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<CurrencyFormValues>(reference);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [countryList, setCountryList] = useState<any[]>([]);

  useEffect(() => {
    if (Array.isArray(countryListJson)) {
      console.log(countryListJson, "countryListJson");
      setCountryList(countryListJson);
    } else {
      setCountryList([]);
    }
  }, []);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id) {
      setLoading(true);
      fetch(`${process.env.REACT_APP_API_BASE_URL}/currency/id/${id}`)
        .then((res) => res.json())
        .then((data) => setInitial(data.data))
        .catch((err) =>
          setSnackbar({ open: true, message: err.message, severity: "error" })
        )
        .finally(() => setLoading(false));
    } else {
      setInitial(reference);
    }
  }, [mode, id]);

  const formik = useFormik<CurrencyFormValues>({
    initialValues: initial,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: CurrencyFormValues) => {
      try {
        let response;
        if (mode === "add") {
          console.log(values, "values");
          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/currency/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
        } else if (mode === "edit" && id) {
          console.log(values, "values");
          delete values?.createdAt;
          delete values?.updatedAt;
          values.id = id;

          response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/currency/`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            }
          );
        }
        if (!response?.ok) throw new Error("Failed to save currency");
        setSnackbar({ open: true, message: "Saved!", severity: "success" });
        navigate("/organization/harivaraone/currency");
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

  // Handler for currency name change
  const handleCurrencyNameChange = (e: any) => {
    const selectedName = e.target.value;
    const selected = countryList.find((c) => c.currency_name === selectedName);
    formik.setFieldValue("currencyName", selectedName);
    if (selected) {
      formik.setFieldValue("currencyCode", selected.iso2);
      formik.setFieldValue("currencySymbol", selected.currency_symbol);
    }
  };

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
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(95, 121, 217, 0.08)",
                background: "#fff",
              }}
            >
              <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700} color="#222" flex={1}>
                  Currency
                </Typography>
                <Switch
                  checked={formik.values.status}
                  onChange={formik.handleChange}
                  name="status"
                  color="primary"
                  sx={{
                    ml: 2,
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#5F79D9" },
                    "& .MuiSwitch-track": { backgroundColor: "#5F79D9" },
                  }}
                  disabled={isView}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="currency-name-label">
                      Currency Name
                    </InputLabel>
                    <Select
                      labelId="currency-name-label"
                      id="currencyName"
                      name="currencyName"
                      value={formik.values.currencyName}
                      onChange={handleCurrencyNameChange}
                      label="Currency Name"
                      size="small"
                      disabled={isView}
                    >
                      {Array.isArray(countryList) &&
                        countryList.map((item) => (
                          <MenuItem
                            key={item.currency_name}
                            value={item.currency_name}
                          >
                            {item.currency_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Currency Code"
                    name="currencyCode"
                    value={formik.values.currencyCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.currencyCode &&
                      Boolean(formik.errors.currencyCode)
                    }
                    helperText={
                      formik.touched.currencyCode && formik.errors.currencyCode
                    }
                    disabled
                    size="small"
                    sx={{
                      borderRadius: 2,
                      background: "#f5f7ff",
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "#7B7B93",
                        WebkitTextFillColor: "#7B7B93",
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
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
                    disabled
                    size="small"
                    sx={{
                      borderRadius: 2,
                      background: "#f5f7ff",
                      "& .MuiInputBase-input.Mui-disabled": {
                        color: "#7B7B93",
                        WebkitTextFillColor: "#7B7B93",
                      },
                    }}
                    InputLabelProps={{
                      sx: { color: "#7B7B93", fontWeight: 600 },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      id="country-label"
                      sx={{ color: "#7B7B93", fontWeight: 600 }}
                    >
                      Country
                    </InputLabel>
                    <Select
                      labelId="country-label"
                      id="country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={isView}
                      label="Country"
                      input={<OutlinedInput label="Country" />}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        background: isView ? "#f5f7ff" : "#fff",
                      }}
                    >
                      {countryList
                        .filter(
                          (item) =>
                            item.currency_name === formik.values.currencyName
                        )
                        .map((item) => (
                          <MenuItem key={item.name} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      id="payment-methods-label"
                      sx={{ color: "#7B7B93", fontWeight: 600 }}
                    >
                      Payment Methods
                    </InputLabel>
                    <Select
                      labelId="payment-methods-label"
                      id="payment-methods"
                      multiple
                      name="paymentMethods"
                      value={formik.values.paymentMethods}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      input={<OutlinedInput label="Payment Methods" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      disabled={isView}
                      label="Payment Methods"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        background: isView ? "#f5f7ff" : "#fff",
                      }}
                    >
                      {paymentMethodOptions.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel
                      id="voucher-value-label"
                      sx={{ color: "#7B7B93", fontWeight: 600 }}
                    >
                      Voucher Value
                    </InputLabel>
                    <Select
                      labelId="voucher-value-label"
                      id="voucher-value"
                      multiple
                      name="voucherValue"
                      value={formik.values.voucherValue}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      input={<OutlinedInput label="Voucher Value" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {(selected as number[]).map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      disabled={isView}
                      label="Voucher Value"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        background: isView ? "#f5f7ff" : "#fff",
                      }}
                    >
                      {[50, 100, 200, 500].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                minHeight: 200,
                boxShadow: "0 4px 24px 0 rgba(95, 121, 217, 0.08)",
                background: "#fff",
              }}
            >
              <TextField
                fullWidth
                label="Icon URL"
                name="icon"
                value={formik.values.icon}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.icon && Boolean(formik.errors.icon)}
                helperText={formik.touched.icon && formik.errors.icon}
                disabled={isView}
                size="small"
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  background: isView ? "#f5f7ff" : "#fff",
                }}
                InputLabelProps={{ sx: { color: "#7B7B93", fontWeight: 600 } }}
              />
              {formik.values.icon && (
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
                    src={formik.values.icon}
                    alt="icon"
                    style={{ maxHeight: 60, maxWidth: "100%" }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate("/organization/harivaraone/currency")}
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isView || !formik.isValid || formik.isSubmitting}
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
