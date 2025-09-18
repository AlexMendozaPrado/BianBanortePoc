import { FunctionalityId } from '../value-objects/FunctionalityId';

/**
 * Entidad que representa una Funcionalidad específica dentro de una SubCapacidad
 */
export class Functionality {
  constructor(
    public readonly id: FunctionalityId,
    public readonly name: string,
    public readonly description: string,
    public readonly subCapabilityId: string,
    public readonly capabilityId: string,
    public readonly businessValue: string,
    public readonly technicalRequirements: string[] = [],
    public readonly dependencies: string[] = [],
    public readonly isActive: boolean = true,
    public readonly complexity: 'Low' | 'Medium' | 'High' = 'Medium',
    public readonly estimatedEffort: number = 0, // en horas
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Verifica si la funcionalidad tiene dependencias
   */
  hasDependencies(): boolean {
    return this.dependencies.length > 0;
  }

  /**
   * Verifica si la funcionalidad tiene requisitos técnicos
   */
  hasTechnicalRequirements(): boolean {
    return this.technicalRequirements.length > 0;
  }

  /**
   * Obtiene el nivel de complejidad como número
   */
  getComplexityLevel(): number {
    switch (this.complexity) {
      case 'Low': return 1;
      case 'Medium': return 2;
      case 'High': return 3;
      default: return 2;
    }
  }

  /**
   * Crea una copia de la funcionalidad con nuevos valores
   */
  update(updates: Partial<Pick<Functionality, 'name' | 'description' | 'businessValue' | 'technicalRequirements' | 'dependencies' | 'isActive' | 'complexity' | 'estimatedEffort'>>): Functionality {
    return new Functionality(
      this.id,
      updates.name ?? this.name,
      updates.description ?? this.description,
      this.subCapabilityId,
      this.capabilityId,
      updates.businessValue ?? this.businessValue,
      updates.technicalRequirements ?? this.technicalRequirements,
      updates.dependencies ?? this.dependencies,
      updates.isActive ?? this.isActive,
      updates.complexity ?? this.complexity,
      updates.estimatedEffort ?? this.estimatedEffort,
      this.createdAt,
      new Date()
    );
  }
}
