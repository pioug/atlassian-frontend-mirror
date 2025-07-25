// If you make any change here, copy it to above file as well
// and notify about the change in #team-fc-editor-ai-dev channel.
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { FabricChannel } from '@atlaskit/analytics-listeners/types';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ButtonProps } from '@atlaskit/button/types';
import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	type TOOLBAR_ACTION_SUBJECT_ID,
} from '../../analytics';
import { type Keymap, ToolTipContent } from '../../keymaps';
import type { MenuItem } from '../DropdownMenu/types';

import Button from './styles';

export type Props = {
	// Used for analytics only
	buttonId?: TOOLBAR_ACTION_SUBJECT_ID;
	className?: string;
	disabled?: boolean;
	hideTooltip?: boolean;
	href?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	iconAfter?: React.ReactElement<any>;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	keymap?: Keymap;
	'aria-label'?: React.AriaAttributes['aria-label'];
	'aria-expanded'?: React.AriaAttributes['aria-expanded'];
	'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
	'aria-pressed'?: React.AriaAttributes['aria-pressed'];
	'aria-keyshortcuts'?: React.AriaAttributes['aria-keyshortcuts'];
	'data-ds--level'?: string;
} & Pick<
	ButtonProps,
	| 'aria-label'
	| 'children'
	| 'onFocus'
	| 'onBlur'
	| 'onMouseEnter'
	| 'onMouseLeave'
	| 'aria-controls'
	| 'rel'
>;

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
		keymap,
		titlePosition = 'top',
		item,
		rel,
		'aria-label': ariaLabel,
		'aria-haspopup': ariaHasPopup,
		'aria-expanded': ariaExpanded,
		'aria-pressed': ariaPressed,
		'aria-keyshortcuts': ariaKeyShortcuts,
		'aria-controls': ariaControls,
		'data-ds--level': dataDsLevel,
		onClick,
		onKeyDown,
		onItemClick,
		onFocus,
		onBlur,
		onMouseEnter,
		onMouseLeave,
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

	const button = (
		<Button
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
			aria-controls={ariaControls}
			aria-haspopup={ariaHasPopup}
			aria-label={ariaLabel}
			aria-pressed={ariaPressed}
			aria-keyshortcuts={ariaKeyShortcuts}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			onBlur={onBlur}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			data-ds--level={dataDsLevel}
			rel={rel}
		>
			{children}
		</Button>
	);

	if (!title) {
		return button;
	}

	const tooltipContent = hideTooltip ? null : (
		<ToolTipContent description={title} keymap={keymap} />
	);

	return (
		<Tooltip content={tooltipContent} hideTooltipOnClick={true} position={titlePosition}>
			<div css={buttonWrapper}>{button}</div>
		</Tooltip>
	);
});

export default ToolbarButton;
