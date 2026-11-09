import React, { type KeyboardEvent, type MouseEvent, useCallback } from 'react';

import noop from '@atlaskit/ds-lib/noop';
import ButtonItem from '@atlaskit/menu/button-item';
import { SELECTION_STYLE_CONTEXT_DO_NOT_USE } from '@atlaskit/menu/selection-style-context-do-not-use';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import NewDropdownMenuItem from '../dropdown-menu-item-new';
import CheckboxIcon from '../internal/components/checkbox-icon';
import useCheckboxState from '../internal/hooks/use-checkbox-state';
import useRegisterItemWithFocusManager from '../internal/hooks/use-register-item-with-focus-manager';
import { type DropdownItemCheckboxProps } from '../types';

/**
 * __Dropdown item checkbox__
 *
 * A dropdown item checkbox creates groups that have multiple selections.
 *
 * - [Examples](https://atlassian.design/components/dropdown-menu/dropdown-item-checkbox/examples)
 * - [Code](https://atlassian.design/components/dropdown-menu/dropdown-item-checkbox/code)
 * - [Usage](https://atlassian.design/components/dropdown-menu/dropdown-item-checkbox/usage)
 */
export const DropdownItemCheckbox = ({
	children,
	defaultSelected,
	description,
	id,
	isDisabled,
	isSelected,
	onClick: providedOnClick = noop,
	shouldDescriptionWrap = true,
	shouldTitleWrap = true,
	shortcut,
	testId,
	interactionName,
	// DSP-13312 TODO: remove spread props in future major release
	...rest
}: DropdownItemCheckboxProps): React.JSX.Element => {
	if (
		typeof process !== 'undefined' &&
		process.env.NODE_ENV !== 'production' &&
		typeof isSelected !== 'undefined' &&
		typeof defaultSelected !== 'undefined'
	) {
		// eslint-disable-next-line no-console
		console.warn(
			"[DropdownItemCheckbox] You've used both `defaultSelected` and `isSelected` props. This is dangerous and can lead to unexpected results. Use one or the other depending if you want to control the components state yourself.",
		);
	}

	const [selected, setSelected] = useCheckboxState({
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

	const checkboxItem = fg('platform-dst-new-menu') ? (
		// eslint-disable-next-line @atlassian/a11y/aria-toggle-field-name -- Linter demands the component has children, but the title prop here handles children which maintains accessibility.
		<NewDropdownMenuItem
			title={children}
			description={description}
			elemBefore={<CheckboxIcon checked={selected} disabled={isDisabled} />}
			isSelected={selected}
			aria-checked={selected}
			isDisabled={isDisabled}
			shouldTitleWrap={shouldTitleWrap}
			shouldDescriptionWrap={shouldDescriptionWrap}
			shortcut={shortcut}
			onClick={handleItemClick}
			role="menuitemcheckbox"
			testId={testId}
			id={id}
			ref={itemRef}
		/>
	) : (
		<ButtonItem
			aria-checked={selected}
			description={description}
			iconBefore={<CheckboxIcon checked={selected} />}
			id={id}
			isDisabled={isDisabled}
			isSelected={selected}
			onClick={handleItemClick}
			ref={itemRef}
			role="menuitemcheckbox"
			shouldTitleWrap={shouldTitleWrap}
			shouldDescriptionWrap={shouldDescriptionWrap}
			testId={testId}
			interactionName={interactionName}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...rest}
			// Checked state is conveyed by aria-checked, not ButtonItem's aria-current (A11Y-30123).
			aria-current={undefined}
		>
			{children}
		</ButtonItem>
	);

	return (
		<SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="none">
			{checkboxItem}
		</SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
	);
};

export default DropdownItemCheckbox;
