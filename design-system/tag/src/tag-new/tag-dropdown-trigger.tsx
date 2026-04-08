/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, memo } from 'react';

import { jsx } from '@compiled/react';

import __noop from '@atlaskit/ds-lib/noop';

import { colorMapping, TagDropdownTriggerComponent } from './tag-new';
import { type TagDropdownTriggerProps } from './types';

/**
 * __Tag dropdown trigger__
 *
 * @deprecated For **Jira Epic** only. Do not use for other products or use cases.
 *
 * A tag-styled pressable button that acts as a dropdown trigger. Renders a chevron icon
 * and supports selected/loading states.
 *
 */
const TagDropdownTrigger: import('react').MemoExoticComponent<
	import('react').ForwardRefExoticComponent<
		TagDropdownTriggerProps & import('react').RefAttributes<HTMLButtonElement>
	>
> = memo(
	forwardRef<HTMLButtonElement, TagDropdownTriggerProps>(
		({ color = 'gray', onClick = __noop, text, ...other }, ref) => {
			const resolvedColor = colorMapping[color] || 'gray';
			return (
				<TagDropdownTriggerComponent
					text={text}
					ref={ref}
					color={resolvedColor}
					onClick={onClick}
					{...other}
				/>
			);
		},
	),
);

export default TagDropdownTrigger;
