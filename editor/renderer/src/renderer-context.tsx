import React from 'react';
import type { FeatureFlags } from '@atlaskit/editor-common/types';

export type RendererContextProps = {
  featureFlags?: FeatureFlags;
};

const RendererContext = React.createContext({});

export const useRendererContext = () =>
  React.useContext<RendererContextProps>(RendererContext);

export const RendererContextProvider = RendererContext.Provider;
