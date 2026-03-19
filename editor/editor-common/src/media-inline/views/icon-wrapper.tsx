/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

type Props = {
	children?: React.ReactNode;
};

const wrapperStyle = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'span > svg': { verticalAlign: 'top' },
});

export const IconWrapper = ({ children }: React.PropsWithChildren<Props>): jsx.JSX.Element => {
	return (
		<span css={wrapperStyle} data-testid="media-inline-image-card-icon">
			{children}
		</span>
	);
};
