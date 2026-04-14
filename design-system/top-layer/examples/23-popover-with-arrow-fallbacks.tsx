/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { arrow } from '@atlaskit/top-layer/arrow';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
	},
});

const viewportStyles = css({
	width: '100%',
	height: '100vh',
	position: 'relative',
});

const centerBlockEndStyles = css({
	position: 'absolute',
	insetBlockStart: '50%',
	insetInlineStart: '30%',
});

const centerInlineEndStyles = css({
	position: 'absolute',
	insetBlockStart: '50%',
	insetInlineStart: '60%',
});

const bottomBlockEndStyles = css({
	position: 'absolute',
	insetBlockEnd: token('space.100'),
	insetInlineStart: '30%',
});

const bottomBlockEndAlignedStyles = css({
	position: 'absolute',
	insetBlockEnd: token('space.100'),
	insetInlineStart: '55%',
});

const rightInlineEndStyles = css({
	position: 'absolute',
	insetBlockStart: '20%',
	insetInlineEnd: token('space.100'),
});

const rightInlineEndAlignedStyles = css({
	position: 'absolute',
	insetBlockStart: '40%',
	insetInlineEnd: token('space.100'),
});

const cornerBottomRightStyles = css({
	position: 'absolute',
	insetBlockEnd: token('space.100'),
	insetInlineEnd: token('space.100'),
});

function placementLabel(placement: TPlacementOptions): string {
	const axis = placement.axis ?? 'block';
	const edge = placement.edge ?? 'end';
	const align = placement.align ?? 'center';
	return align === 'center' ? `${axis}-${edge}` : `${axis}-${edge} align-${align}`;
}

const popoverArrow = arrow();

function ArrowDemo({ placement }: { placement: TPlacementOptions }) {
	const label = placementLabel(placement);
	return (
		<Popup placement={placement} onClose={() => {}}>
			<Popup.Trigger>
				<Button>{label}</Button>
			</Popup.Trigger>
			<Popup.Content
				role="dialog"
				label={`Arrow popup at ${label}`}
				arrow={popoverArrow}
				xcss={styles.surface}
			>
				<Box padding="space.200">
					<Text size="small" weight="medium" color="color.text.inverse">
						{label}
					</Text>
				</Box>
			</Popup.Content>
		</Popup>
	);
}

/**
 * Popup arrows with CSS flip fallbacks.
 *
 * Triggers are absolutely positioned inside a viewport-height container.
 * Centered triggers show normal arrow placement. Triggers near edges
 * force `@position-try` fallbacks, flipping the popover and arrow together.
 *
 * Open a popup near an edge and compare with the centered ones —
 * the arrow always points toward the trigger regardless of flip.
 */
export default function PopoverWithArrowExample(): JSX.Element {
	return (
		<div css={viewportStyles}>
			{/* Normal placement — no flip */}
			<div css={centerBlockEndStyles}>
				<ArrowDemo placement={{ axis: 'block', edge: 'end' }} />
			</div>
			<div css={centerInlineEndStyles}>
				<ArrowDemo placement={{ axis: 'inline', edge: 'end' }} />
			</div>

			{/* Near bottom edge — block-end flips above */}
			<div css={bottomBlockEndStyles}>
				<ArrowDemo placement={{ axis: 'block', edge: 'end' }} />
			</div>
			<div css={bottomBlockEndAlignedStyles}>
				<ArrowDemo placement={{ axis: 'block', edge: 'end', align: 'start' }} />
			</div>

			{/* Near right edge — inline-end flips left */}
			<div css={rightInlineEndStyles}>
				<ArrowDemo placement={{ axis: 'inline', edge: 'end' }} />
			</div>
			<div css={rightInlineEndAlignedStyles}>
				<ArrowDemo placement={{ axis: 'inline', edge: 'end', align: 'start' }} />
			</div>

			{/* Bottom-right corner — flips both axes */}
			<div css={cornerBottomRightStyles}>
				<ArrowDemo placement={{ axis: 'block', edge: 'end', align: 'start' }} />
			</div>
		</div>
	);
}
