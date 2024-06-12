/** @jsx jsx */
import { forwardRef, type HTMLAttributes, type Ref } from 'react';

import { jsx } from '@emotion/react';

import useScrollbarWidth from '@atlaskit/ds-lib/use-scrollbar-width';

import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

import { containerCSS, innerContainerCSS, outerContainerCSS } from './styles';

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
		<div
			ref={typedRef}
			css={outerContainerCSS({
				showTopScrollIndicator,
				scrollbarWidth: scrollbar.width,
			})}
			data-testid={testId}
		>
			<div ref={scrollbar.ref} css={innerContainerCSS({ showTopScrollIndicator })}>
				<div css={containerCSS({ showTopScrollIndicator })}>{children}</div>
			</div>
		</div>
	);
});

export default NavigationContent;
