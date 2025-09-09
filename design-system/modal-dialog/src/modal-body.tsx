/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { cssMap, jsx } from '@compiled/react';
import { TouchScrollable } from 'react-scrolllock';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useModal } from './hooks';
import ScrollContainer from './internal/components/scroll-container';
import useScroll from './internal/hooks/use-scroll';

const styles = cssMap({
	root: {
		/* This ensures the body fills the whole space between header and footer. */
		flex: '1 1 auto',
	},
	font: {
		font: token('font.body'),
	},
	paddingBlock: {
		/**
		 * Adding the padding here avoids cropping the keyline on its sides.
		 * The combined vertical spacing is maintained by subtracting the
		 * keyline height from header and footer using negative margins.
		 */
		paddingBlock: token('space.025'),
	},
	paddingInline: {
		paddingInline: token('space.300'),
	},
});

export interface ModalBodyProps {
	/**
	 * Children of modal dialog footer.
	 */
	children: React.ReactNode;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Determines whether inline padding will be applied. Defaults to true.
	 */
	hasInlinePadding?: boolean;
}

/**
 * __Modal body__
 *
 * A modal body is used to display the main content of a modal.
 *
 * - [Examples](https://atlassian.design/components/modal-dialog/examples)
 * - [Code](https://atlassian.design/components/modal-dialog/code#modal-body-props)
 * - [Usage](https://atlassian.design/components/modal-dialog/usage)
 */
const ModalBody = (props: ModalBodyProps) => {
	const { children, testId: userDefinedTestId, hasInlinePadding = true } = props;
	const { testId: modalTestId } = useModal();
	const shouldScrollInViewport = useScroll();

	const testId = userDefinedTestId || (modalTestId && `${modalTestId}--body`);

	return shouldScrollInViewport ? (
		<div
			css={[
				styles.root,
				hasInlinePadding && styles.paddingInline,
				fg('platform_ads_explicit_font_styles') && styles.font,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	) : (
		<TouchScrollable>
			<ScrollContainer testId={userDefinedTestId || modalTestId}>
				<div
					css={[
						styles.root,
						/**
						 * Adding block padding for scroll keylines, which are only shown when the scrolling
						 * is on the container.
						 */
						styles.paddingBlock,
						hasInlinePadding && styles.paddingInline,
						fg('platform_ads_explicit_font_styles') && styles.font,
					]}
					data-testid={testId}
				>
					{children}
				</div>
			</ScrollContainer>
		</TouchScrollable>
	);
};

export default ModalBody;
