/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';
import { TouchScrollable } from 'react-scrolllock';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { useModal } from './hooks';
import ScrollContainer from './internal/components/scroll-container';
import useScroll from './internal/hooks/use-scroll';

const bodyStyles = css({
	/* This ensures the body fills the whole space between header and footer. */
	flex: '1 1 auto',
});

const fontStyles = css({
	font: token('font.body'),
});

/**
 * Adding the padding here avoids cropping the keyline on its sides.
 * The combined vertical spacing is maintained by subtracting the
 * keyline height from header and footer using negative margins.
 */
const bodyScrollStyles = css({
	paddingBlock: token('border.width.outline'),
	paddingInline: token('space.300'),
});

/**
 * Keylines will not be shown if scrolling in viewport so we do
 * not account for them in this case.
 */
const viewportScrollStyles = css({
	paddingInline: token('space.300'),
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
	const { children, testId: userDefinedTestId } = props;
	const { testId: modalTestId } = useModal();
	const shouldScrollInViewport = useScroll();

	const testId = userDefinedTestId || (modalTestId && `${modalTestId}--body`);

	return shouldScrollInViewport ? (
		<div
			css={[
				bodyStyles,
				viewportScrollStyles,
				fg('platform_ads_explicit_font_styles') && fontStyles,
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
						bodyStyles,
						bodyScrollStyles,
						fg('platform_ads_explicit_font_styles') && fontStyles,
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
