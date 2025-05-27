import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Fab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface TdsSetting {
  _id: string;
  tdsType: string;
  percentage: number;
  maxCapPrice: number;
  description: string;
  status: boolean;
}

export default function TdsSettingsList() {
  const navigate = useNavigate();
  const [tdsSettings, setTdsSettings] = useState<TdsSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTdsSetting, setSelectedTdsSetting] =
    useState<TdsSetting | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchTdsSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tds-settings/`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch TDS settings");
      setTdsSettings(data.data || []);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to fetch TDS settings",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTdsSettings();
  }, []);

  const handleDelete = async () => {
    if (!selectedTdsSetting) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/tds-settings/id/${selectedTdsSetting._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ _id: selectedTdsSetting._id }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete TDS setting");
      }

      setSnackbar({
        open: true,
        message: "TDS setting deleted successfully",
        severity: "success",
      });
      fetchTdsSettings();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to delete TDS setting",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTdsSetting(null);
    }
  };

  if (loading && !tdsSettings.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#fff",
        pt: 4,
      }}
    >
      {/* Centered Title and Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            textAlign: "center",
            fontFamily: "Inter, Poppins, Arial, sans-serif",
          }}
        >
          TDS Settings
        </Typography>
        <Fab
          color="primary"
          size="medium"
          aria-label="add"
          onClick={() => navigate("/organization/tds-settings/tds/add")}
          sx={{
            ml: 2,
            boxShadow: "none",
            background: "#407BFF",
            position: "absolute",
            left: "calc(50% + 110px)",
            top: "-8px",
            width: 40,
            height: 40,
            minHeight: 40,
            "&:hover": { background: "#255edb" },
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
      {/* Table Container Centered with Max Width */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04)",
            minWidth: 700,
            maxWidth: 900,
            width: "100%",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#F5F6FA" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#7B7B93",
                    fontSize: 17,
                    borderTopLeftRadius: 12,
                    borderBottom: 0,
                  }}
                >
                  TDS Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#7B7B93",
                    fontSize: 17,
                    borderBottom: 0,
                  }}
                >
                  Percentage
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#7B7B93",
                    fontSize: 17,
                    borderBottom: 0,
                  }}
                >
                  Max.Cap Price
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: "#7B7B93",
                    fontSize: 17,
                    borderTopRightRadius: 12,
                    borderBottom: 0,
                  }}
                  align="center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tdsSettings.map((tdsSetting) => (
                <TableRow
                  key={tdsSetting._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: 17, color: "#222" }}
                  >
                    {tdsSetting.tdsType}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16 }}>
                    {tdsSetting.percentage}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16 }}>
                    {tdsSetting.maxCapPrice}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 2, justifyContent: "center" }}
                    >
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedTdsSetting(tdsSetting);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: "#B0B0B0" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/organization/tds-settings/tds/edit/${tdsSetting._id}`
                            )
                          }
                          sx={{ color: "#B0B0B0" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/organization/tds-settings/tds/view/${tdsSetting._id}`
                            )
                          }
                          sx={{ color: "#B0B0B0" }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !tdsSettings.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: 18, fontWeight: 500 }}
                    >
                      No TDS settings found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {snackbar.open && snackbar.severity === "error" && !loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Alert severity="error" sx={{ width: "100%" }}>
                      {snackbar.message}
                    </Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#222" }}>
          Delete TDS Setting
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this TDS setting? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 4,
              textTransform: "none",
              fontSize: 16,
              color: "#7B7B93",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 4,
              textTransform: "none",
              fontSize: 16,
              background: "#FF3D00",
              "&:hover": { background: "#D32F2F" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
