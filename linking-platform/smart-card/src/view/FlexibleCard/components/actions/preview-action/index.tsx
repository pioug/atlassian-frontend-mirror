import React, { useCallback } from 'react';

import { FormattedMessage } from 'react-intl-next';

import MediaServicesActualSizeIcon from '@atlaskit/icon/core/grow-diagonal';
import PanelRightIcon from '@atlaskit/icon/core/panel-right';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { ActionName } from '../../../../../constants';
import { messages } from '../../../../../messages';
import { useFlexibleUiContext } from '../../../../../state/flexible-ui-context';
import useInvokeClientAction from '../../../../../state/hooks/use-invoke-client-action';
import Action from '../action';

import type { PreviewActionProps } from './types';

const PreviewAction = ({
	onClick: onClickCallback,
	...props
}: PreviewActionProps): React.JSX.Element | null => {
	const context = useFlexibleUiContext();
	const invoke = useInvokeClientAction({});

	const data = context?.actions?.[ActionName.PreviewAction];
	const hasPreviewPanel = data?.hasPreviewPanel;

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
			return <PanelRightIcon color="currentColor" spacing="spacious" label="Open preview panel" />;
		}
		return (
			<MediaServicesActualSizeIcon color="currentColor" spacing="spacious" label="Open preview" />
		);
	}, [hasPreviewPanel]);

	const actionLabel = useCallback(() => {
		// Only use panel message if experiment is enabled and hasPreviewPanel is true
		if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test') && hasPreviewPanel) {
			return <FormattedMessage {...messages.preview_panel} />;
		}
		// Fall back to modal message if experiment is enabled, otherwise use original preview message
		if (expValEquals('platform_hover_card_preview_panel', 'cohort', 'test')) {
			return <FormattedMessage {...messages.preview_modal} />;
		}
		return <FormattedMessage {...messages.preview_improved} />;
	}, [hasPreviewPanel]);

	return data ? (
		<Action
			content={actionLabel()}
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
