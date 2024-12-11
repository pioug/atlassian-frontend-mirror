import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import DownloadIcon from '@atlaskit/icon/core/migration/download';
import { fg } from '@atlaskit/platform-feature-flags';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import {
	useFlexibleUiAnalyticsContext,
	useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import { downloadUrl as download } from '../../../../../utils';
import Action from '../action';

import type { DownloadActionProps } from './types';

const DownloadAction = ({ onClick: onClickCallback, ...props }: DownloadActionProps) => {
	const context = useFlexibleUiContext();
	const analytics = useFlexibleUiAnalyticsContext();
	const invoke = useInvokeClientAction({ analytics });

	const data = context?.actions?.[ActionName.DownloadAction];

	const onClick = useCallback(() => {
		if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
			if (data?.invokeAction) {
				invoke(data.invokeAction);
				onClickCallback?.();
			}
		} else {
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
		}
	}, [analytics, data, invoke, onClickCallback]);

	const isStackItem = props.as === 'stack-item';
	const label = isStackItem ? messages.download_file : messages.download;
	const tooltipMessage = isStackItem ? messages.download_description : messages.download;

	return data ? (
		<Action
			content={<FormattedMessage {...label} />}
			icon={<DownloadIcon spacing="spacious" color="currentColor" label="Download" />}
			onClick={onClick}
			testId="smart-action-download-action"
			tooltipMessage={<FormattedMessage {...tooltipMessage} />}
			{...data}
			{...props}
		/>
	) : null;
};

export default DownloadAction;
