'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  useTheme,
  useMediaQuery,
  Snackbar,
} from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SearchArea, ViewMode, SortOption, HierarchyLevel } from './SearchArea';
import { AdaptableCard } from './AdaptableCard';
import { CapabilityList } from './CapabilityList';
import { DetailPanel } from './DetailPanel';
import { SkeletonCard } from './SkeletonCard';
import { Capability } from '../../core/domain/entities/Capability';
import { SubCapability } from '../../core/domain/entities/SubCapability';
import { BaseFunction } from '../../core/domain/entities/BaseFunction';
import { Functionality } from '../../core/domain/entities/Functionality';
import { CapabilityGroup } from '../../core/domain/entities/CapabilityGroup';
import { JsonCapabilityRepository } from '../../infrastructure/repositories/JsonCapabilityRepository';
import { JsonCapabilityGroupRepository } from '../../infrastructure/repositories/JsonCapabilityGroupRepository';

const ITEMS_PER_PAGE = 6;

// Tipos para los datos adaptables (nueva estructura v2.0)
type AdaptableDataItem =
  | { item: Capability; parent: Capability }
  | { item: SubCapability; parent: Capability }
  | { item: BaseFunction; parent: Capability; subParent: SubCapability }
  | { item: Functionality; parent: Capability; subParent: SubCapability; baseFunctionParent: BaseFunction };

