'use client';

import React, { useState, useMemo } from 'react';
import {
  Drawer,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Capability } from '../../core/domain/entities/Capability';
import { CapabilityGroup } from '../../core/domain/entities/CapabilityGroup';

interface SidebarProps {
  capabilityGroups: CapabilityGroup[];
  selectedCapabilityId?: string;
  onCapabilitySelect: (capabilityId: string) => void;
  onSubCapabilitySelect: (capabilityId: string, subCapabilityId: string) => void;
  onFunctionalitySelect: (capabilityId: string, subCapabilityId: string, functionalityId: string) => void;
  open: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export function Sidebar({
  capabilityGroups,
  selectedCapabilityId,
  onCapabilitySelect,
  onSubCapabilitySelect,
  onFunctionalitySelect,
  open,
  onClose,
  isMobile,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);

  // Filtrar grupos de capacidades basado en el término de búsqueda
  const filteredCapabilityGroups = useMemo(() => {
    if (!capabilityGroups || capabilityGroups.length === 0) return [];
    if (!searchTerm) return capabilityGroups;

    return capabilityGroups.filter(group => {
      const searchLower = searchTerm.toLowerCase();
      const groupNameMatch = group.name.toLowerCase().includes(searchLower);

      // Buscar en capacidades del grupo
      const capabilityMatch = group.capabilities.some(capability => {
        const nameMatch = capability.name.toLowerCase().includes(searchLower);

        // Buscar en capacidades empresariales
        const businessMatch = capability.businessCapabilities.some(bc =>
          bc.name.toLowerCase().includes(searchLower) ||
          bc.description.toLowerCase().includes(searchLower) ||
          bc.subCapabilities.some(sub =>
            sub.name.toLowerCase().includes(searchLower) ||
            sub.functionalities.some(func =>
              func.name.toLowerCase().includes(searchLower)
            )
          )
        );

        return nameMatch || businessMatch;
      });

      return groupNameMatch || capabilityMatch;
    });
  }, [capabilityGroups, searchTerm]);

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    const parts = nodeId.split('-');

    if (parts.includes('group')) {
      // Grupo seleccionado - no hacemos nada especial, solo expandir/contraer
      return;
    } else if (parts.includes('cap') && !parts.includes('business')) {
      // Capacidad seleccionada (ej: "group-0-cap-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const group = capabilityGroups[groupIndex];
      if (group && group.capabilities[capIndex]) {
        const capability = group.capabilities[capIndex];
        onCapabilitySelect(capability.id.value);
      }
    } else if (parts.includes('business') && !parts.includes('sub')) {
      // Capacidad empresarial seleccionada (ej: "group-0-cap-0-business-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const businessIndex = parseInt(parts[5]);
      const group = capabilityGroups[groupIndex];
      if (group && group.capabilities[capIndex]) {
        const capability = group.capabilities[capIndex];
        onCapabilitySelect(capability.id.value); // Seleccionar la capacidad principal
      }
    } else if (parts.includes('sub') && !parts.includes('func')) {
      // Subcapacidad seleccionada (ej: "group-0-cap-0-business-0-sub-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const businessIndex = parseInt(parts[5]);
      const subIndex = parseInt(parts[7]);
      const group = capabilityGroups[groupIndex];

      if (group && group.capabilities[capIndex] &&
          group.capabilities[capIndex].businessCapabilities[businessIndex] &&
          group.capabilities[capIndex].businessCapabilities[businessIndex].subCapabilities[subIndex]) {

        const capability = group.capabilities[capIndex];
        const subCapability = capability.businessCapabilities[businessIndex].subCapabilities[subIndex];
        onSubCapabilitySelect(capability.id.value, subCapability.id.value);
      }
    } else if (parts.includes('func')) {
      // Funcionalidad seleccionada (ej: "group-0-cap-0-business-0-sub-0-func-0")
      const groupIndex = parseInt(parts[1]);
      const capIndex = parseInt(parts[3]);
      const businessIndex = parseInt(parts[5]);
      const subIndex = parseInt(parts[7]);
      const funcIndex = parseInt(parts[9]);
      const group = capabilityGroups[groupIndex];

      if (group && group.capabilities[capIndex] &&
          group.capabilities[capIndex].businessCapabilities[businessIndex] &&
          group.capabilities[capIndex].businessCapabilities[businessIndex].subCapabilities[subIndex] &&
          group.capabilities[capIndex].businessCapabilities[businessIndex].subCapabilities[subIndex].functionalities[funcIndex]) {

        const capability = group.capabilities[capIndex];
        const businessCapability = capability.businessCapabilities[businessIndex];
        const subCapability = businessCapability.subCapabilities[subIndex];
        const functionality = subCapability.functionalities[funcIndex];
        onFunctionalitySelect(capability.id.value, subCapability.id.value, functionality.id.value);
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
                      label={capability.businessCapabilities?.length || 0}
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
                {capability.businessCapabilities?.map((businessCapability, businessIndex) => {
                  const businessCapabilityId = `group-${groupIndex}-cap-${capIndex}-business-${businessIndex}`;

                  return (
                    <TreeItem
                      key={businessCapabilityId}
                      itemId={businessCapabilityId}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                          <FolderIcon sx={{ mr: 1, fontSize: 14, color: '#5B6670' }} />
                          <Typography variant="body2">
                            {businessCapability.name}
                          </Typography>
                          <Chip
                            label={businessCapability.subCapabilities?.length || 0}
                            size="small"
                            sx={{
                              ml: 'auto',
                              height: 18,
                              fontSize: '10px',
                              backgroundColor: '#EBF0F2',
                              color: '#5B6670',
                            }}
                          />
                        </Box>
                      }
                      sx={{
                        ml: 2,
                        '& .MuiTreeItem-content': {
                          padding: '2px 8px',
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
                      {businessCapability.subCapabilities?.map((subCapability, subIndex) => {
                        const subCapabilityId = `group-${groupIndex}-cap-${capIndex}-business-${businessIndex}-sub-${subIndex}`;

                        return (
                          <TreeItem
                            key={subCapabilityId}
                            itemId={subCapabilityId}
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                <FolderOpenIcon sx={{ mr: 1, fontSize: 14, color: '#5B6670' }} />
                                <Typography variant="body2">
                                  {subCapability.name}
                                </Typography>
                                <Chip
                                  label={subCapability.functionalities?.length || 0}
                                  size="small"
                                  sx={{
                                    ml: 'auto',
                                    height: 18,
                                    fontSize: '10px',
                                    backgroundColor: '#EBF0F2',
                                    color: '#5B6670',
                                  }}
                                />
                              </Box>
                            }
                            sx={{
                              ml: 2,
                              '& .MuiTreeItem-content': {
                                padding: '2px 8px',
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
                            {subCapability.functionalities?.map((functionality, funcIndex) => {
                              const functionalityId = `group-${groupIndex}-cap-${capIndex}-business-${businessIndex}-sub-${subIndex}-func-${funcIndex}`;

                              return (
                                <TreeItem
                                  key={functionalityId}
                                  itemId={functionalityId}
                                  label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                                      <DescriptionIcon sx={{ mr: 1, fontSize: 12, color: '#5B6670' }} />
                                      <Typography variant="body2" sx={{ fontSize: '13px' }}>
                                        {functionality.name}
                                      </Typography>
                                    </Box>
                                  }
                                  sx={{
                                    ml: 2,
                                    '& .MuiTreeItem-content': {
                                      padding: '2px 8px',
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
          sx={{ mb: 2 }}
        />

        {/* TreeView de navegación */}
        <SimpleTreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expandedItems={expanded}
          onExpandedItemsChange={(event, itemIds) => setExpanded(itemIds)}
          onSelectedItemsChange={(event, itemId) => {
            if (itemId) {
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
    </Drawer>
  );
}
