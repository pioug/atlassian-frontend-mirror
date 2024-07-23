/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component } from 'react';

import { type CardAction } from '../../../actions';
import { CardActionIconButton, type CardActionIconButtonProps } from './cardActionIconButton';
import { type CardActionIconButtonVariant, wrapperStyles } from './styles';
import { CardActionsDropdownMenu } from './cardActionsDropdownMenu';
import { PreventClickThrough } from '../../../../utils/preventClickThrough';
import { createAndFireMediaCardEvent } from '../../../../utils/analytics';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

type CardActionIconButtonPropsWithAnalytics = CardActionIconButtonProps & WithAnalyticsEventsProps;
const CardActionIconButtonWithProps = (props: CardActionIconButtonPropsWithAnalytics) => (
	<CardActionIconButton {...props} />
);

export interface CardActionsViewProps {
	readonly actions: CardAction[];
	readonly filename?: string;

	readonly onToggle?: (attrs: { isOpen: boolean }) => void;
	readonly triggerColor?: string;
	readonly variant?: CardActionIconButtonVariant;
}

export class CardActionsView extends Component<CardActionsViewProps> {
	render(): JSX.Element | null {
		const { actions } = this.props;

		if (!actions.length) {
			return null;
		}

		const primaryAction = actions.find(actionWithIcon);
		const otherActions = actions.filter(actionNotEqualTo(primaryAction));

		return (
			<PreventClickThrough>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={wrapperStyles}>
					{primaryAction ? this.renderActionIconButton(primaryAction, true) : null}
					{this.renderOtherActionButtons(otherActions)}
				</div>
			</PreventClickThrough>
		);
	}

	private renderActionIconButton(action: CardAction, isPrimary?: boolean): JSX.Element {
		const { triggerColor, filename, variant } = this.props;
		const { icon, handler, label } = action;
		const actionSubjectId = isPrimary
			? 'mediaCardPrimaryActionButton'
			: 'mediaCardSecondaryActionButton';

		const CardActionIconButtonWithAnalytics = withAnalyticsEvents({
			onClick: createAndFireMediaCardEvent({
				eventType: 'ui',
				action: 'clicked',
				actionSubject: 'button',
				actionSubjectId,
				attributes: {
					label,
				},
			}),
		})(CardActionIconButtonWithProps);

		return (
			<CardActionIconButtonWithAnalytics
				icon={icon}
				label={filename ? `${filename} — ${label}` : label}
				triggerColor={triggerColor}
				onClick={() => handler()}
				variant={variant}
			/>
		);
	}

	private renderOtherActionButtons(actions: CardAction[]): JSX.Element | null {
		if (actions.length === 0) {
			return null;
		} else {
			const { triggerColor, onToggle, variant } = this.props;
			const firstActionWithIcon = actions.find(actionWithIcon);
			const otherActions = actions.filter(actionNotEqualTo(firstActionWithIcon));

			if (firstActionWithIcon && otherActions.length === 0) {
				return this.renderActionIconButton(firstActionWithIcon, false);
			} else {
				return (
					<CardActionsDropdownMenu
						actions={actions}
						triggerColor={triggerColor}
						onOpenChange={onToggle}
						triggerVariant={variant}
					/>
				);
			}
		}
	}
}

function actionWithIcon(action: CardAction): boolean {
	return !!action.icon;
}

function actionNotEqualTo(otherAction?: CardAction) {
	return (action: any) => action !== otherAction;
}
