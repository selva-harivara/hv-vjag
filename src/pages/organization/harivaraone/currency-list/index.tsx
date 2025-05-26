import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Tooltip,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, Outlet } from "react-router-dom";

const CurrencyList: React.FC = () => {
  const [currencyData, setCurrencyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrency = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/currency/?currency_type=domestic`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data, "data");
        setCurrencyData(Array.isArray(data) ? data : data.data || []);
        setSnackbar({
          open: true,
          message: "Currency list loaded successfully!",
          severity: "success",
        });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || "Failed to fetch currency list.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCurrency();
  }, []);

  console.log(currencyData, "currencyData");

  const handleAdd = (values: any) => {
    // Implementation of handleAdd
  };

  const handleEdit = (values: any) => {
    // Implementation of handleEdit
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this currency?"))
      return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/currency/id/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete currency");
      setSnackbar({
        open: true,
        message: "Currency deleted successfully!",
        severity: "success",
      });
      // Refresh the list
      setCurrencyData((prev) => prev.filter((item) => item._id !== id));
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete currency.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          mb: 3,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Currency
        </Typography>
        {/* <AddIcon /> */}
        <img
          src="/images/add.svg"
          alt="add"
          onClick={() => navigate("/organization/harivaraone/currency/add")}
          style={{ cursor: "pointer" }}
        />
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{
            borderRadius: "50%",
            minWidth: 0,
            width: 36,
            height: 36,
            p: 0,
            boxShadow: 1,
          }}
          onClick={() => navigate("/organization/harivaraone/currency/add")}
        /> */}
      </Box>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 0,
            maxWidth: 1100,
            mx: "auto",
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Currency Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Country Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment Methods</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currencyData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {row.currencyName}
                  </TableCell>
                  <TableCell>{row.currencyCode}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.paymentMethods}</TableCell>
                  <TableCell>
                    <Switch checked={row.status} color="primary" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(row._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(
                            `/organization/harivaraone/currency/edit/${row._id}`
                          )
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(
                            `/organization/harivaraone/currency/view/${row._id}`
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Outlet />
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
};

export default CurrencyList;
