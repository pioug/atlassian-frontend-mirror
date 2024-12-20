/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { Component, Fragment } from 'react';

import { type CardAction } from '../../../actions';
import { CardActionIconButton } from './cardActionIconButton';
import { type CardActionIconButtonVariant } from './styles';
import { CardActionsDropdownMenu } from './cardActionsDropdownMenu';

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
			<Fragment>
				{primaryAction ? this.renderActionIconButton(primaryAction, true) : null}
				{this.renderOtherActionButtons(otherActions)}
			</Fragment>
		);
	}

	private renderActionIconButton(action: CardAction, isPrimary?: boolean): JSX.Element {
		const { triggerColor, filename, variant } = this.props;
		const { icon, handler, label, isDisabled, tooltip } = action;

		return (
			<CardActionIconButton
				icon={icon}
				label={label}
				filename={filename}
				isPrimary={isPrimary}
				triggerColor={triggerColor}
				onClick={() => handler()}
				variant={variant}
				isDisabled={isDisabled}
				tooltip={tooltip}
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
