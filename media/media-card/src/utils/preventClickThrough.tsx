import React from 'react';
import { type ReactNode } from 'react';

export type PreventClickThroughProps = {
	readonly children?: ReactNode;
};

export function PreventClickThrough({ children }: PreventClickThroughProps): JSX.Element {
	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<span
			onClick={(event) => {
				event.stopPropagation();
				event.preventDefault();
			}}
			data-testid="prevent-click-through"
		>
			{children}
		</span>
	);
}

export type CreatePreventClickThrough = <T>(
	onClick: () => void,
) => (event: React.MouseEvent<T, MouseEvent>) => void;

export const createPreventClickThrough: CreatePreventClickThrough = (onClick) => (event) => {
	event.stopPropagation();
	event.preventDefault();
	onClick();
};
