/* eslint-disable @repo/internal/react/no-unsafe-spread-props */
import React, { type ComponentType, type CSSProperties, type ReactNode } from 'react';

import { type XCSSProp } from '@compiled/react';

import type { XCSSAllProperties, XCSSAllPseudos } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';

import Compiled, {
	MultiValueContainer as CompiledMultiValueContainer,
	multiValueCSS as CompiledMultiValueCSS,
	MultiValueLabel as CompiledMultiValueLabel,
	multiValueLabelCSS as CompiledMultiValueLabelCSS,
	MultiValueRemove as CompiledMultiValueRemove,
	multiValueRemoveCSS as CompiledMultiValueRemoveCSS,
} from '../compiled/components/multi-value';
import Emotion, {
	MultiValueContainer as EmotionMultiValueContainer,
	multiValueCSS as EmotionMultiValueCSS,
	MultiValueLabel as EmotionMultiValueLabel,
	multiValueLabelCSS as EmotionMultiValueLabelCSS,
	MultiValueRemove as EmotionMultiValueRemove,
	multiValueRemoveCSS as EmotionMultiValueRemoveCSS,
} from '../emotion/components/multi-value';
import { type SelectProps } from '../select';
import { type CommonPropsAndClassName, type CSSObjectWithLabel, type GroupBase } from '../types';
interface MultiValueComponents<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
	Container: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	Label: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	Remove: ComponentType<MultiValueRemoveProps<Option, IsMulti, Group>>;
}

export interface MultiValueProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> extends CommonPropsAndClassName<Option, IsMulti, Group> {
	children: ReactNode;
	components: MultiValueComponents<Option, IsMulti, Group>;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	cropWithEllipsis?: boolean;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	isFocused: boolean;
	isDisabled: boolean;
	removeProps: JSX.IntrinsicElements['div'];
	index: number;
}

export const multiValueCSS = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? CompiledMultiValueCSS() : EmotionMultiValueCSS(props);

export const multiValueLabelCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MultiValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? CompiledMultiValueLabelCSS() : EmotionMultiValueLabelCSS(props);

export const multiValueRemoveCSS = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MultiValueProps<Option, IsMulti, Group>,
): CSSObjectWithLabel =>
	fg('compiled-react-select') ? CompiledMultiValueRemoveCSS() : EmotionMultiValueRemoveCSS(props);

export interface MultiValueGenericProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: any;
	innerProps: { className?: string; style?: CSSProperties };
	selectProps: SelectProps<Option, IsMulti, Group>;
	isFocused?: boolean;
	isDisabled?: boolean;
	hasEllipsis?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueContainer = <
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
>(
	props: MultiValueGenericProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledMultiValueContainer {...props} />
	) : (
		<EmotionMultiValueContainer {...props} />
	);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const MultiValueLabel = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueGenericProps<Option, IsMulti, Group>,
) =>
	fg('compiled-react-select') ? (
		<CompiledMultiValueLabel {...props} />
	) : (
		<EmotionMultiValueLabel {...props} />
	);
export interface MultiValueRemoveProps<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> {
	children?: ReactNode;
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	data: Option;
	innerProps: JSX.IntrinsicElements['div'];
	selectProps: SelectProps<Option, IsMulti, Group>;
	isDisabled: boolean;
	isFocused?: boolean;
	className?: string | undefined;
	xcss?: XCSSProp<XCSSAllProperties, XCSSAllPseudos> | undefined;
}

export function MultiValueRemove<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueRemoveProps<Option, IsMulti, Group>,
) {
	return (
		// The Remove button is intentionally excluded from the tab order, please avoid assigning a non-negative tabIndex to it. Context: https://hello.atlassian.net/wiki/spaces/A11YKB/pages/3031993460/Clear+Options+on+an+Input+Field
		fg('compiled-react-select') ? (
			<CompiledMultiValueRemove {...props} />
		) : (
			<EmotionMultiValueRemove {...props} />
		)
	);
}

const MultiValue = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: MultiValueProps<Option, IsMulti, Group>,
) => (fg('compiled-react-select') ? <Compiled {...props} /> : <Emotion {...props} />);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default MultiValue;
