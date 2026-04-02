import React from 'react';

import { type CustomItemComponentProps } from '@atlaskit/menu';

/**
 * __Container__
 *
 * A container for Header and Footer that safely handles props to the child component
 */
const HeaderContainer: (props: CustomItemComponentProps) => JSX.Element = ({
	children,
	'data-testid': testId,
	...props
}: CustomItemComponentProps) => {
	// https://stackoverflow.com/a/39333479
	const safeProps = (({
		className,
		onClick,
		onMouseDown,
		onDragStart,
		draggable,
		ref,
		tabIndex,
		disabled,
	}) => ({
		className,
		onClick,
		onMouseDown,
		onDragStart,
		draggable,
		ref,
		tabIndex,
		disabled,
	}))(props);
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		<div data-testid={testId} style={{ position: 'relative' }} {...safeProps}>
			{children}
		</div>
	);
};

export default HeaderContainer;
