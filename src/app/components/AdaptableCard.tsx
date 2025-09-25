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
import { SubCapability } from '../../core/domain/entities/SubCapability';
import { Functionality } from '../../core/domain/entities/Functionality';
import { HierarchyLevel } from './SearchArea';

interface AdaptableCardProps {
  hierarchyLevel: HierarchyLevel;
  data: {
    item: Capability | BusinessCapability | SubCapability | Functionality;
    parent?: Capability;
    businessParent?: BusinessCapability;
    subParent?: SubCapability;
  };
  onViewDetails: (capability: Capability, context?: {
    level: HierarchyLevel;
    item: Capability | BusinessCapability | SubCapability | Functionality;
    businessParent?: BusinessCapability;
    subParent?: SubCapability;
  }) => void;
  onAddToProject?: (capability: Capability) => void;
}

// Mapeo de categorías a colores
const categoryColors: Record<string, string> = {
  'informacion': '#2196F3',
  'documentos': '#4CAF50',
  'gestion': '#9C27B0',
  'validacion': '#FF9800',
  'busqueda': '#4CAF50',
  'oferta': '#9C27B0',
  'contratación': '#9C27B0',
  'default': '#5B6670',
};

// Función para obtener el color de la categoría
const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return categoryColors[normalizedCategory] || categoryColors.default;
};

// Función para determinar la categoría basada en el contenido
const determineCategory = (name: string, description?: string): string => {
  const nameText = name.toLowerCase();
  const descText = description?.toLowerCase() || '';

  if (nameText.includes('información') || descText.includes('información')) {
    return 'informacion';
  }
  if (nameText.includes('documento') || descText.includes('documento')) {
    return 'documentos';
  }
  if (nameText.includes('gestión') || nameText.includes('gestion') || descText.includes('gestión')) {
    return 'gestion';
  }
  if (nameText.includes('validación') || nameText.includes('validacion') || descText.includes('validación')) {
    return 'validacion';
  }
  if (nameText.includes('búsqueda') || nameText.includes('busqueda') || descText.includes('búsqueda')) {
    return 'busqueda';
  }
  if (nameText.includes('oferta') || descText.includes('oferta')) {
    return 'oferta';
  }
  if (nameText.includes('contratación') || descText.includes('contratación')) {
    return 'contratación';
  }

  return 'default';
};

export function AdaptableCard({
  hierarchyLevel,
  data,
  onViewDetails,
  onAddToProject
}: AdaptableCardProps) {
  const { item, parent, businessParent, subParent } = data;

  const renderCapabilityCard = (capability: Capability) => {
    const category = determineCategory(capability.name);
    const categoryColor = getCategoryColor(category);
    const businessCapabilityCount = capability.getTotalBusinessCapabilities();
    const functionalityCount = capability.getTotalFunctionalities();

    return {
      title: capability.name,
      id: capability.id.value,
      description: capability.businessCapabilities.length > 0
        ? capability.businessCapabilities[0].description
        : `Capacidad con ${businessCapabilityCount} capacidades empresariales`,
      category,
      categoryColor,
      stats: `${functionalityCount} funcionalidades`,
      chips: capability.businessCapabilities.slice(0, 2).map(bc => bc.name),
      extraCount: capability.businessCapabilities.length > 2 ? capability.businessCapabilities.length - 2 : 0,
      targetCapability: capability
    };
  };

  const renderBusinessCapabilityCard = (businessCapability: BusinessCapability) => {
    const category = determineCategory(businessCapability.name, businessCapability.description);
    const categoryColor = getCategoryColor(category);
    const subCapabilityCount = businessCapability.subCapabilities.length;
    const functionalityCount = businessCapability.subCapabilities.reduce((total, sub) => total + sub.functionalities.length, 0);

    return {
      title: businessCapability.name,
      id: businessCapability.id,
      description: businessCapability.description || `Capacidad empresarial con ${subCapabilityCount} subcapacidades`,
      category,
      categoryColor,
      stats: `${functionalityCount} funcionalidades`,
      chips: businessCapability.subCapabilities.slice(0, 3).map(sub => sub.name),
      extraCount: businessCapability.subCapabilities.length > 3 ? businessCapability.subCapabilities.length - 3 : 0,
      targetCapability: parent!
    };
  };

  const renderSubCapabilityCard = (subCapability: SubCapability) => {
    const category = determineCategory(subCapability.name, subCapability.description);
    const categoryColor = getCategoryColor(category);
    const functionalityCount = subCapability.functionalities.length;

    return {
      title: subCapability.name,
      id: subCapability.id,
      description: subCapability.description || `Subcapacidad con ${functionalityCount} funcionalidades`,
      category,
      categoryColor,
      stats: `${functionalityCount} funcionalidades`,
      chips: subCapability.functionalities.slice(0, 3).map(func => func.name),
      extraCount: subCapability.functionalities.length > 3 ? subCapability.functionalities.length - 3 : 0,
      targetCapability: parent!
    };
  };

  const renderFunctionalityCard = (functionality: Functionality) => {
    const category = determineCategory(functionality.name, functionality.description);
    const categoryColor = getCategoryColor(category);

    return {
      title: functionality.name,
      id: functionality.id,
      description: functionality.description || 'Funcionalidad del sistema',
      category,
      categoryColor,
      stats: 'Funcionalidad',
      chips: [],
      extraCount: 0,
      targetCapability: parent!
    };
  };

  // Determinar qué tipo de tarjeta renderizar
  let cardData;
  switch (hierarchyLevel) {
    case 'capability':
      cardData = renderCapabilityCard(item as Capability);
      break;
    case 'business':
      cardData = renderBusinessCapabilityCard(item as BusinessCapability);
      break;
    case 'subcapability':
      cardData = renderSubCapabilityCard(item as SubCapability);
      break;
    case 'functionality':
      cardData = renderFunctionalityCard(item as Functionality);
      break;
    default:
      cardData = renderBusinessCapabilityCard(item as BusinessCapability);
  }

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
      onClick={() => onViewDetails(cardData.targetCapability, {
        level: hierarchyLevel,
        item: item,
        businessParent: businessParent,
        subParent: subParent
      })}
    >
      <CardHeader
        title={cardData.title}
        action={
          <Chip
            label={cardData.id}
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
          {cardData.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={cardData.category.charAt(0).toUpperCase() + cardData.category.slice(1)}
            size="small"
            sx={{
              backgroundColor: cardData.categoryColor,
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
            {cardData.stats}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {cardData.chips.map((chipText, index) => (
            <Chip
              key={index}
              label={chipText}
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
          {cardData.extraCount > 0 && (
            <Chip
              label={`+${cardData.extraCount} más`}
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
            onViewDetails(cardData.targetCapability, {
              level: hierarchyLevel,
              item: item,
              businessParent: businessParent,
              subParent: subParent
            });
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
              onAddToProject(cardData.targetCapability);
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