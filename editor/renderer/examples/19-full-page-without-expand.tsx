import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { createSchema, defaultSchemaConfig } from '@atlaskit/adf-schema';

const schemaWithoutExpand = createSchema({
  nodes: defaultSchemaConfig.nodes.filter((node) => node !== 'expand'),
});

export default function Example() {
  return (
    <RendererDemo
      appearance="full-page"
      serializer="react"
      allowHeadingAnchorLinks
      allowColumnSorting={true}
      schema={schemaWithoutExpand}
    />
  );
}
