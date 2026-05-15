import {
    type FieldConfig,
    type FieldSubscriber,
    type FieldSubscription,
    type FormApi as FinalFormAPI,
    type Unsubscribe,
} from 'final-form';

export type Align = 'start' | 'end';

export type FormApi<FormData> = FinalFormAPI<FormData>;

export type OnSubmitHandler<FormData> = (
	values: FormData,
	form: FormApi<FormData>,
	callback?: (errors?: Record<string, string>) => void,
) => void | Object | Promise<Object | void>;

export type DefaultValue<FieldValue> = (value?: FieldValue) => FieldValue;

export type RegisterField = <FieldValue>(
	name: string,
	defaultValue: FieldValue | DefaultValue<FieldValue>,
	subscriber: FieldSubscriber<FieldValue>,
	subscription: FieldSubscription,
	config: FieldConfig<FieldValue>,
) => Unsubscribe;

export type GetCurrentValue = <FormValues>(
	name: string,
) => FormValues[keyof FormValues] | undefined;
