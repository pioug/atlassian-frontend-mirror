/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import { B400, N0, N20A, N30A, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { fontSize } from './constants';

const buttonsContainerStyles = css({
	display: 'flex',
	marginBlockStart: token('space.075', '6px'),
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	insetBlockStart: '100%',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	insetInlineEnd: 0,
	flexShrink: 0,
});

const buttonWrapperBaseStyles = css({
	boxSizing: 'border-box',
	width: token('space.400', '32px'),
	zIndex: 200,
	backgroundColor: token('elevation.surface.overlay', N0),
	borderRadius: token('border.radius', '3px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	fontSize: fontSize,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:last-child': {
		marginInlineStart: token('space.050', '4px'),
	},
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	// These buttons are floating, so they need an override to overlay interaction states
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button': {
		backgroundColor: token('elevation.surface.overlay', N20A),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:hover': {
		backgroundColor: token('elevation.surface.overlay.hovered', N30A),
	},
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > button:active': {
		backgroundColor: token('elevation.surface.overlay.pressed', 'rgba(179, 212, 255, 0.6)'),
		color: token('color.text', B400),
	},
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
			<div css={buttonWrapperBaseStyles}>
				<IconButton
					type="submit"
					icon={ConfirmIcon}
					UNSAFE_size="small"
					onMouseDown={onMouseDown}
					label={confirmButtonLabel}
					testId={testId && `${testId}--confirm`}
				/>
			</div>
			<div css={buttonWrapperBaseStyles}>
				<IconButton
					icon={CancelIcon}
					UNSAFE_size="small"
					label={cancelButtonLabel}
					onClick={onCancelClick}
					onMouseDown={onMouseDown}
					testId={testId && `${testId}--cancel`}
				/>
			</div>
		</div>
	);
};

export default Buttons;
