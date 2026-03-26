/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { useRendererContext } from './renderer-context';
import type { RendererContextProps } from './renderer-context';

export const useFeatureFlags = (): RendererContextProps['featureFlags'] | undefined =>
	useRendererContext()?.featureFlags;
