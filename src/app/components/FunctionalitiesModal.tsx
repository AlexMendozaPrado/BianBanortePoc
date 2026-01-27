'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Breadcrumbs,
  Link,
  Tooltip,
  Collapse,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Layers as LayersIcon,
  Computer as ComputerIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Functionality } from '../../core/domain/entities/Functionality';
import { BaseFunction } from '../../core/domain/entities/BaseFunction';

interface FunctionalitiesModalProps {
  open: boolean;
  onClose: () => void;
  baseFunction: BaseFunction | null;
  breadcrumb: {
    groupName: string;
    capabilityName: string;
    subCapabilityName: string;
  };
  onFunctionalitySelect?: (functionality: Functionality) => void;
  onAddToProject?: (functionalities: Functionality[]) => void;
}

type ViewMode = 'table' | 'cards';

export function FunctionalitiesModal({
  open,
  onClose,
  baseFunction,
  breadcrumb,
  onFunctionalitySelect,
  onAddToProject,
}: FunctionalitiesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFunctionalities, setSelectedFunctionalities] = useState<string[]>([]);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const functionalities = baseFunction?.functionalities || [];

  // Obtener valores únicos para filtros
  const uniqueLevels = useMemo(() => {
    const levels = new Set<number>();
    functionalities.forEach(f => {
      if (f.level) levels.add(f.level);
    });
    return Array.from(levels).sort();
  }, [functionalities]);

  const uniqueSystems = useMemo(() => {
    const systems = new Set<string>();
    functionalities.forEach(f => {
      if (f.systemApplication) systems.add(f.systemApplication);
    });
    return Array.from(systems).sort();
  }, [functionalities]);

  // Filtrar funcionalidades
  const filteredFunctionalities = useMemo(() => {
    return functionalities.filter(func => {
      const matchesSearch = searchTerm === '' ||
        func.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        func.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (func.commonComponentName?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLevel = selectedLevel === 'all' || func.level?.toString() === selectedLevel;
      const matchesSystem = selectedSystem === 'all' || func.systemApplication === selectedSystem;

      return matchesSearch && matchesLevel && matchesSystem;
    });
  }, [functionalities, searchTerm, selectedLevel, selectedSystem]);

  const handleSelectAll = () => {
    if (selectedFunctionalities.length === filteredFunctionalities.length) {
      setSelectedFunctionalities([]);
    } else {
      setSelectedFunctionalities(filteredFunctionalities.map(f => f.id));
    }
  };

  const handleSelectFunctionality = (id: string) => {
    setSelectedFunctionalities(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    if (onAddToProject) {
      const selected = functionalities.filter(f => selectedFunctionalities.includes(f.id));
      onAddToProject(selected);
    }
  };

  const toggleCardExpanded = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getLevelColor = (level?: number) => {
    if (!level) return '#9e9e9e';
    const colors = ['#e0e0e0', '#81c784', '#4caf50', '#388e3c', '#1b5e20'];
    return colors[level - 1] || '#4caf50';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('all');
    setSelectedSystem('all');
  };

  if (!baseFunction) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '70vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 1, fontSize: '12px' }}>
              <Link underline="hover" color="inherit" sx={{ fontSize: '12px' }}>
                {breadcrumb.groupName}
              </Link>
              <Link underline="hover" color="inherit" sx={{ fontSize: '12px' }}>
                {breadcrumb.capabilityName}
              </Link>
              <Link underline="hover" color="inherit" sx={{ fontSize: '12px' }}>
                {breadcrumb.subCapabilityName}
              </Link>
              <Typography color="text.primary" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
                {baseFunction.name}
              </Typography>
            </Breadcrumbs>

            {/* Título */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon sx={{ color: '#7b1fa2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {baseFunction.name}
              </Typography>
              <Chip
                label={`${functionalities.length} funcionalidades`}
                size="small"
                sx={{ backgroundColor: '#f3e5f5', color: '#7b1fa2' }}
              />
            </Box>

            {baseFunction.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {baseFunction.description}
              </Typography>
            )}
          </Box>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {/* Barra de búsqueda y filtros */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 1 }}>
            <TextField
              size="small"
              placeholder="Buscar funcionalidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, maxWidth: 400 }}
            />

            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              size="small"
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ textTransform: 'none' }}
            >
              Filtros
              {(selectedLevel !== 'all' || selectedSystem !== 'all') && (
                <Chip
                  label={
                    (selectedLevel !== 'all' ? 1 : 0) +
                    (selectedSystem !== 'all' ? 1 : 0)
                  }
                  size="small"
                  sx={{ ml: 1, height: 18, fontSize: 10 }}
                />
              )}
            </Button>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="small"
            >
              <ToggleButton value="table">
                <Tooltip title="Vista tabla">
                  <ViewListIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="cards">
                <Tooltip title="Vista tarjetas">
                  <ViewModuleIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Panel de filtros */}
          <Collapse in={showFilters}>
            <Paper sx={{ p: 2, mt: 1, backgroundColor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Nivel</InputLabel>
                  <Select
                    value={selectedLevel}
                    label="Nivel"
                    onChange={(e) => setSelectedLevel(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {uniqueLevels.map(level => (
                      <MenuItem key={level} value={level.toString()}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LayersIcon sx={{ fontSize: 16, color: getLevelColor(level) }} />
                          Nivel {level}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Sistema</InputLabel>
                  <Select
                    value={selectedSystem}
                    label="Sistema"
                    onChange={(e) => setSelectedSystem(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    {uniqueSystems.map(system => (
                      <MenuItem key={system} value={system}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ComputerIcon sx={{ fontSize: 16 }} />
                          {system}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  size="small"
                  onClick={clearFilters}
                  sx={{ textTransform: 'none' }}
                >
                  Limpiar filtros
                </Button>
              </Box>
            </Paper>
          </Collapse>
        </Box>

        {/* Contador de resultados */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Mostrando {filteredFunctionalities.length} de {functionalities.length} funcionalidades
          {selectedFunctionalities.length > 0 && (
            <Chip
              label={`${selectedFunctionalities.length} seleccionadas`}
              size="small"
              color="primary"
              sx={{ ml: 1 }}
            />
          )}
        </Typography>

        {/* Vista de tabla */}
        {viewMode === 'table' && (
          <TableContainer component={Paper} sx={{ maxHeight: 'calc(90vh - 350px)' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedFunctionalities.length > 0 &&
                        selectedFunctionalities.length < filteredFunctionalities.length
                      }
                      checked={
                        filteredFunctionalities.length > 0 &&
                        selectedFunctionalities.length === filteredFunctionalities.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 250 }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 300 }}>Descripción</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: 80 }} align="center">Nivel</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Sistema</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Componente Común</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFunctionalities.map((func) => (
                  <TableRow
                    key={func.id}
                    hover
                    selected={selectedFunctionalities.includes(func.id)}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onFunctionalitySelect?.(func)}
                  >
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedFunctionalities.includes(func.id)}
                        onChange={() => handleSelectFunctionality(func.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: getLevelColor(func.level) }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {func.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {func.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {func.level && (
                        <Chip
                          label={`N${func.level}`}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '11px',
                            fontWeight: 'bold',
                            backgroundColor: getLevelColor(func.level),
                            color: 'white',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {func.systemApplication && (
                        <Chip
                          icon={<ComputerIcon sx={{ fontSize: '14px !important' }} />}
                          label={func.systemApplication}
                          size="small"
                          sx={{ height: 24, fontSize: '11px' }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {func.commonComponentName && (
                        <Tooltip title={`ID: ${func.commonComponentId}`}>
                          <Chip
                            label={func.commonComponentName}
                            size="small"
                            sx={{
                              height: 24,
                              fontSize: '11px',
                              backgroundColor: '#fff3e0',
                              color: '#e65100',
                            }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Vista de cards */}
        {viewMode === 'cards' && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 2,
            maxHeight: 'calc(90vh - 350px)',
            overflowY: 'auto',
          }}>
            {filteredFunctionalities.map((func) => (
              <Card
                key={func.id}
                sx={{
                  border: selectedFunctionalities.includes(func.id)
                    ? '2px solid #1976d2'
                    : '1px solid #e0e0e0',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <CardContent sx={{ pb: '8px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Checkbox
                      checked={selectedFunctionalities.includes(func.id)}
                      onChange={() => handleSelectFunctionality(func.id)}
                      sx={{ mt: -1, ml: -1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: getLevelColor(func.level) }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', flex: 1 }}>
                          {func.name}
                        </Typography>
                        {func.level && (
                          <Chip
                            label={`N${func.level}`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '10px',
                              fontWeight: 'bold',
                              backgroundColor: getLevelColor(func.level),
                              color: 'white',
                            }}
                          />
                        )}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: expandedCards.includes(func.id) ? 10 : 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {func.description || 'Sin descripción'}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {func.systemApplication && (
                          <Chip
                            icon={<ComputerIcon sx={{ fontSize: '12px !important' }} />}
                            label={func.systemApplication}
                            size="small"
                            sx={{ height: 22, fontSize: '10px' }}
                          />
                        )}
                        {func.commonComponentName && (
                          <Chip
                            label={`CC: ${func.commonComponentName}`}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '10px',
                              backgroundColor: '#fff3e0',
                              color: '#e65100',
                            }}
                          />
                        )}
                      </Box>

                      {func.description && func.description.length > 100 && (
                        <Button
                          size="small"
                          onClick={() => toggleCardExpanded(func.id)}
                          endIcon={expandedCards.includes(func.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          sx={{ mt: 1, textTransform: 'none', p: 0 }}
                        >
                          {expandedCards.includes(func.id) ? 'Ver menos' : 'Ver más'}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {filteredFunctionalities.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              No se encontraron funcionalidades con los filtros aplicados
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>
          Cerrar
        </Button>
        {selectedFunctionalities.length > 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSelected}
            sx={{ textTransform: 'none' }}
          >
            Agregar {selectedFunctionalities.length} al proyecto
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
