import React from 'react';

import Card from './internal/card';
import Layout from './internal/layout';

const gaps = [32, 16, 8, 4, 0] as const;

export default function ClosestEdgeExample() {
  return (
    <Layout testId="layout">
      {gaps.map(gap => (
        <Card edge="right" gap={gap}>
          {gap}px
        </Card>
      ))}
    </Layout>
  );
}
