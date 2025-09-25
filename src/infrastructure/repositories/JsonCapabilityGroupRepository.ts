import { CapabilityGroupRepository, CapabilityGroupFilters, PaginatedResult } from '../../core/domain/ports/CapabilityGroupRepository';
import { CapabilityGroup } from '../../core/domain/entities/CapabilityGroup';
import { Capability } from '../../core/domain/entities/Capability';
import { BusinessCapability } from '../../core/domain/entities/BusinessCapability';
import { SubCapability } from '../../core/domain/entities/SubCapability';
import { Functionality } from '../../core/domain/entities/Functionality';
import { CapabilityId } from '../../core/domain/value-objects/CapabilityId';
import { StyleType } from '../../core/domain/value-objects/StyleType';
import bianData from '../data/bian-data.json';

/**
 * Implementación del repositorio de grupos de capacidades usando datos JSON
 */
export class JsonCapabilityGroupRepository implements CapabilityGroupRepository {
  private capabilityGroups: CapabilityGroup[] = [];

  constructor() {
    this.loadData();
  }

  /**
   * Carga los datos desde el archivo JSON con la nueva estructura
   */
  private loadData(): void {
    try {
      this.capabilityGroups = (bianData as any).CEfuncionalidades?.map((groupData: any) =>
        this.mapToCapabilityGroup(groupData)
      ) || [];
    } catch (error) {
      console.error('Error loading BIAN data:', error);
      this.capabilityGroups = [];
    }
  }

  /**
   * Mapea datos JSON a entidad CapabilityGroup
   */
  private mapToCapabilityGroup(data: any): CapabilityGroup {
    const style = new StyleType(data.estilo);

    const capabilities = data.capacidades?.map((capData: any) =>
      this.mapToCapability(capData, data.Nombre)
    ) || [];

    return new CapabilityGroup(
      this.generateGroupId(data.Nombre),
      data.Nombre,
      style,
      capabilities,
      true, // isActive por defecto
      new Date(),
      new Date()
    );
  }

  /**
   * Mapea datos JSON a entidad Capability
   */
  private mapToCapability(data: any, groupName: string): Capability {
    const capabilityId = new CapabilityId(data.Id);
    const groupId = this.generateGroupId(groupName);

    const businessCapabilities = data.empresarial?.map((bizData: any) =>
      this.mapToBusinessCapability(bizData, data.Id)
    ) || [];

    return new Capability(
      capabilityId,
      data.Nombre,
      groupId,
      businessCapabilities,
      true, // isActive por defecto
      new Date(),
      new Date()
    );
  }

  /**
   * Mapea datos JSON a entidad BusinessCapability
   */
  private mapToBusinessCapability(data: any, capabilityId: string): BusinessCapability {
    const subCapabilities = data.subcapacidad?.map((subData: any) =>
      this.mapToSubCapability(subData, data.Id)
    ) || [];

    return new BusinessCapability(
      data.Id,
      data.Nombre,
      data.Descripcion || '',
      capabilityId,
      subCapabilities,
      true, // isActive por defecto
      new Date(),
      new Date()
    );
  }

  /**
   * Mapea datos JSON a entidad SubCapability
   */
  private mapToSubCapability(data: any, businessCapabilityId: string): SubCapability {
    const functionalities = data.funcionalidades?.map((funcData: any) =>
      this.mapToFunctionality(funcData, data.Id)
    ) || [];

    return new SubCapability(
      data.Id,
      data.Nombre,
      data.Descripcion || '',
      businessCapabilityId,
      functionalities,
      true, // isActive por defecto
      new Date(),
      new Date()
    );
  }

  /**
   * Mapea datos JSON a entidad Functionality
   */
  private mapToFunctionality(data: any, subCapabilityId: string): Functionality {
    return new Functionality(
      data.Id,
      data.Nombre,
      data.Descripcion || '',
      subCapabilityId,
      true, // isActive por defecto
      new Date(),
      new Date()
    );
  }

  /**
   * Genera un ID único para el grupo basado en el nombre
   */
  private generateGroupId(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Obtiene todos los grupos de capacidades
   */
  async findAll(): Promise<CapabilityGroup[]> {
    return [...this.capabilityGroups];
  }

  /**
   * Busca un grupo por ID
   */
  async findById(id: string): Promise<CapabilityGroup | null> {
    const group = this.capabilityGroups.find(group => group.id === id);
    return group || null;
  }

  /**
   * Busca grupos por estilo
   */
  async findByStyle(style: StyleType): Promise<CapabilityGroup[]> {
    return this.capabilityGroups.filter(group => group.style.equals(style));
  }

  /**
   * Busca grupos activos
   */
  async findActive(): Promise<CapabilityGroup[]> {
    return this.capabilityGroups.filter(group => group.isActive);
  }

  /**
   * Busca grupos por nombre
   */
  async findByName(name: string): Promise<CapabilityGroup[]> {
    const searchTerm = name.toLowerCase();
    return this.capabilityGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Búsqueda textual en grupos
   */
  async search(query: string): Promise<CapabilityGroup[]> {
    const searchTerm = query.toLowerCase();
    return this.capabilityGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm) ||
      group.capabilities.some(cap =>
        cap.name.toLowerCase().includes(searchTerm) ||
        cap.businessCapabilities.some(bc =>
          bc.name.toLowerCase().includes(searchTerm) ||
          bc.description.toLowerCase().includes(searchTerm) ||
          bc.subCapabilities.some(sub =>
            sub.name.toLowerCase().includes(searchTerm) ||
            sub.description.toLowerCase().includes(searchTerm) ||
            sub.functionalities.some(func =>
              func.name.toLowerCase().includes(searchTerm) ||
              func.description.toLowerCase().includes(searchTerm)
            )
          )
        )
      )
    );
  }

  /**
   * Guarda un grupo
   */
  async save(group: CapabilityGroup): Promise<void> {
    const index = this.capabilityGroups.findIndex(g => g.id === group.id);
    if (index >= 0) {
      this.capabilityGroups[index] = group;
    } else {
      this.capabilityGroups.push(group);
    }
  }

  /**
   * Elimina un grupo
   */
  async delete(id: string): Promise<void> {
    this.capabilityGroups = this.capabilityGroups.filter(group => group.id !== id);
  }

  /**
   * Verifica si existe un grupo
   */
  async exists(id: string): Promise<boolean> {
    return this.capabilityGroups.some(group => group.id === id);
  }

  /**
   * Obtiene el conteo total de grupos
   */
  async count(): Promise<number> {
    return this.capabilityGroups.length;
  }
}