import React from 'react';
import { toNativeBridge } from './web-to-native';

export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (toNativeBridge.editorError) {
      toNativeBridge.editorError(
        error.toString(),
        errorInfo?.toString() || undefined,
      );
    }
  }

  render() {
    return this.props.children;
  }
}
