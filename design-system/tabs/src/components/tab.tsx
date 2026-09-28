/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef } from 'react';

import { jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Focusable, Text } from '@atlaskit/primitives/compiled';

import { type TabMotionAttributes } from '../internal/tab-motion-context';
import { type TabAttributesType, type TabProps } from '../types';
import useTab from '../use-tab';

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
		'data-motion-capable': dataMotionCapable,
		'data-motion-direction': dataMotionDirection,
		'data-motion-state': dataMotionState,
	}: TabAttributesType & TabMotionAttributes = useTab();

	return (
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
			data-motion-capable={dataMotionCapable}
			data-motion-direction={dataMotionDirection}
			data-motion-state={dataMotionState}
			ref={ref}
		>
			<Text
				weight="medium"
				color="inherit"
				maxLines={fg('platform_dst_tabs_remove_line_clamp') ? undefined : 1}
			>
				{children}
			</Text>
		</Focusable>
	);
});

export default Tab;
