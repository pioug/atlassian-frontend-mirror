/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Field from '@atlaskit/form/Field';
import Form from '@atlaskit/form/Form';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import VisuallyHidden from '@atlaskit/visually-hidden';

import Buttons from './internal/buttons';
import useButtonFocusHook from './internal/hooks/use-button-focus-hook';
import ReadView from './internal/read-view';
import { type InlineEditProps } from './types';

const fieldStyles = css({
	maxWidth: '100%',
	position: 'relative',
});

const analyticsAttributes = {
	componentName: 'inlineEdit',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const InnerInlineEdit = <FieldValue extends unknown>(props: InlineEditProps<FieldValue>) => {
	const {
		startWithEditViewOpen = false,
		keepEditViewOpenOnBlur = false,
		hideActionButtons = false,
		isRequired = false,
		readViewFitContainerWidth = false,
		editButtonLabel = 'Edit',
		editLabel = 'edit',
		confirmButtonLabel = 'Confirm',
		cancelButtonLabel = 'Cancel',
		defaultValue,
		isEditing,
		label,
		validate,
		readView,
		editView,
		analyticsContext,
		onConfirm: providedOnConfirm,
		onCancel: providedOnCancel,
		onEdit: providedOnEdit,
		testId,
	} = props;

	const wasFocusReceivedSinceLastBlurRef = useRef(false);
	const isControlled = typeof isEditing === 'undefined';
	const [isEditingState, setEditingState] = useState(startWithEditViewOpen);
	const timerRef = useRef<ReturnType<typeof setTimeout>>();

	const { editButtonRef, editViewRef, shouldBeEditing, doNotFocusOnEditButton } =
		useButtonFocusHook(isEditing, isEditingState);

	const onCancel = useCallback(() => {
		if (isControlled) {
			setEditingState(false);
		}
		providedOnCancel?.();
	}, [isControlled, providedOnCancel]);

	const onEditRequested = useCallback(() => {
		if (isControlled) {
			setEditingState(true);
		}
		providedOnEdit?.();
		if (shouldBeEditing && editViewRef.current) {
			editViewRef.current.focus();
		}
	}, [isControlled, shouldBeEditing, editViewRef, providedOnEdit]);

	const onConfirm = usePlatformLeafEventHandler({
		fn: (value: string, analyticsEvent: UIAnalyticsEvent) => {
			if (isControlled) {
				setEditingState(false);
			}
			providedOnConfirm(value, analyticsEvent);
		},
		action: 'confirmed',
		analyticsData: analyticsContext,
		...analyticsAttributes,
	});

	const onCancelClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			event.preventDefault();
			onCancel();
		},
		[onCancel],
	);

	const tryAutoSubmitWhenBlur = useCallback(
		(
			isFieldInvalid: boolean,
			onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
			formRef: React.RefObject<HTMLFormElement>,
		) => {
			if (!isFieldInvalid && !wasFocusReceivedSinceLastBlurRef.current && formRef.current) {
				doNotFocusOnEditButton();
				if (formRef.current.checkValidity()) {
					onSubmit();
				}
			}
		},
		[doNotFocusOnEditButton],
	);

	/**
	 * If keepEditViewOpenOnBlur prop is set to false, will call confirmIfUnfocused() which
	 *  confirms the value, if the focus is not transferred to the action buttons.
	 *
	 *  When you're in `editing` state, the focus will be on the input field. And if you use keyboard
	 *  to navigate to `submit` button, this function will be invoked. Then function `onEditViewWrapperFocus`
	 *  will be called, the timeout used here is making sure `onEditViewWrapperFocus` is always called before
	 *  `autoSubmitWhenBlur`.
	 *
	 *  There are two paths here the function can be triggered:
	 *
	 *  - focus on input first, and then use keyboard to `submit`
	 *  - focus on input first, and then click anywhere else on the page (outside of edit view wrapper) to `submit` (auto save).
	 */
	const onEditViewWrapperBlur = useCallback(
		(
			isFieldInvalid: boolean,
			onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
			formRef: React.RefObject<HTMLFormElement>,
		) => {
			if (!keepEditViewOpenOnBlur) {
				wasFocusReceivedSinceLastBlurRef.current = false;
				timerRef.current = setTimeout(
					() => tryAutoSubmitWhenBlur(isFieldInvalid, onSubmit, formRef),
					0,
				);
			}
		},
		[keepEditViewOpenOnBlur, tryAutoSubmitWhenBlur],
	);

	/**
	 * Gets called when focus is transferred to the editView, or action buttons.
	 *
	 * There are three paths here the function can be called:
	 *
	 * - when a user click the `editView`
	 * - when a user use keyboard to tab into `editView`
	 * - when a user use keyboard to tab into `submit` when they were on input field.
	 */
	const onEditViewWrapperFocus = useCallback(() => {
		wasFocusReceivedSinceLastBlurRef.current = true;
	}, []);

	const concatenatedEditButtonLabel = () => {
		if (label) {
			return `${editButtonLabel}, ${label}, ${editLabel}`;
		}
		return `${editButtonLabel}, ${editLabel}`;
	};

	const renderReadView = () => {
		return (
			<ReadView
				editButtonLabel={concatenatedEditButtonLabel()}
				onEditRequested={onEditRequested}
				postReadViewClick={doNotFocusOnEditButton}
				editButtonRef={editButtonRef}
				readViewFitContainerWidth={readViewFitContainerWidth}
				readView={readView}
				testId={testId}
			/>
		);
	};

	return (
		<Form onSubmit={(data: { inlineEdit: any }) => onConfirm(data.inlineEdit)}>
			{({ formProps: { onKeyDown, onSubmit, ref: formRef }, reset }) => (
				<form
					/**
					 * It is not normally acceptable to add key handlers to non-interactive elements
					 * as this is an accessibility anti-pattern. However, because this instance is
					 * to add support for keyboard functionality instead of creating an inaccessible
					 * custom element, we can add role="presentation" so that there is no negative
					 * impacts to assistive technologies.
					 */
					role="presentation"
					onKeyDown={(e) => {
						onKeyDown(e);
						if (e.key === 'Esc' || e.key === 'Escape') {
							reset();
							onCancel();
						}
					}}
					onSubmit={onSubmit}
					ref={formRef}
					// Below we have added a class name to the form element to prevent the default focus on the form element
					// This is because due to some default focus being applied to the form element, the inline edit component
					// was being focused automatically and causing scroll issues in issue view
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={
						fg('platform_design_system_inline_edit_dont_focus') ? 'dont-default-focus' : undefined
					}
				>
					{shouldBeEditing ? (
						<Field
							name="inlineEdit"
							label={label}
							defaultValue={defaultValue}
							validate={validate}
							isRequired={isRequired}
							key="edit-view" // used for reset to default value
						>
							{({ fieldProps, error }) => (
								// eslint-disable-next-line jsx-a11y/no-static-element-interactions
								<div
									css={fieldStyles}
									onBlur={(e) => {
										if (!e.currentTarget.contains(e.relatedTarget as Node)) {
											onEditViewWrapperBlur(fieldProps.isInvalid, onSubmit, formRef);
										}
									}}
									onFocus={onEditViewWrapperFocus}
								>
									{editView(
										{
											...fieldProps,
											errorMessage: error,
										},
										editViewRef,
									)}
									{!hideActionButtons ? (
										<Buttons
											testId={testId}
											cancelButtonLabel={cancelButtonLabel}
											confirmButtonLabel={confirmButtonLabel}
											onMouseDown={() => {
												/**
												 * Prevents focus on edit button only if mouse is used to click button, but not when keyboard is used
												 */
												doNotFocusOnEditButton();
											}}
											onCancelClick={(e) => {
												reset();
												onCancelClick(e);
											}}
										/>
									) : (
										/**
										 * This is to allow Ctrl + Enter to submit without action buttons
										 */
										<Pressable hidden type="submit">
											<VisuallyHidden>Submit</VisuallyHidden>
										</Pressable>
									)}
								</div>
							)}
						</Field>
					) : (
						/**
						 * Field is used here only for the label and spacing
						 */
						<Field
							name="inlineEdit"
							label={label}
							defaultValue=""
							isRequired={isRequired}
							key="read-view" // used for reset to default value
						>
							{renderReadView}
						</Field>
					)}
				</form>
			)}
		</Form>
	);
};

const InlineEdit = <FieldValue extends unknown = string>(props: InlineEditProps<FieldValue>) => {
	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
	return <InnerInlineEdit<FieldValue> {...props} />;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default InlineEdit;
