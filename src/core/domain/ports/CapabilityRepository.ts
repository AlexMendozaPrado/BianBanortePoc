import { Capability } from '../entities/Capability';
import { CapabilityId } from '../value-objects/CapabilityId';
import { CategoryType } from '../value-objects/CategoryType';

/**
 * Puerto (interfaz) para el repositorio de Capacidades
 */
export interface CapabilityRepository {
  /**
   * Obtiene todas las capacidades
   */
  findAll(): Promise<Capability[]>;

  /**
   * Busca una capacidad por ID
   */
  findById(id: CapabilityId): Promise<Capability | null>;

  /**
   * Busca capacidades por categoría
   */
  findByCategory(category: CategoryType): Promise<Capability[]>;

  /**
   * Busca capacidades por nombre (búsqueda parcial)
   */
  findByName(name: string): Promise<Capability[]>;

  /**
   * Busca capacidades activas
   */
  findActive(): Promise<Capability[]>;

  /**
   * Busca capacidades que contengan el texto en nombre o descripción
   */
  search(query: string): Promise<Capability[]>;

  /**
   * Obtiene capacidades con filtros avanzados
   */
  findWithFilters(filters: CapabilityFilters): Promise<Capability[]>;

  /**
   * Guarda una capacidad
   */
  save(capability: Capability): Promise<void>;

  /**
   * Elimina una capacidad
   */
  delete(id: CapabilityId): Promise<void>;

  /**
   * Verifica si existe una capacidad con el ID dado
   */
  exists(id: CapabilityId): Promise<boolean>;

  /**
   * Obtiene el conteo total de capacidades
   */
  count(): Promise<number>;

  /**
   * Obtiene capacidades paginadas
   */
  findPaginated(page: number, limit: number): Promise<PaginatedResult<Capability>>;
}

/**
 * Filtros para búsqueda de capacidades
 */
export interface CapabilityFilters {
  categories?: CategoryType[];
  isActive?: boolean;
  hasSubCapabilities?: boolean;
  minFunctionalities?: number;
  maxFunctionalities?: number;
  searchTerm?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
