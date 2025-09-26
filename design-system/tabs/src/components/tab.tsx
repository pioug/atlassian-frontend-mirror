import React, { forwardRef } from 'react';

import { Focusable, Text } from '@atlaskit/primitives/compiled';

import { useTab } from '../hooks';
import { type TabAttributesType, type TabProps } from '../types';

/**
 * __Tab__
 *
 * Tab represents an individual Tab displayed in a TabList.
 *
 * - [Examples](https://atlassian.design/components/tabs/examples)
 * - [Code](https://atlassian.design/components/tabs/code)
 * - [Usage](https://atlassian.design/components/tabs/usage)
 */
const Tab: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TabProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TabProps>(function Tab({ children, testId }: TabProps, ref) {
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
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<Focusable
			as="div"
			isInset
			testId={testId}
			onClick={onClick}
			id={id}
			aria-controls={ariaControls}
			aria-posinset={ariaPosinset}
			aria-selected={ariaSelected}
			aria-setsize={ariaSetsize}
			onKeyDown={onKeyDown}
			role={role}
			tabIndex={tabIndex}
			ref={ref}
		>
			<Text weight="medium" color="inherit" maxLines={1}>
				{children}
			</Text>
		</Focusable>
	);
});

export default Tab;
