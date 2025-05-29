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
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Pagination,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";

const ratingOptions = [
  { label: "All Ratings", value: "" },
  { label: "5", value: "5" },
  { label: "4.5", value: "4.5" },
  { label: "4", value: "4" },
  { label: "3.5", value: "3.5" },
  { label: "3", value: "3" },
  { label: "2.5", value: "2.5" },
  { label: "2", value: "2" },
  { label: "1.5", value: "1.5" },
  { label: "1", value: "1" },
];

const PujareviewList: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("panditName");
  const [rating, setRating] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, limit, search, searchType, rating, date]);

  const fetchData = async () => {
    const params: any = {
      page,
      limit,
    };
    if (search) params[searchType] = search;
    if (rating) params.rating = rating;
    if (date) params.date = date;
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`/professional-review/?${query}`);
    setData(Array.isArray(res.data.data.list) ? res.data.data.list : []);
    setTotal(res.data.data.pagination?.total || 0);
  };

  const handleClear = () => {
    setSearch("");
    setRating("");
    setDate("");
    setPage(1);
  };

  return (
    <Box sx={{ background: "#fff", minHeight: "100vh", p: 3 }}>
      {/* Title and Add Button */}
      <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
        <Typography fontWeight={700} mr={2} sx={{ fontSize: 28 }}>
          Reviews
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
      {/* Search Bar */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0px 2px 8px #00000014",
            px: 2,
            py: 1,
            minWidth: 400,
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
            >
              <MenuItem value="panditName">Pandit Name</MenuItem>
            </Select>
          </FormControl>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />
          <TextField
            placeholder="Search Pandit Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
      {/* Ratings, Date, Clear Controls */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mb={2}
      >
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: 4,
              fontWeight: 700,
              color: "#1D887A",
              borderColor: "#E0E0E0",
              background: "#fff",
              fontSize: 16,
              boxShadow: "none",
              textTransform: "none",
              height: 40,
              "& .MuiSelect-icon": { color: "#1D887A" },
            }}
          >
            {ratingOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
          sx={{
            background: "#fff",
            borderRadius: 2,
            minWidth: 160,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #E0E0E0",
            },
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="outlined"
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            color: "#1D887A",
            borderColor: "#E0E0E0",
            background: "#fff",
            minWidth: 80,
            boxShadow: "none",
            textTransform: "none",
          }}
          onClick={handleClear}
        >
          Clear
        </Button>
      </Box>
      {/* Table */}
      <Paper sx={{ borderRadius: 3, boxShadow: "0 2px 8px #00000014" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Customer & Service Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Rating
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Reviews
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Pandit Name
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>
                  Posted Date
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
                      <Box>
                        <Typography fontWeight={600} fontSize={16}>
                          {row.customerName}
                        </Typography>
                        <Typography fontSize={13} color="#19A594">
                          {row.customerId}
                        </Typography>
                        <Typography
                          fontSize={15}
                          color="#19A594"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {row.serviceName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography fontWeight={700} fontSize={16}>
                          {row.rating}
                        </Typography>
                        <StarIcon sx={{ color: "#F7B500", fontSize: 20 }} />
                      </Box>
                    </TableCell>
                    <TableCell>{row.review}</TableCell>
                    <TableCell>{row.panditName}</TableCell>
                    <TableCell>{row.postedDate}</TableCell>
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
    </Box>
  );
};

export default PujareviewList;
