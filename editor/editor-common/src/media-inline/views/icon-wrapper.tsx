/** @jsx jsx */
import { css, jsx } from '@emotion/react';

type Props = {
	children?: React.ReactNode;
};

const wrapperStyle = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'span > svg': { verticalAlign: 'top' },
});

export const IconWrapper = ({ children }: React.PropsWithChildren<Props>) => {
	return (
		<span css={wrapperStyle} data-testid="media-inline-image-card-icon">
			{children}
		</span>
	);
};
