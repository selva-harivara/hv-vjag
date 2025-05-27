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
  Tooltip,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EntityList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/entity/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch entity list");
        return res.json();
      })
      .then((json) => setData(Array.isArray(json.data) ? json.data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
        <Typography variant="h5" fontWeight={700} align="center" mr={1}>
          Entity
        </Typography>
        <img
          src="/images/add.svg"
          alt="add"
          onClick={() => navigate("/organization/harivaraone/entity-list/add")}
        />
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 0, borderRadius: "50%", p: 1, boxShadow: 1 }}
          onClick={() => navigate("/organization/harivaraone/entity-list/add")}
        >
          <AddIcon />
        </Button> */}
      </Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, maxWidth: 900, mx: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Display Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>TDS Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 700 }}>{row._id}</TableCell>
                  <TableCell>{row.displayName}</TableCell>
                  <TableCell>{row.dtsId}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => setDeleteId(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/organization/harivaraone/entity-list/edit/${row._id}`
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
                              `/organization/harivaraone/entity-list/view/${row._id}`
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Entity</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this entity?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                const res = await fetch(
                  `${API_BASE_URL}/entity/id/${deleteId}`,
                  { method: "DELETE" }
                );
                if (!res.ok) throw new Error("Failed to delete entity");
                setSnackbar({
                  open: true,
                  message: "Entity deleted",
                  severity: "success",
                });
                setDeleteId(null);
                setRefresh((r) => r + 1);
              } catch (err: any) {
                setSnackbar({
                  open: true,
                  message: err.message,
                  severity: "error",
                });
              }
            }}
            color="error"
            variant="contained"
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
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default EntityList;
