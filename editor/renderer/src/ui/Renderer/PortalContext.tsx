/* eslint-disable jsdoc/require-jsdoc -- thin portal context helpers */
import React, { useContext } from 'react';

import type { RendererProps } from '../renderer-props';

export const PortalContext: React.Context<HTMLElement | undefined> = React.createContext<RendererProps['portal']>(undefined);

export function usePortal(props?: Pick<RendererProps, 'portal'>): HTMLElement | undefined {
	const portalFromContext = useContext(PortalContext);

	return props?.portal || portalFromContext;
}
