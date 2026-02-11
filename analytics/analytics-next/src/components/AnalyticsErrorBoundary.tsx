import React, { Component, type ReactNode } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import isModernContextEnabledEnv from '../utils/isModernContextEnabledEnv';

import LegacyAnalyticsContext from './AnalyticsContext/LegacyAnalyticsContext';
import ModernAnalyticsContext from './AnalyticsContext/ModernAnalyticsContext';

type AnalyticsErrorBoundaryErrorInfo = {
	componentStack: string;
};

export interface AnalyticsErrorBoundaryProps {
	channel: string;
	/** React component to be wrapped */
	children: ReactNode;
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

	render(): React.JSX.Element | null {
		const { data, children, ErrorComponent } = this.props;
		const { hasError } = this.state;
		const isModernContext =
			isModernContextEnabledEnv || fg('analytics-next-use-legacy-context') === false;

		if (hasError) {
			if (ErrorComponent) {
				if (isModernContext) {
					return (
						<ModernAnalyticsContext data={data}>
							<ErrorComponent />
						</ModernAnalyticsContext>
					);
				}
				return (
					<LegacyAnalyticsContext data={data}>
						<ErrorComponent />
					</LegacyAnalyticsContext>
				);
			}
			return null;
		}
		if (isModernContext) {
			return <ModernAnalyticsContext data={data}>{children}</ModernAnalyticsContext>;
		}

		return <LegacyAnalyticsContext data={data}>{children}</LegacyAnalyticsContext>;
	}
}
