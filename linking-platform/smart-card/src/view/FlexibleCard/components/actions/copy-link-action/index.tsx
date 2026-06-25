import React, { useCallback, useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import LinkIcon from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import useRovoConfig from '../../../../../state/hooks/use-rovo-config';
import Action from '../action';

import { type CopyLinkActionProps } from './types';

const CopyLinkAction = ({
	onClick: onClickCallback,
	...props
}: CopyLinkActionProps): React.JSX.Element | null => {
	const intl = useIntl();
	const context = useFlexibleUiContext();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[ActionName.CopyLinkAction];
	const [tooltipMessage, setTooltipMessage] = useState(messages.copy_url_to_clipboard);

	const { product } = useRovoConfig();

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
			ariaLabel={intl.formatMessage(messages.copy_url_to_clipboard)}
			content={<FormattedMessage {...messages.copy_url_to_clipboard} />}
			icon={
				<LinkIcon
					color="currentColor"
					label=""
					spacing="spacious"
					{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') ||
					(!!product && product === 'CONFLUENCE')
						? { size: props.iconSize }
						: {})}
				/>
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
