import React, {
	type ComponentType,
	type ReactNode,
	type Ref,
	forwardRef,
	useImperativeHandle,
	useMemo,
	useRef,
	type JSX,
} from 'react';

import type BaseSelect from '@atlaskit/react-select/base';

import {
	type AsyncSelectProps,
	type AtlaskitSelectRefType,
	type CreatableSelectProps,
	type MenuProps,
	type OptionType,
	type SelectProps,
} from './types';

type AtlaskitSelectProps<Option extends unknown, IsMulti extends boolean> =
	| SelectProps<Option, IsMulti>
	| AsyncSelectProps<Option, IsMulti>
	| CreatableSelectProps<Option, IsMulti>;

const InlineMenuPortal = ({ children }: { children: ReactNode }) => children;

const InlineMenu = ({ children, innerProps }: MenuProps<OptionType, boolean>): JSX.Element => (
	<div
		{...innerProps}
		// MenuList owns this ID; forwarding it here would create duplicate listbox IDs.
		id={undefined}
	>
		{children}
	</div>
);

export default function createSelect(WrappedComponent: ComponentType<any>) {
	const AtlaskitSelect: React.ForwardRefExoticComponent<
		React.PropsWithoutRef<AtlaskitSelectProps<any, boolean>> &
			React.RefAttributes<AtlaskitSelectRefType>
	> = forwardRef(function AtlaskitSelect<
		Option extends unknown = OptionType,
		IsMulti extends boolean = false,
	>(props: AtlaskitSelectProps<Option, IsMulti>, forwardedRef: Ref<AtlaskitSelectRefType>) {
		const {
			ariaLiveMessages,
			components,
			isInvalid, // TODO: set to true when cleaning up validationState prop so it has a default value
			menuRenderMode = 'popup',
			onClickPreventDefault = true,
			tabSelectsValue = false,
			validationState = 'default',
			...restProps
		} = props;

		const internalSelectRef = useRef<BaseSelect | null>(null);
		const inlineMenuComponents = useMemo(
			() => ({
				...components,
				MenuPortal: InlineMenuPortal,
				Menu: InlineMenu,
			}),
			[components],
		);

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

		if (menuRenderMode === 'inline') {
			return (
				<WrappedComponent
					ref={internalSelectRef}
					ariaLiveMessages={ariaLiveMessages}
					onClickPreventDefault={onClickPreventDefault}
					isInvalid={isInvalid || validationState === 'error'}
					{...restProps}
					components={inlineMenuComponents}
					menuIsOpen
					tabSelectsValue={tabSelectsValue}
					// indicates react-select to be async by default using the base Select component
					// so that makers can pass all async props on the base select to async load options.
					isAsync
				/>
			);
		}

		return (
			<WrappedComponent
				ref={internalSelectRef}
				ariaLiveMessages={ariaLiveMessages}
				tabSelectsValue={tabSelectsValue}
				onClickPreventDefault={onClickPreventDefault}
				isInvalid={isInvalid || validationState === 'error'}
				components={components}
				{...restProps}
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
