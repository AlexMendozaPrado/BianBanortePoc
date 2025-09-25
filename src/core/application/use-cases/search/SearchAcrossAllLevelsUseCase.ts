import { CapabilityGroupRepository } from '../../../domain/ports/CapabilityGroupRepository';
import { CapabilityGroup } from '../../../domain/entities/CapabilityGroup';

/**
 * DTO para resultados de búsqueda con información de nivel
 */
export interface SearchResultDto {
  level: 'group' | 'capability' | 'business' | 'subcapability' | 'functionality';
  id: string;
  name: string;
  description: string;
  matchedText: string;
  path: {
    groupId: string;
    groupName: string;
    capabilityId?: string;
    capabilityName?: string;
    businessCapabilityId?: string;
    businessCapabilityName?: string;
    subCapabilityId?: string;
    subCapabilityName?: string;
  };
  style: {
    name: string;
    color: string;
  };
}

/**
 * Caso de uso para búsqueda avanzada en todos los niveles de la jerarquía
 */
export class SearchAcrossAllLevelsUseCase {
  constructor(private capabilityGroupRepository: CapabilityGroupRepository) {}

  /**
   * Busca en todos los niveles de la jerarquía
   */
  async execute(query: string): Promise<SearchResultDto[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const searchTerm = query.toLowerCase().trim();
      const groups = await this.capabilityGroupRepository.findAll();
      const results: SearchResultDto[] = [];

      for (const group of groups) {
        // Buscar en nivel de grupo
        if (this.matchesSearchTerm(group.name, searchTerm)) {
          results.push(this.createGroupResult(group, group.name, searchTerm));
        }

        // Buscar en capacidades
        for (const capability of group.capabilities) {
          if (this.matchesSearchTerm(capability.name, searchTerm)) {
            results.push(this.createCapabilityResult(group, capability, capability.name, searchTerm));
          }

          // Buscar en capacidades empresariales
          for (const businessCap of capability.businessCapabilities) {
            if (this.matchesSearchTerm(businessCap.name, searchTerm) ||
                this.matchesSearchTerm(businessCap.description, searchTerm)) {
              results.push(this.createBusinessCapabilityResult(
                group, capability, businessCap,
                this.getMatchedText([businessCap.name, businessCap.description], searchTerm),
                searchTerm
              ));
            }

            // Buscar en subcapacidades
            for (const subCap of businessCap.subCapabilities) {
              if (this.matchesSearchTerm(subCap.name, searchTerm) ||
                  this.matchesSearchTerm(subCap.description, searchTerm)) {
                results.push(this.createSubCapabilityResult(
                  group, capability, businessCap, subCap,
                  this.getMatchedText([subCap.name, subCap.description], searchTerm),
                  searchTerm
                ));
              }

              // Buscar en funcionalidades
              for (const func of subCap.functionalities) {
                if (this.matchesSearchTerm(func.name, searchTerm) ||
                    this.matchesSearchTerm(func.description, searchTerm)) {
                  results.push(this.createFunctionalityResult(
                    group, capability, businessCap, subCap, func,
                    this.getMatchedText([func.name, func.description], searchTerm),
                    searchTerm
                  ));
                }
              }
            }
          }
        }
      }

      return this.sortResultsByRelevance(results, searchTerm);
    } catch (error) {
      throw new Error(`Search failed: ${error}`);
    }
  }

  /**
   * Verifica si un texto contiene el término de búsqueda
   */
  private matchesSearchTerm(text: string, searchTerm: string): boolean {
    return text.toLowerCase().includes(searchTerm);
  }

  /**
   * Obtiene el texto que coincide con la búsqueda
   */
  private getMatchedText(texts: string[], searchTerm: string): string {
    for (const text of texts) {
      if (this.matchesSearchTerm(text, searchTerm)) {
        return text;
      }
    }
    return texts[0] || '';
  }

  /**
   * Crea resultado para nivel de grupo
   */
  private createGroupResult(group: CapabilityGroup, matchedText: string, searchTerm: string): SearchResultDto {
    return {
      level: 'group',
      id: group.id,
      name: group.name,
      description: `Grupo de capacidades con estilo ${group.style.getValue()}`,
      matchedText: this.highlightSearchTerm(matchedText, searchTerm),
      path: {
        groupId: group.id,
        groupName: group.name,
      },
      style: {
        name: group.style.getValue(),
        color: group.style.getColor(),
      },
    };
  }

  /**
   * Crea resultado para nivel de capacidad
   */
  private createCapabilityResult(group: any, capability: any, matchedText: string, searchTerm: string): SearchResultDto {
    return {
      level: 'capability',
      id: capability.id.getValue(),
      name: capability.name,
      description: `Capacidad dentro de ${group.name}`,
      matchedText: this.highlightSearchTerm(matchedText, searchTerm),
      path: {
        groupId: group.id,
        groupName: group.name,
        capabilityId: capability.id.getValue(),
        capabilityName: capability.name,
      },
      style: {
        name: group.style.getValue(),
        color: group.style.getColor(),
      },
    };
  }

  /**
   * Crea resultado para nivel de capacidad empresarial
   */
  private createBusinessCapabilityResult(group: any, capability: any, businessCap: any, matchedText: string, searchTerm: string): SearchResultDto {
    return {
      level: 'business',
      id: businessCap.id,
      name: businessCap.name,
      description: businessCap.description,
      matchedText: this.highlightSearchTerm(matchedText, searchTerm),
      path: {
        groupId: group.id,
        groupName: group.name,
        capabilityId: capability.id.getValue(),
        capabilityName: capability.name,
        businessCapabilityId: businessCap.id,
        businessCapabilityName: businessCap.name,
      },
      style: {
        name: group.style.getValue(),
        color: group.style.getColor(),
      },
    };
  }

  /**
   * Crea resultado para nivel de subcapacidad
   */
  private createSubCapabilityResult(group: any, capability: any, businessCap: any, subCap: any, matchedText: string, searchTerm: string): SearchResultDto {
    return {
      level: 'subcapability',
      id: subCap.id,
      name: subCap.name,
      description: subCap.description,
      matchedText: this.highlightSearchTerm(matchedText, searchTerm),
      path: {
        groupId: group.id,
        groupName: group.name,
        capabilityId: capability.id.getValue(),
        capabilityName: capability.name,
        businessCapabilityId: businessCap.id,
        businessCapabilityName: businessCap.name,
        subCapabilityId: subCap.id,
        subCapabilityName: subCap.name,
      },
      style: {
        name: group.style.getValue(),
        color: group.style.getColor(),
      },
    };
  }

  /**
   * Crea resultado para nivel de funcionalidad
   */
  private createFunctionalityResult(group: any, capability: any, businessCap: any, subCap: any, func: any, matchedText: string, searchTerm: string): SearchResultDto {
    return {
      level: 'functionality',
      id: func.id,
      name: func.name,
      description: func.description,
      matchedText: this.highlightSearchTerm(matchedText, searchTerm),
      path: {
        groupId: group.id,
        groupName: group.name,
        capabilityId: capability.id.getValue(),
        capabilityName: capability.name,
        businessCapabilityId: businessCap.id,
        businessCapabilityName: businessCap.name,
        subCapabilityId: subCap.id,
        subCapabilityName: subCap.name,
      },
      style: {
        name: group.style.getValue(),
        color: group.style.getColor(),
      },
    };
  }

  /**
   * Resalta el término de búsqueda en el texto
   */
  private highlightSearchTerm(text: string, searchTerm: string): string {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Ordena los resultados por relevancia
   */
  private sortResultsByRelevance(results: SearchResultDto[], searchTerm: string): SearchResultDto[] {
    return results.sort((a, b) => {
      // Priorizar coincidencias exactas en el nombre
      const aExactName = a.name.toLowerCase() === searchTerm.toLowerCase();
      const bExactName = b.name.toLowerCase() === searchTerm.toLowerCase();

      if (aExactName && !bExactName) return -1;
      if (!aExactName && bExactName) return 1;

      // Priorizar coincidencias al inicio del nombre
      const aStartsWithName = a.name.toLowerCase().startsWith(searchTerm.toLowerCase());
      const bStartsWithName = b.name.toLowerCase().startsWith(searchTerm.toLowerCase());

      if (aStartsWithName && !bStartsWithName) return -1;
      if (!aStartsWithName && bStartsWithName) return 1;

      // Ordenar por jerarquía (grupos primero, funcionalidades al final)
      const levelOrder = { group: 1, capability: 2, business: 3, subcapability: 4, functionality: 5 };
      return levelOrder[a.level] - levelOrder[b.level];
    });
  }
}