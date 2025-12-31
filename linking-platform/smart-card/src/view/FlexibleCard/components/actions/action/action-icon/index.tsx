/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { type ActionIconProps } from './types';

const stackItemIconStylesCompiled = css({
	display: 'inline-block',
});

const ActionIcon = ({ testId, icon }: ActionIconProps) => {
	return (
		<span css={[stackItemIconStylesCompiled]} data-testid={`${testId}-icon`}>
			{icon}
		</span>
	);
};

export default ActionIcon;
