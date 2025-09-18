import { CapabilityId } from '../value-objects/CapabilityId';
import { CategoryType } from '../value-objects/CategoryType';
import { SubCapability } from './SubCapability';

/**
 * Entidad principal que representa una Capacidad empresarial BIAN
 */
export class Capability {
  constructor(
    public readonly id: CapabilityId,
    public readonly name: string,
    public readonly description: string,
    public readonly category: CategoryType,
    public readonly subCapabilities: SubCapability[] = [],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Obtiene todas las funcionalidades de esta capacidad
   */
  getAllFunctionalities() {
    return this.subCapabilities.flatMap(sub => sub.functionalities);
  }

  /**
   * Busca una subcapacidad por ID
   */
  findSubCapability(id: string): SubCapability | undefined {
    return this.subCapabilities.find(sub => sub.id === id);
  }

  /**
   * Verifica si la capacidad contiene una funcionalidad específica
   */
  hasFunctionality(functionalityId: string): boolean {
    return this.getAllFunctionalities().some(func => func.id === functionalityId);
  }

  /**
   * Obtiene el número total de funcionalidades
   */
  getTotalFunctionalities(): number {
    return this.getAllFunctionalities().length;
  }

  /**
   * Crea una copia de la capacidad con nuevos valores
   */
  update(updates: Partial<Pick<Capability, 'name' | 'description' | 'category' | 'isActive'>>): Capability {
    return new Capability(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      updates.category ?? this.category,
      this.subCapabilities,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}
