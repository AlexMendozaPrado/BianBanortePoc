'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

export type ViewMode = 'cards' | 'list';
export type SortOption = 'relevance' | 'alphabetical' | 'id';
export type HierarchyLevel = 'capability' | 'subcapability' | 'baseFunction' | 'functionality';

interface SearchAreaProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  hierarchyLevel: HierarchyLevel;
  onHierarchyLevelChange: (level: HierarchyLevel) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultsCount: number;
}

const filterOptions = [
  { id: 'informacion', label: 'Información', color: '#2196F3' },
  { id: 'documentos', label: 'Documentos', color: '#4CAF50' },
  { id: 'validacion', label: 'Validación', color: '#FF9800' },
  { id: 'gestion', label: 'Gestión', color: '#9C27B0' },
];

const hierarchyLevelOptions = [
  { id: 'capability', label: 'Capacidad', description: 'Vista por capacidades empresariales' },
  { id: 'subcapability', label: 'SubCapacidad', description: 'Vista por subcapacidades' },
  { id: 'baseFunction', label: 'Func. Base', description: 'Vista por funcionalidades base' },
  { id: 'functionality', label: 'Funcionalidades', description: 'Vista por funcionalidades' },
];

export function SearchArea({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  hierarchyLevel,
  onHierarchyLevelChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  resultsCount,
}: SearchAreaProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleFilterToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    onFilterChange([]);
  };

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: ViewMode | null,
  ) => {
    if (newView !== null) {
      onViewModeChange(newView);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: 'white', borderBottom: '1px solid #EBF0F2' }}>
      {/* Barra de búsqueda principal - Actualizada con especificación oficial */}
      <TextField
        fullWidth
        placeholder="¿Qué capacidad BIAN necesitas hoy?"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#5B6670' }} />
            </InputAdornment>
          ),
          sx: {
            height: '45px', // Actualizado según especificación oficial
            borderRadius: '4px', // Actualizado según especificación
            fontSize: '1rem',
            fontFamily: 'Roboto', // Contenido usa Roboto según especificación
          },
        }}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#5B6670',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#EB0029',
              borderWidth: '2px',
            },
            '&.Mui-focused': {
              outline: 'none',
            },
          },
          '& .MuiOutlinedInput-input': {
            '&:focus': {
              outline: 'none',
              boxShadow: 'none',
            },
          },
        }}
      />

      {/* Filtros y controles */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Filtros de nivel de jerarquía */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mr: 1, color: '#5B6670', fontWeight: 'medium' }}>
            Ver por:
          </Typography>

          {hierarchyLevelOptions.map((level) => (
            <Chip
              key={level.id}
              label={level.label}
              onClick={() => onHierarchyLevelChange(level.id as HierarchyLevel)}
              sx={{
                backgroundColor: hierarchyLevel === level.id ? '#EB0029' : '#EBF0F2',
                color: hierarchyLevel === level.id ? 'white' : '#323E48',
                fontFamily: 'Gotham',
                fontSize: '13px',
                height: '32px',
                cursor: 'pointer',
                fontWeight: hierarchyLevel === level.id ? '600' : '400',
                '&:hover': {
                  backgroundColor: hierarchyLevel === level.id ? '#E30028' : '#CFD2D3',
                },
              }}
            />
          ))}
        </Box>

        {/* Segunda fila: Filtros por categoría */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mr: 1, color: '#5B6670', fontWeight: 'medium' }}>
            Filtros:
          </Typography>
          
          {filterOptions.map((filter) => (
            <Chip
              key={filter.id}
              label={filter.label}
              onClick={() => handleFilterToggle(filter.id)}
              sx={{
                backgroundColor: selectedFilters.includes(filter.id) 
                  ? filter.color 
                  : '#EBF0F2',
                color: selectedFilters.includes(filter.id) 
                  ? 'white' 
                  : '#323E48',
                fontFamily: 'Gotham',
                fontSize: '13px',
                height: '32px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: selectedFilters.includes(filter.id)
                    ? filter.color
                    : '#CFD2D3',
                },
              }}
            />
          ))}

          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            sx={{
              ml: 1,
              height: '32px',
              fontSize: '0.75rem', // Actualizado según especificación
              textTransform: 'none',
              fontFamily: 'Gotham', // Botones usan Gotham
              borderColor: '#EB0029',
              color: '#EB0029',
              '&:hover': {
                borderColor: '#E30028',
                backgroundColor: 'rgba(235, 0, 41, 0.04)',
              },
            }}
          >
            Filtros avanzados
          </Button>

          {selectedFilters.length > 0 && (
            <Button
              variant="text"
              size="small"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              sx={{
                height: '32px',
                fontSize: '0.75rem', // Actualizado según especificación
                textTransform: 'none',
                fontFamily: 'Gotham', // Botones usan Gotham
                color: '#5B6670',
                '&:hover': {
                  backgroundColor: 'rgba(91, 102, 112, 0.04)',
                },
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </Box>

        {/* Tercera fila: Controles de vista y ordenamiento */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          {/* Contador de resultados */}
          <Typography variant="body2" sx={{ color: '#5B6670' }}>
            Mostrando 1-6 de {resultsCount} resultados
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Selector de ordenamiento */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#5B6670' }}>
                Ordenar por:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  sx={{
                    height: '32px',
                    fontSize: '13px',
                    fontFamily: 'Gotham',
                  }}
                >
                  <MenuItem value="relevance">Relevancia</MenuItem>
                  <MenuItem value="alphabetical">Alfabético</MenuItem>
                  <MenuItem value="id">ID</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Controles de vista */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  border: '1px solid #CFD2D3',
                  height: '32px',
                  width: '40px',
                  '&.Mui-selected': {
                    backgroundColor: '#EB0029',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#E30028',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="cards" aria-label="vista de tarjetas">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="vista de lista">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
