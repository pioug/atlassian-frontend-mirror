import React, { useContext } from 'react';

import type { RendererProps } from '../renderer-props';

export const PortalContext = React.createContext<RendererProps['portal']>(undefined);

export function usePortal(props?: Pick<RendererProps, 'portal'>) {
	const portalFromContext = useContext(PortalContext);

	return props?.portal || portalFromContext;
}
