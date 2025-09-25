'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Colores oficiales de Banorte según especificación
const banorteColors = {
  primary: '#EB0029',        // Banorte Red
  primaryHover: '#E30028',   // Banorte Red Hover
  primaryLight: '#EBF0F2',   // Light Primary
  surface1: '#FFFFFF',       // Surface 1
  surface2: '#F8F9FA',       // Surface 2
  textPrimary: '#323E48',    // Dark Gray
  textSecondary: '#5B6670',  // Medium Gray
  textDisabled: '#7B868C',   // Light Gray
  success: '#6CC04A',        // Green
  warning: '#FFA400',        // Orange
  error: '#FF671B',          // Error Orange
  borderDashed: '#D1D5DB',   // Dashed Border
  borderLight: '#E5E7EB',    // Light Border
};

/**
 * Tema personalizado de Banorte para Material-UI
 * Actualizado según la Guía de Estilos Web Banorte Versión 1
 */
export const banorteTheme = createTheme({
  palette: {
    primary: {
      main: banorteColors.primary,
      dark: banorteColors.primaryHover,
      light: banorteColors.primaryLight,
      contrastText: banorteColors.surface1,
    },
    secondary: {
      main: banorteColors.textPrimary,
      light: banorteColors.textSecondary,
      dark: banorteColors.textPrimary,
      contrastText: banorteColors.surface1,
    },
    success: {
      main: banorteColors.success,
    },
    warning: {
      main: banorteColors.warning,
    },
    error: {
      main: banorteColors.error,
    },
    background: {
      default: banorteColors.surface2,
      paper: banorteColors.surface1,
    },
    text: {
      primary: banorteColors.textPrimary,
      secondary: banorteColors.textSecondary,
      disabled: banorteColors.textDisabled,
    },
    divider: banorteColors.borderLight,
  },
  typography: {
    fontFamily: [
      'Gotham',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),

    // Headers y elementos de UI usan Gotham
    h1: {
      fontFamily: 'Gotham',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: banorteColors.textPrimary,
    },
    h2: {
      fontFamily: 'Gotham',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      color: banorteColors.textPrimary,
    },
    h3: {
      fontFamily: 'Gotham',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: banorteColors.textPrimary,
    },
    h4: {
      fontFamily: 'Gotham',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: banorteColors.textPrimary,
    },
    h5: {
      fontFamily: 'Gotham',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: banorteColors.textPrimary,
    },
    h6: {
      fontFamily: 'Gotham',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: banorteColors.textPrimary,
    },

    // Contenido usa Roboto
    body1: {
      fontFamily: 'Roboto',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: banorteColors.textSecondary,
    },
    body2: {
      fontFamily: 'Roboto',
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: banorteColors.textSecondary,
    },

    // Botones usan Gotham
    button: {
      fontFamily: 'Gotham',
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.02em',
    },

    subtitle1: {
      fontFamily: 'Roboto',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: banorteColors.textSecondary,
    },
    subtitle2: {
      fontFamily: 'Roboto',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: banorteColors.textSecondary,
    },
    caption: {
      fontFamily: 'Roboto',
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: banorteColors.textSecondary,
    },
  } as ThemeOptions['typography'],
  shape: {
    borderRadius: 4, // Especificación oficial: 4px
  },

  spacing: 8, // Sistema de spacing basado en múltiplos de 8px

  components: {
    // Configuración global de botones
    MuiButton: {
      styleOverrides: {
        root: {
          height: '45px', // Altura oficial para botones primarios
          borderRadius: '4px',
          fontFamily: 'Gotham',
          fontWeight: 500,
          fontSize: '0.875rem',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: banorteColors.primary,
          color: banorteColors.surface1,
          '&:hover': {
            backgroundColor: banorteColors.primaryHover,
          },
          '&:disabled': {
            backgroundColor: banorteColors.textDisabled,
            color: banorteColors.surface1,
          },
        },
        outlinedPrimary: {
          borderColor: banorteColors.primary,
          color: banorteColors.primary,
          '&:hover': {
            borderColor: banorteColors.primaryHover,
            backgroundColor: 'rgba(235, 0, 41, 0.04)',
          },
        },
      },
    },

    // Configuración de campos de texto
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            '& fieldset': {
              borderColor: banorteColors.borderLight,
            },
            '&:hover fieldset': {
              borderColor: banorteColors.textSecondary,
            },
            '&.Mui-focused fieldset': {
              borderColor: banorteColors.primary,
            },
          },
          '& .MuiInputLabel-root': {
            color: banorteColors.textSecondary,
            fontFamily: 'Roboto',
            '&.Mui-focused': {
              color: banorteColors.primary,
            },
          },
        },
      },
    },

    // Configuración de modales
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px', // Modales usan 8px según especificación
          maxWidth: '720px',   // Ancho oficial para modales
          minHeight: '320px',  // Altura mínima oficial
          padding: '32px',
          boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
        },
      },
    },

    // Headers y navegación
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: banorteColors.surface1,
          color: banorteColors.textPrimary,
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
          height: '64px',
        },
      },
    },
    // Configuración de Cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${banorteColors.borderLight}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    // Configuración de Chips
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Gotham',
          fontSize: '0.75rem',
          height: '32px',
        },
      },
    },

    // Configuración de Drawers
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: banorteColors.surface2,
          borderRight: `1px solid ${banorteColors.borderLight}`,
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        root: {
          '& .MuiTreeItem-content': {
            padding: '8px 12px',
            borderRadius: '4px',
            fontFamily: 'Gotham',
            fontSize: '14px',
            color: '#323E48',
          },
          '& .Mui-selected': {
            backgroundColor: '#EB0029 !important',
            color: 'white',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: '1px solid #CFD2D3',
          '&.Mui-selected': {
            backgroundColor: '#EB0029',
            color: 'white',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #EBF0F2',
          '&:before': {
            display: 'none'
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontFamily: 'Gotham',
          fontSize: '14px',
          fontWeight: '500',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
        },
        elevation3: {
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.16)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          borderRight: '1px solid #E0E0E0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(227, 30, 36, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(227, 30, 36, 0.12)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 8,
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #F0F0F0',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#FAFAFA',
            borderBottom: '2px solid #E0E0E0',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(227, 30, 36, 0.04)',
          },
        },
      },
    },
  },
});

export default banorteTheme;
