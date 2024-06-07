import React, { type ErrorInfo } from 'react';
import type { UFOExperience } from '@atlaskit/ufo';

export class UfoErrorBoundary extends React.Component<{
	experiences: UFOExperience[];
	children?: React.ReactNode;
}> {
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		for (const exp of this.props.experiences) {
			exp.failure({
				metadata: {
					source: 'UfoErrorBoundary',
					reason: 'error',
					error: {
						name: error.name,
						message: error.message,
						infoStack: errorInfo.componentStack,
					},
				},
			});
		}
	}

	render() {
		return this.props.children;
	}
}
