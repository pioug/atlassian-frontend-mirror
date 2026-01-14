import React from 'react';

interface ErrorBoundaryProps {
	children: React.ReactNode;
	onError: () => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, {}> {
	componentDidCatch(): void {
		// Failure analytics here too
		this.props.onError();
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;
