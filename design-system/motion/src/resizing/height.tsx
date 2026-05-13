/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required */
import React, { Fragment } from 'react';

import { type CallbackRef } from '../utils/use-element-ref';

import { type ResizingHeightOpts, useResizingHeight } from './use-resizing-height';

/**
 * __ResizingHeight__
 *
 * Component which consumes the useResizingHook() under-the-hood. Its props are the same as the hooks opts.
 *
 * See [examples](https://atlaskit.atlassian.com/packages/design-system/motion/docs/resizing-motions).
 *
 * @deprecated Use `Resizing` from `@atlaskit/motion/resizing` instead. Pass `dimension="height"`
 * to animate height changes. The new component supports `'width'`, `'height'`, or `'both'`.
 */
export const ResizingHeight = ({
	children,
	...props
}: ResizingHeightOpts & {
	children: (opts: { ref: CallbackRef }) => React.ReactNode;
}): React.JSX.Element => {
	const resizing = useResizingHeight(props);
	return <Fragment>{children(resizing)}</Fragment>;
};
/* eslint-enable @repo/internal/deprecations/deprecation-ticket-required */
