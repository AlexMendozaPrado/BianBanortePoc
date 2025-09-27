'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBanorteTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#E5E7EB',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#5B6670',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#EB0029',
      borderWidth: '2px',
    },
    '& input': {
      fontFamily: 'Roboto',
      fontSize: '1rem',
      color: '#323E48',
      padding: '12px 16px',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#5B6670',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    '&.Mui-focused': {
      color: '#EB0029',
    },
    '&.Mui-error': {
      color: '#FF671B',
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: 'Roboto',
    fontSize: '0.75rem',
    marginTop: '4px',
    '&.Mui-error': {
      color: '#FF671B',
    },
  },
}));

export const BanorteTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <StyledBanorteTextField
      variant="outlined"
      fullWidth
      {...props}
    />
  );
};