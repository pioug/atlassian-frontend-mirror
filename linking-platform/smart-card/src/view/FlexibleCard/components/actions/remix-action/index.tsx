import React, { useCallback } from 'react';

import { useIntl } from 'react-intl';

import AiGenerativeRemixIcon from '@atlaskit/icon-lab/core/ai-generative-remix';
import { usePlugins } from '@atlaskit/link-provider/use-plugins';

import { InternalActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context/useFlexibleUiContext';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import { useRemixActionExposure } from '../../../../../utils/use-remix-action-exposure';
import Action from '../action';
import type { LinkActionProps } from '../types';

const RemixAction = ({
	onClick: onClickCallback,
	...props
}: LinkActionProps): React.JSX.Element | null => {
	const intl = useIntl();
	const context = useFlexibleUiContext();
	const { remix } = usePlugins();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[InternalActionName.RemixAction];
	const actionMessage = intl.formatMessage(messages.rovo_prompt_button_remix);

	const isRemixVisible = Boolean(data && remix);
	useRemixActionExposure(isRemixVisible);

	const onClick = useCallback(() => {
		if (data?.invokeAction && remix) {
			const { url } = data;
			invoke({
				...data.invokeAction,
				actionFn: async () => remix.open({ url }),
			});
			onClickCallback?.();
		}
	}, [data, invoke, onClickCallback, remix]);

	return isRemixVisible ? (
		<Action
			ariaLabel={actionMessage}
			content={actionMessage}
			icon={<AiGenerativeRemixIcon color="currentColor" label="" size={props.iconSize} />}
			onClick={onClick}
			testId="smart-action-remix-action"
			tooltipMessage={actionMessage}
			{...props}
		/>
	) : null;
};

export default RemixAction;
