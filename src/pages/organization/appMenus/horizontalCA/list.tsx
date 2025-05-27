import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export default function HorizontalCAList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = () => {
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/menu/?menuType=horizontal&appType=ca&Status=true`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu list");
        return res.json();
      })
      .then((res) => setData(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/menu/id/${deleteId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setDeleteId(null);
    fetchData();
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={4}
        mb={2}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mr={1}
          sx={{ fontSize: { xs: "1.2rem", sm: "2rem" } }}
        >
          Horizontal Menus (CA)
        </Typography>
        <IconButton
          color="primary"
          onClick={() => navigate("/organization/appMenus/horizontalCA/add")}
          sx={{ background: "#f5f6fa", boxShadow: 1, p: { xs: 0.5, sm: 1.5 } }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      {isMobile ? (
        <Box>
          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : error ? (
            <Typography align="center" color="error">
              {error}
            </Typography>
          ) : data.length === 0 ? (
            <Typography align="center">No menus found.</Typography>
          ) : (
            data.map((row: any) => (
              <Paper key={row._id} sx={{ mb: 2, p: 2 }}>
                <Typography>
                  <b>Menu Name:</b> {row.menuName}
                </Typography>
                <Typography>
                  <b>Navigate To:</b> {row.navigateTo}
                </Typography>
                <Typography>
                  <b>Icon URL:</b>{" "}
                  <a
                    href={row.icon}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#5a7be7" }}
                  >
                    {row.icon}
                  </a>
                </Typography>
                <Typography>
                  <b>Status:</b> {row.status ? "Active" : "Inactive"}
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
                        `/organization/appMenus/horizontalCA/edit/${row._id}`
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
                        `/organization/appMenus/horizontalCA/view/${row._id}`
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
              borderRadius: 3,
              boxShadow: "0 4px 24px 0 rgba(95, 121, 217, 0.08)",
              minWidth: 600,
              maxWidth: 1100,
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f6fa" }}>
                  <TableCell>
                    <b>Menu Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Navigate To</b>
                  </TableCell>
                  <TableCell>
                    <b>Icon URL</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      style={{ color: "red" }}
                    >
                      {error}
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No menus found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row: any) => (
                    <TableRow key={row._id}>
                      <TableCell>
                        <b>{row.menuName}</b>
                      </TableCell>
                      <TableCell>{row.navigateTo}</TableCell>
                      <TableCell>
                        <a
                          href={row.icon}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#5a7be7" }}
                        >
                          {row.icon}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Switch checked={row.status} color="primary" />
                      </TableCell>
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
                              `/organization/appMenus/horizontalCA/edit/${row._id}`
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
                              `/organization/appMenus/horizontalCA/view/${row._id}`
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
        <DialogTitle>Delete Menu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this menu?
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
    </>
  );
}
