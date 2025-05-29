import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Switch,
  IconButton,
  Pagination,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import OutlinedInput from "@mui/material/OutlinedInput";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const locationStatusOptions = [
  { label: "All", value: "" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
];
const locationTypeOptions = [
  { label: "All", value: "" },
  { label: "Temple", value: "Temple" },
  { label: "Hall", value: "Hall" },
  { label: "Home", value: "Home" },
];
const cityOptions = [
  { label: "All", value: "" },
  { label: "Salem, India", value: "Salem, India" },
  { label: "Chennai, India", value: "Chennai, India" },
  { label: "Bangalore, India", value: "Bangalore, India" },
];

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LocationList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [published, setPublished] = useState("published");
  const [filterOpen, setFilterOpen] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [pendingFilter, setPendingFilter] = useState({
    status: "",
    type: "",
    city: "",
  });
  const [appliedFilter, setAppliedFilter] = useState({
    status: "",
    type: "",
    city: "",
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, limit, published, languages, appliedFilter]);

  const fetchData = async () => {
    try {
      const params: any = {
        page,
        limit,
        publishStatus: published,
      };
      if (appliedFilter.status) params.locationStatus = appliedFilter.status;
      if (appliedFilter.type) params.locationType = appliedFilter.type;
      if (appliedFilter.city) params.city = appliedFilter.city;
      if (languages.length) params.languageSpoken = languages.join(",");
      const query = new URLSearchParams(params).toString();
      const res = await axios.get(`${API_BASE}/location/?${query}`);
      setData(Array.isArray(res.data.data.list) ? res.data.data.list : []);
      setTotal(res.data.data.pagination?.total || 0);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          error.message ||
          "Failed to fetch locations",
        severity: "error",
      });
      setData([]);
      setTotal(0);
    }
  };

  const handleFilterReset = () => {
    setPendingFilter({ status: "", type: "", city: "" });
    setAppliedFilter({ status: "", type: "", city: "" });
    setFilterOpen(false);
    setPage(1);
  };

  const handleFilterSave = () => {
    setAppliedFilter({ ...pendingFilter });
    setFilterOpen(false);
    setPage(1);
  };

  const handleSnackbarClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ background: "#fff", minHeight: "100vh", p: 3 }}>
      {/* Title and Add Button */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <Typography fontWeight={700} mr={2} sx={{ fontSize: 28 }}>
          Locations ({total})
        </Typography>
        <IconButton
          sx={{
            background: "#1D887A",
            color: "#fff",
            width: 36,
            height: 36,
            ml: 1,
            boxShadow: "0px 2px 8px #00000014",
            "&:hover": { background: "#17695F" },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Published and Filter Buttons */}
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            value={published}
            onChange={(e) => setPublished(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: 4,
              fontWeight: 700,
              color: "#1D887A",
              borderColor: "#E0E0E0",
              background: "#fff",
              fontSize: 18,
              boxShadow: "none",
              textTransform: "none",
              height: 40,
              "& .MuiSelect-icon": { color: "#1D887A" },
            }}
          >
            <MenuItem value={"published"}>Published</MenuItem>
            <MenuItem value={"draft"}>Draft</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<FilterAltIcon />}
          sx={{
            borderRadius: 4,
            fontWeight: 700,
            color: "#1D887A",
            borderColor: "#E0E0E0",
            background: "#fff",
            minWidth: 120,
            fontSize: 18,
            boxShadow: "none",
            textTransform: "none",
            "&:hover": { borderColor: "#1D887A", background: "#F6FCFB" },
          }}
          onClick={() => setFilterOpen(true)}
        >
          Filter
        </Button>
      </Box>
      {/* Filter Dialog */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 0,
            minWidth: 380,
            boxShadow: "0px 4px 24px #00000014",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            color: "#1D887A",
            fontSize: 24,
            pb: 0,
          }}
        >
          <FilterAltIcon sx={{ fontSize: 32 }} /> Filter
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 0 }}>
          <Box mt={2} mb={2}>
            <Typography fontWeight={700} color="#1D887A" mb={1} fontSize={18}>
              Location Status
            </Typography>
            <FormControl fullWidth>
              <Select
                value={pendingFilter.status}
                onChange={(e) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                  />
                }
                sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                displayEmpty
              >
                {locationStatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <Typography fontWeight={700} color="#1D887A" mb={1} fontSize={18}>
              Location Type
            </Typography>
            <FormControl fullWidth>
              <Select
                value={pendingFilter.type}
                onChange={(e) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                  />
                }
                sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                displayEmpty
              >
                {locationTypeOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <Typography fontWeight={700} color="#1D887A" mb={1} fontSize={18}>
              City
            </Typography>
            <FormControl fullWidth>
              <Select
                value={pendingFilter.city}
                onChange={(e) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                  />
                }
                sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                displayEmpty
              >
                {cityOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "space-between", px: 3, pb: 2, pt: 1 }}
        >
          <Button
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              color: "#1D887A",
              borderColor: "#E0E0E0",
              background: "#fff",
              minWidth: 110,
              boxShadow: "none",
              textTransform: "none",
            }}
            onClick={handleFilterReset}
          >
            Reset All
          </Button>
          <Box display="flex" gap={2}>
            <Button
              variant="text"
              sx={{
                color: "#1D887A",
                fontWeight: 700,
                fontSize: 18,
                textTransform: "none",
              }}
              onClick={() => setFilterOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "#1D887A",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 18,
                px: 4,
                boxShadow: "none",
                textTransform: "none",
              }}
              onClick={handleFilterSave}
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 8px #00000014" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Location Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Location Type
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  City
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Last Updated
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Location Status
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No record found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={row.image}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                          <Typography fontWeight={600} fontSize={16}>
                            {row.locationName}
                          </Typography>
                          <Typography fontSize={14} color="#19A594">
                            {row.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{row.locationType || "-"}</TableCell>
                    <TableCell>
                      {row.town || row.state || row.city || row.country || "-"}
                    </TableCell>
                    <TableCell>
                      {row.updatedAt || row.createdAt || "-"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={row.status === "published"}
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton size="small" sx={{ color: "#1D887A" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#1D887A" }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#B0B0B0" }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {data.length > 0 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                ".MuiPaginationItem-root": {
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: "50%",
                  minWidth: 28,
                  height: 28,
                  color: "#fff",
                  backgroundColor: "#1D887A",
                  "&:hover": {
                    backgroundColor: "#1D887A",
                  },
                },
                ".Mui-selected": {
                  backgroundColor: "#1D887A",
                  color: "#fff",
                  fontWeight: 700,
                },
                ".MuiPaginationItem-previousNext": {
                  color: "#fff",
                  fontSize: 20,
                  borderRadius: "50%",
                  minWidth: 28,
                  height: 28,
                },
              }}
            />
          </Box>
        )}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LocationList;
