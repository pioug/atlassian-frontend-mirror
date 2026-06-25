import React, { useCallback, useMemo } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import MediaServicesActualSizeIcon from '@atlaskit/icon/core/grow-diagonal';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import useRovoConfig from '../../../../../state/hooks/use-rovo-config';
import Action from '../action';

import type { PreviewActionProps } from './types';

const PreviewAction = ({
	onClick: onClickCallback,
	...props
}: PreviewActionProps): React.JSX.Element | null => {
	const intl = useIntl();
	const context = useFlexibleUiContext();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[ActionName.PreviewAction];
	const hasPreviewPanel = data?.hasPreviewPanel;

	const { product } = useRovoConfig();

	const onClick = useCallback(() => {
		if (data?.invokeAction) {
			invoke(data.invokeAction);
			onClickCallback?.();
		}
	}, [data, invoke, onClickCallback]);

	const isStackItem = props.as === 'stack-item';
	const tooltipMessage = isStackItem ? messages.preview_description : messages.preview_improved;

	const actionIcon = useCallback(() => {
		// Only use panel icon if experiment is enabled and hasPreviewPanel is true
		if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') && hasPreviewPanel) {
			return (
				<PanelRightIcon
					color="currentColor"
					spacing="spacious"
					label=""
					{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') ||
					(!!product && product === 'CONFLUENCE')
						? { size: props.iconSize }
						: {})}
				/>
			);
		}
		return (
			<MediaServicesActualSizeIcon
				color="currentColor"
				spacing="spacious"
				label=""
				{...(fg('platform_sl_3p_auth_rovo_action_kill_switch') ||
				(!!product && product === 'CONFLUENCE')
					? { size: props.iconSize }
					: {})}
			/>
		);
	}, [hasPreviewPanel, props.iconSize, product]);

	const actionLabel = useMemo(() => {
		// Only use panel message if experiment is enabled and hasPreviewPanel is true
		if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') && hasPreviewPanel) {
			return messages.preview_panel;
		}
		// Fall back to modal message if experiment is enabled, otherwise use original preview message
		if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')) {
			return messages.preview_modal;
		}
		return messages.preview_improved;
	}, [hasPreviewPanel]);

	const actionMessage = intl.formatMessage(actionLabel);

	return data ? (
		<Action
			ariaLabel={actionMessage}
			content={actionMessage}
			icon={actionIcon()}
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
