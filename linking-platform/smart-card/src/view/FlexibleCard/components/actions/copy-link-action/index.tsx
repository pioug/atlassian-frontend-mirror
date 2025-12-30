import React, { useCallback, useState } from 'react';

import { FormattedMessage } from 'react-intl-next';

import LinkIcon from '@atlaskit/icon/core/link';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import Action from '../action';

import { type CopyLinkActionProps } from './types';

const CopyLinkAction = ({
	onClick: onClickCallback,
	...props
}: CopyLinkActionProps): React.JSX.Element | null => {
	const context = useFlexibleUiContext();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[ActionName.CopyLinkAction];
	const [tooltipMessage, setTooltipMessage] = useState(messages.copy_url_to_clipboard);

	const onClick = useCallback(() => {
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
	}, [data, invoke, onClickCallback]);

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
