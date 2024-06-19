import React, { Component, type ErrorInfo, type ReactNode } from 'react';

export type ErrorBoundaryErrorInfo = {
	componentStack: string;
};

type BaseErrorBoundaryState = {
	hasError: boolean;
};

interface BaseErrorBoundaryProps {
	children: ReactNode;
	ErrorComponent?: React.ComponentType;
	onError?: (error: Error, info?: ErrorInfo) => void;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class BaseErrorBoundary extends Component<BaseErrorBoundaryProps, BaseErrorBoundaryState> {
	constructor(props: BaseErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error: Error, info?: ErrorInfo): void {
		const { onError } = this.props;
		onError && onError(error, info);
		this.setState({ hasError: true });
	}

	render() {
		const { children, ErrorComponent } = this.props;
		const { hasError } = this.state;

		if (hasError && ErrorComponent) {
			return <ErrorComponent />;
		}

		return children;
	}
}
