import React, { useRef } from 'react';

import Select from '@atlaskit/react-select/state-manager';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

export default function TopLayerNestedPopoverFixture(): React.ReactNode {
	const popoverRef = useRef<HTMLDivElement>(null);

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
			>
				<label htmlFor="nested-select">City</label>
				<Select inputId="nested-select" options={options} testId="nested-select" />
			</div>
		</>
	);
}
