'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Capability } from '../../core/domain/entities/Capability';

interface CapabilityListProps {
  capabilities: Capability[];
  onViewDetails: (capability: Capability) => void;
  onAddToProject?: (capability: Capability) => void;
}

// Mapeo de categorías a colores (mismo que en CapabilityCard)
const categoryColors: Record<string, string> = {
  'informacion': '#2196F3',
  'documentos': '#4CAF50', 
  'gestion': '#9C27B0',
  'validacion': '#FF9800',
  'busqueda': '#4CAF50',
  'default': '#5B6670',
};

const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return categoryColors[normalizedCategory] || categoryColors.default;
};

const determineCategory = (capability: Capability): string => {
  const name = capability.name.toLowerCase();

  // Obtener descripción de las capacidades empresariales
  const businessDescriptions = capability.businessCapabilities
    .map(bc => bc.description.toLowerCase())
    .join(' ');

  if (name.includes('información') || businessDescriptions.includes('información')) {
    return 'informacion';
  }
  if (name.includes('documento') || businessDescriptions.includes('documento')) {
    return 'documentos';
  }
  if (name.includes('gestión') || name.includes('gestion') || businessDescriptions.includes('gestión')) {
    return 'gestion';
  }
  if (name.includes('validación') || name.includes('validacion') || businessDescriptions.includes('validación')) {
    return 'validacion';
  }
  if (name.includes('búsqueda') || name.includes('busqueda') || businessDescriptions.includes('búsqueda')) {
    return 'busqueda';
  }

  return 'default';
};

export function CapabilityList({ 
  capabilities, 
  onViewDetails, 
  onAddToProject 
}: CapabilityListProps) {
  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        boxShadow: 'none',
        border: '1px solid #EBF0F2',
        borderRadius: '8px',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F4F7F8' }}>
            <TableCell sx={{ fontFamily: 'Gotham', fontWeight: '600', color: '#323E48' }}>
              ID
            </TableCell>
            <TableCell sx={{ fontFamily: 'Gotham', fontWeight: '600', color: '#323E48' }}>
              Nombre
            </TableCell>
            <TableCell sx={{ fontFamily: 'Gotham', fontWeight: '600', color: '#323E48' }}>
              Categoría
            </TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Gotham', fontWeight: '600', color: '#323E48' }}>
              # Funcionalidades
            </TableCell>
            <TableCell align="center" sx={{ fontFamily: 'Gotham', fontWeight: '600', color: '#323E48' }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {capabilities.map((capability) => {
            const category = determineCategory(capability);
            const categoryColor = getCategoryColor(category);
            const functionalityCount = capability.getTotalFunctionalities();

            return (
              <TableRow
                key={capability.id.value}
                sx={{
                  '&:hover': {
                    backgroundColor: '#F4F7F8',
                    cursor: 'pointer',
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
                onClick={() => onViewDetails(capability)}
              >
                <TableCell>
                  <Chip
                    label={capability.id.value}
                    size="small"
                    sx={{
                      backgroundColor: '#F4F7F8',
                      color: '#5B6670',
                      fontSize: '12px',
                      fontFamily: 'Gotham',
                    }}
                  />
                </TableCell>
                
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Gotham',
                        fontWeight: '600',
                        color: '#323E48',
                        mb: 0.5,
                      }}
                    >
                      {capability.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#5B6670',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {capability.businessCapabilities.length > 0
                        ? capability.businessCapabilities[0].description
                        : `Capacidad con ${capability.getTotalBusinessCapabilities()} capacidades empresariales`}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                    size="small"
                    sx={{
                      backgroundColor: categoryColor,
                      color: 'white',
                      fontSize: '12px',
                      fontFamily: 'Gotham',
                      fontWeight: '500',
                    }}
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Gotham',
                      fontWeight: '600',
                      color: '#323E48',
                    }}
                  >
                    {functionalityCount}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <Tooltip title="Ver detalles">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(capability);
                        }}
                        sx={{
                          color: '#EB0029',
                          '&:hover': {
                            backgroundColor: 'rgba(235, 0, 41, 0.04)',
                          },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {onAddToProject && (
                      <Tooltip title="Agregar a proyecto">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToProject(capability);
                          }}
                          sx={{
                            color: '#4CAF50',
                            '&:hover': {
                              backgroundColor: 'rgba(76, 175, 80, 0.04)',
                            },
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
