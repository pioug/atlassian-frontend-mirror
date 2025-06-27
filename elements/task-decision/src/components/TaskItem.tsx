/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo, useRef, type Ref } from 'react';
import { useIntl } from 'react-intl-next';

import { css, jsx } from '@compiled/react';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { Icon } from '@atlaskit/icon/base-new';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import type { NewCoreIconProps } from '@atlaskit/icon/base-new';
import CheckboxCheckedIcon from '@atlaskit/icon/core/checkbox-checked';

import { messages } from './i18n';
import Item from './Item';
import { type Appearance, type ContentRef } from '../types';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { createAndFireEventInElementsChannel } from '../analytics';
import { token } from '@atlaskit/tokens';
import { useMergeRefs } from 'use-callback-ref';

const CheckboxUncheckedIcon = (props: NewCoreIconProps) => (
	<Icon
		dangerouslySetGlyph={`<rect width="12.5" height="12.5" x="1.75" y="1.75" stroke="currentcolor" stroke-width="1.5" rx="1.25"/>`}
		type={'core'}
		{...props}
	/>
);

/**
 * References packages/design-system/checkbox/src/checkbox.tsx
 * To be used until mobile editor does not require legacy themed() API anymore,
 * which will allow migration to use @atlaskit/checkbox instead
 */
const checkboxStyles = css({
	flex: '0 0 24px',
	width: '24px',
	height: '24px',
	position: 'relative',
	alignSelf: 'start',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	"& > input[type='checkbox']": {
		width: '16px',
		height: '16px',
		zIndex: 1,
		cursor: 'pointer',
		outline: 'none',
		margin: 0,
		opacity: 0,
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&[disabled]': {
			cursor: 'default',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'+ span': {
			width: '24px',
			height: '24px',
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'+ span > svg': {
			boxSizing: 'border-box',
			display: 'inline',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			maxWidth: 'unset',
			maxHeight: 'unset',
			position: 'absolute',
			overflow: 'hidden',
			color: token('color.background.input'),
			transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'path:first-of-type': {
				visibility: 'hidden',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				stroke: token('color.border.input'),
				strokeWidth: 1,
				transition: 'stroke 0.2s ease-in-out',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover + span > svg': {
			color: token('color.background.input.hovered'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				stroke: token('color.border.input'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:checked:hover + span > svg': {
			color: token('color.background.selected.bold.hovered'),
			fill: token('color.icon.inverse'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				stroke: token('color.background.selected.bold.hovered'),
			},
		},
		'&:checked': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'+ span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'path:first-of-type': {
					visibility: 'visible',
				},
				color: token('color.background.selected.bold'),
				fill: token('color.icon.inverse'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					stroke: token('color.background.selected.bold'),
				},
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:active + span > svg': {
			color: token('color.background.input.pressed'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				stroke: token('color.border'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:checked:active + span > svg': {
			color: token('color.background.input.pressed'),
			fill: token('color.icon.inverse'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				stroke: token('color.border'),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:disabled + span > svg, &:disabled:hover + span > svg, &:disabled:focus + span > svg, &:disabled:active + span > svg':
			{
				color: token('color.background.disabled'),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					stroke: token('color.background.disabled'),
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:disabled:checked + span > svg': {
			fill: token('color.icon.disabled'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:focus + span::after': {
			position: 'absolute',
			width: token('space.200', '16px'),
			height: token('space.200', '16px'),
			border: `2px solid ${token('color.border.focused')}`,
			borderRadius: token('space.050', '4px'),
			content: "''",
			display: 'block',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
	},
});

export interface Props {
	taskId: string;
	isDone?: boolean;
	isFocused?: boolean;
	isRenderer?: boolean;
	onChange?: (taskId: string, isChecked: boolean) => void;
	onClick?: () => void;
	contentRef?: ContentRef;
	children?: any;
	placeholder?: string;
	showPlaceholder?: boolean;
	appearance?: Appearance;
	disabled?: boolean;
	dataAttributes?: { [key: string]: string | number };
	inputRef?: Ref<HTMLInputElement>;
}

let taskCount = 0;
const getCheckBoxId = (localId: string) => `${localId}-${taskCount++}`;

const TaskItem = (props: Props & WithAnalyticsEventsProps) => {
	const {
		appearance,
		isDone,
		isFocused,
		contentRef,
		children,
		placeholder,
		showPlaceholder,
		disabled,
		dataAttributes,
		taskId,
		onChange,
		onClick,
		createAnalyticsEvent,
		inputRef: inputRefFromProps,
	} = props;

	const { formatMessage } = useIntl();

	const checkBoxId = useMemo(() => getCheckBoxId(taskId), [taskId]);

	const handleOnChange = useMemo(() => {
		return (_evt: React.SyntheticEvent<HTMLInputElement>) => {
			const newIsDone = !isDone;
			if (onChange) {
				onChange(taskId, newIsDone);
			}
			const action = newIsDone ? 'checked' : 'unchecked';
			if (createAnalyticsEvent) {
				createAndFireEventInElementsChannel({
					action,
					actionSubject: 'action',
					eventType: 'ui',
					attributes: {
						localId: taskId,
					},
				})(createAnalyticsEvent);
			}
		};
	}, [onChange, taskId, isDone, createAnalyticsEvent]);

	const handleOnKeyPress = useMemo(
		() => (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleOnChange(event);
			}
		},
		[handleOnChange],
	);

	const localInputRef = useRef(null);
	const inputRef = useMergeRefs(
		inputRefFromProps === undefined ? [localInputRef] : [inputRefFromProps, localInputRef],
	);

	const icon = (
		<span css={checkboxStyles} contentEditable={false}>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
			<input
				id={checkBoxId}
				aria-label={formatMessage(
					isDone ? messages.markTaskAsNotCompleted : messages.markTaskAsCompleted,
				)}
				name={checkBoxId}
				type="checkbox"
				onChange={handleOnChange}
				onClick={onClick}
				checked={!!isDone}
				disabled={!!disabled}
				suppressHydrationWarning={true}
				onKeyPress={handleOnKeyPress}
				ref={inputRef}
			/>
			{isDone ? <CheckboxCheckedIcon label="" /> : <CheckboxUncheckedIcon label="" />}
		</span>
	);

	React.useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current?.focus();
			inputRef.current?.blur();
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [isFocused, inputRef]);

	return (
		<Item
			appearance={appearance}
			contentRef={contentRef}
			icon={icon}
			placeholder={placeholder}
			showPlaceholder={showPlaceholder}
			itemType="TASK"
			dataAttributes={dataAttributes}
			checkBoxId={checkBoxId}
		>
			{children}
		</Item>
	);
};

export default withAnalyticsEvents()(TaskItem);
