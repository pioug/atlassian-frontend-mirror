// This file is copied to `packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/ToolbarButton/index.tsx`
// If you make any change here, copy it to above file as well
// and notify about the change in #team-fc-editor-ai-dev channel.
/** @jsx jsx */
import React, { useCallback } from 'react';

import { css, jsx } from '@emotion/react';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ButtonProps } from '@atlaskit/button/types';
import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE, TOOLBAR_ACTION_SUBJECT_ID } from '../../analytics';
import type { MenuItem } from '../DropdownMenu';

import Button from './styles';

export const TOOLBAR_BUTTON = TOOLBAR_ACTION_SUBJECT_ID;

export type Props = {
	buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
	className?: string;
	disabled?: boolean;
	hideTooltip?: boolean;
	href?: string;
	iconAfter?: React.ReactElement<any>;
	iconBefore?: React.ReactElement<any>;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	onItemClick?: (item: MenuItem) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
	selected?: boolean;
	spacing?: 'default' | 'compact' | 'none';
	target?: string;
	title?: React.ReactNode;
	titlePosition?: PositionType;
	item?: MenuItem;
	testId?: string;
	'aria-label'?: React.AriaAttributes['aria-label'];
	'aria-expanded'?: React.AriaAttributes['aria-expanded'];
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-pressed'?: React.AriaAttributes['aria-pressed'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
} & Pick<ButtonProps, 'aria-label' | 'children'>;

const buttonWrapper = css({
	display: 'flex',
	height: '100%',
});

export type ToolbarButtonRef = HTMLElement;
const ToolbarButton = React.forwardRef<ToolbarButtonRef, Props>((props, ref) => {
	const {
		buttonId,
		testId,
		className = '',
		href,
		iconAfter,
		iconBefore,
		disabled,
		selected,
		spacing,
		target,
		children,
		hideTooltip,
		title,
		titlePosition = 'top',
		item,
		'aria-label': ariaLabel,
		'aria-haspopup': ariaHasPopup,
		'aria-expanded': ariaExpanded,
		'aria-pressed': ariaPressed,
		'aria-keyshortcuts': ariaKeyShortcuts,
		onClick,
		onKeyDown,
		onItemClick,
	} = props;

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {
			if (disabled) {
				return;
			}

			if (buttonId) {
				analyticsEvent
					.update((payload) => ({
						...payload,
						action: ACTION.CLICKED,
						actionSubject: ACTION_SUBJECT.TOOLBAR_BUTTON,
						actionSubjectId: buttonId,
						eventType: EVENT_TYPE.UI,
					}))
					.fire(FabricChannel.editor);
			}

			if (onClick) {
				onClick(event);
			}

			if (item && onItemClick) {
				onItemClick(item);
			}
		},

		[disabled, onClick, onItemClick, item, buttonId],
	);
	const id = buttonId ? `editor-toolbar__${buttonId}` : undefined;

	const button = (
		<Button
			id={id}
			ref={ref}
			appearance="subtle"
			testId={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			href={href}
			iconAfter={iconAfter}
			iconBefore={iconBefore}
			isDisabled={disabled}
			isSelected={selected}
			onClick={handleClick}
			spacing={spacing || 'default'}
			target={target}
			shouldFitContainer
			aria-expanded={ariaExpanded}
			aria-haspopup={ariaHasPopup}
			aria-label={ariaLabel}
			aria-pressed={ariaPressed}
			aria-keyshortcuts={ariaKeyShortcuts}
			onKeyDown={onKeyDown}
		>
			{children}
		</Button>
	);

	if (!title) {
		return button;
	}

	const tooltipContent = !hideTooltip ? title : null;

	return (
		<Tooltip content={tooltipContent} hideTooltipOnClick={true} position={titlePosition}>
			<div css={buttonWrapper}>{button}</div>
		</Tooltip>
	);
});

export default ToolbarButton;
