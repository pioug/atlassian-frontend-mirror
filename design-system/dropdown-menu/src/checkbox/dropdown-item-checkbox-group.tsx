import React from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';
import Section from '@atlaskit/menu/section';
import type { SectionProps } from '@atlaskit/menu/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import DropdownMenuItemGroup from '../dropdown-item-group';
import GroupTitle from '../internal/components/group-title';
import { CheckboxGroupContext } from '../internal/context/checkbox-group-context';

interface DropdownItemCheckboxGroupProps extends SectionProps {
	/**
	 * Unique identifier for the checkbox group.
	 */
	id: string;
}

/**
 * __Dropdown item checkbox group__
 *
 * A wrapping element for dropdown menu checkbox items.
 *
 */
export const DropdownItemCheckboxGroup = ({
	children,
	hasSeparator,
	id,
	isList,
	isScrollable,
	testId,
	title,
	titleId,
	label,
	// DSP-13312 TODO: remove spread props in future major release
	...rest
}: DropdownItemCheckboxGroupProps): React.JSX.Element => {
	const uid = useId();
	const groupTitleId = titleId || `dropdown-menu-item-checkbox-group-title-${uid}`;

	if (fg('platform-dst-new-menu')) {
		return (
			<CheckboxGroupContext.Provider value={id}>
				<DropdownMenuItemGroup
					id={id}
					hasSeparator={hasSeparator}
					isScrollable={isScrollable}
					testId={testId}
					title={title}
					titleId={groupTitleId}
					label={label}
				>
					{children}
				</DropdownMenuItemGroup>
			</CheckboxGroupContext.Provider>
		);
	}

	return (
		<CheckboxGroupContext.Provider value={id}>
			<Section
				hasSeparator={hasSeparator}
				id={id}
				isList={isList}
				isScrollable={isScrollable}
				testId={testId}
				titleId={title ? groupTitleId : undefined}
				label={label}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			>
				{title && <GroupTitle id={groupTitleId} title={title} />}
				{children}
			</Section>
		</CheckboxGroupContext.Provider>
	);
};

export default DropdownItemCheckboxGroup;
