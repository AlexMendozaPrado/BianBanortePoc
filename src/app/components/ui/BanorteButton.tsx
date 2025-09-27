'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

interface BanorteButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  loading?: boolean;
  fullWidth?: boolean;
}

const StyledBanorteButton = styled(Button)<BanorteButtonProps>(({ variant }: { variant?: 'primary' | 'secondary' | 'outline' | 'text' }) => ({
  height: '45px',
  borderRadius: '4px',
  fontFamily: 'Gotham',
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '12px 24px',

  ...(variant === 'primary' && {
    backgroundColor: '#EB0029',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#E30028',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
    '&:disabled': {
      backgroundColor: '#7B868C',
      color: '#FFFFFF',
    },
  }),

  ...(variant === 'secondary' && {
    backgroundColor: '#323E48',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#5B6670',
    },
  }),

  ...(variant === 'outline' && {
    backgroundColor: 'transparent',
    border: '1px solid #EB0029',
    color: '#EB0029',
    '&:hover': {
      backgroundColor: 'rgba(235, 0, 41, 0.04)',
      borderColor: '#E30028',
    },
  }),

  ...(variant === 'text' && {
    backgroundColor: 'transparent',
    color: '#EB0029',
    '&:hover': {
      backgroundColor: 'rgba(235, 0, 41, 0.04)',
    },
  }),
}));

export const BanorteButton: React.FC<BanorteButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledBanorteButton
      variant={variant as any}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={20}
          sx={{
            color: variant === 'primary' ? '#FFFFFF' : '#EB0029',
            marginRight: 1
          }}
        />
      ) : null}
      {children}
    </StyledBanorteButton>
  );
};