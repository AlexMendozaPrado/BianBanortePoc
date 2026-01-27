"""
Script de migracion: Excel -> JSON
Convierte el archivo Excel de BIAN a la nueva estructura JSON de 6 niveles.

Uso: python scripts/migrate_excel_to_json.py
"""

import pandas as pd
import json
from collections import defaultdict
import os

def clean_text(text):
    """Limpia texto de caracteres especiales y valores nulos"""
    if pd.isna(text):
        return ""
    return str(text).strip()

def get_safe_value(row, index, default=""):
    """Obtiene valor seguro de una fila por índice"""
    try:
        val = row.iloc[index]
        return clean_text(val)
    except (IndexError, KeyError):
        return default

def get_safe_number(row, index, default=None):
    """Obtiene valor numérico seguro"""
    try:
        val = row.iloc[index]
        if pd.isna(val):
            return default
        return int(val)
    except (IndexError, KeyError, ValueError):
        return default

def build_hierarchy(df):
    """Construye la jerarquia de capacidades desde el DataFrame principal"""
    print(f"Procesando {len(df)} filas de la hoja principal...")

    # Estructura para acumular datos
    capacidades = defaultdict(lambda: {
        'nombre': '',
        'subcapacidades': defaultdict(lambda: {
            'nombre': '',
            'funcionalidadesBase': defaultdict(lambda: {
                'nombre': '',
                'descripcion': '',
                'funcionalidades': []
            })
        })
    })

    for idx, row in df.iterrows():
        # Mapeo de columnas segun estructura del Excel 'Matriz CE y Func.'
        # Col 1: Id CE (CE-01)
        # Col 2: Nombre Capacidad Empresarial
        # Col 3: Id SubCE (SCE-01-01)
        # Col 4: Nombre SubCapacidad
        # Col 5: Id Funcionalidad Base (FN-01-01-001)
        # Col 6: Nombre Funcionalidad Base
        # Col 7: Id Funcionalidad (FN-01.047)
        # Col 8: Nombre Funcionalidad
        # Col 9: Descripcion
        # Col 10: ID Componente Comun
        # Col 11: Nombre CC
        # Col 12: Nivel/Calificacion
        # Col 13: Sistema/Aplicacion

        cap_id = get_safe_value(row, 1)  # Id CE
        cap_nombre = get_safe_value(row, 2)  # Nombre Capacidad Empresarial
        subcap_id = get_safe_value(row, 3)  # Id SubCE
        subcap_nombre = get_safe_value(row, 4)  # Nombre SubCapacidad
        func_base_id = get_safe_value(row, 5)  # Id Funcionalidad Base
        func_base_nombre = get_safe_value(row, 6)  # Nombre Funcionalidad Base
        func_id = get_safe_value(row, 7)  # Id Funcionalidad
        func_nombre = get_safe_value(row, 8)  # Nombre Funcionalidad
        descripcion = get_safe_value(row, 9)  # Descripcion
        cc_id = get_safe_value(row, 10)  # ID Componente Comun
        cc_nombre = get_safe_value(row, 11)  # Nombre CC
        nivel = get_safe_number(row, 12)  # Nivel/Calificacion
        sistema = get_safe_value(row, 13)  # Sistema/Aplicacion

        # Saltar filas de encabezado o sin datos esenciales
        if not cap_id or cap_id == 'Id CE' or not func_id or func_id == 'Id':
            continue

        # Actualizar capacidad
        capacidades[cap_id]['nombre'] = cap_nombre

        # Actualizar subcapacidad
        capacidades[cap_id]['subcapacidades'][subcap_id]['nombre'] = subcap_nombre

        # Actualizar funcionalidad base
        fb = capacidades[cap_id]['subcapacidades'][subcap_id]['funcionalidadesBase'][func_base_id]
        fb['nombre'] = func_base_nombre

        # Agregar funcionalidad
        funcionalidad = {
            "Id": func_id,
            "Nombre": func_nombre,
            "Descripcion": descripcion
        }

        # Solo agregar campos opcionales si tienen valor
        if nivel is not None:
            funcionalidad["Nivel"] = nivel
        if sistema:
            funcionalidad["Sistema"] = sistema
        if cc_id:
            funcionalidad["ComponenteComunId"] = cc_id
        if cc_nombre:
            funcionalidad["ComponenteComunNombre"] = cc_nombre

        fb['funcionalidades'].append(funcionalidad)

    # Convertir a estructura final
    grupo = {
        "Nombre": "Customer Engagement",
        "estilo": "success",
        "capacidades": []
    }

    for cap_id in sorted(capacidades.keys()):
        cap_data = capacidades[cap_id]
        capacidad = {
            "Id": cap_id,
            "Nombre": cap_data['nombre'],
            "subcapacidades": []
        }

        for subcap_id in sorted(cap_data['subcapacidades'].keys()):
            subcap_data = cap_data['subcapacidades'][subcap_id]
            subcapacidad = {
                "Id": subcap_id,
                "Nombre": subcap_data['nombre'],
                "Descripcion": "",
                "funcionalidadesBase": []
            }

            for fb_id in sorted(subcap_data['funcionalidadesBase'].keys()):
                fb_data = subcap_data['funcionalidadesBase'][fb_id]
                func_base = {
                    "Id": fb_id,
                    "Nombre": fb_data['nombre'],
                    "Descripcion": fb_data.get('descripcion', ''),
                    "funcionalidades": fb_data['funcionalidades']
                }
                subcapacidad['funcionalidadesBase'].append(func_base)

            capacidad['subcapacidades'].append(subcapacidad)

        grupo['capacidades'].append(capacidad)

    print(f"  - Capacidades encontradas: {len(grupo['capacidades'])}")
    total_funcs = sum(
        len(fb['funcionalidades'])
        for cap in grupo['capacidades']
        for sc in cap['subcapacidades']
        for fb in sc['funcionalidadesBase']
    )
    print(f"  - Total funcionalidades: {total_funcs}")

    return [grupo]

