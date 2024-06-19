/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type FC } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { h600 } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

type HeaderProps = {
	children: string;
	level?: number;
};
// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-array-arguments -- Ignored via go/DSP-18766
const headerStyles = css([
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	h600(),
	{
		marginTop: token('space.0', '0px'),
		marginBottom: token('space.200', '16px'),
	},
]);

/**
 * __Header__
 *
 * Header of Empty State.
 *
 * @internal
 */
const EmptyStateHeader: FC<HeaderProps> = ({ children, level = 4 }) => {
	const Tag = `h${level > 0 && level < 7 ? level : level > 6 ? 6 : 4}` as
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6';

	return <Tag css={headerStyles}>{children}</Tag>;
};

export default EmptyStateHeader;
