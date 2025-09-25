import { CapabilityGroupRepository } from '../../../domain/ports/CapabilityGroupRepository';
import { CapabilityGroup } from '../../../domain/entities/CapabilityGroup';

/**
 * DTO para representar la jerarquía completa de capacidades
 */
export interface CapabilityHierarchyDto {
  group: {
    id: string;
    name: string;
    style: string;
    styleColor: string;
  };
  capabilities: {
    id: string;
    name: string;
    businessCapabilities: {
      id: string;
      name: string;
      description: string;
      subCapabilities: {
        id: string;
        name: string;
        description: string;
        functionalities: {
          id: string;
          name: string;
          description: string;
          isActive: boolean;
        }[];
      }[];
    }[];
  }[];
}

/**
 * Caso de uso para obtener la jerarquía completa de capacidades
 */
export class GetCapabilityHierarchyUseCase {
  constructor(private capabilityGroupRepository: CapabilityGroupRepository) {}

  /**
   * Obtiene la jerarquía completa de todos los grupos
   */
  async execute(): Promise<CapabilityHierarchyDto[]> {
    try {
      const groups = await this.capabilityGroupRepository.findActive();
      return groups.map(group => this.mapGroupToHierarchy(group));
    } catch (error) {
      throw new Error(`Failed to get capability hierarchy: ${error}`);
    }
  }

  /**
   * Obtiene la jerarquía de un grupo específico
   */
  async executeForGroup(groupId: string): Promise<CapabilityHierarchyDto | null> {
    try {
      const group = await this.capabilityGroupRepository.findById(groupId);
      if (!group) {
        return null;
      }
      return this.mapGroupToHierarchy(group);
    } catch (error) {
      throw new Error(`Failed to get hierarchy for group ${groupId}: ${error}`);
    }
  }

  /**
   * Mapea un grupo de capacidades a su representación jerárquica
   */
  private mapGroupToHierarchy(group: CapabilityGroup): CapabilityHierarchyDto {
    return {
      group: {
        id: group.id,
        name: group.name,
        style: group.style.getValue(),
        styleColor: group.style.getColor(),
      },
      capabilities: group.capabilities.map(capability => ({
        id: capability.id.getValue(),
        name: capability.name,
        businessCapabilities: capability.businessCapabilities.map(businessCap => ({
          id: businessCap.id,
          name: businessCap.name,
          description: businessCap.description,
          subCapabilities: businessCap.subCapabilities.map(subCap => ({
            id: subCap.id,
            name: subCap.name,
            description: subCap.description,
            functionalities: subCap.functionalities.map(func => ({
              id: func.id,
              name: func.name,
              description: func.description,
              isActive: func.isActive,
            })),
          })),
        })),
      })),
    };
  }
}