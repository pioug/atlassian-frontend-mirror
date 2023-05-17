import React from 'react';
import { logException } from '@atlaskit/editor-common/monitoring';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { toNativeBridge } from './web-to-native';

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (toNativeBridge.editorError) {
      toNativeBridge.editorError(
        error.toString(),
        errorInfo?.toString() || undefined,
      );
    }

    if (getBooleanFF('platform.editor.sentry-error-monitoring_6bksu')) {
      logException(error, { location: 'editor-mobile-bridge' });
    }
  }

  render() {
    return this.props.children;
  }
}
