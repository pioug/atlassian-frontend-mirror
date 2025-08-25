/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { jsx, cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

type ToolbarPortalContextValue = {
	isActive: boolean;
	Portal: React.ComponentType<{ children: React.ReactNode }>;
};

const ToolbarPortalContext = React.createContext<ToolbarPortalContextValue | undefined>(undefined);

export const ToolbarPortalContextProvider = ({
	children,
	portal,
	isActive,
}: {
	children: React.ReactNode;
	isActive: boolean;
	portal: React.ComponentType<{ children: React.ReactNode }>;
}) => {
	const value = React.useMemo(() => ({ Portal: portal, isActive }), [portal, isActive]);
	return <ToolbarPortalContext.Provider value={value}>{children}</ToolbarPortalContext.Provider>;
};

// NOTE: This doesn't throw on undefined context on purpose, as it is likely that
// the outer toolbar _won't_ have a context provider as it is unlikely to portal
// anywhere
export const useToolbarPortal = () => {
	return React.useContext(ToolbarPortalContext);
};

const toolbarPortalStyles = cssMap({
	portal: {
		position: 'absolute',
		inset: token('space.0'),
		'&:empty': {
			display: 'none',
		},
	},
});

export const ToolbarPortalMountPoint = () => {
	const portal = useToolbarPortal();

	// Don't render a mountpoint when we're already inside a portal
	if (portal) {
		return null;
	}
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
	return <div className="ak-editor-toolbar-portal" css={toolbarPortalStyles.portal} />;
};
