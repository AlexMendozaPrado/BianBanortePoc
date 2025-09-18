import { CapabilityRepository, CapabilityFilters, PaginatedResult } from '../../core/domain/ports/CapabilityRepository';
import { Capability } from '../../core/domain/entities/Capability';
import { SubCapability } from '../../core/domain/entities/SubCapability';
import { Functionality } from '../../core/domain/entities/Functionality';
import { CapabilityId } from '../../core/domain/value-objects/CapabilityId';
import { FunctionalityId } from '../../core/domain/value-objects/FunctionalityId';
import { CategoryType } from '../../core/domain/value-objects/CategoryType';
import bianData from '../data/bian-data.json';

/**
 * Implementación del repositorio de capacidades usando datos JSON
 */
export class JsonCapabilityRepository implements CapabilityRepository {
  private capabilities: Capability[] = [];

  constructor() {
    this.loadData();
  }

  /**
   * Carga los datos desde el archivo JSON
   */
  private loadData(): void {
    try {
      this.capabilities = bianData.capabilities.map(capData => this.mapToCapability(capData));
    } catch (error) {
      console.error('Error loading BIAN data:', error);
      this.capabilities = [];
    }
  }

  /**
   * Mapea datos JSON a entidad Capability
   */
  private mapToCapability(data: any): Capability {
    const capabilityId = new CapabilityId(data.id);
    const category = new CategoryType(data.category);
    
    const subCapabilities = data.subCapabilities?.map((subData: any) => 
      this.mapToSubCapability(subData)
    ) || [];

    return new Capability(
      capabilityId,
      data.name,
      data.description,
      category,
      subCapabilities,
      data.isActive ?? true,
      new Date(data.createdAt || Date.now()),
      new Date(data.updatedAt || Date.now())
    );
  }

  /**
   * Mapea datos JSON a entidad SubCapability
   */
  private mapToSubCapability(data: any): SubCapability {
    const functionalities = data.functionalities?.map((funcData: any) => 
      this.mapToFunctionality(funcData)
    ) || [];

    return new SubCapability(
      data.id,
      data.name,
      data.description,
      data.capabilityId,
      functionalities,
      data.isActive ?? true,
      new Date(data.createdAt || Date.now()),
      new Date(data.updatedAt || Date.now())
    );
  }

  /**
   * Mapea datos JSON a entidad Functionality
   */
  private mapToFunctionality(data: any): Functionality {
    const functionalityId = new FunctionalityId(data.id);

    return new Functionality(
      functionalityId,
      data.name,
      data.description,
      data.subCapabilityId,
      data.capabilityId,
      data.businessValue,
      data.technicalRequirements || [],
      data.dependencies || [],
      data.isActive ?? true,
      data.complexity || 'Medium',
      data.estimatedEffort || 0,
      new Date(data.createdAt || Date.now()),
      new Date(data.updatedAt || Date.now())
    );
  }

  /**
   * Obtiene todas las capacidades
   */
  async findAll(): Promise<Capability[]> {
    return [...this.capabilities];
  }

  /**
   * Busca una capacidad por ID
   */
  async findById(id: CapabilityId): Promise<Capability | null> {
    const capability = this.capabilities.find(cap => cap.id.equals(id));
    return capability || null;
  }

  /**
   * Busca capacidades por categoría
   */
  async findByCategory(category: CategoryType): Promise<Capability[]> {
    return this.capabilities.filter(cap => cap.category.equals(category));
  }

  /**
   * Busca capacidades por nombre
   */
  async findByName(name: string): Promise<Capability[]> {
    const searchTerm = name.toLowerCase();
    return this.capabilities.filter(cap => 
      cap.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Busca capacidades activas
   */
  async findActive(): Promise<Capability[]> {
    return this.capabilities.filter(cap => cap.isActive);
  }

  /**
   * Busca capacidades que contengan el texto en nombre o descripción
   */
  async search(query: string): Promise<Capability[]> {
    const searchTerm = query.toLowerCase();
    return this.capabilities.filter(cap => 
      cap.name.toLowerCase().includes(searchTerm) ||
      cap.description.toLowerCase().includes(searchTerm) ||
      cap.subCapabilities.some(sub => 
        sub.name.toLowerCase().includes(searchTerm) ||
        sub.description.toLowerCase().includes(searchTerm) ||
        sub.functionalities.some(func => 
          func.name.toLowerCase().includes(searchTerm) ||
          func.description.toLowerCase().includes(searchTerm)
        )
      )
    );
  }

  /**
   * Obtiene capacidades con filtros avanzados
   */
  async findWithFilters(filters: CapabilityFilters): Promise<Capability[]> {
    let result = [...this.capabilities];

    // Filtrar por categorías
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(cap => 
        filters.categories!.some(category => cap.category.equals(category))
      );
    }

    // Filtrar por estado activo
    if (filters.isActive !== undefined) {
      result = result.filter(cap => cap.isActive === filters.isActive);
    }

    // Filtrar por presencia de subcapacidades
    if (filters.hasSubCapabilities !== undefined) {
      result = result.filter(cap => 
        (cap.subCapabilities.length > 0) === filters.hasSubCapabilities
      );
    }

    // Filtrar por número mínimo de funcionalidades
    if (filters.minFunctionalities !== undefined) {
      result = result.filter(cap => 
        cap.getTotalFunctionalities() >= filters.minFunctionalities!
      );
    }

    // Filtrar por número máximo de funcionalidades
    if (filters.maxFunctionalities !== undefined) {
      result = result.filter(cap => 
        cap.getTotalFunctionalities() <= filters.maxFunctionalities!
      );
    }

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter(cap => 
        cap.name.toLowerCase().includes(searchTerm) ||
        cap.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por fecha de creación
    if (filters.createdAfter) {
      result = result.filter(cap => cap.createdAt >= filters.createdAfter!);
    }

    if (filters.createdBefore) {
      result = result.filter(cap => cap.createdAt <= filters.createdBefore!);
    }

    return result;
  }

  /**
   * Guarda una capacidad (simulado - en memoria)
   */
  async save(capability: Capability): Promise<void> {
    const index = this.capabilities.findIndex(cap => cap.id.equals(capability.id));
    if (index >= 0) {
      this.capabilities[index] = capability;
    } else {
      this.capabilities.push(capability);
    }
  }

  /**
   * Elimina una capacidad
   */
  async delete(id: CapabilityId): Promise<void> {
    this.capabilities = this.capabilities.filter(cap => !cap.id.equals(id));
  }

  /**
   * Verifica si existe una capacidad
   */
  async exists(id: CapabilityId): Promise<boolean> {
    return this.capabilities.some(cap => cap.id.equals(id));
  }

  /**
   * Obtiene el conteo total de capacidades
   */
  async count(): Promise<number> {
    return this.capabilities.length;
  }

  /**
   * Obtiene capacidades paginadas
   */
  async findPaginated(page: number, limit: number): Promise<PaginatedResult<Capability>> {
    const offset = (page - 1) * limit;
    const items = this.capabilities.slice(offset, offset + limit);
    const total = this.capabilities.length;
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1
    };
  }
}
