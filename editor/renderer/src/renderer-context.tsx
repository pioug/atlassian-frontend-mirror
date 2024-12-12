/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import React from 'react';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export type RendererContextProps = {
	featureFlags?: FeatureFlags;
	// Keep this uninitialized it will be set to true in the top level renderer
	isTopLevelRenderer?: boolean;
};

const RendererContext = React.createContext({});

export const useRendererContext = () => React.useContext<RendererContextProps>(RendererContext);

export const RendererContextProvider = RendererContext.Provider;
