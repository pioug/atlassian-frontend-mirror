/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type HTMLAttributes, type Ref } from 'react';

import { css, cssMap, jsx } from '@compiled/react';

import useScrollbarWidth from '@atlaskit/ds-lib/use-scrollbar-width';
import { token } from '@atlaskit/tokens';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export interface NavigationContentProps {
	children: React.ReactNode;

	/**
	 * Forces the top scroll indicator to be shown.
	 */
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	showTopScrollIndicator?: boolean;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
}

const outerContainerCSS = css({
	display: 'flex',
	height: '100%',
	position: 'relative',
	overflow: 'hidden',
	'&::before': {
		display: 'block',
		height: 2,
		position: 'absolute',
		zIndex: 1,
		backgroundColor: `var(--ds-menu-seperator-color, ${token('color.border')})`,
		borderRadius: `${token('border.radius.050')}`,
		content: "''",
		insetInlineEnd: 8,
		insetInlineStart: `${token('space.100')}`,
	},
	'&::after': {
		display: 'block',
		height: 2,
		position: 'absolute',
		zIndex: 1,
		flexShrink: 0,
		backgroundColor: `var(--ds-menu-seperator-color, ${token('color.border')})`,
		borderRadius: `${token('border.radius.050')}`,
		content: "''",
		insetBlockEnd: 0,
		insetInlineEnd: 8,
		insetInlineStart: `${token('space.100')}`,
	},
});

const innerContainerCSS = cssMap({
	basic: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		position: 'relative',
		flexDirection: 'column',
		overflow: 'auto',
		'&::after': {
			display: 'block',
			height: 2,
			position: 'relative',
			zIndex: 2,
			flexShrink: 0,
			backgroundColor: `var(--ds-menu-scroll-indicator-color, ${token('elevation.surface')})`,
			borderRadius: `${token('border.radius.050')}`,
			content: "''",
			marginBlockStart: 'auto',
		},
	},
	topScrollIndicator: {
		'&::before': {
			display: 'block',
			height: 2,
			position: 'absolute',
			zIndex: 2,
			backgroundColor: `var(--ds-menu-scroll-indicator-color, ${token('elevation.surface')})`,
			borderRadius: `${token('border.radius.050')}`,
			content: "''",
			insetInlineEnd: 0,
			insetInlineStart: 0,
		},
	},
});

const containerCSS = cssMap({
	basic: {
		position: 'relative',
		marginInlineEnd: `${token('space.100')}`,
		marginInlineStart: `${token('space.100')}`,
		marginBlockStart: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& [data-ds--menu--heading-item]': {
			marginBlockEnd: `${token('space.075')}`,
			marginBlockStart: `${token('space.200')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& [data-ds--menu--skeleton-heading-item]': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginBlockEnd: 9,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginBlockStart: 25,
		},
	},
	marginBlockStart: { marginBlockStart: `${token('space.025')}` },
});

/**
 * __Navigation content__
 *
 * A navigation content is used as the container for navigation items.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#content)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const NavigationContent = forwardRef<
	HTMLElement,
	// We place HTMLAttributes here so ERT doesn't blow up.
	NavigationContentProps & HTMLAttributes<HTMLElement>
>((props: NavigationContentProps, ref) => {
	const { showTopScrollIndicator, children, testId } = props;
	const { shouldRender } = useShouldNestedElementRender();
	const scrollbar = useScrollbarWidth();

	if (!shouldRender) {
		return children as JSX.Element;
	}

	const typedRef = ref as Ref<HTMLDivElement>;
	return (
		<div ref={typedRef} css={outerContainerCSS} data-testid={testId}>
			<div
				ref={scrollbar.ref}
				css={[
					innerContainerCSS.basic,
					!showTopScrollIndicator && innerContainerCSS.topScrollIndicator,
				]}
			>
				<div css={[containerCSS.basic, showTopScrollIndicator && containerCSS.marginBlockStart]}>
					{children}
				</div>
			</div>
		</div>
	);
});

export default NavigationContent;
