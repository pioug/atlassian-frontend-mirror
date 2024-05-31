import React from 'react';
import { logException } from '@atlaskit/editor-common/monitoring';
import { toNativeBridge } from './web-to-native';

export class ErrorBoundary extends React.Component<{ children?: React.ReactNode }, unknown> {
	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		if (toNativeBridge.editorError) {
			toNativeBridge.editorError(error.toString(), errorInfo?.toString() || undefined);
		}
		logException(error, { location: 'editor-mobile-bridge' });
	}

	render() {
		return this.props.children;
	}
}
