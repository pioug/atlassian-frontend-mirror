/* eslint-disable @atlaskit/editor/no-re-export */

import type { ComponentType } from 'react';

import { withDefaultNodes } from '../react/utils/withDefaultNodes';
import type { RendererProps } from '../ui/renderer-props';
import { RendererWithAnalytics } from '../ui/Renderer/index';

export type { RendererProps } from '../ui/renderer-props';

export const Renderer: ComponentType<RendererProps> = withDefaultNodes(RendererWithAnalytics);
