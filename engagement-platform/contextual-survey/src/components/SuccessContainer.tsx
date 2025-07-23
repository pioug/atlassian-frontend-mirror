/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import CheckCircleIcon from '@atlaskit/icon/core/migration/status-success--check-circle';
import { G300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const sectionStyles = css({
	marginLeft: token('space.500', '40px'),
});

const iconContainerStyles = css({
	position: 'absolute',
	top: token('space.250', '20px'),
	left: token('space.300', '24px'),
});

interface Props {
	children: React.ReactNode;
}

export default ({ children }: Props) => (
	<section css={sectionStyles}>
		<div css={iconContainerStyles}>
			<CheckCircleIcon
				spacing="spacious"
				label=""
				aria-hidden
				color={token('color.icon.success', G300)}
				LEGACY_margin="4px 0 0 0"
			/>
		</div>
		{children}
	</section>
);
