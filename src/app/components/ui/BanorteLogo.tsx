'use client';

import Image from 'next/image';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface BanorteLogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: 'red' | 'white' | 'full-color';
  useOfficialLogo?: boolean;
  href?: string; // Para hacer el logo clickeable
}

const LogoContainer = styled(Box)<{ clickable: boolean }>(({ clickable }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: clickable ? 'pointer' : 'default',
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: clickable ? 0.8 : 1,
  },
}));

const FallbackLogo = styled(Box)<{ variant: string; height: number }>(({ variant, height }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Gotham, sans-serif',
  fontWeight: 700,
  fontSize: `${height * 0.25}px`,
  color: variant === 'white' ? '#FFFFFF' : '#FFFFFF',
  backgroundColor: variant === 'white' ? 'transparent' : '#EB0029',
  border: variant === 'white' ? '2px solid #FFFFFF' : '2px solid transparent',
  borderRadius: '4px',
  padding: '8px 16px',
  minWidth: `${height * 2.5}px`,
  height: `${height}px`,
}));

export const BanorteLogo: React.FC<BanorteLogoProps> = ({
  className = "",
  width = 140,
  height = 40,
  variant = 'red',
  useOfficialLogo = true,
  href
}) => {
  const [imageError, setImageError] = useState(false);
  const isClickable = Boolean(href);

  const LogoContent = () => {
    // Intentar usar logo oficial primero
    if (useOfficialLogo && !imageError) {
      return (
        <Image
          src="/images/LogotipoBanorteFinal.png"
          alt="Banorte"
          width={width}
          height={height}
          className="object-contain"
          style={{
            filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none',
            maxWidth: width,
            maxHeight: height,
          }}
          onError={() => setImageError(true)}
          priority
        />
      );
    }

    // Fallback a logo de texto
    return (
      <FallbackLogo variant={variant} height={height}>
        BANORTE
      </FallbackLogo>
    );
  };

  const logoElement = (
    <LogoContainer
      className={className}
      clickable={isClickable}
      style={{ width, height }}
    >
      <LogoContent />
    </LogoContainer>
  );

  // Si tiene href, envolver en link
  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none' }}>
        {logoElement}
      </a>
    );
  }

  return logoElement;
};