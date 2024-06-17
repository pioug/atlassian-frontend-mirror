/** @jsx jsx */
import { type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { type Align } from './types';
export interface FormFooterProps {
	/**
	 * Content to render in the footer of the form.
	 */
	children?: ReactNode;
	/**
	 * Sets the alignment of the footer contents. This is often a button. This should be left-aligned in single-page forms, flags, cards, and section messages.
	 */
	align?: Align;
}

const formFooterWrapperStyles = css({
	display: 'flex',
	justifyContent: 'flex-end',
	marginBlockStart: token('space.300', '24px'),
});

const justifyContentStyles = css({
	justifyContent: 'flex-start',
});

/**
 * __Form footer__
 *
 * A form footer has the content to be shown at the bottom of the form. This is usually the submit button.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/layout)
 */
export default function FormFooter({ align = 'end', children }: FormFooterProps) {
	return (
		<footer css={[formFooterWrapperStyles, align === 'start' && justifyContentStyles]}>
			{children}
		</footer>
	);
}
