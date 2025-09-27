import { CapabilityId } from '../value-objects/CapabilityId';
import { BusinessCapability } from './BusinessCapability';

/**
 * Entidad que representa una Capacidad (segundo nivel en la jerarquía)
 * Ahora contiene capacidades empresariales en lugar de subcapacidades directamente
 */
export class Capability {
  constructor(
    public readonly id: CapabilityId,
    public readonly name: string,
    public readonly groupId: string,
    public readonly businessCapabilities: BusinessCapability[] = [],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  /**
   * Verifica si la capacidad tiene capacidades empresariales
   */
  hasBusinessCapabilities(): boolean {
    return this.businessCapabilities.length > 0;
  }

  /**
   * Verifica si la capacidad puede ser activada
   */
  canBeActivated(): boolean {
    return this.hasBusinessCapabilities() && this.isActive;
  }

  /**
   * Verifica si está completamente configurada
   */
  isCompletelyConfigured(): boolean {
    return this.hasBusinessCapabilities() && this.businessCapabilities.every(bc => bc.isActive);
  }

  /**
   * Obtiene el total de capacidades empresariales
   */
  getTotalBusinessCapabilities(): number {
    return this.businessCapabilities.length;
  }

  /**
   * Obtiene el total de funcionalidades sumando todas las subcapacidades de todas las capacidades empresariales
   */
  getTotalFunctionalities(): number {
    return this.businessCapabilities.reduce((total, businessCap) => {
      return total + businessCap.subCapabilities.reduce((subTotal, subCap) => {
        return subTotal + subCap.functionalities.length;
      }, 0);
    }, 0);
  }

  /**
   * Obtiene todas las subcapacidades de todas las capacidades empresariales
   */
  getAllSubCapabilities() {
    return this.businessCapabilities.reduce((allSubCaps, businessCap) => {
      return allSubCaps.concat(businessCap.subCapabilities);
    }, [] as any[]);
  }

  /**
   * Obtiene todas las funcionalidades de todas las subcapacidades
   */
  getAllFunctionalities() {
    return this.businessCapabilities.reduce((allFuncs, businessCap) => {
      return allFuncs.concat(
        businessCap.subCapabilities.reduce((subFuncs, subCap) => {
          return subFuncs.concat(subCap.functionalities);
        }, [] as any[])
      );
    }, [] as any[]);
  }

  /**
   * Crea una copia de la capacidad con nuevos valores
   */
  update(updates: Partial<Pick<Capability, 'name' | 'isActive'>>): Capability {
    return new Capability(
      this.id,
      updates.name ?? this.name,
      this.groupId,
      this.businessCapabilities,
      updates.isActive ?? this.isActive,
      this.createdAt,
      new Date()
    );
  }
}
