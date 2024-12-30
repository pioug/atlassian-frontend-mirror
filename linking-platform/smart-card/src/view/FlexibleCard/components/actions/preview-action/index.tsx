import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import MediaServicesActualSizeIcon from '@atlaskit/icon/core/migration/grow-diagonal--media-services-actual-size';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import Action from '../action';

import type { PreviewActionProps } from './types';

const PreviewAction = ({ onClick: onClickCallback, ...props }: PreviewActionProps) => {
	const context = useFlexibleUiContext();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[ActionName.PreviewAction];

	const onClick = useCallback(() => {
		if (data?.invokeAction) {
			invoke(data.invokeAction);
			onClickCallback?.();
		}
	}, [data, invoke, onClickCallback]);

	const isStackItem = props.as === 'stack-item';
	const tooltipMessage = isStackItem ? messages.preview_description : messages.preview_improved;

	return data ? (
		<Action
			content={<FormattedMessage {...messages.preview_improved} />}
			icon={
				<MediaServicesActualSizeIcon color="currentColor" spacing="spacious" label="Open preview" />
			}
			onClick={onClick}
			testId="smart-action-preview-action"
			tooltipMessage={<FormattedMessage {...tooltipMessage} />}
			hideTooltipOnMouseDown={true}
			{...data}
			{...props}
		/>
	) : null;
};

export default PreviewAction;
