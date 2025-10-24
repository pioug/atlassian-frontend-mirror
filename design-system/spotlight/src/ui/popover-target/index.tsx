/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { jsx } from '@atlaskit/css';
import { Reference } from '@atlaskit/popper';

interface PopoverTargetProps {
	/**
	 * The content to be rendered in `PopoverTarget`. This is intended to be the element you want to point the spotlight at.
	 */
	children: ReactNode;
}

/**
 * __Target__
 *
 * A target is the element that the popover content will be positioned in relation to.
 */
export const PopoverTarget = ({ children }: PopoverTargetProps) => {
	return <Reference>{({ ref }) => <div ref={ref}>{children}</div>}</Reference>;
};
