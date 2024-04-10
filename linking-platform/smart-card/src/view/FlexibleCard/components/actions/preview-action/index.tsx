import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import React, { type FC, useCallback } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import {
  useFlexibleUiAnalyticsContext,
  useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import { openEmbedModalWithFlexibleUiIcon } from '../../utils';
import Action from '../action';
import PreviewIcon from './preview-icon';
import type { PreviewActionProps } from './types';

const PreviewAction: FC<PreviewActionProps> = ({
  onClick: onClickCallback,
  ...props
}) => {
  const context = useFlexibleUiContext();
  const analytics = useFlexibleUiAnalyticsContext();
  const invoke = useInvokeClientAction({ analytics });

  const data = context?.actions?.[ActionName.PreviewAction];

  const onClick = useCallback(() => {
    if (data) {
      invoke({
        actionType: ActionName.PreviewAction,
        actionFn: async () =>
          openEmbedModalWithFlexibleUiIcon({
            download: data?.downloadUrl,
            extensionKey: analytics?.extensionKey,
            analytics,
            ...data,
          }),
        // These values have already been set in analytics context.
        // We only pass these here for ufo experience.
        display: analytics?.display,
        extensionKey: analytics?.extensionKey,
      });
    }

    if (onClickCallback) {
      onClickCallback();
    }
  }, [analytics, data, invoke, onClickCallback]);

  const isStackItem = props.as === 'stack-item';
  const Icon = isStackItem ? PreviewIcon : VidFullScreenOnIcon;
  const tooltipMessage = isStackItem
    ? messages.preview_description
    : messages.preview_improved;

  return data ? (
    <Action
      content={<FormattedMessage {...messages.preview_improved} />}
      icon={<Icon label="Open preview" />}
      onClick={onClick}
      testId="smart-action-preview-action"
      tooltipMessage={<FormattedMessage {...tooltipMessage} />}
      {...data}
      {...props}
    />
  ) : null;
};

export default PreviewAction;
