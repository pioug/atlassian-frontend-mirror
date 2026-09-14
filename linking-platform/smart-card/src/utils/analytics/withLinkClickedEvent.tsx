import React from 'react';

import type { LinkProps } from '@atlaskit/link/link';

import { useLinkClicked } from '../../state/analytics/useLinkClicked';
import { useMouseDownEvent } from '../../state/analytics/useMouseDownEvent';

const getDisplayName = (WrappedComponent: React.ElementType<any> | string): string => {
	if (typeof WrappedComponent === 'string') {
		return WrappedComponent;
	}
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export function withLinkClickedEvent<
	Component extends Extract<React.ElementType, 'a'> | React.ComponentType<LinkProps>,
>(
	WrappedComponent: Component,
): {
	(props: LinkProps): React.ReactElement<LinkProps, string | React.JSXElementConstructor<any>>;
	displayName: string;
} {
	const Component = (props: LinkProps) => {
		const onClick = useLinkClicked(props.onClick);
		const onMouseDown = useMouseDownEvent(props.onMouseDown);
		return React.createElement(WrappedComponent, {
			...props,
			onClick,
			onMouseDown,
		});
	};

	Component.displayName = `withLinkClickedEvent(${getDisplayName(WrappedComponent)})`;

	return Component;
}
