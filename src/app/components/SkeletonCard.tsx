'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton,
  Box,
} from '@mui/material';

export function SkeletonCard() {
  return (
    <Card
      sx={{
        borderRadius: '8px',
        border: '1px solid #CFD2D3',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={<Skeleton variant="text" width="70%" height={24} />}
        action={<Skeleton variant="rectangular" width={60} height={24} />}
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: '12px' }} />
          <Skeleton variant="text" width={100} height={20} />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: '12px' }} />
          <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: '12px' }} />
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: '4px' }} />
        <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: '4px' }} />
      </CardActions>
    </Card>
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ gridColumn: '1', minHeight: '300px' }}>
          <SkeletonCard />
        </div>
      ))}
    </>
  );
}
