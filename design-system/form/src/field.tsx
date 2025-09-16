/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type FormEvent,
	type MutableRefObject,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { type FieldState } from 'final-form';

import { css, jsx } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import { token } from '@atlaskit/tokens';

import { FieldId } from './field-id-context';
import { FormContext, IsDisabledContext } from './form';
import { Label } from './label';
import RequiredAsterisk from './required-asterisk';

const fieldWrapperStyles = css({
	marginBlockStart: token('space.100', '8px'),
});

function isEvent(event: any): event is FormEvent<SupportedElements> {
	return Boolean(event && event.target);
}

function isFunction<T>(x: T | ((value?: T) => T)): x is (value?: T) => T {
	return typeof x === 'function';
}

type SupportedElements = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface FieldProps<FieldValue, Element extends SupportedElements = HTMLInputElement> {
	id: string;
	isRequired: boolean;
	isDisabled: boolean;
	isInvalid: boolean;
	// This can be either an event or value as `onChange` might not be applied
	// directly to a DOM element. For example, it might be a react-select
	onChange: (value: FormEvent<Element> | FieldValue) => void;
	onBlur: () => void;
	onFocus: () => void;
	value: FieldValue;
	name: string;
	'aria-invalid': 'true' | 'false';
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	'aria-labelledby': string;
	'aria-describedby'?: string;
}

export interface Meta {
	dirty: boolean;
	dirtySinceLastSubmit: boolean;
	submitFailed: boolean;
	submitting: boolean;
	touched: boolean;
	valid: boolean;
	error?: string;
	submitError?: boolean;
	validating?: boolean;
}

// Must be exported to satisfy error TS4023 from Jira builds
// src/packages/servicedesk/virtual-agent/common/src/ui/base-text-field/index.tsx(10,14):
// error TS4023: Exported variable `BaseTextField` has or is using name
// `FieldComponentProps` from external module
// `/opt/atlassian/pipelines/agent/build/jira/tsDist/@atlaskit__form/app/src/field`
// but cannot be named.
export interface FieldComponentProps<FieldValue, Element extends SupportedElements> {
	/**
	 * Content to render in the field. This is a function that is called with props for the field component and other information about the field.
	 */
	children: (args: {
		fieldProps: FieldProps<FieldValue, Element>;
		error?: string;
		// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
		valid: boolean;
		meta: Meta;
	}) => ReactNode;
	/**
	 * Sets the default value of the field. If a function is provided, it is called with the current default value of the field.
	 */
	defaultValue?: FieldValue | ((currentDefaultValue?: FieldValue) => FieldValue);
	/**
	 * Passed to the ID attribute of the field. This is randomly generated if it is not specified.
	 */
	id?: string;
	/**
	 * Sets whether the field is required for submission. Required fields are marked with a red asterisk.
	 */
	isRequired?: boolean;
	/**
	 * Sets whether the field is disabled. Users cannot edit or focus on the fields. If the parent form component is disabled, then the field will always be disabled.
	 */
	isDisabled?: boolean;
	/**
	 * Label displayed above the form field.
	 */
	label?: ReactNode;
	/**
	 * Element displayed after the label, and after the red asterisk if field is required.
	 */
	elementAfterLabel?: ReactNode;
	/**
	 * Specifies the name of the field. This is important for referencing the form data.
	 */
	name: string;
	/**
	 * Access the current field value and transform it to return a different field value.
	 */
	transform?: (event: FormEvent<Element> | FieldValue, current: FieldValue) => FieldValue;
	/**
	 * Checks whether the field input is valid. This is usually used to display a message relevant to the current value using `ErrorMessage`, `HelperMessage` or `ValidMessage`.
	 */
	validate?: (
		value: FieldValue | undefined,
		formState: Object,
		fieldState: Meta,
	) => string | void | Promise<string | void>;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
}

interface State<FieldValue, Element extends SupportedElements> {
	fieldProps: {
		onChange: (value: FormEvent<Element> | FieldValue) => void;
		onBlur: () => void;
		onFocus: () => void;
		value: FieldValue;
	};
	error?: string;
	valid: boolean;
	meta: Meta;
}

function usePreviousRef<T>(current: T): MutableRefObject<T> {
	const ref = useRef(current);

	// will be updated on the next render
	useEffect(() => {
		ref.current = current;
	});

	// return the existing current (pre render)
	return ref;
}

