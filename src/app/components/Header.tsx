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
        height: '63px',
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ height: '63px', minHeight: '63px !important' }}>
        {/* Logo Banorte */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontFamily: 'Gotham',
            fontSize: '18px',
            fontWeight: 'medium',
            color: 'white',
          }}
        >
          Banorte
        </Typography>

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
