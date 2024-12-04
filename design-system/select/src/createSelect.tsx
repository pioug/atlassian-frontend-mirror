/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, {
	type ComponentType,
	forwardRef,
	type Ref,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import {
	type AriaOnFocusProps,
	type GroupBase,
	type OptionsOrGroups,
} from '@atlaskit/react-select';
import type BaseSelect from '@atlaskit/react-select/base';

import {
	ClearIndicator,
	DropdownIndicator,
	IndicatorSeparator,
	LoadingIndicator,
	MultiValueRemove,
} from './components';
import { Input } from './components/input-aria-describedby';
import { NoOptionsMessage } from './components/no-options';
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
			ariaLiveMessages,
			components: componentsProp,
			isInvalid, // TODO: set to true when cleaning up validationState prop so it has a default value
			onClickPreventDefault = true,
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

		const descriptionId = props['aria-describedby'] || props['descriptionId'];
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
				aria-live={fg('design_system_select-a11y-improvement') ? undefined : 'assertive'}
				ariaLiveMessages={
					// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
					fg('design_system_select-a11y-improvement')
						? undefined
						: isOptionsGrouped(props.options as OptionsOrGroups<OptionType, GroupType<OptionType>>)
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
				isInvalid={isInvalid || validationState === 'error'}
				{...restProps}
				components={components}
				// indicates react-select to be async by default using the base Select component
				// so that makers can pass all async props on the base select to async load options.
				isAsync
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
