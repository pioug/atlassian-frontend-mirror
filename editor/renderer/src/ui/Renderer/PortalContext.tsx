import React, { useContext } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import type { RendererProps } from '../renderer-props';

export const PortalContext = React.createContext<RendererProps['portal']>(undefined);

export const usePortal = ({
	portal: portalFromProps,
}: { portal?: RendererProps['portal'] } = {}) => {
	const portalFromContext = useContext(PortalContext);
	if (portalFromProps) {
		return portalFromProps;
	}
	if (fg('cc_complexit_reduce_portal_rerenders')) {
		return portalFromContext;
	}
	return undefined;
};
