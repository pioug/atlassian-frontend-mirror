/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const containerStyle = cssMap({
	root: {
		paddingBlockStart: token('space.500', '40px'),
		paddingInlineEnd: token('space.500', '40px'),
		paddingBlockEnd: token('space.500', '40px'),
		paddingInlineStart: token('space.500', '40px'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.400', '32px'),
	},
});

const triggerStyle = cssMap({
	root: {
		paddingBlockStart: token('space.200', '16px'),
		paddingInlineEnd: token('space.200', '16px'),
		paddingBlockEnd: token('space.200', '16px'),
		paddingInlineStart: token('space.200', '16px'),
		backgroundColor: token('color.background.accent.blue.subtler'),
		borderColor: token('color.border'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderRadius: token('radius.small', '3px'),
		cursor: 'pointer',
		width: '200px',
		textAlign: 'center',
	},
});

export default function PositionMouseExample() {
	return (
		<div css={containerStyle.root}>
			<Tooltip
				content="Tooltip positioned at mouse coordinates"
				position="mouse"
				mousePosition="right-start"
				testId="tooltip-mouse"
			>
				<button data-testid="trigger-mouse" css={triggerStyle.root} type="button">
					Hover me (mouse)
				</button>
			</Tooltip>

			<Tooltip
				content="Tooltip using mouse Y and target X"
				position="mouse-y"
				mousePosition="right"
				testId="tooltip-mouse-y"
			>
				<button data-testid="trigger-mouse-y" css={triggerStyle.root} type="button">
					Hover me (mouse-y)
				</button>
			</Tooltip>

			<Tooltip
				content="Tooltip using mouse X and target Y"
				position="mouse-x"
				mousePosition="bottom"
				testId="tooltip-mouse-x"
			>
				<button data-testid="trigger-mouse-x" css={triggerStyle.root} type="button">
					Hover me (mouse-x)
				</button>
			</Tooltip>
		</div>
	);
}
