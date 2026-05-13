import React from 'react';

import { type CallbackRef } from '../utils/use-element-ref';

import { type ResizingOpts, useResizing } from './use-resizing';

/**
 * __Resizing__
 *
 * Component which consumes the `useResizing()` hook under-the-hood. Its props are the same as the hook's opts.
 */
export const Resizing = ({
	children,
	...props
}: ResizingOpts & {
	children: (opts: { ref: CallbackRef }) => React.ReactNode;
}): React.JSX.Element => {
	const resizing = useResizing(props);
	return <>{children(resizing)}</>;
};
