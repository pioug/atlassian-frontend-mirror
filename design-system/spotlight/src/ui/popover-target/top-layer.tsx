/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useContext, useLayoutEffect, useRef } from 'react';

import { jsx } from '@atlaskit/css';

import { SpotlightContext } from '../../controllers/context';

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
export const PopoverTarget = ({ children }: PopoverTargetProps): JSX.Element => {
	const localRef = useRef<HTMLDivElement>(null);
	const { target } = useContext(SpotlightContext);

	useLayoutEffect(() => {
		target.setRef(localRef);
	}, [target]);

	return <div ref={localRef}>{children}</div>;
};
