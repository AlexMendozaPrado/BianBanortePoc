import { Functionality } from './Functionality';

/**
 * Entidad que representa una Subcapacidad dentro de una Capacidad BIAN
 */
export class SubCapability {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly businessCapabilityId: string,
    public readonly functionalities: Functionality[] = [],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Verifica si la subcapacidad puede ser activada
   */
  canBeActivated(): boolean {
    return this.hasFunctionalities() && this.isActive;
  }

  /**
   * Verifica si está lista para implementación
   */
  isReadyForImplementation(): boolean {
    return this.isActive && this.hasFunctionalities() && this.description.length > 5;
  }

  /**
   * Verifica si tiene funcionalidades
   */
  hasFunctionalities(): boolean {
    return this.functionalities.length > 0;
  }

  /**
   * Crea una copia de la subcapacidad con nuevos valores
   */
  update(updates: Partial<Pick<SubCapability, 'name' | 'description' | 'isActive'>>): SubCapability {
    return new SubCapability(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      this.businessCapabilityId,
      this.functionalities,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}
