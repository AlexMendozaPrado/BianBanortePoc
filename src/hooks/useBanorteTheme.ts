import { useTheme } from '@mui/material/styles';

export const useBanorteTheme = () => {
  const theme = useTheme();

  return {
    colors: {
      primary: theme.palette.primary.main,
      primaryHover: theme.palette.primary.dark,
      textPrimary: theme.palette.text.primary,
      textSecondary: theme.palette.text.secondary,
      surface1: theme.palette.background.paper,
      surface2: theme.palette.background.default,
      success: theme.palette.success.main,
      warning: theme.palette.warning.main,
      error: theme.palette.error.main,
    },
    spacing: theme.spacing,
    borderRadius: theme.shape.borderRadius,
  };
};