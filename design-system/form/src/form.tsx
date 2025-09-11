import React, {
	createContext,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import {
	createForm,
	type FieldConfig,
	type FieldSubscriber,
	type FieldSubscription,
	type FormApi,
	type FormState,
	type Unsubscribe,
} from 'final-form';
import createDecorator from 'final-form-focus';
import set from 'lodash/set';

import { fg } from '@atlaskit/platform-feature-flags';

import { type OnSubmitHandler } from './types';
import { getFirstErrorField } from './utils';

type DefaultValue<FieldValue> = (value?: FieldValue) => FieldValue;

type RegisterField = <FieldValue>(
	name: string,
	defaultValue: FieldValue | DefaultValue<FieldValue>,
	subscriber: FieldSubscriber<FieldValue>,
	subscription: FieldSubscription,
	config: FieldConfig<FieldValue>,
) => Unsubscribe;

type GetCurrentValue = <FormValues>(name: string) => FormValues[keyof FormValues] | undefined;

/**
 * __Form context__
 *
 * A form context creates a context for the field values and allows them to be accessed by the children.
 */
export const FormContext = createContext<{
	registerField: RegisterField;
	getCurrentValue: GetCurrentValue;
	subscribe: FormApi['subscribe'];
}>({
	registerField: function () {
		return () => {};
	},
	getCurrentValue: () => undefined,
	subscribe: function () {
		return () => {};
	},
});

/**
 * __Is disabled context__
 *
 * An is disabled context creates the context for when a value is disabled.
 */
export const IsDisabledContext = createContext(false);

interface FormChildrenProps {
	ref: React.RefObject<HTMLFormElement>;
	onSubmit: (event?: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>) => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

type FormChildrenArgs<FormValues> = {
	formProps: FormChildrenProps;
	disabled: boolean;
	dirty: boolean;
	submitting: boolean;
	getState: () => FormState<FormValues>;
	getValues: () => FormValues;
	setFieldValue: (name: string, value: any) => void;
	resetFieldState?: (name: string) => void;
	reset: (initialValues?: FormValues) => void;
};

type ExcludeReservedFormProps = {
	onKeyDown?: never;
	onSubmit?: never;
	ref?: never;
};

export interface FormProps<FormValues> {
	/**
	 *  The contents rendered inside of the form. This is a function where the props will be passed from the form. The function props you can access are `dirty`, `submitting` and `disabled`.
	 *  You can read more about these props in [react-final form documentation](https://final-form.org/docs/final-form/types/FormState).
	 */
	children: ((args: FormChildrenArgs<FormValues>) => ReactNode) | (() => void) | ReactNode;
	/**
	 * When `Form` renders JSX children directly and not using a function to
	 * spread `formProps` manually, the properties in this `formProps` prop will
	 * be spread on an internally rendered  HTML `form` element.
	 */
	formProps?: {
		[x: string]: any;
	} & ExcludeReservedFormProps;
	/**
	 *   Event handler called when the form is submitted. Fields must be free of validation errors.
	 */
	onSubmit: OnSubmitHandler<FormValues>;
	/**
	 *   Sets the form and its fields as disabled. Users cannot edit or focus on the fields.
	 */
	isDisabled?: boolean;
	/**
	 * A test identifier for the form element. This will be applied as `data-testid` attribute.
	 */
	testId?: string;
}

export default function Form<FormValues extends Record<string, any> = {}>(
	props: FormProps<FormValues>,
) {
	const { formProps: userProvidedFormProps, onSubmit, testId } = props;

	const formRef = useRef<HTMLFormElement | null>(null);
	const onSubmitRef = useRef(onSubmit);
	onSubmitRef.current = onSubmit;

	const [form] = useState(() => {
		// Types here would break the existing API
		const finalForm = createForm<any>({
			onSubmit: (...args) => onSubmitRef.current(...args),
			destroyOnUnregister: true,
			initialValues: {},
			mutators: {
				setDefaultValue: ([name, defaultValue]: [string, {} | DefaultValue<any>], state) => {
					if (state.formState.initialValues) {
						const initialValues: any = state.formState.initialValues;
						const values: any = state.formState.values;
						const value =
							name && typeof defaultValue === 'function'
								? defaultValue(initialValues[name])
								: defaultValue;

						set(initialValues, name, value);
						set(values, name, value);
					}
				},
			},
		});

		createDecorator<FormValues>(
			() => (formRef.current ? Array.from(formRef.current.querySelectorAll('input')) : []),
			fg('platform-form-field-error-focus') ? getFirstErrorField : undefined,
		)(finalForm);

		return finalForm;
	});

	const [state, setState] = useState({
		dirty: false,
		submitting: false,
	});

	useEffect(() => {
		const unsubscribe = form.subscribe(
			({ dirty, submitting }: { dirty: boolean; submitting: boolean }) => {
				setState({ dirty, submitting });
			},
			{
				dirty: true,
				submitting: true,
			},
		);

		return unsubscribe;
	}, [form]);

	const registerField = useCallback<RegisterField>(
		(name, defaultValue, subscriber, subscription, config) => {
			form.pauseValidation();
			const unsubscribe = form.registerField(name, subscriber, subscription, config);

			form.mutators.setDefaultValue(name, defaultValue);
			form.resumeValidation();

			return unsubscribe;
		},
		[form],
	);

	const handleSubmit = (
		e?: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>,
	) => {
		if (e) {
			e.preventDefault();
		}
		form.submit();
	};

	const handleReset = (initialValues?: FormValues) => {
		form.reset(initialValues);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && formRef.current) {
			const submitButton: HTMLElement | null = formRef.current.querySelector(
				'button:not([type]), button[type="submit"], input[type="submit"]',
			);
			if (submitButton) {
				submitButton.click();
			}
			e.preventDefault();
		}
	};

	const { isDisabled = false, children } = props;
	const { dirty, submitting } = state;

	/**
	 * This method is needed in FormContext to use it on the field level
	 * to check the current value of the field in case of the component re-mounting.
	 */
	const getCurrentValue: GetCurrentValue = useCallback(
		(name) => {
			const formState = form.getState();
			return formState?.values[name] || undefined;
		},
		[form],
	);

	const FormContextValue = useMemo(() => {
		return { registerField, getCurrentValue, subscribe: form.subscribe };
	}, [registerField, getCurrentValue, form.subscribe]);

	// Abstracting so we can use the same for both rendering patterns
	const formProps = {
		onKeyDown: handleKeyDown,
		onSubmit: handleSubmit,
		ref: formRef,
		...(testId && { 'data-testid': testId }),
	};

	const childrenContent = (() => {
		if (typeof children === 'function') {
			const result =
				children.length > 0
					? (children as (args: FormChildrenArgs<FormValues>) => ReactNode)({
							formProps,
							dirty,
							reset: handleReset,
							submitting,
							disabled: isDisabled,
							getState: () => form.getState(),
							getValues: () => form.getState().values,
							setFieldValue: form.change,
							...(fg('platform-form-reset-field-state') && {
								resetFieldState: form.resetFieldState,
							}),
						})
					: (children as () => ReactNode | void)();
			return result === undefined ? null : result;
		} else {
			return fg('platform_design-system-team_form-upgrade') ? (
				<form {...formProps} {...userProvidedFormProps}>
					{children}
				</form>
			) : (
				children
			);
		}
	})();

	return (
		<FormContext.Provider value={FormContextValue}>
			<IsDisabledContext.Provider value={isDisabled}>{childrenContent}</IsDisabledContext.Provider>
		</FormContext.Provider>
	);
}
