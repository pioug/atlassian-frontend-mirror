/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { gs, mq } from '../../common/utils';

export interface ContentFooterProps {
	children: React.ReactNode;
	hasSpaceBetween?: boolean;
}

export const contentFooterClassName = 'smart-link-content-footer';

const flexStyles = css({
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const baseStyles = mq({
	flexDirection: ['column', 'row'],
	flexGrow: [1, 'unset'],
	alignItems: ['unset', 'center'],
	marginTop: [gs(1), gs(1.5)],
});

export const ContentFooter = ({ children, hasSpaceBetween = false }: ContentFooterProps) => (
	<div
		css={[
			flexStyles,
			baseStyles,
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			mq({ justifyContent: [hasSpaceBetween ? 'space-between' : 'flex-end', 'space-between'] }),
		]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={contentFooterClassName}
	>
		{children}
	</div>
);
