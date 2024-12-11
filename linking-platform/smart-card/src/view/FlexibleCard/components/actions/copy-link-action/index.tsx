import React, { useCallback, useState } from 'react';

import { FormattedMessage } from 'react-intl-next';

import LinkIcon from '@atlaskit/icon/core/migration/link';
import { fg } from '@atlaskit/platform-feature-flags';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import {
	useFlexibleUiAnalyticsContext,
	useFlexibleUiContext,
} from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import Action from '../action';

import { type CopyLinkActionProps } from './types';

const CopyLinkAction = ({ onClick: onClickCallback, ...props }: CopyLinkActionProps) => {
	const context = useFlexibleUiContext();
	const analytics = useFlexibleUiAnalyticsContext();
	const invoke = useInvokeClientAction({ analytics });

	const data = context?.actions?.[ActionName.CopyLinkAction];
	const [tooltipMessage, setTooltipMessage] = useState(messages.copy_url_to_clipboard);

	const onClick = useCallback(() => {
		if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
			if (data?.invokeAction) {
				invoke({
					...data.invokeAction,
					actionFn: async () => {
						await data.invokeAction?.actionFn();
						setTooltipMessage(messages.copied_url_to_clipboard);
					},
				});
				onClickCallback?.();
			}
		} else {
			if (data && data.url) {
				invoke({
					actionType: ActionName.CopyLinkAction,
					actionFn: async () => {
						await navigator.clipboard.writeText(data.url ?? '');
						setTooltipMessage(messages.copied_url_to_clipboard);
					},
					// These values have already been set in analytics context.
					// We only pass these here for ufo experience.
					display: analytics?.display,
					extensionKey: analytics?.extensionKey,
				});
			}

			if (onClickCallback) {
				onClickCallback();
			}
		}
	}, [analytics, data, invoke, onClickCallback]);

	return data ? (
		<Action
			content={<FormattedMessage {...messages.copy_url_to_clipboard} />}
			icon={
				<LinkIcon color="currentColor" label="copy url" LEGACY_size="medium" spacing="spacious" />
			}
			onClick={onClick}
			testId="smart-action-copy-link-action"
			tooltipMessage={<FormattedMessage {...tooltipMessage} />}
			tooltipOnHide={() => setTooltipMessage(messages.copy_url_to_clipboard)}
			{...data}
			{...props}
		/>
	) : null;
};

export default CopyLinkAction;
