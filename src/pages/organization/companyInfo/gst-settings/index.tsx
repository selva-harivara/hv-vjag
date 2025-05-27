import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const GstSettingsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/gst-settings/`)
      .then((res) => res.json())
      .then((res) => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/gst-settings/id/${deleteId}`,
      {
        method: "DELETE",
      }
    );
    setDeleting(false);
    setDeleteId(null);
    fetchData();
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ fontSize: { xs: "1.2rem", sm: "2rem" } }}
        >
          GST Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/organization/company-info/gst-settings/add")
          }
          sx={{ ml: 2, p: { xs: 0.5, sm: 1.5 } }}
        >
          Add
        </Button>
      </Box>
      {isMobile ? (
        <Box>
          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : data.length === 0 ? (
            <Typography align="center">No GST settings found.</Typography>
          ) : (
            data.map((row: any) => (
              <Paper key={row._id} sx={{ mb: 2, p: 2 }}>
                <Typography>
                  <b>Display Name:</b> {row.displayName}
                </Typography>
                <Typography>
                  <b>Percentage:</b> {row.percentage}
                </Typography>
                <Box mt={1} display="flex" gap={1}>
                  <IconButton
                    size="small"
                    sx={{ color: "#888" }}
                    onClick={() => setDeleteId(row._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#888" }}
                    onClick={() =>
                      navigate(
                        `/organization/company-info/gst-settings/edit/${row._id}`
                      )
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "#888" }}
                    onClick={() =>
                      navigate(
                        `/organization/company-info/gst-settings/view/${row._id}`
                      )
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <TableContainer
            component={Paper}
            sx={{
              minWidth: 600,
              maxWidth: 1100,
              borderRadius: 3,
              boxShadow: "0 4px 24px 0 rgba(95, 121, 217, 0.08)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f6fa" }}>
                  <TableCell>
                    <b>Display Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Percentage</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No GST settings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row: any) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <b>{row.displayName}</b>
                      </TableCell>
                      <TableCell>{row.percentage}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          sx={{ color: "#888" }}
                          onClick={() => setDeleteId(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#888" }}
                          onClick={() =>
                            navigate(
                              `/organization/company-info/gst-settings/edit/${row._id}`
                            )
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#888" }}
                          onClick={() =>
                            navigate(
                              `/organization/company-info/gst-settings/view/${row._id}`
                            )
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete GST Setting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this GST setting?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GstSettingsList;
