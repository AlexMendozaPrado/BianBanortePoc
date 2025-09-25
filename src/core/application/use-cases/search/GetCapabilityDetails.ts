import { CapabilityRepository } from '../../../domain/ports/CapabilityRepository';
import { CapabilityGroupRepository } from '../../../domain/ports/CapabilityGroupRepository';
import { CapabilityId } from '../../../domain/value-objects/CapabilityId';
import { Capability } from '../../../domain/entities/Capability';
import { CapabilityGroup } from '../../../domain/entities/CapabilityGroup';
import { BusinessCapability } from '../../../domain/entities/BusinessCapability';

/**
 * Caso de uso para obtener detalles de una capacidad específica con nueva estructura de 5 niveles
 */
export class GetCapabilityDetails {
  constructor(
    private readonly capabilityRepository: CapabilityRepository,
    private readonly capabilityGroupRepository: CapabilityGroupRepository
  ) {}

  /**
   * Ejecuta la obtención de detalles de capacidad
   */
  async execute(request: GetCapabilityDetailsRequest): Promise<GetCapabilityDetailsResponse> {
    try {
      // Validar entrada
      this.validateRequest(request);

      // Crear CapabilityId
      const capabilityId = CapabilityId.fromString(request.capabilityId);

      // Buscar capacidad
      const capability = await this.capabilityRepository.findById(capabilityId);

      if (!capability) {
        return {
          success: false,
          error: `Capability with ID ${request.capabilityId} not found`,
          timestamp: new Date()
        };
      }

      // Buscar el grupo al que pertenece la capacidad
      const group = await this.capabilityGroupRepository.findById(capability.groupId);

      if (!group) {
        return {
          success: false,
          error: `Group for capability ${request.capabilityId} not found`,
          timestamp: new Date()
        };
      }

      // Obtener información adicional con contexto de grupo
      const additionalInfo = await this.getAdditionalInfo(capability, group);

      return {
        success: true,
        capability,
        group,
        additionalInfo,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date()
      };
    }
  }

  /**
   * Valida la solicitud
   */
  private validateRequest(request: GetCapabilityDetailsRequest): void {
    if (!request.capabilityId || typeof request.capabilityId !== 'string') {
      throw new Error('Capability ID is required and must be a string');
    }

    if (!CapabilityId.isValid(request.capabilityId)) {
      throw new Error('Invalid capability ID format');
    }
  }

  /**
   * Obtiene información adicional sobre la capacidad con nueva estructura
   */
  private async getAdditionalInfo(capability: Capability, group: CapabilityGroup): Promise<CapabilityAdditionalInfo> {
    const totalFunctionalities = capability.getTotalFunctionalities();
    const totalBusinessCapabilities = capability.getTotalBusinessCapabilities();
    const activeSubCapabilities = capability.getAllSubCapabilities().filter(sub => sub.isActive);
    const activeFunctionalities = capability.getAllFunctionalities().filter(func => func.isActive);

    // Calcular estadísticas por capacidad empresarial
    const businessCapabilityStats = this.calculateBusinessCapabilityStats(capability);

    return {
      totalFunctionalities,
      totalBusinessCapabilities,
      activeSubCapabilities: activeSubCapabilities.length,
      activeFunctionalities: activeFunctionalities.length,
      businessCapabilityStats,
      lastUpdated: capability.updatedAt,
      groupInfo: {
        id: group.id,
        name: group.name,
        style: group.style.getValue(),
        styleColor: group.style.getColor()
      },
      hierarchyPath: this.buildHierarchyPath(capability, group),
      hasDocumentation: capability.businessCapabilities.some(bc => bc.description.length > 10)
    };
  }

  /**
   * Calcula estadísticas por capacidad empresarial
   */
  private calculateBusinessCapabilityStats(capability: Capability): BusinessCapabilityStats[] {
    return capability.businessCapabilities.map(businessCap => ({
      id: businessCap.id,
      name: businessCap.name,
      description: businessCap.description,
      subCapabilityCount: businessCap.subCapabilities.length,
      functionalityCount: businessCap.getAllFunctionalities().length,
      activeFunctionalityCount: businessCap.getAllFunctionalities().filter(f => f.isActive).length,
      isComplete: businessCap.isReadyForProduction()
    }));
  }

  /**
   * Construye el path jerárquico de la capacidad
   */
  private buildHierarchyPath(capability: Capability, group: CapabilityGroup): HierarchyPath {
    return {
      group: {
        id: group.id,
        name: group.name,
        level: 1
      },
      capability: {
        id: capability.id.getValue(),
        name: capability.name,
        level: 2
      },
      businessCapabilities: capability.businessCapabilities.map(bc => ({
        id: bc.id,
        name: bc.name,
        level: 3,
        subCapabilities: bc.subCapabilities.map(sub => ({
          id: sub.id,
          name: sub.name,
          level: 4,
          functionalities: sub.functionalities.map(func => ({
            id: func.id,
            name: func.name,
            level: 5,
            isActive: func.isActive
          }))
        }))
      }))
    };
  }
}

/**
 * Solicitud para obtener detalles de capacidad
 */
export interface GetCapabilityDetailsRequest {
  capabilityId: string;
}

/**
 * Respuesta con detalles de capacidad (nueva estructura)
 */
export interface GetCapabilityDetailsResponse {
  success: boolean;
  capability?: Capability;
  group?: CapabilityGroup;
  additionalInfo?: CapabilityAdditionalInfo;
  error?: string;
  timestamp: Date;
}

/**
 * Información adicional sobre la capacidad (nueva estructura)
 */
export interface CapabilityAdditionalInfo {
  totalFunctionalities: number;
  totalBusinessCapabilities: number;
  activeSubCapabilities: number;
  activeFunctionalities: number;
  businessCapabilityStats: BusinessCapabilityStats[];
  lastUpdated: Date;
  groupInfo: GroupInfo;
  hierarchyPath: HierarchyPath;
  hasDocumentation: boolean;
}

/**
 * Estadísticas de capacidad empresarial
 */
export interface BusinessCapabilityStats {
  id: string;
  name: string;
  description: string;
  subCapabilityCount: number;
  functionalityCount: number;
  activeFunctionalityCount: number;
  isComplete: boolean;
}

/**
 * Información del grupo
 */
export interface GroupInfo {
  id: string;
  name: string;
  style: string;
  styleColor: string;
}

/**
 * Path jerárquico completo
 */
export interface HierarchyPath {
  group: {
    id: string;
    name: string;
    level: number;
  };
  capability: {
    id: string;
    name: string;
    level: number;
  };
  businessCapabilities: {
    id: string;
    name: string;
    level: number;
    subCapabilities: {
      id: string;
      name: string;
      level: number;
      functionalities: {
        id: string;
        name: string;
        level: number;
        isActive: boolean;
      }[];
    }[];
  }[];
}
