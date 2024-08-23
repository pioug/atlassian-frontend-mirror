import React from 'react';

import { useId } from '@atlaskit/ds-lib/react-uid';
import type { SectionProps } from '@atlaskit/menu';
import Section from '@atlaskit/menu/section';

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
const DropdownItemCheckboxGroup = ({
	children,
	hasSeparator,
	id,
	isList,
	isScrollable,
	overrides,
	testId,
	title,
	// DSP-13312 TODO: remove spread props in future major release
	...rest
}: DropdownItemCheckboxGroupProps) => {
	const uid = useId();
	const titleId = `dropdown-menu-item-checkbox-group-title-${uid}`;

	return (
		<CheckboxGroupContext.Provider value={id}>
			<Section
				hasSeparator={hasSeparator}
				id={id}
				isList={isList}
				isScrollable={isScrollable}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
				overrides={overrides}
				testId={testId}
				titleId={title ? titleId : undefined}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			>
				{title && <GroupTitle id={titleId} title={title} />}
				{children}
			</Section>
		</CheckboxGroupContext.Provider>
	);
};

export default DropdownItemCheckboxGroup;
