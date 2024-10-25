import React from 'react';

import PremiumIcon from '@atlaskit/icon/core/migration/premium';
import { token } from '@atlaskit/tokens';

import {
	ComponentStorageValue,
	DefaultTemplate,
	ExampleStorageKey,
	FunctionStorageValue,
} from './constants';
import { type FlexibleTemplate } from './types';

export type ChangeParams<T extends object> = [
	onChange: (template: T) => void,
	template: T,
	propName: keyof T,
	defaultValue?: T[keyof T] | string | boolean,
];

const updateObj = <T extends object>(
	template: T,
	propName: keyof T,
	defaultValue?: T[keyof T] | string | boolean | undefined,
	value?: T[keyof T] | string | boolean,
): T => {
	if (value === defaultValue || (Array.isArray(value) && value.length === 0)) {
		const { [propName]: removedProp, ...rest } = template;
		return rest as T;
	} else {
		return { ...template, [propName]: value };
	}
};

export const handleOnChange = <T extends object>(
	onChange: (template: T) => void,
	template: T,
	propName: keyof T,
	defaultValue?: T[keyof T] | string | boolean,
	value?: T[keyof T] | string | boolean,
) => {
	onChange(updateObj(template, propName, defaultValue, value));
};

export const getCustomActionIcon = () => (
	<PremiumIcon label="" color={token('color.icon', '#44546F')} />
);

export const getExampleFromLocalStorage = () => {
	try {
		const str = localStorage.getItem(ExampleStorageKey);
		if (str) {
			return JSON.parse(str, (key, value) => {
				if (typeof value === 'string' && value === FunctionStorageValue) {
					return () => {};
				} else if (typeof value === 'string' && value === ComponentStorageValue) {
					return getCustomActionIcon();
				} else {
					return value;
				}
			});
		}
	} catch (err) {
		localStorage.removeItem(ExampleStorageKey);
		console.log(err);
	}
	return DefaultTemplate;
};

export const setExampleToLocalStorage = (template: FlexibleTemplate) => {
	localStorage.setItem(
		ExampleStorageKey,
		JSON.stringify(template, (key, value) => {
			if (typeof value === 'function') {
				return FunctionStorageValue;
			} else if (typeof value === 'object' && value['$$typeof'] === Symbol.for('react.element')) {
				return ComponentStorageValue;
			} else {
				return value;
			}
		}),
	);
};
