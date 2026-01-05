import React, { type ErrorInfo } from 'react';
import type { UFOExperience } from '@atlaskit/ufo';

export class UfoErrorBoundary extends React.Component<{
	children?: React.ReactNode;
	experiences: UFOExperience[];
}> {
	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		for (const exp of this.props.experiences) {
			const { name, message } = error;
			const infoStack =
				errorInfo.componentStack && typeof errorInfo.componentStack !== 'undefined'
					? errorInfo.componentStack
					: undefined;
			exp.failure({
				metadata: {
					source: 'UfoErrorBoundary',
					reason: 'error',
					error: {
						name,
						message,
						infoStack,
					},
				},
			});
		}
	}

	render() {
		return this.props.children;
	}
}
