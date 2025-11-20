import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import DownloadIcon from '@atlaskit/icon/core/migration/download';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import Action from '../action';

import type { DownloadActionProps } from './types';

const DownloadAction = ({
	onClick: onClickCallback,
	...props
}: DownloadActionProps): React.JSX.Element | null => {
	const context = useFlexibleUiContext();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[ActionName.DownloadAction];

	const onClick = useCallback(() => {
		if (data?.invokeAction) {
			invoke(data.invokeAction);
			onClickCallback?.();
		}
	}, [data, invoke, onClickCallback]);

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
