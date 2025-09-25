'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Tema personalizado de Banorte para Material-UI
 * Basado en las especificaciones técnicas del Figma
 */
export const banorteTheme = createTheme({
  palette: {
    primary: {
      main: '#EB0029', // Rojo Banorte exacto
      light: '#FF5252',
      dark: '#E30028',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5B6670', // Gris secundario
      light: '#A2A9AD',
      dark: '#323E48',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    grey: {
      50: '#F4F7F8',
      100: '#EBF0F2',
      200: '#CFD2D3',
      300: '#A2A9AD',
      400: '#5B6670',
      500: '#323E48',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#F4F7F8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: [
      '"Roboto"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Gotham',
      fontWeight: 'bold',
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#323E48',
    },
    h2: {
      fontFamily: 'Gotham',
      fontWeight: '600',
      fontSize: '18px',
      lineHeight: 1.3,
      color: '#323E48',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#323E48',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#323E48',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#323E48',
    },
    h6: {
      fontFamily: 'Gotham',
      fontSize: '18px',
      fontWeight: 'medium',
      lineHeight: 1.5,
      color: '#323E48',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#5B6670',
    },
    button: {
      fontFamily: 'Gotham',
      fontWeight: '500',
      textTransform: 'none',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#757575',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#212121',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      color: '#757575',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#757575',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          height: '45px',
          fontFamily: 'Gotham',
          fontSize: '15px',
          fontWeight: 'medium',
          textTransform: 'none',
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: '#EB0029',
          '&:hover': {
            backgroundColor: '#E30028',
          },
        },
        outlined: {
          borderColor: '#EB0029',
          color: '#EB0029',
          height: '40px',
          fontFamily: 'Gotham',
          fontSize: '15px',
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
          border: '1px solid #CFD2D3',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Gotham',
          fontSize: '13px',
          height: '32px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            fontFamily: 'Gotham',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#EB0029',
          height: '63px',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#F4F7F8',
          borderRight: '1px solid #CFD2D3',
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