def build_common_components(df_func, df_icc):
    """Construye los componentes comunes desde las hojas CC"""
    print(f"Procesando Componentes Comunes...")

    # Agrupar funcionalidades por CC
    cc_data = defaultdict(lambda: {'nombre': '', 'funcionalidades': []})

    for _, row in df_func.iterrows():
        cc_id = clean_text(row.get('ID CC', ''))
        cc_nombre = clean_text(row.get('Nombre CC', ''))
        func_id = clean_text(row.get('No. Funcionalidad', ''))

        if cc_id and func_id:
            cc_data[cc_id]['nombre'] = cc_nombre
            cc_data[cc_id]['funcionalidades'].append(func_id)

    # Agregar info de ICC
    icc_info = {}
    for _, row in df_icc.iterrows():
        cc_id = clean_text(row.get('ID CC', ''))
        if cc_id:
            icc_info[cc_id] = {
                'ocpId': clean_text(row.get('ID Componente OCP', '')),
                'descripcion': clean_text(row.get('Descripcion', '')),
                'proyectoOrigen': clean_text(row.get('Proyecto Origen', ''))
            }

    # Combinar en estructura final
    componentes = []
    for cc_id in sorted(cc_data.keys()):
        data = cc_data[cc_id]
        icc = icc_info.get(cc_id, {})

        componente = {
            "Id": cc_id,
            "Nombre": data['nombre'],
            "FuncionalidadesIds": list(set(data['funcionalidades']))
        }

        if icc.get('ocpId'):
            componente["IdOCP"] = icc['ocpId']
        if icc.get('descripcion'):
            componente["Descripcion"] = icc['descripcion']
        if icc.get('proyectoOrigen'):
            componente["ProyectoOrigen"] = icc['proyectoOrigen']

        componentes.append(componente)

    print(f"  - Componentes comunes encontrados: {len(componentes)}")
    return componentes

def build_services(df):
    """Construye los servicios desde la hoja CC y Servicios"""
    print(f"Procesando Servicios...")

    servicios = []
    seen = set()

    for _, row in df.iterrows():
        servicio_id = clean_text(row.get('ID Servicio', ''))
        cc_id = clean_text(row.get('ID Componente común candidato', ''))
        cc_nombre = clean_text(row.get('Nombre Componente Común', ''))

        if servicio_id and servicio_id not in seen and servicio_id.lower() != 'nan':
            seen.add(servicio_id)
            servicio = {
                "Id": servicio_id,
                "Nombre": cc_nombre
            }
            if cc_id:
                servicio["ComponentesComunesIds"] = [cc_id]
            servicios.append(servicio)

    print(f"  - Servicios encontrados: {len(servicios)}")
    return servicios

