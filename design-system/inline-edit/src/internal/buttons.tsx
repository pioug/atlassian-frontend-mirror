/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import CrossIcon from '@atlaskit/icon/core/cross';
import { fg } from '@atlaskit/platform-feature-flags';
import { B400, N0, N20A, N30A, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const buttonsContainerStyles = css({
	display: 'flex',
	position: 'absolute',
	flexShrink: 0,
	insetBlockStart: '100%',
	insetInlineEnd: 0,
	marginBlockStart: token('space.075', '6px'),
});

const buttonWrapperBaseStyles = css({
	boxSizing: 'border-box',
	width: token('space.400', '32px'),
	zIndex: 200,
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	font: token('font.body'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:last-child': {
		marginInlineStart: token('space.050', '4px'),
	},
	'& > button': {
		backgroundColor: token('elevation.surface.overlay', N20A),
	},
	'& > button:hover': {
		backgroundColor: token('elevation.surface.overlay.hovered', N30A),
	},
	'& > button:active': {
		backgroundColor: token('elevation.surface.overlay.pressed', 'rgba(179, 212, 255, 0.6)'),
		color: token('color.text', B400),
	},
});

const buttonWrapperBaseStylesT26Shape = css({
	borderRadius: token('radius.medium', '6px'),
});

interface ButtonsProp {
	confirmButtonLabel: string;
	cancelButtonLabel: string;
	onMouseDown: () => void;
	onCancelClick: (event: React.MouseEvent<HTMLElement>) => void;
	testId?: string;
}

const Buttons = ({
	confirmButtonLabel,
	cancelButtonLabel,
	onMouseDown,
	onCancelClick,
	testId,
}: ButtonsProp) => {
	return (
		<div css={buttonsContainerStyles}>
			<div
				css={[
					buttonWrapperBaseStyles,
					fg('platform-dst-shape-theme-default') && buttonWrapperBaseStylesT26Shape,
				]}
				tabIndex={-1}
			>
				<IconButton
					type="submit"
					icon={(iconProps) => <CheckMarkIcon {...iconProps} size="small" />}
					onMouseDown={onMouseDown}
					label={confirmButtonLabel}
					testId={testId && `${testId}--confirm`}
				/>
			</div>
			<div
				css={[
					buttonWrapperBaseStyles,
					fg('platform-dst-shape-theme-default') && buttonWrapperBaseStylesT26Shape,
				]}
				tabIndex={-1}
			>
				<IconButton
					icon={(iconProps) => <CrossIcon {...iconProps} size="small" />}
					label={cancelButtonLabel}
					onClick={onCancelClick}
					onMouseDown={onMouseDown}
					testId={testId && `${testId}--cancel`}
				/>
			</div>
		</div>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Buttons;
