import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const { user, userRole, projects } = useAuth();

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
    },
    {
      title: "User Role",
      value: userRole.charAt(0).toUpperCase() + userRole.slice(1),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
    },
    {
      title: "Account Status",
      value: "Active",
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.displayName || "User"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your account
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  backgroundColor: `${stat.color}15`,
                  borderRadius: "50%",
                  p: 2,
                  mb: 2,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {stat.title}
              </Typography>
              <Typography variant="h4" component="p">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Recent Activity
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No recent activity to display
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
