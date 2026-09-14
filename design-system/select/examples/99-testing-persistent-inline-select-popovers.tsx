import React, { Fragment, type ReactNode, useRef, useState } from 'react';

import Select from '@atlaskit/select/default';
import { PopupSelect } from '@atlaskit/select/popup-select';
import { Popover } from '@atlaskit/top-layer/popover/popover';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

const InlineMenuPortal = ({ children }: { children: ReactNode }): ReactNode => (
	<Fragment>{children}</Fragment>
);

function NativeOuterPopover({
	children,
	testId,
	triggerLabel,
}: {
	children: ReactNode;
	testId: string;
	triggerLabel: string;
}): ReactNode {
	const popoverRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<button type="button" onClick={() => popoverRef.current?.showPopover()}>
				{triggerLabel}
			</button>
			<div
				ref={popoverRef}
				data-testid={testId}
				// @ts-expect-error -- popover attribute not yet in React types
				// eslint-disable-next-line react/no-unknown-property
				popover="auto"
			>
				{children}
			</div>
		</>
	);
}

function PopupSelectScenario(): ReactNode {
	return (
		<NativeOuterPopover
			testId="popup-select-outer-popover"
			triggerLabel="Open PopupSelect outer popover"
		>
			<PopupSelect
				options={options}
				testId="persistent-popup-select"
				target={({ isOpen: _isOpen, ...triggerProps }) => (
					<button type="button" {...triggerProps}>
						Open PopupSelect
					</button>
				)}
			/>
		</NativeOuterPopover>
	);
}

function BespokeScenario(): ReactNode {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<NativeOuterPopover testId="bespoke-outer-popover" triggerLabel="Open bespoke outer popover">
			<button type="button" onClick={() => setIsOpen(true)}>
				Open bespoke Select popup
			</button>
			<Popover
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				role="dialog"
				label="Bespoke Select popup"
				testId="bespoke-select-popup"
			>
				<Select
					inputId="bespoke-inline-select"
					label="Bespoke city"
					menuIsOpen
					options={options}
					components={{ MenuPortal: InlineMenuPortal }}
				/>
			</Popover>
		</NativeOuterPopover>
	);
}

export default function PersistentInlineSelectPopoversFixture(): ReactNode {
	return (
		<>
			<PopupSelectScenario />
			<BespokeScenario />
		</>
	);
}
