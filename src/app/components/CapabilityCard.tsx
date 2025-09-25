'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Capability } from '../../core/domain/entities/Capability';
import { BusinessCapability } from '../../core/domain/entities/BusinessCapability';

interface CapabilityCardProps {
  businessCapability: BusinessCapability;
  parentCapability: Capability;
  onViewDetails: (capability: Capability) => void;
  onAddToProject?: (capability: Capability) => void;
}

// Mapeo de categorías a colores
const categoryColors: Record<string, string> = {
  'informacion': '#2196F3',
  'documentos': '#4CAF50', 
  'gestion': '#9C27B0',
  'validacion': '#FF9800',
  'busqueda': '#4CAF50',
  'default': '#5B6670',
};

// Función para obtener el color de la categoría
const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return categoryColors[normalizedCategory] || categoryColors.default;
};

// Función para determinar la categoría basada en la capacidad empresarial
const determineCategory = (businessCapability: BusinessCapability): string => {
  const name = businessCapability.name.toLowerCase();
  const description = businessCapability.description.toLowerCase();

  if (name.includes('información') || description.includes('información')) {
    return 'informacion';
  }
  if (name.includes('documento') || description.includes('documento')) {
    return 'documentos';
  }
  if (name.includes('gestión') || name.includes('gestion') || description.includes('gestión')) {
    return 'gestion';
  }
  if (name.includes('validación') || name.includes('validacion') || description.includes('validación')) {
    return 'validacion';
  }
  if (name.includes('búsqueda') || name.includes('busqueda') || description.includes('búsqueda')) {
    return 'busqueda';
  }
  if (name.includes('oferta') || description.includes('oferta')) {
    return 'gestion';
  }
  if (name.includes('contratación') || description.includes('contratación')) {
    return 'gestion';
  }

  return 'default';
};

export function CapabilityCard({
  businessCapability,
  parentCapability,
  onViewDetails,
  onAddToProject
}: CapabilityCardProps) {
  const category = determineCategory(businessCapability);
  const categoryColor = getCategoryColor(category);
  const subCapabilityCount = businessCapability.subCapabilities.length;
  const functionalityCount = businessCapability.subCapabilities.reduce((total, sub) => total + sub.functionalities.length, 0);

  return (
    <Card
      sx={{
        borderRadius: '8px',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
        border: '1px solid #CFD2D3',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={() => onViewDetails(parentCapability)}
    >
      <CardHeader
        title={businessCapability.name}
        action={
          <Chip
            label={businessCapability.id}
            size="small"
            sx={{
              backgroundColor: '#F4F7F8',
              color: '#5B6670',
              fontSize: '12px',
              fontFamily: 'Gotham',
            }}
          />
        }
        titleTypographyProps={{
          fontFamily: 'Gotham',
          fontSize: '16px',
          fontWeight: '600',
          color: '#323E48',
        }}
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            fontSize: '14px',
          }}
        >
          {businessCapability.description || `Capacidad empresarial con ${subCapabilityCount} subcapacidades`}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
          
          <Typography
            variant="caption"
            sx={{
              color: '#5B6670',
              fontSize: '12px',
            }}
          >
            {functionalityCount} funcionalidades
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {businessCapability.subCapabilities.slice(0, 3).map((subCap) => (
            <Chip
              key={subCap.id}
              label={subCap.name}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '11px',
                height: '24px',
                borderColor: '#CFD2D3',
                color: '#5B6670',
              }}
            />
          ))}
          {businessCapability.subCapabilities.length > 3 && (
            <Chip
              label={`+${businessCapability.subCapabilities.length - 3} más`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: '11px',
                height: '24px',
                borderColor: '#CFD2D3',
                color: '#5B6670',
              }}
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(parentCapability);
          }}
          sx={{
            borderColor: '#EB0029',
            color: '#EB0029',
            fontSize: '13px',
            textTransform: 'none',
            fontFamily: 'Gotham',
            '&:hover': {
              backgroundColor: 'rgba(235, 0, 41, 0.04)',
            },
          }}
        >
          Ver más
        </Button>
        
        {onAddToProject && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.stopPropagation();
              onAddToProject(parentCapability);
            }}
            sx={{
              backgroundColor: '#EB0029',
              fontSize: '13px',
              textTransform: 'none',
              fontFamily: 'Gotham',
              '&:hover': {
                backgroundColor: '#E30028',
              },
            }}
          >
            Agregar
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
