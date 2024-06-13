/** @jsx jsx */
import { jsx } from '@emotion/react';
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

export const Byline = ({ text, children, testId, className }: BylineProps) => (
	<span
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={mq({
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			fontSize: gs(1.5),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			lineHeight: gs(2.5),
			color: `${token('color.text.subtlest', N300)}`,
			fontWeight: 'normal',
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			marginTop: gs(0.5),
			// Spec: only allow two lines MAX to be shown.
			display: '-webkit-box',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			WebkitLineClamp: 2,
			WebkitBoxOrient: 'vertical',
			wordBreak: 'break-word',
			// Fallback options.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			maxHeight: gs(5),
			whiteSpace: 'pre-line',
			// EDM-713: fixes copy-paste from renderer to editor for Firefox
			// due to HTML its unwrapping behaviour on paste.
			MozUserSelect: 'none',
		})}
		data-testid={testId}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={className}
	>
		{text || children}
	</span>
);
