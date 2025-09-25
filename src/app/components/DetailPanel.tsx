'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Compare as CompareIcon,
  GetApp as ExportIcon,
  Share as ShareIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { Capability } from '../../core/domain/entities/Capability';
import { BusinessCapability } from '../../core/domain/entities/BusinessCapability';
import { SubCapability } from '../../core/domain/entities/SubCapability';
import { Functionality } from '../../core/domain/entities/Functionality';
import { HierarchyLevel } from './SearchArea';

interface DetailPanelProps {
  open: boolean;
  capability: Capability | null;
  selectedItem?: {
    level: HierarchyLevel;
    item: Capability | BusinessCapability | SubCapability | Functionality;
    businessParent?: BusinessCapability;
    subParent?: SubCapability;
  };
  onClose: () => void;
  onAddToProject?: (capability: Capability) => void;
}

export function DetailPanel({
  open,
  capability,
  selectedItem,
  onClose,
  onAddToProject
}: DetailPanelProps) {
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  // Generar breadcrumbs basado en el item seleccionado
  const generateBreadcrumbs = () => {
    if (!selectedItem) {
      return [
        { label: 'Inicio', active: false },
        { label: 'Capacidades', active: false },
        { label: capability?.name || '', active: true }
      ];
    }

    const breadcrumbs = [
      { label: 'Inicio', active: false },
      { label: 'Capacidades', active: false }
    ];

    switch (selectedItem.level) {
      case 'capability':
        breadcrumbs.push({ label: (selectedItem.item as Capability).name, active: true });
        break;
      case 'business':
        breadcrumbs.push(
          { label: capability?.name || '', active: false },
          { label: (selectedItem.item as BusinessCapability).name, active: true }
        );
        break;
      case 'subcapability':
        breadcrumbs.push(
          { label: capability?.name || '', active: false },
          { label: selectedItem.businessParent?.name || '', active: false },
          { label: (selectedItem.item as SubCapability).name, active: true }
        );
        break;
      case 'functionality':
        breadcrumbs.push(
          { label: capability?.name || '', active: false },
          { label: selectedItem.businessParent?.name || '', active: false },
          { label: selectedItem.subParent?.name || '', active: false },
          { label: (selectedItem.item as Functionality).name, active: true }
        );
        break;
    }

    return breadcrumbs;
  };

  // Obtener información principal a mostrar
  const getMainContent = () => {
    if (!selectedItem) {
      return {
        title: capability?.name || '',
        id: capability?.id.value || '',
        description: capability?.businessCapabilities.length > 0
          ? capability.businessCapabilities[0].description
          : 'Capacidad BIAN sin descripción detallada disponible.',
        type: 'Capacidad'
      };
    }

    const { item, level } = selectedItem;

    switch (level) {
      case 'capability':
        const cap = item as Capability;
        return {
          title: cap.name,
          id: cap.id.value,
          description: cap.businessCapabilities.length > 0
            ? cap.businessCapabilities[0].description
            : 'Capacidad BIAN sin descripción detallada disponible.',
          type: 'Capacidad'
        };
      case 'business':
        const business = item as BusinessCapability;
        return {
          title: business.name,
          id: business.id,
          description: business.description || 'Capacidad empresarial sin descripción.',
          type: 'Capacidad Empresarial'
        };
      case 'subcapability':
        const sub = item as SubCapability;
        return {
          title: sub.name,
          id: sub.id,
          description: sub.description || 'Subcapacidad sin descripción.',
          type: 'Subcapacidad'
        };
      case 'functionality':
        const func = item as Functionality;
        return {
          title: func.name,
          id: func.id,
          description: func.description || 'Funcionalidad sin descripción.',
          type: 'Funcionalidad'
        };
      default:
        return {
          title: capability?.name || '',
          id: capability?.id.value || '',
          description: 'Sin descripción disponible.',
          type: 'Elemento'
        };
    }
  };

  if (!capability) return null;

  const breadcrumbs = generateBreadcrumbs();
  const mainContent = getMainContent();

  const functionalityCount = capability.getTotalFunctionalities();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          padding: '24px',
          top: '63px', // Altura del header
          height: 'calc(100vh - 63px)',
        },
      }}
    >
      {/* Header del panel */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Gotham',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#323E48',
              mb: 1,
            }}
          >
            {mainContent.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={mainContent.type}
              size="small"
              sx={{
                backgroundColor: '#EB0029',
                color: 'white',
                fontSize: '12px',
                fontFamily: 'Gotham',
                fontWeight: '500',
              }}
            />
            <Chip
              label={mainContent.id}
              size="small"
              sx={{
                backgroundColor: '#F4F7F8',
                color: '#5B6670',
                fontSize: '12px',
                fontFamily: 'Gotham',
              }}
            />
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#5B6670' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{
          mb: 3,
          '& .MuiBreadcrumbs-li': {
            fontSize: '14px',
            color: '#5B6670',
          },
        }}
      >
        {breadcrumbs.map((breadcrumb, index) =>
          breadcrumb.active ? (
            <Typography key={index} color="text.primary" sx={{ fontSize: '14px', fontWeight: '500' }}>
              {breadcrumb.label}
            </Typography>
          ) : (
            <Link key={index} underline="hover" color="inherit" href="#" onClick={(e) => e.preventDefault()}>
              {breadcrumb.label}
            </Link>
          )
        )}
      </Breadcrumbs>

      {/* Información general */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Gotham',
            fontSize: '16px',
            fontWeight: '600',
            color: '#323E48',
            mb: 2,
          }}
        >
          Descripción Detallada
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#5B6670',
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {mainContent.description}
        </Typography>
        
        {/* Stats chips dinámicos */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {selectedItem ? (
            (() => {
              switch (selectedItem.level) {
                case 'capability':
                  const cap = selectedItem.item as Capability;
                  return (
                    <>
                      <Chip
                        label={`${cap.getTotalBusinessCapabilities()} capacidades empresariales`}
                        size="small"
                        sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
                      />
                      <Chip
                        label={`${cap.getTotalFunctionalities()} funcionalidades`}
                        size="small"
                        sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
                      />
                    </>
                  );
                case 'business':
                  const business = selectedItem.item as BusinessCapability;
                  const businessFuncCount = business.subCapabilities.reduce((total, sub) => total + sub.functionalities.length, 0);
                  return (
                    <>
                      <Chip
                        label={`${business.subCapabilities.length} subcapacidades`}
                        size="small"
                        sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
                      />
                      <Chip
                        label={`${businessFuncCount} funcionalidades`}
                        size="small"
                        sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
                      />
                    </>
                  );
                case 'subcapability':
                  const sub = selectedItem.item as SubCapability;
                  return (
                    <Chip
                      label={`${sub.functionalities.length} funcionalidades`}
                      size="small"
                      sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
                    />
                  );
                case 'functionality':
                  return (
                    <Chip
                      label="Funcionalidad específica"
                      size="small"
                      sx={{ backgroundColor: '#4CAF50', color: 'white' }}
                    />
                  );
                default:
                  return null;
              }
            })()
          ) : (
            <>
              <Chip
                label={`${capability.getTotalBusinessCapabilities()} capacidades empresariales`}
                size="small"
                sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
              />
              <Chip
                label={`${functionalityCount} funcionalidades`}
                size="small"
                sx={{ backgroundColor: '#EBF0F2', color: '#5B6670' }}
              />
            </>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Lista de subcapacidades y funcionalidades */}
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'Gotham',
          fontSize: '16px',
          fontWeight: '600',
          color: '#323E48',
          mb: 2,
        }}
      >
        Funcionalidades
      </Typography>

      <Box sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto' }}>
        {capability.businessCapabilities.map((businessCapability, index) => (
          <Accordion
            key={businessCapability.id}
            expanded={expandedAccordion === `panel${index}`}
            onChange={handleAccordionChange(`panel${index}`)}
            sx={{
              boxShadow: 'none',
              border: '1px solid #EBF0F2',
              '&:before': { display: 'none' },
              '&:not(:last-child)': { mb: 1 },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                fontFamily: 'Gotham',
                fontSize: '14px',
                fontWeight: '500',
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography sx={{ fontWeight: '500', flex: 1 }}>
                  {businessCapability.name}
                </Typography>
                <Chip
                  label={businessCapability.subCapabilities.length}
                  size="small"
                  sx={{
                    backgroundColor: '#EBF0F2',
                    color: '#5B6670',
                    fontSize: '11px',
                    height: '20px',
                    mr: 1,
                  }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Typography variant="body2" sx={{ color: '#5B6670', mb: 2, fontSize: '13px' }}>
                {businessCapability.description}
              </Typography>
              <List dense sx={{ py: 0 }}>
                {businessCapability.subCapabilities.map((subCapability) => (
                  <Box key={subCapability.id} sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0, py: 0.5, bgcolor: '#F8F9FA', borderRadius: 1 }}>
                      <ListItemText
                        primary={subCapability.name}
                        secondary={`${subCapability.id} • ${subCapability.functionalities.length} funcionalidades`}
                        primaryTypographyProps={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#323E48',
                        }}
                        secondaryTypographyProps={{
                          fontSize: '11px',
                          color: '#5B6670',
                        }}
                      />
                    </ListItem>
                    {subCapability.functionalities.length > 0 && (
                      <Box sx={{ ml: 2, mt: 1 }}>
                        {subCapability.functionalities.map((functionality) => (
                          <Box key={functionality.id} sx={{ mb: 1, p: 1, bgcolor: '#FAFBFC', borderRadius: 1, border: '1px solid #EBF0F2' }}>
                            <Typography sx={{ fontSize: '12px', fontWeight: '500', color: '#323E48', mb: 0.5 }}>
                              {functionality.name}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', color: '#5B6670', mb: 0.5 }}>
                              ID: {functionality.id}
                            </Typography>
                            <Typography sx={{ fontSize: '11px', color: '#5B6670', lineHeight: 1.4 }}>
                              {functionality.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Metadatos */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Gotham',
            fontSize: '14px',
            fontWeight: '600',
            color: '#323E48',
            mb: 2,
          }}
        >
          Metadatos
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: '#5B6670' }}>
              Última actualización:
            </Typography>
            <Typography variant="caption" sx={{ color: '#323E48', fontWeight: '500' }}>
              {capability.updatedAt.toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: '#5B6670' }}>
              Versión BIAN:
            </Typography>
            <Typography variant="caption" sx={{ color: '#323E48', fontWeight: '500' }}>
              12.0
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: '#5B6670' }}>
              Estado:
            </Typography>
            <Chip
              label="Activo"
              size="small"
              sx={{
                backgroundColor: '#4CAF50',
                color: 'white',
                fontSize: '10px',
                height: '18px',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Botones de acción */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 'auto' }}>
        {onAddToProject && (
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => onAddToProject(capability)}
            sx={{
              backgroundColor: '#EB0029',
              height: '45px',
              borderRadius: '4px',
              fontFamily: 'Gotham',
              fontSize: '15px',
              fontWeight: 'medium',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#E30028',
              },
            }}
          >
            Agregar a Mi Proyecto
          </Button>
        )}
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CompareIcon />}
            sx={{
              flex: 1,
              borderColor: '#EB0029',
              color: '#EB0029',
              fontSize: '13px',
              textTransform: 'none',
              fontFamily: 'Gotham',
            }}
          >
            Comparar
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ExportIcon />}
            sx={{
              flex: 1,
              borderColor: '#EB0029',
              color: '#EB0029',
              fontSize: '13px',
              textTransform: 'none',
              fontFamily: 'Gotham',
            }}
          >
            Exportar
          </Button>
        </Box>
        
        <Button
          variant="text"
          size="small"
          startIcon={<ShareIcon />}
          sx={{
            color: '#5B6670',
            fontSize: '13px',
            textTransform: 'none',
            fontFamily: 'Gotham',
          }}
        >
          Compartir con Equipo
        </Button>
      </Box>
    </Drawer>
  );
}
