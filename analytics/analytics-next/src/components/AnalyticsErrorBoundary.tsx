import React, { Component, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-fg
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import LegacyAnalyticsContext from './AnalyticsContext/LegacyAnalyticsContext';
import ModernAnalyticsContext from './AnalyticsContext/ModernAnalyticsContext';

type AnalyticsErrorBoundaryErrorInfo = {
	componentStack: string;
};

export interface AnalyticsErrorBoundaryProps {
	/** React component to be wrapped */
	children: ReactNode;
	channel: string;
	// eslint-disable-next-line @typescript-eslint/ban-types
	data: {};
	ErrorComponent?: React.ComponentType;
	onError?: (error: Error, info?: AnalyticsErrorBoundaryErrorInfo) => void;
}

type AnalyticsErrorBoundaryState = {
	hasError: boolean;
};

/**
 *  @private https://product-fabric.atlassian.net/browse/AFO-815
 *  @deprecated
 */
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class AnalyticsErrorBoundary extends Component<
	AnalyticsErrorBoundaryProps,
	AnalyticsErrorBoundaryState
> {
	constructor(props: AnalyticsErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error: Error, info: AnalyticsErrorBoundaryErrorInfo): void {
		const { onError } = this.props;

		onError && onError(error, info);
		this.setState({ hasError: true });
	}

	render() {
		const isModernContextEnabledEnv =
			typeof process !== 'undefined' &&
			process !== null &&
			process.env?.['ANALYTICS_NEXT_MODERN_CONTEXT'];

		const { data, children, ErrorComponent } = this.props;
		const { hasError } = this.state;

		if (hasError) {
			if (ErrorComponent) {
				if (
					isModernContextEnabledEnv ||
					// eslint-disable-next-line @atlaskit/platform/prefer-fg
					getBooleanFF('platform.analytics-next-use-modern-context_fqgbx')
				) {
					return (
						<ModernAnalyticsContext data={data}>
							<ErrorComponent />
						</ModernAnalyticsContext>
					);
				} else {
					return (
						<LegacyAnalyticsContext data={data}>
							<ErrorComponent />
						</LegacyAnalyticsContext>
					);
				}
			}
			return null;
		}
		if (
			isModernContextEnabledEnv ||
			// eslint-disable-next-line @atlaskit/platform/prefer-fg
			getBooleanFF('platform.analytics-next-use-modern-context_fqgbx')
		) {
			return <ModernAnalyticsContext data={data}>{children}</ModernAnalyticsContext>;
		}

		return <LegacyAnalyticsContext data={data}>{children}</LegacyAnalyticsContext>;
	}
}
