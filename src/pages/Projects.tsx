import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Snackbar,
  Alert,
  Container,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import ProjectDialog from "../components/ProjectDialog";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FormData {
  name: string;
  description: string;
}

const Projects: React.FC = () => {
  const { userRole, projects } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
  });

  const canManageProjects = userRole === "admin" || userRole === "manager";

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
  }) => {
    try {
      const projectRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setSnackbar({
        open: true,
        message: "Project created successfully",
        severity: "success",
      });
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error creating project",
        severity: "error",
      });
    }
  };

  const handleEditProject = async (projectData: {
    name: string;
    description: string;
  }) => {
    if (!selectedProject) return;
    try {
      await updateDoc(doc(db, "projects", selectedProject.id), {
        ...projectData,
        updatedAt: new Date(),
      });
      setSnackbar({
        open: true,
        message: "Project updated successfully",
        severity: "success",
      });
      setDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error updating project",
        severity: "error",
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setSnackbar({
        open: true,
        message: "Project deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error deleting project",
        severity: "error",
      });
    }
  };

  const handleOpen = (project?: Project) => {
    if (project) {
      setSelectedProject(project);
      setFormData({
        name: project.name,
        description: project.description,
      });
    } else {
      setSelectedProject(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedProject(null);
    setFormData({
      name: "",
      description: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      await handleEditProject(formData);
    } else {
      await handleCreateProject(formData);
    }
    handleClose();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        {canManageProjects && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Add Project
          </Button>
        )}
      </Box>
      <Grid container spacing={3}>
        {projects.map((project: Project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Created: {project.createdAt.toLocaleDateString()}
                </Typography>
                {canManageProjects && (
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpen(project)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProject ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Project Name"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedProject ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Projects;