def build_control_processes(df):
    """Construye los procesos de control desde la hoja correspondiente"""
    print(f"Procesando Procesos de Control...")

    procesos = []

    for idx, row in df.iterrows():
        nombre = clean_text(row.get('Procesos de Control', ''))
        cap_nombre = clean_text(row.get('Capacidad Empresarial', ''))
        subcap_nombre = clean_text(row.get('SubCapacidad Empresarial', ''))

        if nombre:
            proceso = {
                "Id": f"PC-{idx+1:03d}",
                "Nombre": nombre,
                "CapacidadEmpresarial": cap_nombre,
                "SubCapacidadEmpresarial": subcap_nombre
            }
            procesos.append(proceso)

    print(f"  - Procesos de control encontrados: {len(procesos)}")
    return procesos

def migrate_excel_to_json():
    """Funcion principal de migracion"""

    # Ruta del Excel
    excel_path = r'c:\Users\fluid\Downloads\Copia de CE CC y Funcionalidades 2025 v250805 copia.xlsx'

    # Ruta de salida
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    output_path = os.path.join(project_root, 'src', 'infrastructure', 'data', 'bian-data.json')

    print("=" * 60)
    print("MIGRACION EXCEL -> JSON")
    print("=" * 60)
    print(f"Archivo origen: {excel_path}")
    print(f"Archivo destino: {output_path}")
    print()

    # Verificar que el archivo existe
    if not os.path.exists(excel_path):
        print(f"ERROR: No se encontró el archivo: {excel_path}")
        return

    # Leer todas las hojas
    print("Leyendo hojas del Excel...")
    try:
        # Usar hoja 'Matriz CE y Func.' que contiene los datos principales
        df_main = pd.read_excel(excel_path, sheet_name='Matriz CE y Func.')
        print(f"  - Matriz CE y Func.: {len(df_main)} filas")
    except Exception as e:
        print(f"Error leyendo hoja principal: {e}")
        return

    try:
        # Nota: la hoja tiene un espacio al final en el nombre
        df_cc_func = pd.read_excel(excel_path, sheet_name='CC y Funcionalidades ')
        print(f"  - CC y Funcionalidades: {len(df_cc_func)} filas")
    except Exception as e:
        print(f"Advertencia: No se pudo leer 'CC y Funcionalidades': {e}")
        df_cc_func = pd.DataFrame()

    try:
        df_icc = pd.read_excel(excel_path, sheet_name='ICC')
        print(f"  - ICC: {len(df_icc)} filas")
    except Exception as e:
        print(f"Advertencia: No se pudo leer 'ICC': {e}")
        df_icc = pd.DataFrame()

    try:
        df_cc_services = pd.read_excel(excel_path, sheet_name='CC y Servicios')
        print(f"  - CC y Servicios: {len(df_cc_services)} filas")
    except Exception as e:
        print(f"Advertencia: No se pudo leer 'CC y Servicios': {e}")
        df_cc_services = pd.DataFrame()

    try:
        df_control = pd.read_excel(excel_path, sheet_name='Procesos de Control y Gobierno')
        print(f"  - Procesos de Control: {len(df_control)} filas")
    except Exception as e:
        print(f"Advertencia: No se pudo leer 'Procesos de Control y Gobierno': {e}")
        df_control = pd.DataFrame()

    print()

    # Construir estructura
    print("Construyendo estructura JSON...")
    data = {
        "version": "2.0",
        "grupos": build_hierarchy(df_main),
        "componentesComunes": build_common_components(df_cc_func, df_icc) if not df_cc_func.empty else [],
        "servicios": build_services(df_cc_services) if not df_cc_services.empty else [],
        "procesosControl": build_control_processes(df_control) if not df_control.empty else []
    }

    print()

    # Guardar JSON
    print("Guardando JSON...")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print()
    print("=" * 60)
    print("MIGRACIÓN COMPLETADA")
    print("=" * 60)
    print(f"Archivo generado: {output_path}")
    print(f"  - Grupos: {len(data['grupos'])}")
    print(f"  - Componentes Comunes: {len(data['componentesComunes'])}")
    print(f"  - Servicios: {len(data['servicios'])}")
    print(f"  - Procesos de Control: {len(data['procesosControl'])}")

if __name__ == '__main__':
    migrate_excel_to_json()
