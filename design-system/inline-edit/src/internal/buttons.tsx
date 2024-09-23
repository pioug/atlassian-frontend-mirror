/* eslint-disable @atlaskit/design-system/no-nested-styles */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import { B400, N0, N20A, N30A, N50A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { fontSize } from './constants';

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
	borderRadius: token('border.radius', '3px'),
	boxShadow: token('elevation.shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
	fontSize: fontSize,
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

interface ButtonsProp {
	confirmButtonLabel: string;
	cancelButtonLabel: string;
	onMouseDown: () => void;
	onCancelClick: (event: React.MouseEvent<HTMLElement>) => void;
	testId?: string;
}
// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Buttons__
 *
 * A buttons {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
const Buttons = ({
	confirmButtonLabel,
	cancelButtonLabel,
	onMouseDown,
	onCancelClick,
	testId,
}: ButtonsProp) => {
	return (
		<div css={buttonsContainerStyles}>
			<div css={buttonWrapperBaseStyles} tabIndex={-1}>
				<IconButton
					type="submit"
					icon={(iconProps) => <ConfirmIcon {...iconProps} size="small" />}
					onMouseDown={onMouseDown}
					label={confirmButtonLabel}
					testId={testId && `${testId}--confirm`}
				/>
			</div>
			<div css={buttonWrapperBaseStyles} tabIndex={-1}>
				<IconButton
					icon={(iconProps) => <CancelIcon {...iconProps} size="small" />}
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
