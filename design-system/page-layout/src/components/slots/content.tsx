/** @jsx jsx */
import { type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { CONTENT } from '../../common/constants';

interface ContentProps {
	/**
	 * React children
	 */
	children: ReactNode;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

const contentStyles = css({
	display: 'flex',
	height: '100%',
	position: 'relative',
	gridArea: CONTENT,
});

/**
 * __Content__
 *
 * Provides a slot for your application content within the PageLayout.
 *
 * - [Examples](https://atlassian.design/components/page-layout/examples)
 * - [Code](https://atlassian.design/components/page-layout/code)
 */
const Content = (props: ContentProps) => {
	const { children, testId } = props;

	return (
		<div data-testid={testId} css={contentStyles}>
			{children}
		</div>
	);
};

export default Content;
