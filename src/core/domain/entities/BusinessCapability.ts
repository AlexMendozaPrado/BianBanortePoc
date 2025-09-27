import { SubCapability } from './SubCapability';

/**
 * Entidad que representa una capacidad empresarial (nivel intermedio)
 * Ej: "Información del Cliente", "Gestión Documental", etc.
 */
export class BusinessCapability {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly capabilityId: string,
    public readonly subCapabilities: SubCapability[] = [],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Verifica si la capacidad empresarial puede ser activada
   */
  canBeActivated(): boolean {
    return this.hasSubCapabilities() && this.isActive;
  }

  /**
   * Verifica si está lista para producción
   */
  isReadyForProduction(): boolean {
    return this.isActive && this.hasSubCapabilities() && this.description.length > 10;
  }

  /**
   * Verifica si tiene subcapacidades
   */
  hasSubCapabilities(): boolean {
    return this.subCapabilities.length > 0;
  }

  /**
   * Obtiene todas las funcionalidades de todas las subcapacidades
   */
  getAllFunctionalities() {
    return this.subCapabilities.reduce((allFuncs, subCap) => {
      return allFuncs.concat(subCap.functionalities);
    }, [] as any[]);
  }

  /**
   * Crea una copia de la capacidad empresarial con nuevos valores
   */
  update(updates: Partial<Pick<BusinessCapability, 'name' | 'description' | 'isActive'>>): BusinessCapability {
    return new BusinessCapability(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      this.capabilityId,
      this.subCapabilities,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}