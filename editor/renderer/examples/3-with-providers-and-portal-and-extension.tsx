import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example() {
  return (
    <RendererDemo
      withProviders={true}
      withPortal={true}
      withExtension={true}
      serializer="react"
    />
  );
}
