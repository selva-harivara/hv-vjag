import React, { useEffect, useState, useCallback, lazy, Suspense } from "react";
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
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  Pagination,
  CircularProgress,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const profileStatusOptions = ["All", "Active", "Inactive"];
const cityOptions = ["Bangalore", "Chennai", "Hyderabad", "Mumbai"];
const languageOptions = ["Kannada", "Tamil", "English", "Hindi"];

const ProfessionalHubList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(
    searchParams.get("status") || "published"
  );
  const [searchType, setSearchType] = useState(
    searchParams.get("searchType") || "name"
  );
  const [search, setSearch] = useState(
    searchParams.get("name") || searchParams.get("id") || ""
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterProfileStatus, setFilterProfileStatus] = useState(
    searchParams.get("profileStatus") || "All"
  );
  const [filterCities, setFilterCities] = useState<string[]>(
    searchParams.get("city") ? searchParams.get("city")!.split(",") : []
  );
  const [filterLanguages, setFilterLanguages] = useState<string[]>(
    searchParams.get("language") ? searchParams.get("language")!.split(",") : []
  );
  const [pendingFilter, setPendingFilter] = useState({
    profileStatus: searchParams.get("profileStatus") || "All",
    cities: searchParams.get("city")
      ? searchParams.get("city")!.split(",")
      : [],
    languages: searchParams.get("language")
      ? searchParams.get("language")!.split(",")
      : [],
  });

  const buildQuery = (queryObj: Record<string, any>) => {
    return Object.entries(queryObj)
      .filter(
        ([_, v]) =>
          v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0)
      )
      .map(([k, v]) =>
        Array.isArray(v)
          ? `${encodeURIComponent(k)}=${v.map(encodeURIComponent).join(",")}`
          : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      )
      .join("&");
  };

  useEffect(() => {
    const params: Record<string, any> = {
      page,
      status,
      limit,
      searchType,
      profileStatus:
        filterProfileStatus !== "All" ? filterProfileStatus : undefined,
      city: filterCities.length ? filterCities.join(",") : undefined,
      language: filterLanguages.length ? filterLanguages.join(",") : undefined,
    };
    if (search) {
      if (searchType === "name") params.name = search;
      else if (searchType === "id") params.id = search;
    }
    Object.keys(params).forEach(
      (k) => params[k] === undefined && delete params[k]
    );
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line
  }, [
    page,
    status,
    limit,
    searchType,
    search,
    filterProfileStatus,
    filterCities,
    filterLanguages,
  ]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [
    page,
    status,
    limit,
    search,
    filterProfileStatus,
    filterCities,
    filterLanguages,
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryObj: Record<string, any> = {
        limit,
        page,
        status,
        profileStatus:
          filterProfileStatus !== "All" ? filterProfileStatus : undefined,
        city: filterCities.length ? filterCities : undefined,
        language: filterLanguages.length ? filterLanguages : undefined,
      };
      if (search) {
        if (searchType === "name") queryObj.name = search;
        else if (searchType === "id") queryObj.id = search;
      }
      const query = buildQuery(queryObj);
      const res = await axios.get(`/professional-hub/?${query}`);
      setData(Array.isArray(res.data.data.list) ? res.data.data.list : []);
      setTotal(res.data.data.pagination.total || 0);
    } catch (e) {
      setData([]);
    }
    setLoading(false);
  };

  const handlePublishedChange = (e: any) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilterProfileStatus("All");
    setFilterCities([]);
    setFilterLanguages([]);
    setPendingFilter({
      profileStatus: "All",
      cities: [],
      languages: [],
    });
  };

  const handleFilterSave = () => {
    setFilterProfileStatus(pendingFilter.profileStatus);
    setFilterCities(pendingFilter.cities);
    setFilterLanguages(pendingFilter.languages);
    setFilterOpen(false);
    setPage(1);
  };

  // Delete handler
  const handleDelete = useCallback(async (id: string) => {
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/professional-hub/id/${deleteId}`);
      fetchData();
    } catch (e) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  }, [deleteId, fetchData]);

  return (
    <Box sx={{ background: "#fff", minHeight: "100vh", p: 3 }}>
      {/* Title and Add Button */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <Typography fontWeight={700} mr={2} sx={{ fontSize: 22 }}>
          Professional Hub ({total})
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
          href="/puja/professional/add"
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
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
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 0 }}>
          <Typography>
            Are you sure you want to delete this professional?
          </Typography>
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
            onClick={() => setDeleteConfirmOpen(false)}
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
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Filter/Search Bar */}
      <Box display="flex" justifyContent="center" mb={1}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0px 2px 8px #00000014",
            px: 2,
            py: 1,
            mb: 3,
            minWidth: 600,
            gap: 2,
          }}
        >
          <FormControl sx={{ minWidth: 120 }} size="small">
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              displayEmpty
              sx={{
                minWidth: 90,
                height: 36,
                background: "transparent",
                border: "1px solid #E0E0E0",
                borderRadius: 6,
                fontWeight: 700,
                color: "#1D887A",
                fontSize: 16,
                padding: "4px 10px",
                display: "flex",
                alignItems: "center",
                "& .MuiSelect-icon": { color: "#1D887A", fontSize: 20 },
              }}
              renderValue={(selected) => {
                if (!selected) return "Select Type";
                return searchType === "name"
                  ? "Pandit Name"
                  : "Professional ID";
              }}
            >
              <MenuItem value="">Select Type</MenuItem>
              <MenuItem value="name">Pandit Name</MenuItem>
              <MenuItem value="id">Professional ID</MenuItem>
            </Select>
          </FormControl>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />
          <TextField
            placeholder="Search Pandit Name"
            value={search}
            onChange={handleSearchChange}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#B0B0B0" }} />
                </InputAdornment>
              ),
              style: { fontSize: 18 },
            }}
            sx={{ background: "transparent", minWidth: 220, fontSize: 18 }}
          />
        </Box>
      </Box>
      {/* Published and Filter Buttons below search bar */}
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            value={status}
            onChange={handlePublishedChange}
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
              Profile Status
            </Typography>
            <FormControl fullWidth>
              <Select
                value={pendingFilter.profileStatus}
                onChange={(e) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    profileStatus: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                  />
                }
                sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
              >
                {profileStatusOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
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
                multiple
                value={pendingFilter.cities}
                onChange={(e) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    cities:
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                  />
                }
                renderValue={(selected) =>
                  selected.length ? selected.join(", ") : "Select City"
                }
                sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
              >
                {cityOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Checkbox
                      checked={pendingFilter.cities.indexOf(opt) > -1}
                    />
                    <ListItemText primary={opt} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box mb={2}>
            <Typography fontWeight={700} color="#1D887A" mb={1} fontSize={18}>
              Language
            </Typography>
            <FormControl fullWidth>
              <Select
                multiple
                value={pendingFilter.languages}
                onChange={(e) =>
                  setPendingFilter((prev) => ({
                    ...prev,
                    languages:
                      typeof e.target.value === "string"
                        ? e.target.value.split(",")
                        : e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
                  />
                }
                renderValue={(selected) =>
                  selected.length ? selected.join(", ") : "Select Language"
                }
                sx={{ background: "#F6FCFB", borderRadius: 2, height: 48 }}
              >
                {languageOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    <Checkbox
                      checked={pendingFilter.languages.indexOf(opt) > -1}
                    />
                    <ListItemText primary={opt} />
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
      <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 8px #00000014" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Pandit Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Language
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  City
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No record found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={row.profileImage}
                          sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                          <Typography fontWeight={600} fontSize={16}>
                            {row.name}
                          </Typography>
                          <Typography fontSize={14} color="#19A594">
                            {row._id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{row.language || "-"}</TableCell>
                    <TableCell>{row.city || "-"}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton size="small" sx={{ color: "#1D887A" }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: "#1D887A" }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "#1D887A" }}
                          onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            background: "#19A594",
                            borderRadius: 2,
                            fontWeight: 600,
                            fontSize: 13,
                            px: 2,
                            py: 0.5,
                            boxShadow: "none",
                          }}
                        >
                          Logs
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!loading && data.length > 0 && (
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small" sx={{ minWidth: 70 }}>
                <Select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  sx={{
                    fontWeight: 600,
                    color: "#1D887A",
                    fontSize: 14,
                    borderRadius: 2,
                    height: 28,
                  }}
                >
                  {[10, 25, 50, 75, 100, 150, 200].map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Pagination
                count={Math.ceil(total / limit)}
                page={page}
                onChange={(_, value) => setPage(value)}
                // color="primary"
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
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const LazyProfessionalHubList = lazy(() =>
  Promise.resolve({ default: ProfessionalHubList })
);

export default function ProfessionalHubListWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyProfessionalHubList />
    </Suspense>
  );
}
