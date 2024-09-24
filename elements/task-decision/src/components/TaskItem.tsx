/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type RefObject, useMemo, useRef } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import CheckboxIcon from '@atlaskit/icon/core/migration/checkbox-checked--checkbox';
import Item from './Item';
import { type Appearance, type ContentRef } from '../types';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { createAndFireEventInElementsChannel } from '../analytics';
import { checkboxStyles } from './styles';

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
		isRenderer,
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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span css={checkboxStyles(isRenderer)} contentEditable={false}>
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
			<CheckboxIcon color="currentColor" spacing="spacious" label="" />
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
