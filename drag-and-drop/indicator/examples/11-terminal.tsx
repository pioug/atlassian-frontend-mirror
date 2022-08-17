import React from 'react';

import Layout from './internal/layout';
import Tree from './internal/tree';
import TreeItem from './internal/tree-item';

const edges = ['top', 'bottom', 'child'] as const;

export default function TerminalExample() {
  return (
    <Layout testId="layout--appearance">
      {edges.map(edge => (
        <Tree>
          <TreeItem>Item</TreeItem>
          <TreeItem edge={edge}>Item with {edge} edge</TreeItem>
          <TreeItem>Item</TreeItem>
        </Tree>
      ))}
    </Layout>
  );
}
