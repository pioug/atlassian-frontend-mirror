/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { arrow } from '@atlaskit/top-layer/arrow';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';

const styles = cssMap({
	root: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	grid: {
		display: 'grid',
		width: '500px',
		gridTemplateColumns: '1fr 1fr 1fr',
		gap: token('space.1000'),
	},
	surface: {
		backgroundColor: token('color.background.neutral.bold'),
	},
});

const popoverArrow = arrow();

function ArrowPopup({ placement, label }: { placement: TPlacementOptions; label: string }) {
	return (
		<Popup placement={placement} onClose={() => {}}>
			<Popup.Trigger>
				<Button shouldFitContainer>{label}</Button>
			</Popup.Trigger>
			<Popup.Content
				role="dialog"
				label={`Arrow popup: ${label}`}
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
 * Popup with a CSS arrow at every placement, arranged in a grid
 * matching the visual position of each placement.
 *
 * Top row: block-start placements (above trigger).
 * Middle row: inline placements (left/right of trigger).
 * Bottom row: block-end placements (below trigger).
 */
export default function PopoverWithArrowExample(): JSX.Element {
	return (
		<div css={styles.root}>
			<div css={styles.grid}>
				{/* Top row: block-start (above) */}
				<ArrowPopup placement={{ axis: 'block', edge: 'start', align: 'end' }} label="top-start" />
				<ArrowPopup placement={{ axis: 'block', edge: 'start' }} label="top-center" />
				<ArrowPopup placement={{ axis: 'block', edge: 'start', align: 'start' }} label="top-end" />

				{/* Middle row: inline (left/right) */}
				<ArrowPopup
					placement={{ axis: 'inline', edge: 'start', align: 'end' }}
					label="left-start"
				/>
				<div />
				<ArrowPopup placement={{ axis: 'inline', edge: 'end', align: 'end' }} label="right-start" />

				<ArrowPopup
					placement={{ axis: 'inline', edge: 'start', align: 'start' }}
					label="left-end"
				/>
				<div />
				<ArrowPopup placement={{ axis: 'inline', edge: 'end', align: 'start' }} label="right-end" />

				{/* Bottom row: block-end (below) */}
				<ArrowPopup placement={{ axis: 'block', edge: 'end', align: 'end' }} label="bottom-start" />
				<ArrowPopup placement={{ axis: 'block', edge: 'end' }} label="bottom-center" />
				<ArrowPopup placement={{ axis: 'block', edge: 'end', align: 'start' }} label="bottom-end" />
			</div>
		</div>
	);
}
