import React from 'react';
import RendererDemo from './helper/RendererDemo';

export default function Example() {
  return (
    <RendererDemo
      appearance="full-page"
      serializer="react"
      allowHeadingAnchorLinks
      allowColumnSorting={true}
      useSpecBasedValidator={true}
      unsupportedContentLevelsTracking={{
        enabled: true,
        thresholds: {
          degraded: 10,
          blocking: 20,
        },
      }}
    />
  );
}
