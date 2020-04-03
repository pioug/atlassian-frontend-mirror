import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example() {
  return (
    <RendererDemo truncationEnabled={true} maxHeight={96} serializer="react" />
  );
}
