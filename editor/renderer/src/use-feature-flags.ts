/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { type RendererContextProps, useRendererContext } from './renderer-context';

export const useFeatureFlags = (): RendererContextProps['featureFlags'] | undefined =>
	useRendererContext()?.featureFlags;
