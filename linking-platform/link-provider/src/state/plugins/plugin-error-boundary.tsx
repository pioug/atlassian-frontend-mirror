import React, { Component, type ReactNode, useEffect, useState } from 'react';

import type { LinkProviderPluginResolver } from '../context/types';

type PluginErrorBoundaryState = { hasError: boolean };

/** Only plugin UI is discarded on failure; the provider's children stay mounted. */
class PluginErrorBoundary extends Component<{ children: ReactNode }, PluginErrorBoundaryState> {
	state: PluginErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError(): PluginErrorBoundaryState {
		return { hasError: true };
	}

	render(): ReactNode {
		return this.state.hasError ? null : this.props.children;
	}
}

// Invoke the callback under the boundary, not in the provider's render function.
const PluginContent = ({ plugins }: { plugins: LinkProviderPluginResolver }): React.JSX.Element => (
	<>{plugins.render?.()}</>
);

export const PluginUI = ({
	plugins,
}: {
	plugins: LinkProviderPluginResolver;
}): React.JSX.Element | null => {
	// React error boundaries do not catch server-render errors. Plugin UI is interactive,
	// so wait until after hydration before invoking third-party rendering callbacks.
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null;
	}
	return (
		<PluginErrorBoundary>
			<PluginContent plugins={plugins} />
		</PluginErrorBoundary>
	);
};
