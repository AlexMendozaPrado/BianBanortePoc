'use client';

import React, { useState, useMemo } from 'react';
import {
  Drawer,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Folder as FolderIcon,
  Category as CategoryIcon,
  Functions as FunctionsIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { CapabilityGroup } from '../../core/domain/entities/CapabilityGroup';
import { BaseFunction } from '../../core/domain/entities/BaseFunction';
import { Functionality } from '../../core/domain/entities/Functionality';
import { FunctionalitiesModal } from './FunctionalitiesModal';

interface SidebarProps {
  capabilityGroups: CapabilityGroup[];
  onCapabilitySelect: (capabilityId: string) => void;
  onSubCapabilitySelect: (capabilityId: string, subCapabilityId: string) => void;
  onFunctionalitySelect: (capabilityId: string, subCapabilityId: string, functionalityId: string) => void;
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function Sidebar({
  capabilityGroups,
  onCapabilitySelect,
  onSubCapabilitySelect,
  onFunctionalitySelect,
  open,
  onClose,
  isMobile,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);

  // Estado para el modal de funcionalidades
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBaseFunction, setSelectedBaseFunction] = useState<BaseFunction | null>(null);
  const [modalBreadcrumb, setModalBreadcrumb] = useState({
    groupName: '',
    capabilityName: '',
    subCapabilityName: '',
  });

  const handleOpenModal = (
    baseFunction: BaseFunction,
    groupName: string,
    capabilityName: string,
    subCapabilityName: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setSelectedBaseFunction(baseFunction);
    setModalBreadcrumb({ groupName, capabilityName, subCapabilityName });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBaseFunction(null);
  };

  const handleFunctionalitySelectFromModal = (functionality: Functionality) => {
    // Encontrar la información necesaria para llamar onFunctionalitySelect
    if (selectedBaseFunction) {
      // Buscar la capacidad y subcapacidad que contienen esta funcionalidad
      for (const group of capabilityGroups) {
        for (const capability of group.capabilities) {
          for (const subCap of capability.subCapabilities) {
            if (subCap.baseFunctions.some(bf => bf.id === selectedBaseFunction.id)) {
              onFunctionalitySelect(capability.id.value, subCap.id, functionality.id);
              return;
            }
          }
        }
      }
    }
  };

  // Filtrar grupos de capacidades basado en el término de búsqueda (nueva estructura v2.0)
  const filteredCapabilityGroups = useMemo(() => {
    if (!capabilityGroups || capabilityGroups.length === 0) return [];
    if (!searchTerm) return capabilityGroups;

    return capabilityGroups.filter(group => {
      const searchLower = searchTerm.toLowerCase();
      const groupNameMatch = group.name.toLowerCase().includes(searchLower);

      // Buscar en capacidades del grupo
      const capabilityMatch = group.capabilities.some(capability => {
        const nameMatch = capability.name.toLowerCase().includes(searchLower);

        // Buscar en subcapacidades
        const subCapMatch = capability.subCapabilities.some(sc =>
          sc.name.toLowerCase().includes(searchLower) ||
          sc.description.toLowerCase().includes(searchLower) ||
          sc.baseFunctions.some(bf =>
            bf.name.toLowerCase().includes(searchLower) ||
            bf.functionalities.some(func =>
              func.name.toLowerCase().includes(searchLower)
            )
          )
        );

        return nameMatch || subCapMatch;
      });

      return groupNameMatch || capabilityMatch;
    });
  }, [capabilityGroups, searchTerm]);

  const handleSelect = (_: React.SyntheticEvent, nodeId: string) => {
    const parts = nodeId.split('-');

    if (parts.includes('group') && parts.length === 2) {
      // Grupo seleccionado - no hacemos nada especial, solo expandir/contraer
      return;
    } else if (parts.includes('cap') && !parts.includes('sub')) {
      // Capacidad seleccionada (ej: "group-0-cap-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const group = capabilityGroups[groupIndex];
      if (group && group.capabilities[capIndex]) {
        const capability = group.capabilities[capIndex];
        onCapabilitySelect(capability.id.value);
      }
    } else if (parts.includes('sub') && !parts.includes('base')) {
      // Subcapacidad seleccionada (ej: "group-0-cap-0-sub-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const subIndex = parseInt(parts[5]);
      const group = capabilityGroups[groupIndex];

      if (group && group.capabilities[capIndex] &&
          group.capabilities[capIndex].subCapabilities[subIndex]) {

        const capability = group.capabilities[capIndex];
        const subCapability = capability.subCapabilities[subIndex];
        onSubCapabilitySelect(capability.id.value, subCapability.id);
      }
    } else if (parts.includes('base') && !parts.includes('func')) {
      // BaseFunction seleccionada (ej: "group-0-cap-0-sub-0-base-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const subIndex = parseInt(parts[5]);
      const group = capabilityGroups[groupIndex];

      if (group && group.capabilities[capIndex] &&
          group.capabilities[capIndex].subCapabilities[subIndex]) {

        const capability = group.capabilities[capIndex];
        onCapabilitySelect(capability.id.value);
      }
    } else if (parts.includes('func')) {
      // Funcionalidad seleccionada (ej: "group-0-cap-0-sub-0-base-0-func-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const subIndex = parseInt(parts[5]);
      const baseIndex = parseInt(parts[7]);
      const funcIndex = parseInt(parts[9]);
      const group = capabilityGroups[groupIndex];

      if (group && group.capabilities[capIndex] &&
          group.capabilities[capIndex].subCapabilities[subIndex] &&
          group.capabilities[capIndex].subCapabilities[subIndex].baseFunctions[baseIndex] &&
          group.capabilities[capIndex].subCapabilities[subIndex].baseFunctions[baseIndex].functionalities[funcIndex]) {

        const capability = group.capabilities[capIndex];
        const subCapability = capability.subCapabilities[subIndex];
        const functionality = subCapability.baseFunctions[baseIndex].functionalities[funcIndex];
        onFunctionalitySelect(capability.id.value, subCapability.id, functionality.id);
      }
    }
  };

  const renderTreeItems = (capabilityGroups: CapabilityGroup[]) => {
    if (!capabilityGroups || capabilityGroups.length === 0) {
      return [];
    }

    return capabilityGroups.map((group, groupIndex) => {
      const groupId = `group-${groupIndex}`;

      return (
        <TreeItem
          key={groupId}
          itemId={groupId}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
              <FolderIcon sx={{ mr: 1, fontSize: 18, color: '#EB0029' }} />
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#EB0029' }}>
                {group.name}
              </Typography>
              <Chip
                label={group.capabilities?.length || 0}
                size="small"
                sx={{
                  ml: 'auto',
                  height: 22,
                  fontSize: '11px',
                  backgroundColor: '#EB0029',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            </Box>
          }
          sx={{
            '& .MuiTreeItem-content': {
              padding: '6px 8px',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(235, 0, 41, 0.05)',
              },
            },
          }}
        >
          {group.capabilities?.map((capability, capIndex) => {
            const capabilityId = `group-${groupIndex}-cap-${capIndex}`;

            return (
              <TreeItem
                key={capabilityId}
                itemId={capabilityId}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                    <FolderIcon sx={{ mr: 1, fontSize: 16, color: '#5B6670' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {capability.name}
                    </Typography>
                    <Chip
                      label={capability.subCapabilities?.length || 0}
                      size="small"
                      sx={{
                        ml: 'auto',
                        height: 20,
                        fontSize: '11px',
                        backgroundColor: '#EBF0F2',
                        color: '#5B6670',
                      }}
                    />
                  </Box>
                }
                sx={{
                  '& .MuiTreeItem-content': {
                    padding: '4px 8px',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#EBF0F2',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#EB0029 !important',
                      color: 'white',
                      '& .MuiTypography-root': {
                        color: 'white',
                      },
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                      '& .MuiChip-root': {
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                      },
                    },
                  },
                }}
              >
                {capability.subCapabilities?.map((subCapability, subIndex) => {
                  const subCapabilityId = `group-${groupIndex}-cap-${capIndex}-sub-${subIndex}`;
                  const totalFuncs = subCapability.baseFunctions?.reduce(
                    (acc, bf) => acc + (bf.functionalities?.length || 0), 0
                  ) || 0;

                  return (
                    <TreeItem
                      key={subCapabilityId}
                      itemId={subCapabilityId}
                      label={
                        <Tooltip title={subCapability.description || subCapability.name} arrow placement="right">
                          <span style={{ display: 'flex', alignItems: 'center', padding: '4px 0', width: '100%' }}>
                            <CategoryIcon sx={{ mr: 1, fontSize: 16, color: '#1976d2' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, minWidth: 0 }} noWrap>
                              {subCapability.name}
                            </Typography>
                            <Chip
                              label={`${subCapability.baseFunctions?.length || 0} / ${totalFuncs}`}
                              size="small"
                              sx={{
                                ml: 1,
                                height: 20,
                                fontSize: '10px',
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 'bold',
                                '& .MuiChip-label': { px: 1 },
                              }}
                            />
                          </span>
                        </Tooltip>
                      }
                      sx={{
                        ml: 1,
                        '& .MuiTreeItem-content': {
                          padding: '4px 8px',
                          borderRadius: '4px',
                          borderLeft: '2px solid #1976d2',
                          '&:hover': {
                            backgroundColor: '#e3f2fd',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#1976d2 !important',
                            color: 'white',
                            '& .MuiTypography-root': { color: 'white' },
                            '& .MuiSvgIcon-root': { color: 'white' },
                            '& .MuiChip-root': {
                              backgroundColor: 'rgba(255,255,255,0.25)',
                              color: 'white',
                            },
                          },
                        },
                      }}
                    >
                      {subCapability.baseFunctions?.map((baseFunction, baseIndex) => {
                        const baseFunctionId = `group-${groupIndex}-cap-${capIndex}-sub-${subIndex}-base-${baseIndex}`;
                        const funcCount = baseFunction.functionalities?.length || 0;

                        return (
                          <TreeItem
                            key={baseFunctionId}
                            itemId={baseFunctionId}
                            label={
                              <Tooltip title={baseFunction.description || `${funcCount} funcionalidades`} arrow placement="right">
                                <span style={{ display: 'flex', alignItems: 'center', padding: '4px 0', width: '100%' }}>
                                  <FunctionsIcon sx={{ mr: 1, fontSize: 16, color: '#7b1fa2' }} />
                                  <Typography variant="body2" sx={{ fontWeight: 500, flex: 1, minWidth: 0 }} noWrap>
                                    {baseFunction.name}
                                  </Typography>
                                  <Chip
                                    label={funcCount}
                                    size="small"
                                    sx={{
                                      mr: 0.5,
                                      height: 20,
                                      fontSize: '10px',
                                      backgroundColor: '#f3e5f5',
                                      color: '#7b1fa2',
                                      fontWeight: 'bold',
                                      minWidth: 24,
                                      '& .MuiChip-label': { px: 0.75 },
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleOpenModal(
                                      baseFunction,
                                      group.name,
                                      capability.name,
                                      subCapability.name,
                                      e
                                    )}
                                    sx={{
                                      p: 0.25,
                                      color: '#7b1fa2',
                                      '&:hover': {
                                        backgroundColor: 'rgba(123, 31, 162, 0.1)',
                                      },
                                    }}
                                  >
                                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                                  </IconButton>
                                </span>
                              </Tooltip>
                            }
                            sx={{
                              ml: 1,
                              '& .MuiTreeItem-content': {
                                padding: '4px 8px',
                                borderRadius: '4px',
                                borderLeft: '2px solid #7b1fa2',
                                '&:hover': {
                                  backgroundColor: '#f3e5f5',
                                },
                                '&.Mui-selected': {
                                  backgroundColor: '#7b1fa2 !important',
                                  color: 'white',
                                  '& .MuiTypography-root': { color: 'white' },
                                  '& .MuiSvgIcon-root': { color: 'white' },
                                  '& .MuiChip-root': {
                                    backgroundColor: 'rgba(255,255,255,0.25)',
                                    color: 'white',
                                  },
                                  '& .MuiIconButton-root': {
                                    color: 'white',
                                  },
                                },
                              },
                            }}
                          />
                        );
                      })}
                    </TreeItem>
                  );
                })}
              </TreeItem>
            );
          })}
        </TreeItem>
      );
    });
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? open : true}
      onClose={isMobile ? onClose : undefined}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: '#F4F7F8',
          borderRight: '1px solid #CFD2D3',
          top: isMobile ? 0 : '63px', // Altura del header
          height: isMobile ? '100vh' : 'calc(100vh - 63px)',
          zIndex: isMobile ? 1300 : 1200,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Campo de búsqueda */}
        <TextField
          fullWidth
          placeholder="Filtrar navegación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#5B6670', fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: {
              height: '45px',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'Gotham',
              backgroundColor: 'white',
            },
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#CFD2D3',
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

        {/* TreeView de navegación */}
        <SimpleTreeView
          expandedItems={expanded}
          onExpandedItemsChange={(_, itemIds) => setExpanded(itemIds)}
          onSelectedItemsChange={(event, itemId) => {
            if (itemId && event) {
              handleSelect(event, itemId as string);
            }
          }}
          sx={{
            '& .MuiTreeItem-root': {
              '& .MuiTreeItem-content': {
                fontFamily: 'Gotham',
                fontSize: '14px',
                color: '#323E48',
              },
            },
          }}
        >
          {filteredCapabilityGroups && renderTreeItems(filteredCapabilityGroups)}
        </SimpleTreeView>
      </Box>

      {/* Modal de funcionalidades */}
      <FunctionalitiesModal
        open={modalOpen}
        onClose={handleCloseModal}
        baseFunction={selectedBaseFunction}
        breadcrumb={modalBreadcrumb}
        onFunctionalitySelect={handleFunctionalitySelectFromModal}
      />
    </Drawer>
  );
}
