import React, { ErrorInfo, useCallback } from 'react';
import {
  EmbedModalContext,
  EmbedModalProps,
  EmbedModalSize,
} from '../../types';
import { WithAnalytics } from './types';
import { CardDisplay } from '../../../../constants';

const getResizeFrom = (size?: EmbedModalSize): EmbedModalSize =>
  size === EmbedModalSize.Small ? EmbedModalSize.Large : EmbedModalSize.Small;

const withAnalytics =
  (
    Component: React.ComponentType<EmbedModalProps>,
  ): React.FC<EmbedModalProps & WithAnalytics> =>
  (props) => {
    const { analytics, onClose, onOpen, onOpenFailed, onResize, origin } =
      props;

    const handleOnOpen = useCallback(
      (context: EmbedModalContext) => {
        analytics.screen.modalViewedEvent({
          name: 'embedPreviewModal',
          attributes: {
            origin,
            size: context.size,
          },
        });

        analytics.ui.renderSuccessEvent({
          status: 'resolved',
          display: CardDisplay.EmbedPreview,
        });

        if (onOpen) {
          onOpen(context);
        }
      },
      [analytics.screen, analytics.ui, onOpen, origin],
    );

    const handleOnOpenFailed = useCallback(
      (error: Error, errorInfo: ErrorInfo) => {
        analytics.ui.renderFailedEvent({
          display: CardDisplay.EmbedPreview,
          error,
          errorInfo,
        });

        if (onOpenFailed) {
          onOpenFailed(error, errorInfo);
        }
      },
      [analytics.ui, onOpenFailed],
    );

    const handleOnClose = useCallback(
      (context: EmbedModalContext) => {
        analytics.ui.modalClosedEvent({
          actionSubjectId: 'embedPreview',
          attributes: {
            origin,
            previewTime: context.duration,
            size: context.size,
          },
        });

        if (onClose) {
          onClose(context);
        }
      },
      [analytics.ui, onClose, origin],
    );

    const handleOnResize = useCallback(
      (context: EmbedModalContext) => {
        analytics.ui.buttonClickedEvent({
          actionSubjectId: 'embedPreviewResize',
          attributes: {
            newSize: context.size,
            origin,
            previousSize: getResizeFrom(context.size),
          },
        });

        if (onResize) {
          onResize(context);
        }
      },
      [analytics.ui, onResize, origin],
    );

    return (
      <Component
        {...props}
        onClose={handleOnClose}
        onOpen={handleOnOpen}
        onOpenFailed={handleOnOpenFailed}
        onResize={handleOnResize}
      />
    );
  };

export default withAnalytics;
