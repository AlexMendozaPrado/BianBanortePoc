'use client';

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  AccountTree as TreeIcon,
  FolderOpen as ProjectIcon,
  GetApp as ExportIcon
} from '@mui/icons-material';

export default function Home() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BIAN POC - Banorte
          </Typography>
          <Button color="inherit">Inicio</Button>
          <Button color="inherit">Explorar</Button>
          <Button color="inherit">Proyectos</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #E31E24 0%, #B71C1C 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Explorador de Capacidades BIAN
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Descubre y gestiona las capacidades empresariales del framework BIAN
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip
              label="Framework BIAN 12.0"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Chip
              label="Clean Architecture"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Chip
              label="React + Next.js"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Search Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SearchIcon sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="h5" component="h2">
                    Búsqueda Inteligente
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Encuentra capacidades, subcapacidades y funcionalidades específicas
                  utilizando búsqueda semántica avanzada.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                  fullWidth
                >
                  Comenzar Búsqueda
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Navigation Tree */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TreeIcon sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
                  <Typography variant="h5" component="h2">
                    Árbol de Navegación
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Explora la estructura completa de capacidades BIAN organizadas
                  por categorías y jerarquías.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<TreeIcon />}
                  fullWidth
                >
                  Explorar Estructura
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Projects */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ProjectIcon sx={{ mr: 2, color: 'success.main', fontSize: 32 }} />
                  <Typography variant="h5" component="h2">
                    Gestión de Proyectos
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Crea y gestiona proyectos personalizados seleccionando
                  capacidades y funcionalidades específicas.
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ProjectIcon />}
                  fullWidth
                >
                  Mis Proyectos
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Export */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ExportIcon sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
                  <Typography variant="h5" component="h2">
                    Exportación de Datos
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Exporta información de capacidades y proyectos en múltiples
                  formatos (CSV, JSON, PDF).
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<ExportIcon />}
                  fullWidth
                >
                  Exportar Datos
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Statistics Section */}
        <Paper sx={{ mt: 6, p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Estadísticas del Framework
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="primary.main" fontWeight="bold">
                20+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Categorías BIAN
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="secondary.main" fontWeight="bold">
                150+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Capacidades
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="success.main" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Subcapacidades
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="h3" color="warning.main" fontWeight="bold">
                1000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Funcionalidades
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
