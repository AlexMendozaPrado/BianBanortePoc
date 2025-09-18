import { CapabilityRepository } from '../../../domain/ports/CapabilityRepository';
import { CapabilityId } from '../../../domain/value-objects/CapabilityId';
import { Capability } from '../../../domain/entities/Capability';

/**
 * Caso de uso para obtener detalles de una capacidad específica
 */
export class GetCapabilityDetails {
  constructor(private readonly capabilityRepository: CapabilityRepository) {}

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

      // Obtener información adicional
      const additionalInfo = await this.getAdditionalInfo(capability);

      return {
        success: true,
        capability,
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
   * Obtiene información adicional sobre la capacidad
   */
  private async getAdditionalInfo(capability: Capability): Promise<CapabilityAdditionalInfo> {
    const totalFunctionalities = capability.getTotalFunctionalities();
    const activeSubCapabilities = capability.subCapabilities.filter(sub => sub.isActive);
    const activeFunctionalities = capability.getAllFunctionalities().filter(func => func.isActive);

    // Calcular estadísticas de complejidad
    const complexityStats = this.calculateComplexityStats(capability);

    // Calcular esfuerzo total estimado
    const totalEstimatedEffort = capability.getAllFunctionalities()
      .reduce((total, func) => total + func.estimatedEffort, 0);

    return {
      totalFunctionalities,
      activeSubCapabilities: activeSubCapabilities.length,
      activeFunctionalities: activeFunctionalities.length,
      complexityStats,
      totalEstimatedEffort,
      lastUpdated: capability.updatedAt,
      hasDocumentation: capability.description.length > 100, // Heurística simple
      dependencies: this.extractDependencies(capability)
    };
  }

  /**
   * Calcula estadísticas de complejidad
   */
  private calculateComplexityStats(capability: Capability): ComplexityStats {
    const functionalities = capability.getAllFunctionalities();
    const total = functionalities.length;

    if (total === 0) {
      return { low: 0, medium: 0, high: 0, total: 0 };
    }

    const low = functionalities.filter(f => f.complexity === 'Low').length;
    const medium = functionalities.filter(f => f.complexity === 'Medium').length;
    const high = functionalities.filter(f => f.complexity === 'High').length;

    return { low, medium, high, total };
  }

  /**
   * Extrae dependencias de la capacidad
   */
  private extractDependencies(capability: Capability): string[] {
    const dependencies = new Set<string>();

    capability.getAllFunctionalities().forEach(func => {
      func.dependencies.forEach(dep => dependencies.add(dep));
    });

    return Array.from(dependencies);
  }
}

/**
 * Solicitud para obtener detalles de capacidad
 */
export interface GetCapabilityDetailsRequest {
  capabilityId: string;
}

/**
 * Respuesta con detalles de capacidad
 */
export interface GetCapabilityDetailsResponse {
  success: boolean;
  capability?: Capability;
  additionalInfo?: CapabilityAdditionalInfo;
  error?: string;
  timestamp: Date;
}

/**
 * Información adicional sobre la capacidad
 */
export interface CapabilityAdditionalInfo {
  totalFunctionalities: number;
  activeSubCapabilities: number;
  activeFunctionalities: number;
  complexityStats: ComplexityStats;
  totalEstimatedEffort: number;
  lastUpdated: Date;
  hasDocumentation: boolean;
  dependencies: string[];
}

/**
 * Estadísticas de complejidad
 */
export interface ComplexityStats {
  low: number;
  medium: number;
  high: number;
  total: number;
}