export function ExplorerPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados principales
  const [capabilityGroups, setCapabilityGroups] = useState<CapabilityGroup[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [subCapabilities, setSubCapabilities] = useState<{ subCapability: SubCapability, parent: Capability }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hierarchyLevel, setHierarchyLevel] = useState<HierarchyLevel>('subcapability');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estados de navegación
  const [, setSelectedCapabilityId] = useState<string>('');
  const [detailCapability, setDetailCapability] = useState<Capability | null>(null);
  const [selectedItemContext, setSelectedItemContext] = useState<{
    level: HierarchyLevel;
    item: Capability | SubCapability | BaseFunction | Functionality;
    subParent?: SubCapability;
    baseFunctionParent?: BaseFunction;
  } | undefined>(undefined);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Repositorios
  const [] = useState(() => new JsonCapabilityRepository());
  const [groupRepository] = useState(() => new JsonCapabilityGroupRepository());

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Loading capability groups from repository...');
        const groups = await groupRepository.findAll();
        console.log('Received capability groups:', groups);
        setCapabilityGroups(groups);

        // Extraer todas las capacidades de todos los grupos
        const allCapabilities = groups.flatMap(group => group.capabilities);
        console.log('Extracted capabilities:', allCapabilities);
        setCapabilities(allCapabilities);

        // Extraer todas las subcapacidades con sus padres
        const allSubCapabilities = allCapabilities.flatMap(capability =>
          capability.subCapabilities?.map(subCapability => ({
            subCapability,
            parent: capability
          })) || []
        );
        console.log('Extracted sub capabilities:', allSubCapabilities);
        setSubCapabilities(allSubCapabilities);
      } catch (err) {
        setError('Error al cargar las capacidades BIAN');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groupRepository]);

  // Generar datos adaptables según el nivel de jerarquía seleccionado (nueva estructura v2.0)
  const adaptableData = useMemo((): AdaptableDataItem[] => {
    if (!capabilities || capabilities.length === 0) {
      return [];
    }

    switch (hierarchyLevel) {
      case 'capability':
        return capabilities.map(capability => ({
          item: capability,
          parent: capability
        }));

      case 'subcapability':
        return capabilities.flatMap(capability =>
          capability.subCapabilities?.map(subCapability => ({
            item: subCapability,
            parent: capability
          })) || []
        );

      case 'baseFunction':
        return capabilities.flatMap(capability =>
          capability.subCapabilities?.flatMap(subCapability =>
            subCapability.baseFunctions?.map(baseFunction => ({
              item: baseFunction,
              parent: capability,
              subParent: subCapability
            })) || []
          ) || []
        );

      case 'functionality':
        return capabilities.flatMap(capability =>
          capability.subCapabilities?.flatMap(subCapability =>
            subCapability.baseFunctions?.flatMap(baseFunction =>
              baseFunction.functionalities?.map(functionality => ({
                item: functionality,
                parent: capability,
                subParent: subCapability,
                baseFunctionParent: baseFunction
              })) || []
            ) || []
          ) || []
        );

      default:
        return subCapabilities.map(({ subCapability, parent }) => ({
          item: subCapability,
          parent: parent
        }));
    }
  }, [capabilities, subCapabilities, hierarchyLevel]);

  // Filtrar y ordenar datos adaptables
  const filteredAndSortedData = useMemo((): AdaptableDataItem[] => {
    if (!adaptableData || adaptableData.length === 0) {
      return [];
    }

    let filtered = adaptableData;

    // Aplicar búsqueda por texto
    if (searchTerm) {
      filtered = filtered.filter((data) => {
        const searchLower = searchTerm.toLowerCase();
        const item = data.item;

        let nameMatch = false;
        let descriptionMatch = false;
        let parentMatch = false;

        if ('name' in item) {
          nameMatch = item.name.toLowerCase().includes(searchLower);
        }

        if ('description' in item && item.description) {
          descriptionMatch = item.description.toLowerCase().includes(searchLower);
        }

        if (data.parent) {
          parentMatch = data.parent.name.toLowerCase().includes(searchLower);
        }

        // Búsqueda específica según el tipo (nueva estructura v2.0)
        let deepMatch = false;
        switch (hierarchyLevel) {
          case 'capability':
            const capability = item as Capability;
            deepMatch = capability.subCapabilities?.some(sc =>
              sc.name.toLowerCase().includes(searchLower) ||
              sc.description.toLowerCase().includes(searchLower)
            ) || false;
            break;
          case 'subcapability':
            const subCap = item as SubCapability;
            deepMatch = subCap.baseFunctions?.some(bf =>
              bf.name.toLowerCase().includes(searchLower) ||
              bf.functionalities?.some(func =>
                func.name.toLowerCase().includes(searchLower)
              )
            ) || false;
            break;
          case 'baseFunction':
            const baseFunc = item as BaseFunction;
            deepMatch = baseFunc.functionalities?.some(func =>
              func.name.toLowerCase().includes(searchLower)
            ) || false;
            break;
        }

        return nameMatch || descriptionMatch || parentMatch || deepMatch;
      });
    }

    // Aplicar filtros por categoría
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((data) => {
        const item = data.item;
        let name = '';
        let description = '';

        if ('name' in item) {
          name = item.name.toLowerCase();
        }
        if ('description' in item && item.description) {
          description = item.description.toLowerCase();
        }

        return selectedFilters.some(filter => {
          switch (filter) {
            case 'informacion':
              return name.includes('información') || description.includes('información');
            case 'documentos':
              return name.includes('documento') || description.includes('documento');
            case 'validacion':
              return name.includes('validación') || description.includes('validación');
            case 'gestion':
              return name.includes('gestión') || name.includes('gestion') || description.includes('gestión') ||
                     name.includes('oferta') || description.includes('oferta') ||
                     name.includes('contratación') || description.includes('contratación');
            default:
              return false;
          }
        });
      });
    }

    // Aplicar ordenamiento
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => {
          const aName = 'name' in a.item ? a.item.name : '';
          const bName = 'name' in b.item ? b.item.name : '';
          return aName.localeCompare(bName);
        });
        break;
      case 'id':
        filtered.sort((a, b) => {
          const aId = 'id' in a.item ?
            (typeof a.item.id === 'string' ? a.item.id : a.item.id.value) : '';
          const bId = 'id' in b.item ?
            (typeof b.item.id === 'string' ? b.item.id : b.item.id.value) : '';
          return aId.localeCompare(bId);
        });
        break;
      case 'relevance':
      default:
        // Mantener orden original para relevancia
        break;
    }

    return filtered;
  }, [adaptableData, searchTerm, selectedFilters, sortBy, hierarchyLevel]);

  // Paginación
  const totalPages = Math.ceil((filteredAndSortedData?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  ) || [];

  // Handlers
  const handleCapabilitySelect = (capabilityId: string) => {
    setSelectedCapabilityId(capabilityId);
    const capability = capabilities.find(cap => cap.id.value === capabilityId);
    if (capability) {
      setDetailCapability(capability);
      setDetailPanelOpen(true);
    }
  };

  const handleSubCapabilitySelect = (capabilityId: string, _subCapabilityId: string) => {
    handleCapabilitySelect(capabilityId);
  };

  const handleFunctionalitySelect = (capabilityId: string, _subCapabilityId: string, _functionalityId: string) => {
    handleCapabilitySelect(capabilityId);
  };

  const handleViewDetails = (capability: Capability, context?: {
    level: HierarchyLevel;
    item: Capability | SubCapability | BaseFunction | Functionality;
    subParent?: SubCapability;
    baseFunctionParent?: BaseFunction;
  }) => {
    setDetailCapability(capability);
    setSelectedItemContext(context);
    setDetailPanelOpen(true);
  };

  const handleAddToProject = (capability: Capability) => {
    // TODO: Implementar lógica de agregar a proyecto
    console.log('Agregando a proyecto:', capability.name);
    setSnackbarMessage(`"${capability.name}" agregado al proyecto exitosamente`);
    setSnackbarOpen(true);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Reset página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilters, sortBy, hierarchyLevel]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header onMenuClick={handleMenuClick} />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar
          capabilityGroups={capabilityGroups}
          onCapabilitySelect={handleCapabilitySelect}
          onSubCapabilitySelect={handleSubCapabilitySelect}
          onFunctionalitySelect={handleFunctionalitySelect}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Área principal */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 0,
        }}>
          {/* Área de búsqueda */}
          <SearchArea
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
            hierarchyLevel={hierarchyLevel}
            onHierarchyLevelChange={setHierarchyLevel}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultsCount={filteredAndSortedData?.length || 0}
          />

          {/* Área de resultados */}
          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
            {loading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={4} key={index}>
                    <SkeletonCard />
                  </Grid>
                ))}
              </Grid>
            ) : (!filteredAndSortedData || filteredAndSortedData.length === 0) ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No se encontraron resultados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Intenta ajustar los filtros o términos de búsqueda
                </Typography>
              </Box>
            ) : (
              <>
                {viewMode === 'cards' ? (
                  <Grid container spacing={3}>
                    {paginatedData.map((data, index) => {
                      const keyId = 'id' in data.item
                        ? (typeof data.item.id === 'string' ? data.item.id : data.item.id.value)
                        : `item-${index}`;

                      return (
                        <Grid item xs={12} sm={6} lg={4} key={`${data.parent?.id.value}-${keyId}`}>
                          <AdaptableCard
                            hierarchyLevel={hierarchyLevel}
                            data={data}
                            onViewDetails={handleViewDetails}
                            onAddToProject={handleAddToProject}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                ) : (
                  <CapabilityList
                    capabilities={paginatedData.map(({ parent }) => parent!)}
                    onViewDetails={handleViewDetails}
                    onAddToProject={handleAddToProject}
                  />
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Panel de detalles */}
      <DetailPanel
        open={detailPanelOpen}
        capability={detailCapability}
        selectedItem={selectedItemContext}
        onClose={() => {
          setDetailPanelOpen(false);
          setSelectedItemContext(undefined);
        }}
        onAddToProject={handleAddToProject}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
