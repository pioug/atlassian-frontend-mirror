import React, { PropsWithChildren } from 'react';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';
import { B300, R300, N30A, N900 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import {
  AnalyticsErrorBoundaryInlinePayload,
  fireMediaCardEvent,
  ErrorBoundaryErrorInfo,
} from '../utils/analytics';
export type MediaInlineAnalyticsErrorBoundaryProps = PropsWithChildren<
  {
    isSelected?: boolean;
    data?: { [k: string]: any };
    featureFlags?: MediaFeatureFlags;
  } & WithAnalyticsEventsProps
>;

type MediaInlineAnalyticsErrorBoundaryState = {
  hasError: boolean;
};

interface ErrorBoundaryProps {
  message: string;
  isSelected: boolean;
}

const ErrorBoundaryComponent: React.FC<ErrorBoundaryProps> = ({
  message,
  isSelected,
}) => {
  const selectedStyle: React.CSSProperties = {
    cursor: 'pointer',
    boxShadow: `0 0 0 1px ${token('color.border.selected', B300)}`,
    outline: 'none',
    userSelect: 'none',
    borderColor: 'transparent',
  };

  /* Note:
   - styling is borrowed from packages/media/media-ui/src/MediaInlineCard/Frame/styled.ts
   - because we are not using styled components, we are not able to use themed(), here is the "themed" property of color and backgroundColor

    color: `${themed({
      light: token('color.text', N900),
      dark: token('color.text', DN600),
    })}`,
    backgroundColor: `${themed({
      light: token('color.background.neutral', N30A),
      dark: token('color.background.neutral', DN80),
    })}`,

  */

  const style: React.CSSProperties = {
    lineHeight: '16px',
    padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
    marginRight: token('space.negative.025', '-2px'),
    WebkitBoxDecorationBreak: 'clone',
    display: 'inline',
    borderRadius: '3px',
    color: token('color.text', N900),
    backgroundColor: token('color.background.neutral', N30A),
    userSelect: 'text',
    transition: 'all 0.1s ease-in-out 0s',
    cursor: 'pointer',
    ...(isSelected ? { ...selectedStyle } : { userSelect: 'text' }),
  };

  return (
    <span style={style}>
      <WarningIcon
        label="error"
        size="small"
        primaryColor={token('color.icon.danger', R300)}
      />
      {message}
    </span>
  );
};

class WrappedMediaInlineAnalyticsErrorBoundary extends React.Component<
  MediaInlineAnalyticsErrorBoundaryProps,
  MediaInlineAnalyticsErrorBoundaryState
> {
  constructor(props: MediaInlineAnalyticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static displayName = 'MediaInlineAnalyticsErrorBoundary';
  private fireOperationalEvent = (
    error: Error | string,
    info?: ErrorBoundaryErrorInfo,
  ) => {
    const { data = {}, createAnalyticsEvent } = this.props;
    const payload: AnalyticsErrorBoundaryInlinePayload = {
      eventType: 'operational',
      action: 'failed',
      actionSubject: 'mediaInlineRender',
      attributes: {
        browserInfo: window?.navigator?.userAgent
          ? window.navigator.userAgent
          : 'unknown',
        error,
        failReason: 'unexpected-error',
        info,
        ...data,
      },
    };
    fireMediaCardEvent(payload, createAnalyticsEvent);
  };

  componentDidCatch(error: Error, info?: ErrorBoundaryErrorInfo): void {
    try {
      this.fireOperationalEvent(error, info);
      this.setState({ hasError: true });
    } catch (e) {}
  }

  render() {
    const { hasError } = this.state;
    const { children, isSelected } = this.props;

    return hasError ? (
      <ErrorBoundaryComponent
        message="We couldn't load this content"
        isSelected={isSelected!}
      />
    ) : (
      children
    );
  }
}

const MediaInlineAnalyticsErrorBoundary: React.ComponentType<
  MediaInlineAnalyticsErrorBoundaryProps & WithAnalyticsEventsProps
> = withAnalyticsEvents()(WrappedMediaInlineAnalyticsErrorBoundary);

export default MediaInlineAnalyticsErrorBoundary;
