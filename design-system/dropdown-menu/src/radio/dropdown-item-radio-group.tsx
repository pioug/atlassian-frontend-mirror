import React, { useContext, useState } from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';
import { Section, type SectionProps } from '@atlaskit/menu';

import GroupTitle from '../internal/components/group-title';
import { SelectionStoreContext } from '../internal/context/selection-store-context';
import resetOptionsInGroup from '../internal/utils/reset-options-in-group';

import { RadioGroupContext } from './radio-group-context';

interface DropdownItemRadioGroupProps extends SectionProps {
	id: string;
}

/**
 * __Dropdown item radio group__
 *  Store which manages the selection state for each DropdownItemRadio
 *  across mount and unmounts.
 *
 */
const DropdownItemRadioGroup = ({
	children,
	hasSeparator,
	id,
	isList,
	isScrollable,
	testId,
	title,
	// DSP-13312 TODO: remove spread props in future major release
	...rest
}: DropdownItemRadioGroupProps): React.JSX.Element => {
	const { setGroupState, getGroupState } = useContext(SelectionStoreContext);
	const uid = useId();
	const titleId = `dropdown-menu-item-radio-group-title-${uid}`;

	/**
	 *  - initially `radioGroupState` is from selection store, so it's safe to update without re-rendering
	 *  - we flush a render by updating this local radio group state
	 */
	const [radioGroupState, setRadioGroupState] = useState(() => getGroupState(id));

	const selectRadioItem = (childId: string, value: boolean) => {
		const newValue = {
			...resetOptionsInGroup(getGroupState(id)),
			[childId]: value,
		};

		setRadioGroupState(newValue);
		setGroupState(id, newValue);
	};

	return (
		<RadioGroupContext.Provider value={{ id, radioGroupState, selectRadioItem }}>
			<Section
				hasSeparator={hasSeparator}
				id={id}
				isList={isList}
				isScrollable={isScrollable}
				testId={testId}
				titleId={title ? titleId : undefined}
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...rest}
			>
				{title && <GroupTitle id={titleId} title={title} />}
				{children}
			</Section>
		</RadioGroupContext.Provider>
	);
};

export default DropdownItemRadioGroup;
