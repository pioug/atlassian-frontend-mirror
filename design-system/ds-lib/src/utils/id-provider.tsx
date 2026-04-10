import React, { forwardRef, type ReactNode, useEffect } from 'react';

import { useId } from './use-id';

export interface IdProviderProps {
	/**
	 * Children to render.
	 * Maybe a function that receives the unique id as an argument.
	 */
	children: ReactNode | ((props: { id: string }) => ReactNode);
	/**
	 * A prefix to be added to the generated id.
	 */
	prefix?: string;
	/**
	 * A postfix to be added to the generated id.
	 */
	postfix?: string;
}
// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Id provider__
 *
 * An id provider {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const IdProvider: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<IdProviderProps> & React.RefAttributes<string>
> = forwardRef<string, IdProviderProps>(({ children, postfix = '', prefix = '' }, ref) => {
	const id = `${prefix}${useId()}${postfix}`;

	useEffect(() => {
		if (!ref) {
			return;
		}
		switch (typeof ref) {
			case 'function':
				ref(id);
				break;
			case 'object':
				ref.current = id;
				break;
			default:
				throw new Error(`Unreachable case for unsupported type of ref "${typeof ref}"`);
		}
	}, [id, ref]);

	return <>{typeof children === 'function' ? children({ id }) : children}</>;
});
