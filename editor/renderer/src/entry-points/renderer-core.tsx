/* eslint-disable @atlaskit/editor/no-re-export */

import type { ComponentType } from 'react';

import type { RendererProps } from '../ui/renderer-props';
import { RendererWithAnalytics } from '../ui/Renderer/index';

export type { RendererProps } from '../ui/renderer-props';

// Intentional - all Renderers should use Editor Analytics
export const Renderer: ComponentType<RendererProps> = RendererWithAnalytics;
