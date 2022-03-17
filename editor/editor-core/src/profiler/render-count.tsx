import React, { useRef } from 'react';
import uuid from 'uuid';

import {
  useComponentRenderTracking,
  UseComponentRenderTrackingArgs,
} from '@atlaskit/editor-common/utils';

import { RenderCountProfiler as RenderCountProfilerClass } from '@atlaskit/editor-common/utils';

export enum ProfiledComponentIds {
  editor = 'Editor',
  appearance = 'FullPageEditor',
  reactEditorView = 'ReactEditorView',
  contentArea = 'FullPageContentArea',
  toolbar = 'FullPageToolbar',
  mention = 'MentionNodeView',
}

type RenderCountProfilerProps = {
  componentId: keyof typeof ProfiledComponentIds;
};

const CoreRenderCountProfiler: React.FC<RenderCountProfilerProps> = ({
  componentId,
}) => {
  const { current: instanceId } = useRef(uuid());

  const onRender: UseComponentRenderTrackingArgs['onRender'] = ({
    renderCount,
  }) => {
    const profiler = RenderCountProfilerClass.getInstance({ store: window });
    profiler.setRenderCount({ componentId, instanceId, renderCount });
  };

  useComponentRenderTracking({
    onRender,
    propsDiffingOptions: { enabled: false },
    zeroBasedCount: false,
  });
  return null;
};

export const RenderCountProfiler: React.FC<RenderCountProfilerProps> = ({
  componentId,
}) => {
  const profiler = RenderCountProfilerClass.getInstance({ store: window });
  if (profiler.isEnabled()) {
    return <CoreRenderCountProfiler componentId={componentId} />;
  }
  return null;
};
