import React, { Component, ErrorInfo, ReactNode } from 'react';
import Heading from '@atlaskit/heading';

type ErrorBoundaryProps = {
	children: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

/**
 * Error boundary components need to be class components to use the `componentDidCatch` method.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		hasError: false,
	};

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		const { onError } = this.props;
		this.setState({ hasError: true });
		if (onError) {
			onError(error, errorInfo);
		}
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return <Heading size="small">Something went wrong loading this example.</Heading>;
		}
		return this.props.children;
	}
}