function isShallowEqual<FieldValue>(previousValue: FieldValue, currentValue: FieldValue) {
	if (previousValue === currentValue) {
		return true;
	}

	// not checking functions
	if (typeof previousValue === 'function' && typeof currentValue === 'function') {
		return true;
	}

	if (Array.isArray(previousValue) && Array.isArray(currentValue)) {
		return JSON.stringify(previousValue) === JSON.stringify(currentValue);
	}

	if (typeof previousValue === 'object' && typeof currentValue === 'object') {
		return JSON.stringify(previousValue) === JSON.stringify(currentValue);
	}

	return false;
}

export default function Field<
	FieldValue = string,
	Element extends SupportedElements = HTMLInputElement,
>(props: FieldComponentProps<FieldValue, Element>) {
	const { registerField, getCurrentValue } = useContext(FormContext);
	const isDisabled = useContext(IsDisabledContext) || props.isDisabled || false;
	const defaultValue = isFunction<FieldValue | undefined>(props.defaultValue)
		? props.defaultValue()
		: props.defaultValue;

	const latestPropsRef = usePreviousRef(props);

	/**
	 * HACK: defaultValue can potentially be an array or object which cannot be
	 * passed directly into a `useEffect` dependency array, since it will trigger
	 * the hook every time.
	 */
	const isDefaultValueChanged = !isShallowEqual(
		latestPropsRef.current.defaultValue,
		props.defaultValue,
	);

	const [state, setState] = useState<State<FieldValue, Element>>({
		fieldProps: {
			onChange: () => {},
			onBlur: () => {},
			onFocus: () => {},
			/* Previously, defaultValue was being set as undefined in Field.defaultProps, which
			 * effectively made it an optional prop to external consumers of Field. However the
			 * prop types defined defaultValue as required, so inside the component it was not
			 * valid for defaultValue to be undefined. We need to suppress the error
			 * after changing defaultValue to explicitly be an optional prop.
			 * If default value has changed we are using new default value.
			 * Otherwise we need to check if we already have value for this field
			 * (because we are using changing key prop to re-run field level validation, and that
			 * cause the component re-mounting) to not override the actual value with the default value.
			 */
			// @ts-ignore
			value: isDefaultValueChanged ? defaultValue : (getCurrentValue(props.name) ?? defaultValue),
		},
		error: undefined,
		valid: false,
		meta: {
			dirty: false,
			dirtySinceLastSubmit: false,
			touched: false,
			valid: false,
			validating: false,
			submitting: false,
			submitFailed: false,
			error: undefined,
			submitError: undefined,
		},
	});

	const latestStateRef = usePreviousRef(state);

	useEffect(() => {
		function fieldStateToMeta(value: Partial<FieldState<FieldValue>> = {}): Meta {
			return {
				dirty: value.dirty || false,
				dirtySinceLastSubmit: value.dirtySinceLastSubmit || false,
				touched: value.touched || false,
				valid: value.valid || false,
				submitting: value.submitting || false,
				submitFailed: value.submitFailed || false,
				error: value.error,
				submitError: value.submitError,
				validating: !!value.validating,
			};
		}

		const unregister = registerField<FieldValue>(
			latestPropsRef.current.name,
			/**
			 * Similar as for setting initial state value.
			 * Additionally we are checking if the default value is a function,
			 * it is used in checkbox fields, where fields with same name and
			 * defaultIsChecked should create array of values. In this situation we can't
			 * override the default value on re-registering, but also we don't need to change
			 * the key prop to re-run validation.
			 */
			// @ts-ignore
			isDefaultValueChanged ||
				// @ts-ignore
				isFunction(latestPropsRef.current.defaultValue)
				? latestPropsRef.current.defaultValue
				: latestStateRef.current.fieldProps.value,
			(fieldState) => {
				/**
				 * Do not update dirtySinceLastSubmit until submission has finished.
				 */
				const modifiedDirtySinceLastSubmit = fieldState.submitting
					? latestStateRef.current.meta.dirtySinceLastSubmit
					: fieldState.dirtySinceLastSubmit;

				/**
				 * Do not update submitFailed until submission has finished.
				 */
				const modifiedSubmitFailed = fieldState.submitting
					? latestStateRef.current.meta.submitFailed
					: fieldState.submitFailed;

				/**
				 * Do not use submitError if the value has changed.
				 */
				const modifiedSubmitError =
					modifiedDirtySinceLastSubmit && latestPropsRef.current.validate
						? undefined
						: fieldState.submitError;
				const modifiedError =
					modifiedSubmitError || ((fieldState.touched || fieldState.dirty) && fieldState.error);

				/**
				 * If there has been a submit error, then use logic in modifiedError to determine validity,
				 * so we can determine when there is a submit error which we do not want to display
				 * because the value has been changed.
				 */
				const modifiedValid = modifiedSubmitFailed ? modifiedError === undefined : fieldState.valid;

				function getTransform(
					eventOrValue: FormEvent<Element> | FieldValue,
					currentValue: FieldValue,
				): FieldValue | boolean | string | undefined {
					if (latestPropsRef.current.transform) {
						return latestPropsRef.current.transform(eventOrValue, currentValue);
					}

					if (isEvent(eventOrValue)) {
						const { currentTarget } = eventOrValue;

						if (currentTarget.type === 'checkbox') {
							if ((currentTarget as HTMLInputElement).checked) {
								return currentTarget.value || true;
							}

							return currentTarget.value ? undefined : false;
						} else if (currentTarget) {
							return currentTarget.value;
						}
					} else {
						return eventOrValue;
					}
				}

				setState({
					fieldProps: {
						onChange: (e) => {
							fieldState.change(
								getTransform(
									e as FormEvent<Element>,
									fieldState.value! as FieldValue,
								) as FieldValue,
							);
						},
						onBlur: fieldState.blur,
						onFocus: fieldState.focus,
						value: fieldState.value!,
					},
					error: modifiedError || undefined,
					/**
					 * The following parameters are optionally typed in final-form to indicate that not all parameters need
					 * to be subscribed to. We cast them as booleans (using || false), since this is what they are semantically.
					 */
					valid: modifiedValid || false,
					meta: fieldStateToMeta(fieldState),
				});
			},
			{
				dirty: true,
				dirtySinceLastSubmit: true,
				touched: true,
				valid: true,
				submitting: true,
				submitFailed: true,
				value: true,
				error: true,
				submitError: true,
				validating: true,
			},
			{
				getValidator: () =>
					function validate(
						value: FieldValue,
						formState: Object,
						fieldState?: FieldState<FieldValue>,
					) {
						const supplied = latestPropsRef.current.validate;
						if (supplied && fieldState) {
							return supplied(value, formState, fieldStateToMeta(fieldState));
						}
					},
			},
		);
		return unregister;
	}, [latestPropsRef, latestStateRef, registerField, props.name, isDefaultValueChanged]);

	const uid = useId();
	const fieldId = useMemo(() => {
		return props.id ? props.id : `${props.name}-${uid}`;
	}, [props.id, props.name, uid]);

	const getDescribedBy = () => {
		let value = '';
		if (state.error) {
			value += `${fieldId}-error `;
		}
		if (state.valid) {
			value += `${fieldId}-valid `;
		}
		return `${value}${fieldId}-helper`;
	};

	const extendedFieldProps = {
		...state.fieldProps,
		name: props.name,
		isDisabled,
		isInvalid: Boolean(state.error),
		isRequired: Boolean(props.isRequired),
		'aria-invalid': (state.error ? 'true' : 'false') as 'true' | 'false',
		'aria-describedby': getDescribedBy(),
		'aria-labelledby': `${fieldId}-label`,
		id: fieldId,
	};

	return (
		<div css={fieldWrapperStyles} data-testid={props.testId}>
			{props.label && (
				<Label
					htmlFor={fieldId}
					id={`${fieldId}-label`}
					testId={props.testId && `${props.testId}--label`}
				>
					{props.label}
					{props.isRequired && <RequiredAsterisk />}
					{props.elementAfterLabel}
				</Label>
			)}
			<FieldId.Provider value={fieldId}>
				{props.children({
					fieldProps: extendedFieldProps,
					error: state.error,
					valid: state.valid,
					meta: state.meta,
				})}
			</FieldId.Provider>
		</div>
	);
}
