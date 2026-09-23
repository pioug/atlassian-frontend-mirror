import React, { useRef, useState } from 'react';

import Select from '@atlaskit/react-select/state-manager';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

export default function TopLayerNestedPopoverFixture(): React.ReactNode {
	const popoverRef = useRef<HTMLDivElement>(null);
	const [parentEscapeCount, setParentEscapeCount] = useState(0);
	const [menuCloseCount, setMenuCloseCount] = useState(0);
	const [isSelectMounted, setIsSelectMounted] = useState(true);

	return (
		<>
			<button type="button" onClick={() => popoverRef.current?.showPopover()}>
				Open outer popover
			</button>
			<div
				ref={popoverRef}
				data-testid="outer-popover"
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="auto"
				// Not used for interaction, but to track key presses for testing purposes
				role="presentation"
				onKeyDown={(event) => {
					if (event.key === 'Escape') {
						setParentEscapeCount((count) => count + 1);
					}
					if (event.key === 'u') {
						setIsSelectMounted(false);
					}
				}}
			>
				<button type="button" data-testid="parent-popover-content">
					Parent popover content
				</button>
				<label htmlFor="nested-select">City</label>
				{isSelectMounted && (
					<Select
						inputId="nested-select"
						options={options}
						testId="nested-select"
						onMenuClose={() => setMenuCloseCount((count) => count + 1)}
					/>
				)}
				<output data-testid="parent-escape-count">{parentEscapeCount}</output>
				<output data-testid="menu-close-count">{menuCloseCount}</output>
			</div>
			<button type="button" data-testid="outside-popovers">
				Outside popovers
			</button>
		</>
	);
}
