/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import { Text } from '@atlaskit/primitives';

import { useTab } from '../hooks';
import { type TabAttributesType, type TabProps } from '../types';

/**
 * __Tab__
 *
 * Tab represents an indivudal Tab displayed in a TabList.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
export default function Tab({ children, testId }: TabProps) {
	const {
		onClick,
		id,
		'aria-controls': ariaControls,
		'aria-posinset': ariaPosinset,
		'aria-selected': ariaSelected,
		'aria-setsize': ariaSetsize,
		onKeyDown,
		role,
		tabIndex,
	}: TabAttributesType = useTab();

	return (
		<FocusRing isInset>
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				data-testid={testId}
				onClick={onClick}
				id={id}
				aria-controls={ariaControls}
				aria-posinset={ariaPosinset}
				aria-selected={ariaSelected}
				aria-setsize={ariaSetsize}
				onKeyDown={onKeyDown}
				role={role}
				tabIndex={tabIndex}
			>
				<Text weight="medium" color="inherit" maxLines={1}>
					{children}
				</Text>
			</div>
		</FocusRing>
	);
}
