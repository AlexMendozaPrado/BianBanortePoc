'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#EB0029',
        height: '64px', // Actualizado a especificación oficial
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: '64px', minHeight: '64px !important', padding: '0 24px' }}>
        {/* Logo Banorte actualizado */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
          <Box
            sx={{
              width: '120px',
              height: '32px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              color: '#EB0029',
              fontFamily: 'Gotham',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            BANORTE
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: 'Gotham',
              fontSize: '1.125rem',
              fontWeight: 500,
              color: 'white',
            }}
          >
            BIAN Explorer
          </Typography>
        </Box>

        {/* Iconos de herramientas */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Búsqueda global">
            <IconButton
              color="inherit"
              sx={{
                color: '#FFFFFF',
                '& .MuiSvgIcon-root': { fontSize: '24px' }
              }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notificaciones">
            <IconButton
              color="inherit"
              sx={{
                color: '#FFFFFF',
                '& .MuiSvgIcon-root': { fontSize: '24px' }
              }}
            >
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Perfil de usuario">
            <IconButton
              color="inherit"
              sx={{
                color: '#FFFFFF',
                '& .MuiSvgIcon-root': { fontSize: '24px' }
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Menú de configuración">
            <IconButton
              color="inherit"
              onClick={onMenuClick}
              sx={{
                color: '#FFFFFF',
                '& .MuiSvgIcon-root': { fontSize: '24px' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
