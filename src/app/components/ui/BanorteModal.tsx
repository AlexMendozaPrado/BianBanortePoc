'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface BanorteModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    borderRadius: '8px',
    maxWidth: '720px',
    minHeight: '320px',
    padding: '32px',
    boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
    margin: '32px',
  },
}));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  padding: 0,
  marginBottom: '24px',
  fontFamily: 'Gotham',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#323E48',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledDialogContent = styled(DialogContent)(() => ({
  padding: 0,
  marginBottom: '24px',
  fontFamily: 'Roboto',
  fontSize: '1rem',
  lineHeight: 1.6,
  color: '#5B6670',
}));

const StyledDialogActions = styled(DialogActions)(() => ({
  padding: 0,
  gap: '12px',
  justifyContent: 'flex-end',
}));

export const BanorteModal: React.FC<BanorteModalProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
}) => {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
    >
      {title && (
        <StyledDialogTitle>
          {title}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: '#5B6670' }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
      )}

      <StyledDialogContent>
        {children}
      </StyledDialogContent>

      {actions && (
        <StyledDialogActions>
          {actions}
        </StyledDialogActions>
      )}
    </StyledDialog>
  );
};