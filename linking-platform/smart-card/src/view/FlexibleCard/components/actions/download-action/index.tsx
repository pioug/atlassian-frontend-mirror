import React, { type FC, useCallback } from 'react';
import { downloadUrl as download } from '../../../../../utils';
import { FormattedMessage } from 'react-intl-next';
import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import Action from '../action';
import type { DownloadActionProps } from './types';
import {
  useFlexibleUiAnalyticsContext,
  useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import DownloadIcon from '@atlaskit/icon/glyph/download';

const DownloadAction: FC<DownloadActionProps> = ({
  onClick: onClickCallback,
  ...props
}) => {
  const context = useFlexibleUiContext();
  const analytics = useFlexibleUiAnalyticsContext();
  const invoke = useInvokeClientAction({ analytics });

  const data = context?.actions?.[ActionName.DownloadAction];

  const onClick = useCallback(() => {
    if (data?.downloadUrl) {
      invoke({
        actionType: ActionName.DownloadAction,
        actionFn: async () => download(data?.downloadUrl),
        // These values have already been set in analytics context.
        // We only pass these here for ufo experience.
        display: analytics?.display,
        extensionKey: analytics?.extensionKey,
      });

      if (onClickCallback) {
        onClickCallback();
      }
    }
  }, [analytics, data?.downloadUrl, invoke, onClickCallback]);

  const isStackItem = props.as === 'stack-item';
  const label = isStackItem ? messages.download_file : messages.download;
  const tooltipMessage = isStackItem
    ? messages.download_description
    : messages.download;

  return data ? (
    <Action
      content={<FormattedMessage {...label} />}
      icon={<DownloadIcon label="Download" />}
      onClick={onClick}
      testId="smart-action-download-action"
      tooltipMessage={<FormattedMessage {...tooltipMessage} />}
      {...data}
      {...props}
    />
  ) : null;
};

export default DownloadAction;
