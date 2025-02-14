/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const formRowContainerBaseStyles = css({
	alignItems: 'center',
	display: 'flex',
	flexGrow: 1,
	width: '100%',
});

const formRowContainerNarrowGapStyles = css({
	gap: token('space.100', '8px'),
});

const formRowContainerWideGapStyles = css({
	gap: token('space.200', '16px'),
});

export const FormRowContainer = (props: React.PropsWithChildren<{ isNarrowGap?: boolean }>) => (
	<div
		css={[
			formRowContainerBaseStyles,
			props.isNarrowGap ? formRowContainerNarrowGapStyles : formRowContainerWideGapStyles,
		]}
	>
		{props.children}
	</div>
);
