/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactElement, type Ref, useCallback } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { useMergeRefs } from 'use-callback-ref';

import { N0 } from '@atlaskit/theme/colors';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import usePreventProgrammaticScroll from '../../hooks/use-prevent-programmatic-scroll';
import { type DrawerPrimitiveProps, type Widths } from '../types';

export const wrapperWidth: Widths = {
	full: { width: '100vw' },
	extended: { width: '95vw' },
	narrow: { width: 360 },
	medium: { width: 480 },
	wide: { width: 600 },
};

const wrapperStyles = css({
	display: 'flex',
	height: '100vh',
	position: 'fixed',
	zIndex: 500,
	backgroundColor: token('elevation.surface.overlay', N0),
	[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
	insetBlockStart: 0,
	insetInlineStart: 0,
	overflow: 'hidden',
});

interface FocusLockRefTargetProps
	extends Pick<DrawerPrimitiveProps, 'width' | 'testId' | 'label' | 'titleId'> {
	/**
	 * This must have two children explicitly as we target the second child as the Content.
	 */
	children: [ReactElement, ReactElement];
	/**
	 * A ref pointing to our drawer wrapper, passed to `onCloseComplete` and `onOpenComplete` callbacks.
	 */
	drawerRef: Ref<HTMLDivElement>;
	/**
	 * The className coming from the SlideIn render callback.
	 */
	className?: string;
}

/**
 * A wrapper that controls the styling of the drawer with a few hacks with refs to get our Touch±Scroll locks working.
 */
const DrawerWrapper = forwardRef<HTMLElement, FocusLockRefTargetProps>(
	({ children, className, width = 'narrow', testId, drawerRef, label, titleId }, scrollRef) => {
		/**
		 * We use a callback ref to assign the `<Content />` component to the forwarded `scrollRef`.
		 * This ref comes from `react-scrolllock` to allow touch scrolling, eg.: `<ScrollLock><TouchScrollable>{children}</TouchScrollable><ScrollLock>`
		 *
		 * This is because we do not control the `<Content />` component in order to forward a ref to it (given it can be overriden via `DrawerPrimitiveProps['overrides']['Content']['component']`).
		 * Additionally, we target the last child because with `props.overrides.Sidebar.component = () => null` you only have one child.
		 * If both `Sidebar.component` and `Content.component` return null you will have no children and this will throw an error, but that doesn't seem valid.
		 */
		const assignSecondChildRef = useCallback(
			(node: HTMLDivElement | null) => {
				if (node?.children?.length && typeof scrollRef === 'function') {
					scrollRef(node.children[node.children.length - 1] as HTMLElement);
				}
			},
			[scrollRef],
		);

		const ref = useMergeRefs([drawerRef, assignSecondChildRef]);

		usePreventProgrammaticScroll();

		return (
			<div
				css={wrapperStyles}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={wrapperWidth[width]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				data-testid={testId}
				ref={ref}
				aria-modal={true}
				role="dialog"
				aria-label={label}
				aria-labelledby={titleId}
			>
				{children}
			</div>
		);
	},
);

export default DrawerWrapper;
