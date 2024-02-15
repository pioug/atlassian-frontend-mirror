import React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { MediaImageWithMediaClientConfigProps } from '../types';
import MediaImageV2WithMediaClient from './mediaImageV2WithMediaClient';

interface Props {
  children?: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO: handle error
    // console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

const MediaImageWithErrorBoundary = (
  props: MediaImageWithMediaClientConfigProps,
) => {
  return (
    <ErrorBoundary
      fallback={props.children({
        loading: false,
        error: true,
      })}
    >
      <MediaImageV2WithMediaClient {...props} />
    </ErrorBoundary>
  );
};

export default MediaImageWithErrorBoundary;
