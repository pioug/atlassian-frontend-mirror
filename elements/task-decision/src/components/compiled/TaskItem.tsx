/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type RefObject, useMemo, useRef } from 'react';

import { css, jsx } from '@compiled/react';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import Item from './Item';
import { type Appearance, type ContentRef } from '../../types';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { createAndFireEventInElementsChannel } from '../../analytics';
import { token } from '@atlaskit/tokens';
import { B100, B300, B400, B50, N10, N100, N20, N30, N70 } from '@atlaskit/theme/colors';

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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: token('color.background.input', N10),
			transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'path:first-of-type': {
				visibility: 'hidden',
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				stroke: token('color.border.input', N100),
				strokeWidth: 1,
				transition: 'stroke 0.2s ease-in-out',
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover + span > svg': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: token('color.background.input.hovered', N30),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				stroke: token('color.border.input', N100),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:checked:hover + span > svg': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			color: token('color.background.selected.bold.hovered', B300),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fill: token('color.icon.inverse', N10),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				stroke: token('color.background.selected.bold.hovered', B300),
			},
		},
		'&:checked': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
			'+ span > svg': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'path:first-of-type': {
					visibility: 'visible',
				},
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: token('color.background.selected.bold', B400),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				fill: token('color.icon.inverse', N10),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: token('color.background.selected.bold', B400),
				},
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:active + span > svg': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: token('color.background.input.pressed', B50),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				stroke: token('color.border', B50),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:checked:active + span > svg': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: token('color.background.input.pressed', B50),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fill: token('color.icon.inverse', B400),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
			'rect:first-of-type': {
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				stroke: token('color.border', B50),
			},
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:disabled + span > svg, &:disabled:hover + span > svg, &:disabled:focus + span > svg, &:disabled:active + span > svg':
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
				color: token('color.background.disabled', N20),
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
				'rect:first-of-type': {
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					stroke: token('color.background.disabled', N20),
				},
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:disabled:checked + span > svg': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fill: token('color.icon.disabled', N70),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'&:focus + span::after': {
			position: 'absolute',
			width: token('space.200', '16px'),
			height: token('space.200', '16px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			border: `2px solid ${token('color.border.focused', B100)}`,
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
	inputRef?: RefObject<HTMLInputElement>;
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

	const defaultInputRef = useRef<HTMLInputElement>(null);
	const inputRef = inputRefFromProps ?? defaultInputRef;

	const icon = (
		<span css={checkboxStyles} contentEditable={false}>
			<input
				id={checkBoxId}
				aria-labelledby={`${checkBoxId}-wrapper`}
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
			{/* Migrate to new icon design in DSP-21076 */}
			{/* eslint-disable-next-line @atlaskit/design-system/no-legacy-icons*/}
			<CheckboxIcon label="" isFacadeDisabled={true} />
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

// This is to ensure that the "type" is exported, as it gets lost and not exported along with TaskItem after
// going through the high order component.

export default withAnalyticsEvents()(TaskItem);
