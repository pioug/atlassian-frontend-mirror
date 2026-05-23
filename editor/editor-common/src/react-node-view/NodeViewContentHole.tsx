import React, {
	type ForwardRefExoticComponent,
	forwardRef,
	type HTMLAttributes,
	type RefAttributes,
} from 'react';

import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isSSR } from '../core-utils/is-ssr';

/**
 * A component that serves as a placeholder for the content DOM of a ProseMirror NodeView.
 * It forwards a ref to the underlying div element, which can be used to access the content DOM for rendering the NodeView's content.
 */
export const NodeViewContentHole: ForwardRefExoticComponent<
	HTMLAttributes<HTMLDivElement> & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => (
	<div
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...props}
		ref={ref}
		data-ssr-content-dom-ref={
			isSSR() && expValEquals('platform_editor_editor_ssr_streaming', 'isEnabled', true)
				? ''
				: undefined
		}
	/>
));
