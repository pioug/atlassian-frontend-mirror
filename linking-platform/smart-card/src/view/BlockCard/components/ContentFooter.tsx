/** @jsx jsx */
import { jsx } from '@emotion/react';
import { gs, mq } from '../../common/utils';

export interface ContentFooterProps {
	children: React.ReactNode;
	hasSpaceBetween?: boolean;
}

export const contentFooterClassName = 'smart-link-content-footer';

export const ContentFooter = ({ children, hasSpaceBetween = false }: ContentFooterProps) => (
	<div
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={mq({
			display: 'flex',
			flexDirection: ['column', 'row'],
			flexGrow: [1, 'unset'],
			justifyContent: [hasSpaceBetween ? 'space-between' : 'flex-end', 'space-between'],
			alignItems: ['unset', 'center'],
			// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			marginTop: [gs(1), gs(1.5)],
		})}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={contentFooterClassName}
	>
		{children}
	</div>
);
