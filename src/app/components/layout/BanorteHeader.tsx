'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle, Menu as MenuIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#323E48',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
  height: '64px',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  height: '64px',
  padding: '0 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}));

const BanorteLogo = styled('div')(({ theme }) => ({
  width: '120px',
  height: '32px',
  backgroundColor: '#EB0029',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  color: '#FFFFFF',
  fontFamily: 'Gotham',
  fontWeight: 700,
  fontSize: '1rem',
}));

interface BanorteHeaderProps {
  title?: string;
  user?: {
    name: string;
    email?: string;
  };
  onMenuClick?: () => void;
  onUserMenuClick?: () => void;
}

export const BanorteHeader: React.FC<BanorteHeaderProps> = ({
  title,
  user,
  onMenuClick,
  onUserMenuClick,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <StyledToolbar>
        <LogoSection>
          {onMenuClick && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onMenuClick}
              sx={{ marginRight: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <BanorteLogo>
            BANORTE
          </BanorteLogo>

          {title && (
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: 'Gotham',
                fontWeight: 500,
                color: '#323E48',
              }}
            >
              {title}
            </Typography>
          )}
        </LogoSection>

        {user && (
          <Box>
            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <Typography sx={{ fontFamily: 'Roboto' }}>
                  {user.name}
                </Typography>
              </MenuItem>
              {user.email && (
                <MenuItem onClick={handleClose}>
                  <Typography sx={{ fontFamily: 'Roboto', fontSize: '0.875rem', color: '#5B6670' }}>
                    {user.email}
                  </Typography>
                </MenuItem>
              )}
              <MenuItem onClick={handleClose}>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </StyledToolbar>
    </StyledAppBar>
  );
};