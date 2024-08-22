import React, {
	type ComponentType,
	forwardRef,
	type Ref,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from 'react';

import {
	type AriaOnFocusProps,
	type GroupBase,
	mergeStyles,
	type OptionsOrGroups,
} from 'react-select';
import type BaseSelect from 'react-select/base';

import {
	ClearIndicator,
	DropdownIndicator,
	IndicatorSeparator,
	LoadingIndicator,
	MultiValueRemove,
} from './components';
import { Input } from './components/input-aria-describedby';
import { NoOptionsMessage } from './components/no-options';
import baseStyles from './styles';
import {
	type AsyncSelectProps,
	type AtlaskitSelectRefType,
	type CreatableSelectProps,
	type GroupType,
	type OptionType,
	type SelectProps,
} from './types';
import { isOptionsGrouped, onFocus } from './utils/grouped-options-announcement';

type AtlaskitSelectProps<Option extends unknown, IsMulti extends boolean> =
	| SelectProps<Option, IsMulti>
	| AsyncSelectProps<Option, IsMulti>
	| CreatableSelectProps<Option, IsMulti>;

export default function createSelect(WrappedComponent: ComponentType<any>) {
	const AtlaskitSelect = forwardRef(function AtlaskitSelect<
		Option extends unknown = OptionType,
		IsMulti extends boolean = false,
	>(props: AtlaskitSelectProps<Option, IsMulti>, forwardedRef: Ref<AtlaskitSelectRefType>) {
		const {
			appearance,
			ariaLiveMessages,
			components: componentsProp,
			isInvalid, // TODO: set to true when cleaning up validationState prop so it has a default value
			onClickPreventDefault = true,
			spacing = 'default',
			styles = {},
			tabSelectsValue = false,
			validationState = 'default',
			...restProps
		} = props;

		const internalSelectRef = useRef<BaseSelect | null>(null);

		const components = useMemo(
			() => ({
				ClearIndicator,
				DropdownIndicator,
				LoadingIndicator,
				MultiValueRemove,
				IndicatorSeparator,
				Input,
				NoOptionsMessage,
				...componentsProp,
			}),
			[componentsProp],
		);

		const descriptionId = props['aria-describedby'];
		const isSearchable = props.isSearchable;
		useEffect(() => {
			if (!isSearchable && descriptionId) {
				// when isSearchable is false, react-select will create its own dummy input instead of using ours,
				// so we need to manually add the additional aria-describedby using ref.
				const input = internalSelectRef.current?.inputRef;
				const ariaDescribedby = input?.getAttribute('aria-describedby');

				if (!ariaDescribedby?.includes(descriptionId)) {
					input?.setAttribute('aria-describedby', `${ariaDescribedby} ${descriptionId}`);
				}
			}
		}, [descriptionId, isSearchable]);

		const isCompact = spacing === 'compact';

		/**
		 * The following `useImperativeHandle` hook exists for the sake of backwards compatibility.
		 * This component used to be a class component which set the value of the `ref` prop to object with the properties and value as below.
		 * This has lead to slightly odd usage of refs with this component, e.g. `myRef.current.select.select.controlRef` instead of just `myRef.current.select.controlRef`
		 * In the next major release, this should removed and the ref should be passed directly to the wrapped component (given users have updated usage)
		 * More info https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/88021/overview
		 */
		useImperativeHandle(
			forwardedRef as Ref<AtlaskitSelectRefType>,
			() => ({
				select: internalSelectRef.current,
				focus: () => internalSelectRef.current?.focus(),
				blur: () => internalSelectRef.current?.blur(),
			}),
			[],
		);
		return (
			<WrappedComponent
				ref={internalSelectRef}
				aria-live="assertive"
				ariaLiveMessages={
					isOptionsGrouped(props.options as OptionsOrGroups<OptionType, GroupType<OptionType>>)
						? {
								onFocus: (data: AriaOnFocusProps<OptionType, GroupBase<OptionType>>) =>
									onFocus(
										data,
										props.options as OptionsOrGroups<OptionType, GroupType<OptionType>>,
									),
								...ariaLiveMessages,
							}
						: { ...ariaLiveMessages }
				}
				tabSelectsValue={tabSelectsValue}
				onClickPreventDefault={onClickPreventDefault}
				{...restProps}
				components={components}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				styles={mergeStyles(
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					baseStyles<Option, IsMulti>(
						// This will cover both props for invalid state while giving priority to isInvalid. When cleaning up validationState, we can just keep the inner condition.
						typeof isInvalid !== 'undefined' ? (isInvalid ? 'error' : 'default') : validationState!,
						isCompact,
						appearance || 'default',
					),
					styles,
				)}
			/>
		);
	});
	AtlaskitSelect.displayName = 'AtlaskitSelect';
	return AtlaskitSelect as <Option extends unknown = OptionType, IsMulti extends boolean = false>(
		props: AtlaskitSelectProps<Option, IsMulti> & {
			ref?: Ref<AtlaskitSelectRefType>;
		},
	) => JSX.Element;
}
