import React from 'react';

import Card from './internal/card';
import Layout from './internal/layout';

const edges = ['bottom', 'left', 'right', 'top'] as const;

export default function ClosestEdgeExample() {
  return (
    <div>
      <Layout testId="layout--without-gap">
        {edges.map(edge => (
          <Card key={edge} edge={edge}>
            {edge}
          </Card>
        ))}
      </Layout>
      <Layout testId="layout--with-gap">
        {edges.map(edge => (
          <Card key={edge} edge={edge} gap={32}>
            {edge}
          </Card>
        ))}
      </Layout>
    </div>
  );
}
