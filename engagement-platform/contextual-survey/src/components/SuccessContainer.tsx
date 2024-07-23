/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

interface Props {
	children: React.ReactNode;
}

export default ({ children }: Props) => (
	<section
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={css({
			marginLeft: token('space.500', '40px'),
		})}
	>
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={css({
				position: 'absolute',
				top: token('space.300', '24px'),
				left: token('space.300', '24px'),
			})}
		>
			<CheckCircleIcon label="" aria-hidden primaryColor={token('color.icon.success', G300)} />
		</div>
		{children}
	</section>
);
