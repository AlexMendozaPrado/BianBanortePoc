import { Functionality } from './Functionality';

/**
 * Entidad que representa una Subcapacidad dentro de una Capacidad BIAN
 */
export class SubCapability {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly capabilityId: string,
    public readonly functionalities: Functionality[] = [],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Busca una funcionalidad por ID
   */
  findFunctionality(id: string): Functionality | undefined {
    return this.functionalities.find(func => func.id === id);
  }

  /**
   * Obtiene el número de funcionalidades activas
   */
  getActiveFunctionalities(): Functionality[] {
    return this.functionalities.filter(func => func.isActive);
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
      this.capabilityId,
      this.functionalities,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}
