import MediaServicesActualSizeIcon from '@atlaskit/icon/glyph/media-services/actual-size';
import React, { useCallback } from 'react';
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
import type { PreviewActionProps } from './types';

const PreviewAction = ({ onClick: onClickCallback, ...props }: PreviewActionProps) => {
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
	const tooltipMessage = isStackItem ? messages.preview_description : messages.preview_improved;

	return data ? (
		<Action
			content={<FormattedMessage {...messages.preview_improved} />}
			// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons -- TODO - https://product-fabric.atlassian.net/browse/DSP-20003
			icon={<MediaServicesActualSizeIcon label="Open preview" />}
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
