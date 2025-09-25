/**
 * Entidad que representa una Funcionalidad específica dentro de una SubCapacidad
 */
export class Functionality {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly subCapabilityId: string,
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Regla de negocio: Verifica si la funcionalidad puede ser activada
   */
  canBeActivated(): boolean {
    return this.name.trim().length > 0 && this.description.trim().length > 5;
  }

  /**
   * Regla de negocio: Verifica si está completamente definida
   */
  isCompletelyDefined(): boolean {
    return this.name.trim().length > 0 && this.description.trim().length > 10;
  }

  /**
   * Regla de negocio: Verifica si está lista para implementación
   */
  isReadyForImplementation(): boolean {
    return this.isActive && this.isCompletelyDefined();
  }

  /**
   * Comportamiento de dominio: Activa la funcionalidad
   */
  activate(): Functionality {
    if (!this.canBeActivated()) {
      throw new Error("Functionality cannot be activated: incomplete definition");
    }
    return this.update({ isActive: true });
  }

  /**
   * Comportamiento de dominio: Desactiva la funcionalidad
   */
  deactivate(): Functionality {
    return this.update({ isActive: false });
  }

  /**
   * Verifica si el nombre es válido según reglas de negocio
   */
  hasValidName(): boolean {
    return this.name.trim().length >= 3 && this.name.trim().length <= 100;
  }

  /**
   * Verifica si la descripción es válida según reglas de negocio
   */
  hasValidDescription(): boolean {
    return this.description.trim().length >= 10 && this.description.trim().length <= 500;
  }

  /**
   * Crea una copia de la funcionalidad con nuevos valores (patrón inmutable)
   */
  update(updates: Partial<Pick<Functionality, 'name' | 'description' | 'isActive'>>): Functionality {
    return new Functionality(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      this.subCapabilityId,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}
