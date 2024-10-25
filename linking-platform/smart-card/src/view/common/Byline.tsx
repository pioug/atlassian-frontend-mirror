/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { gs, mq } from './utils';

export interface BylineProps {
	/* Text to be displayed in the body of the card. */
	text?: React.ReactNode;
	testId?: string;
	className?: string;
	children?: React.ReactNode;
}

const baseStyles = css({
	// Spec: only allow two lines MAX to be shown.
	display: '-webkit-box',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	WebkitLineClamp: 2,
	WebkitBoxOrient: 'vertical',
	wordBreak: 'break-word',
	whiteSpace: 'pre-line',
	// EDM-713: fixes copy-paste from renderer to editor for Firefox
	// due to HTML its unwrapping behaviour on paste.
	MozUserSelect: 'none',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const styles = mq({
	fontSize: gs(1.5),
	lineHeight: gs(2.5),
	color: `${token('color.text.subtlest', N300)}`,
	fontWeight: 'normal',
	marginTop: gs(0.5),
	// Fallback options.
	maxHeight: gs(5),
});

export const Byline = ({ text, children, testId, className }: BylineProps) => (
	<span
		css={[baseStyles, styles]}
		data-testid={testId}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={className}
	>
		{text || children}
	</span>
);
