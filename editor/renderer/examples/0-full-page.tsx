import React from 'react';
import RendererDemo from './helper/RendererDemo';
import {
  NORMAL_SEVERITY_THRESHOLD,
  DEGRADED_SEVERITY_THRESHOLD,
} from '../../renderer/src/ui/Renderer';

export default function Example() {
  return (
    <RendererDemo
      appearance="full-page"
      serializer="react"
      allowHeadingAnchorLinks
      allowColumnSorting={true}
      allowCopyToClipboard
      analyticsEventSeverityTracking={{
        enabled: true,
        severityNormalThreshold: NORMAL_SEVERITY_THRESHOLD,
        severityDegradedThreshold: DEGRADED_SEVERITY_THRESHOLD,
      }}
    />
  );
}
