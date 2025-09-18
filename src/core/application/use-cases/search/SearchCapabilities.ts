import { SearchService } from '../../../domain/ports/SearchService';
import { SearchResult, SearchFilters } from '../../../domain/entities/SearchResult';

/**
 * Caso de uso para buscar capacidades
 */
export class SearchCapabilities {
  constructor(private readonly searchService: SearchService) {}

  /**
   * Ejecuta la búsqueda de capacidades
   */
  async execute(request: SearchCapabilitiesRequest): Promise<SearchCapabilitiesResponse> {
    try {
      const startTime = Date.now();

      // Validar entrada
      this.validateRequest(request);

      // Realizar búsqueda
      const searchResult = await this.searchService.search(request.query, request.filters);

      const endTime = Date.now();
      const executionTime = endTime - startTime;

      return {
        success: true,
        result: searchResult,
        executionTime,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        executionTime: 0,
        timestamp: new Date()
      };
    }
  }

  /**
   * Valida la solicitud de búsqueda
   */
  private validateRequest(request: SearchCapabilitiesRequest): void {
    if (!request.query || typeof request.query !== 'string') {
      throw new Error('Query is required and must be a string');
    }

    if (request.query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    if (request.query.length > 500) {
      throw new Error('Query is too long (maximum 500 characters)');
    }

    // Validar filtros si están presentes
    if (request.filters) {
      this.validateFilters(request.filters);
    }
  }

  /**
   * Valida los filtros de búsqueda
   */
  private validateFilters(filters: SearchFilters): void {
    if (filters.dateRange) {
      const { from, to } = filters.dateRange;
      if (from >= to) {
        throw new Error('Date range "from" must be before "to"');
      }
      
      const now = new Date();
      if (to > now) {
        throw new Error('Date range "to" cannot be in the future');
      }
    }

    if (filters.categories && filters.categories.length === 0) {
      throw new Error('Categories filter cannot be empty array');
    }

    if (filters.complexity && filters.complexity.length === 0) {
      throw new Error('Complexity filter cannot be empty array');
    }
  }
}

/**
 * Solicitud para búsqueda de capacidades
 */
export interface SearchCapabilitiesRequest {
  query: string;
  filters?: SearchFilters;
}

/**
 * Respuesta de búsqueda de capacidades
 */
export interface SearchCapabilitiesResponse {
  success: boolean;
  result?: SearchResult;
  error?: string;
  executionTime: number;
  timestamp: Date;
}
