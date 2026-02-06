/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import React from 'react';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { RendererContentMode, NestedRendererType } from './ui/Renderer/types';

export type RendererContextProps = {
	contentMode?: RendererContentMode;
	featureFlags?: FeatureFlags;
	// Keep this uninitialized it will be set to true in the top level renderer
	isTopLevelRenderer?: boolean;
	// used for analytics to track the type of nested renderer this is
	nestedRendererType?: NestedRendererType;
};

const RendererContext = React.createContext({});

export const useRendererContext = () => React.useContext<RendererContextProps>(RendererContext);

export const RendererContextProvider = RendererContext.Provider;
