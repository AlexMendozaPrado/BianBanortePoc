import { CapabilityRepository } from '../../../domain/ports/CapabilityRepository';
import { Capability } from '../../../domain/entities/Capability';
import { CategoryType } from '../../../domain/value-objects/CategoryType';

/**
 * Caso de uso para obtener el árbol de capacidades organizadas por categoría
 */
export class GetCapabilityTree {
  constructor(private readonly capabilityRepository: CapabilityRepository) {}

  /**
   * Ejecuta la obtención del árbol de capacidades
   */
  async execute(request: GetCapabilityTreeRequest = {}): Promise<GetCapabilityTreeResponse> {
    try {
      const startTime = Date.now();

      // Obtener todas las capacidades
      const capabilities = await this.capabilityRepository.findAll();

      // Filtrar capacidades si es necesario
      const filteredCapabilities = this.filterCapabilities(capabilities, request);

      // Organizar en árbol por categorías
      const tree = this.buildCapabilityTree(filteredCapabilities);

      // Calcular estadísticas
      const stats = this.calculateTreeStats(tree);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: true,
        tree,
        stats,
        executionTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        tree: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
        timestamp: new Date()
      };
    }
  }

  /**
   * Filtra las capacidades según los criterios de la solicitud
   */
  private filterCapabilities(capabilities: Capability[], request: GetCapabilityTreeRequest): Capability[] {
    let filtered = capabilities;

    // Filtrar por estado activo
    if (request.activeOnly) {
      filtered = filtered.filter(cap => cap.isActive);
    }

    // Filtrar por categorías específicas
    if (request.categories && request.categories.length > 0) {
      filtered = filtered.filter(cap => 
        request.categories!.some(category => cap.category.value === category)
      );
    }

    // Filtrar por capacidades que tengan subcapacidades
    if (request.withSubCapabilitiesOnly) {
      filtered = filtered.filter(cap => cap.subCapabilities.length > 0);
    }

    // Filtrar por capacidades que tengan funcionalidades
    if (request.withFunctionalitiesOnly) {
      filtered = filtered.filter(cap => cap.getTotalFunctionalities() > 0);
    }

    return filtered;
  }

  /**
   * Construye el árbol de capacidades organizadas por categoría
   */
  private buildCapabilityTree(capabilities: Capability[]): CapabilityTreeNode[] {
    // Agrupar capacidades por categoría
    const capabilitiesByCategory = new Map<string, Capability[]>();

    capabilities.forEach(capability => {
      const categoryCode = capability.category.value;
      if (!capabilitiesByCategory.has(categoryCode)) {
        capabilitiesByCategory.set(categoryCode, []);
      }
      capabilitiesByCategory.get(categoryCode)!.push(capability);
    });

    // Crear nodos del árbol
    const treeNodes: CapabilityTreeNode[] = [];

    // Obtener todas las categorías disponibles para mantener el orden
    const allCategories = CategoryType.getAllCategories();

    allCategories.forEach(categoryInfo => {
      const capabilities = capabilitiesByCategory.get(categoryInfo.code) || [];
      
      if (capabilities.length > 0) {
        const categoryNode: CapabilityTreeNode = {
          id: categoryInfo.code,
          name: categoryInfo.description,
          type: 'category',
          children: capabilities.map(capability => this.buildCapabilityNode(capability)),
          isExpanded: false,
          metadata: {
            categoryCode: categoryInfo.code,
            totalCapabilities: capabilities.length,
            totalSubCapabilities: capabilities.reduce((sum, cap) => sum + cap.subCapabilities.length, 0),
            totalFunctionalities: capabilities.reduce((sum, cap) => sum + cap.getTotalFunctionalities(), 0)
          }
        };

        treeNodes.push(categoryNode);
      }
    });

    return treeNodes;
  }

  /**
   * Construye un nodo para una capacidad específica
   */
  private buildCapabilityNode(capability: Capability): CapabilityTreeNode {
    const subCapabilityNodes = capability.subCapabilities.map(subCap => ({
      id: subCap.id,
      name: subCap.name,
      type: 'subcapability' as const,
      children: subCap.functionalities.map(func => ({
        id: func.id.value,
        name: func.name,
        type: 'functionality' as const,
        children: [],
        isExpanded: false,
        metadata: {
          complexity: func.complexity,
          estimatedEffort: func.estimatedEffort,
          isActive: func.isActive
        }
      })),
      isExpanded: false,
      metadata: {
        totalFunctionalities: subCap.functionalities.length,
        isActive: subCap.isActive
      }
    }));

    return {
      id: capability.id.value,
      name: capability.name,
      type: 'capability',
      children: subCapabilityNodes,
      isExpanded: false,
      metadata: {
        categoryCode: capability.category.value,
        totalSubCapabilities: capability.subCapabilities.length,
        totalFunctionalities: capability.getTotalFunctionalities(),
        isActive: capability.isActive
      }
    };
  }

  /**
   * Calcula estadísticas del árbol
   */
  private calculateTreeStats(tree: CapabilityTreeNode[]): TreeStats {
    let totalCategories = 0;
    let totalCapabilities = 0;
    let totalSubCapabilities = 0;
    let totalFunctionalities = 0;

    tree.forEach(categoryNode => {
      totalCategories++;
      
      categoryNode.children.forEach(capabilityNode => {
        totalCapabilities++;
        
        capabilityNode.children.forEach(subCapabilityNode => {
          totalSubCapabilities++;
          totalFunctionalities += subCapabilityNode.children.length;
        });
      });
    });

    return {
      totalCategories,
      totalCapabilities,
      totalSubCapabilities,
      totalFunctionalities
    };
  }
}

/**
 * Solicitud para obtener el árbol de capacidades
 */
export interface GetCapabilityTreeRequest {
  activeOnly?: boolean;
  categories?: string[];
  withSubCapabilitiesOnly?: boolean;
  withFunctionalitiesOnly?: boolean;
}

/**
 * Respuesta con el árbol de capacidades
 */
export interface GetCapabilityTreeResponse {
  success: boolean;
  tree: CapabilityTreeNode[];
  stats?: TreeStats;
  error?: string;
  executionTime: number;
  timestamp: Date;
}

/**
 * Nodo del árbol de capacidades
 */
export interface CapabilityTreeNode {
  id: string;
  name: string;
  type: 'category' | 'capability' | 'subcapability' | 'functionality';
  children: CapabilityTreeNode[];
  isExpanded: boolean;
  metadata?: Record<string, any>;
}

/**
 * Estadísticas del árbol
 */
export interface TreeStats {
  totalCategories: number;
  totalCapabilities: number;
  totalSubCapabilities: number;
  totalFunctionalities: number;
}
