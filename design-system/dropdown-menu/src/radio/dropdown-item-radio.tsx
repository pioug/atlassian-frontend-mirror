import React, { type KeyboardEvent, type MouseEvent, useCallback } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import ButtonItem from '@atlaskit/menu/button-item';
import { SELECTION_STYLE_CONTEXT_DO_NOT_USE } from '@atlaskit/menu/selection-style-context-do-not-use';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import NewDropdownMenuItem from '../dropdown-menu-item-new';
import RadioIcon from '../internal/components/radio-icon';
import useRadioState from '../internal/hooks/use-radio-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import { type DropdownItemRadioProps } from '../types';

/**
 * __Dropdown item radio__
 *
 * A dropdown item radio displays groups that have a single selection.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/dropdown-item-radio/usage)
 */
export const DropdownItemRadio = ({
	children,
	defaultSelected,
	testId,
	id,
	title,
	description,
	isDisabled,
	isSelected,
	shortcut,
	onClick: providedOnClick = noop,
	shouldDescriptionWrap = true,
	shouldTitleWrap = true,
	interactionName,
	// DSP-13312 TODO: remove spread props in future major release
	...rest
}: DropdownItemRadioProps): React.JSX.Element => {
	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV !== 'production' &&
		typeof isSelected !== 'undefined' &&
		typeof defaultSelected !== 'undefined'
	) {
		// eslint-disable-next-line no-console
		console.warn(
			"[DropdownItemRadio] You've used both `defaultSelected` and `isSelected` props. This is dangerous and can lead to unexpected results. Use one or the other depending if you want to control the components state yourself.",
		);
	}

	const [selected, setSelected] = useRadioState({
		id,
		isSelected,
		defaultSelected,
	});

	const handleItemClick = useCallback(
		(event: MouseEvent | KeyboardEvent) => {
			setSelected((selected) => !selected);
			providedOnClick(event);
		},
		[providedOnClick, setSelected],
	);

	const itemRef = useRegisterItemWithFocusManager();

	// Just to force the toggle in atlaspack workbench
	// @ts-ignore
	const _nothing = fg('platform-dst-tokens-finesse');

	const radioItem = fg('platform-dst-new-menu') ? (
		// eslint-disable-next-line @atlassian/a11y/aria-toggle-field-name -- Linter demands the component has children, but the title prop here handles children which maintains accessibility.
		<NewDropdownMenuItem
			title={children}
			description={description}
			elemBefore={<RadioIcon checked={selected} disabled={isDisabled} />}
			isSelected={selected}
			aria-checked={selected}
			isDisabled={isDisabled}
			shouldTitleWrap={shouldTitleWrap}
			shouldDescriptionWrap={shouldDescriptionWrap}
			shortcut={shortcut}
			onClick={handleItemClick}
			role="menuitemradio"
			testId={testId}
			id={id}
			ref={itemRef}
		/>
	) : (
		<ButtonItem
			aria-checked={selected}
			description={description}
			iconBefore={<RadioIcon checked={selected} />}
			id={id}
			isDisabled={isDisabled}
			isSelected={selected}
			onClick={handleItemClick}
			ref={itemRef}
			role="menuitemradio"
			shouldDescriptionWrap={shouldDescriptionWrap}
			shouldTitleWrap={shouldTitleWrap}
			testId={testId}
			// Thanks to spread props, this attribute are passed to ButtonItem, even though
			// it's not in the component's prop types.
			// @ts-expect-error
			title={title}
			interactionName={interactionName}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
			// Override ButtonItem's default aria-current, as aria-checked is the correct attribute for menuitemradio (A11Y-37930)
			aria-current={undefined}
		>
			{children}
		</ButtonItem>
	);

	return (
		<SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="none">
			{radioItem}
		</SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
	);
};

export default DropdownItemRadio;
