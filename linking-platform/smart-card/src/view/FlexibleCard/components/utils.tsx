import React from 'react';

import { FormattedMessage, type IntlShape, type MessageDescriptor } from 'react-intl-next';
import Loadable from 'react-loadable';

import { type Spacing } from '@atlaskit/button';
import type { Space } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../../constants';

import { type MessageProps } from './types';

export const sizeToButtonSpacing: Record<SmartLinkSize, Spacing> = {
	[SmartLinkSize.Small]: 'none',
	[SmartLinkSize.Medium]: 'compact',
	[SmartLinkSize.Large]: 'compact',
	[SmartLinkSize.XLarge]: 'default',
};

export const getFormattedMessage = (message?: MessageProps) => {
	if (message) {
		const { descriptor, values } = message;
		return <FormattedMessage {...descriptor} values={values} />;
	}
};

export const getFormattedMessageAsString = (
	intl: IntlShape,
	message: MessageDescriptor,
	context?: string,
) => {
	const { formatMessage } = intl;
	return message ? formatMessage(message, { context }) : '';
};

export const getIconWidth = (size?: SmartLinkSize): string => {
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return token('space.300');
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return token('space.200');
	}
};

export const importIcon = (importFn: () => Promise<any>): any => {
	return Loadable({
		loader: () => importFn().then((module) => module.default),
		loading: () => null,
	}) as any; // Because we're using dynamic loading here, TS will not be able to infer the type.
};

export const getMaxLineHeight = (size: SmartLinkSize) => {
	// The maximum line height based on all elements in specific size.
	// These heights belongs to AvatarGroup.
	switch (size) {
		case SmartLinkSize.XLarge:
		case SmartLinkSize.Large:
			return 1.75;
		case SmartLinkSize.Medium:
		case SmartLinkSize.Small:
		default:
			return 1.5;
	}
};

export const getMaxLines = (value: number, defaultValue: number, max: number, min: number) => {
	if (value > max) {
		return defaultValue;
	}

	if (value < min) {
		return min;
	}

	return value;
};

/**
 * A space between element based on smart link size
 * To replace blocks/utils.tsz getGapSize() with space token for primitives
 */
export const getPrimitivesInlineSpaceBySize = (size: SmartLinkSize): Space => {
	switch (size) {
		case SmartLinkSize.XLarge:
			return 'space.250';
		case SmartLinkSize.Large:
			return 'space.200';
		case SmartLinkSize.Medium:
			return 'space.100';
		case SmartLinkSize.Small:
		default:
			return 'space.050';
	}
};

export const hasWhiteSpace = (str: string): boolean => {
	return str.search(/\s/) >= 0;
};
