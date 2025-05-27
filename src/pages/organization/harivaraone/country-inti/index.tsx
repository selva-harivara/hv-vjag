import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  OutlinedInput,
  Pagination,
  CircularProgress,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CountryList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Country Name");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(rowsPerPage),
        });
        if (search) params.append("country_name", search);
        const res = await fetch(
          `${API_BASE_URL}/country/?${params.toString()}`
        );
        if (!res.ok) throw new Error("Failed to fetch country list");
        const json = await res.json();
        console.log(json.data.list, "json");
        setData(Array.isArray(json.data.list) ? json.data.list : []);
        setTotal(json.data.pagination.total || 0);
      } catch (err) {
        setData([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, search, rowsPerPage]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} align="center" mb={2}>
        Country - International
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            input={<OutlinedInput />}
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            <MenuItem value="Country Name">Country Name</MenuItem>
            <MenuItem value="ISD Code">Country ISD Code</MenuItem>
            <MenuItem value="Currency">Assigned Currency</MenuItem>
          </Select>
        </FormControl>
        <TextField
          size="small"
          placeholder="Search Country Name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 300, borderRadius: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 },
          }}
        />
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 0,
          maxWidth: 1400,
          mx: "auto",
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Country Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Country ISD Code</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Assigned Currency</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {row.name || ""}
                  </TableCell>
                  <TableCell>{row.iso2 || ""}</TableCell>
                  <TableCell>{row.assignedCurrency || ""}</TableCell>
                  <TableCell>
                    <Switch checked={row.status} color="primary" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(
                            `/organization/harivaraone/country-inti/edit/${row.iso2}`
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
                            `/organization/harivaraone/country-inti/view/${row.iso2}`
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(total / rowsPerPage) || 1}
          page={page}
          onChange={(_, value) => setPage(value)}
          shape="rounded"
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default CountryList;
