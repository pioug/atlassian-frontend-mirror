/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEvent, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Checkbox } from '@atlaskit/checkbox';
import { Box, xcss } from '@atlaskit/primitives';

type Checkboxes = Record<string, boolean>;

const childCheckBoxesStyle = xcss({ paddingInlineStart: 'space.300' });

const parentCheckbox = { id: 'ALL_PROJECTS', label: 'All projects' };

const childrenCheckboxes = [
	{ id: 'DESIGN_SYSTEM', label: 'Design System' },
	{ id: 'JIRA_SOFTWARE', label: 'Jira Software' },
	{ id: 'CONFLUENCE', label: 'Confluence' },
];

const getInitialCheckedItems = (): Checkboxes => {
	const initialChildCheckboxes: Checkboxes = {};
	childrenCheckboxes.forEach((child) => (initialChildCheckboxes[child.id] = false));
	return initialChildCheckboxes;
};

const IndeterminateCheckboxExample = () => {
	const [childCheckboxes, setChildCheckboxes] = useState(getInitialCheckedItems());

	const getAllChildren = () => Object.keys(childCheckboxes);

	const getCheckedChildrenCount = () => getAllChildren().filter(isChildChecked).length;

	const isParentChecked = () => getCheckedChildrenCount() > 0;
	const isChildChecked = (childCheckboxId: string) => childCheckboxes[childCheckboxId];

	const isIndeterminate = () => {
		const checkedChildrenCount = getCheckedChildrenCount();
		const notAllChildrenAreChecked = checkedChildrenCount < getAllChildren().length;
		const atLeastOneChildIsChecked = checkedChildrenCount > 0;

		return atLeastOneChildIsChecked && notAllChildrenAreChecked;
	};

	const handleParentCheckboxChange = (_event: ChangeEvent<HTMLInputElement>) => {
		const newCheckedState: boolean = !isParentChecked();
		const newChildCheckboxesState: Checkboxes = {};
		getAllChildren().forEach((childCheckboxId) => {
			newChildCheckboxesState[childCheckboxId] = newCheckedState;
		});
		setChildCheckboxes(newChildCheckboxesState);
	};

	const handleChildCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const newCheckboxState = !isChildChecked(value);
		setChildCheckboxes({
			...childCheckboxes,
			[value]: newCheckboxState,
		});
	};

	return (
		<Box>
			<Checkbox
				isChecked={isParentChecked()}
				isIndeterminate={isIndeterminate()}
				onChange={handleParentCheckboxChange}
				label={parentCheckbox.label}
				value={parentCheckbox.id}
				testId="parent"
			/>
			<Box xcss={childCheckBoxesStyle}>
				{childrenCheckboxes.map((childCheckbox, i) => (
					<Checkbox
						isChecked={isChildChecked(childCheckbox.id)}
						onChange={handleChildCheckboxChange}
						label={childCheckbox.label}
						value={childCheckbox.id}
						testId={`child-${i + 1}`}
						key={childCheckbox.id}
					/>
				))}
			</Box>
		</Box>
	);
};

export default IndeterminateCheckboxExample;
