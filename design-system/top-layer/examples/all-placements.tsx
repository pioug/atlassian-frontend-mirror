/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type ReactNode, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/popup';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

type TAxis = NonNullable<TPlacementOptions['axis']>;
type TEdge = NonNullable<TPlacementOptions['edge']>;
type TAlign = NonNullable<TPlacementOptions['align']>;
type TCrossAxisShiftDirection = 'forwards' | 'backwards';
type TOffsetMode = 'token' | 'pixels';

type TCellPlacement = {
	axis: TAxis;
	edge: TEdge;
	align: TAlign;
};

type TSpaceTokenChoice = {
	label: string;
	value: string;
};

// Space tokens suitable for a popover offset; resolved CSS length string
// from `token(...)` flows straight into the placement options.
const spaceTokenChoices: ReadonlyArray<TSpaceTokenChoice> = [
	{ label: 'space.0', value: token('space.0') },
	{ label: 'space.025', value: token('space.025') },
	{ label: 'space.050', value: token('space.050') },
	{ label: 'space.075', value: token('space.075') },
	{ label: 'space.100', value: token('space.100') },
	{ label: 'space.150', value: token('space.150') },
	{ label: 'space.200', value: token('space.200') },
	{ label: 'space.250', value: token('space.250') },
	{ label: 'space.300', value: token('space.300') },
	{ label: 'space.400', value: token('space.400') },
];

const PIXEL_RANGE_MIN = -64;
const PIXEL_RANGE_MAX = 64;
const PIXEL_RANGE_STEP = 1;

const COLOR_INDICATOR = token('color.border.selected');

const styles = cssMap({
	root: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	grid: {
		display: 'grid',
		width: '960px',
		gridTemplateColumns: 'repeat(3, 1fr)',
		columnGap: token('space.1000'),
		rowGap: token('space.1000'),
		marginBlockStart: token('space.500'),
		marginInlineStart: 'auto',
		marginBlockEnd: '0',
		marginInlineEnd: 'auto',
	},
	cellBox: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.075'),
		paddingBlock: token('space.150'),
		paddingInline: token('space.200'),
		borderRadius: token('radius.small', '3px'),
		boxShadow: token('elevation.shadow.raised'),
		color: token('color.text'),
	},
	axisLineClip: {
		position: 'absolute',
		inset: 0,
		overflow: 'hidden',
		pointerEvents: 'none',
	},
	target: {
		width: '100%',
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
		backgroundColor: token('color.background.input'),
		minHeight: '140px',
	},
	decorationLabel: {
		font: token('font.body.small'),
		color: token('color.text.subtlest'),
		pointerEvents: 'none',
		userSelect: 'none',
	},
	popoverContent: {
		whiteSpace: 'nowrap',
		boxShadow: token('elevation.shadow.overlay'),
		alignItems: 'center',
		justifyContent: 'center',
	},
	idTag: {
		position: 'absolute',
		insetBlockEnd: token('space.100'),
		insetInlineEnd: token('space.100'),
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('color.background.neutral'),
		color: token('color.text'),
		font: token('font.heading.xsmall'),
		fontVariantNumeric: 'tabular-nums',
		zIndex: 1,
	},
	popoverIdTag: {
		alignSelf: 'center',
		font: token('font.heading.xsmall'),
		color: token('color.text'),
		fontVariantNumeric: 'tabular-nums',
	},
	// The control panel is pinned to the viewport corner using the
	// "fixed-position popover" recipe documented in
	// `notes/decisions/fixed-position-popover.md`: a `<Popover mode="manual">`
	// with a `position: fixed` child and logical `inset-*` tokens. No anchor
	// element, no `useAnchorPosition`.
	controlPanelPin: {
		position: 'fixed',
		insetBlockStart: token('space.300'),
		insetInlineEnd: token('space.300'),
	},
	controlPanel: {
		width: '280px',
		paddingBlock: token('space.250'),
		paddingInline: token('space.300'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
	},
	controlGroup: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.075'),
	},
	visibilityGrid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(4, 1fr)',
		gap: token('space.050'),
	},
	visibilityCheckbox: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
		font: token('font.body.small'),
		color: token('color.text'),
		cursor: 'pointer',
		fontVariantNumeric: 'tabular-nums',
	},
	bulkToggleRow: {
		display: 'flex',
		gap: token('space.100'),
	},
	bulkToggleButton: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.150'),
		font: token('font.body.small'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('color.background.input'),
		color: token('color.text'),
		cursor: 'pointer',
	},
	controlGroupHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: token('space.100'),
		minHeight: '2rem',
	},
	controlInputRow: {
		display: 'grid',
		gridTemplateColumns: '1fr auto',
		alignItems: 'center',
		gap: token('space.150'),
		minHeight: '2rem',
	},
	rangeInput: {
		width: '100%',
		margin: 0,
		accentColor: token('color.background.accent.blue.bolder'),
	},
	rangeValue: {
		font: token('font.body.small'),
		color: token('color.text'),
		minWidth: '3rem',
		textAlign: 'right',
		fontVariantNumeric: 'tabular-nums',
	},
	select: {
		paddingBlock: token('space.075'),
		paddingInline: token('space.100'),
		font: token('font.body.small'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.input'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('color.background.input'),
		color: token('color.text'),
		width: '100%',
	},
	modeToggle: {
		display: 'inline-flex',
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.input'),
		borderRadius: token('radius.small', '3px'),
		overflow: 'hidden',
	},
	modeToggleButton: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.100'),
		font: token('font.body.small'),
		borderStyle: 'none',
		backgroundColor: token('color.background.input'),
		color: token('color.text.subtle'),
		cursor: 'pointer',
	},
	modeToggleButtonActive: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
	},
});

// Distinct accent colors so each trigger and its popover share a hue.
const cellColors: ReadonlyArray<string> = [
	token('color.background.accent.blue.subtler'),
	token('color.background.accent.purple.subtler'),
	token('color.background.accent.magenta.subtler'),
	token('color.background.accent.red.subtler'),
	token('color.background.accent.orange.subtler'),
	token('color.background.accent.yellow.subtler'),
	token('color.background.accent.lime.subtler'),
	token('color.background.accent.green.subtler'),
	token('color.background.accent.teal.subtler'),
	token('color.background.accent.gray.subtler'),
	token('color.background.accent.blue.subtle'),
	token('color.background.accent.purple.subtle'),
];

// Every axis x edge x align combination, ordered to read naturally as
// rows: block-start, then inline, then block-end.
const placements: ReadonlyArray<TCellPlacement> = [
	{ axis: 'block', edge: 'start', align: 'start' },
	{ axis: 'block', edge: 'start', align: 'center' },
	{ axis: 'block', edge: 'start', align: 'end' },
	{ axis: 'inline', edge: 'start', align: 'start' },
	{ axis: 'inline', edge: 'start', align: 'center' },
	{ axis: 'inline', edge: 'start', align: 'end' },
	{ axis: 'inline', edge: 'end', align: 'start' },
	{ axis: 'inline', edge: 'end', align: 'center' },
	{ axis: 'inline', edge: 'end', align: 'end' },
	{ axis: 'block', edge: 'end', align: 'start' },
	{ axis: 'block', edge: 'end', align: 'center' },
	{ axis: 'block', edge: 'end', align: 'end' },
];

type TTargetDecoration = {
	borderWidth: string;
	borderColor: string;
	axisLine: CSSProperties;
	axisLabel: CSSProperties;
	edgeLabel: CSSProperties;
	dot: CSSProperties;
	dotLabel: CSSProperties;
};

const ALIGN_OFFSET: Record<TAlign, string> = {
	start: '0%',
	center: '50%',
	end: '100%',
};

function getTargetDecoration({ axis, edge, align }: TCellPlacement): TTargetDecoration {
	const thin = '1px';

	// Highlight the active edge.
	const borderColor =
		axis === 'block'
			? edge === 'start'
				? `${COLOR_INDICATOR} ${token('color.border.bold')} ${token('color.border.bold')} ${token('color.border.bold')}`
				: `${token('color.border.bold')} ${token('color.border.bold')} ${COLOR_INDICATOR} ${token('color.border.bold')}`
			: edge === 'start'
				? `${token('color.border.bold')} ${token('color.border.bold')} ${token('color.border.bold')} ${COLOR_INDICATOR}`
				: `${token('color.border.bold')} ${COLOR_INDICATOR} ${token('color.border.bold')} ${token('color.border.bold')}`;

	const borderWidth = thin;

	// Dashed line through the center, perpendicular to the anchor edge.
	const axisLineBase: CSSProperties = {
		position: 'absolute',
		pointerEvents: 'none',
		opacity: 0.3,
		backgroundImage: `repeating-linear-gradient(${
			axis === 'block' ? '0deg' : '90deg'
		}, ${COLOR_INDICATOR} 0, ${COLOR_INDICATOR} 6px, transparent 6px, transparent 12px)`,
	};

	const axisLine: CSSProperties =
		axis === 'block'
			? {
					...axisLineBase,
					left: '50%',
					top: 0,
					bottom: 0,
					width: '2px',
					transform: 'translateX(-50%)',
				}
			: {
					...axisLineBase,
					top: '50%',
					left: 0,
					right: 0,
					height: '2px',
					transform: 'translateY(-50%)',
				};

	// Dot on the anchor edge at the align position.
	const alignOffset = ALIGN_OFFSET[align];
	const dot: CSSProperties = {
		position: 'absolute',
		width: '8px',
		height: '8px',
		borderRadius: '50%',
		backgroundColor: COLOR_INDICATOR,
		pointerEvents: 'none',
		transform: 'translate(-50%, -50%)',
		...(axis === 'block'
			? {
					top: edge === 'start' ? 0 : '100%',
					left: alignOffset,
				}
			: {
					left: edge === 'start' ? 0 : '100%',
					top: alignOffset,
				}),
	};

	// Axis label centered on the axis line; rotated for the vertical case.
	const axisLabel: CSSProperties =
		axis === 'block'
			? {
					position: 'absolute',
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
					whiteSpace: 'nowrap',
					writingMode: 'vertical-rl',
				}
			: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					whiteSpace: 'nowrap',
				};

	// Edge label near the start of the highlighted edge.
	const edgeLabel: CSSProperties =
		axis === 'block'
			? {
					position: 'absolute',
					left: '8px',
					whiteSpace: 'nowrap',
					...(edge === 'start' ? { top: '4px' } : { bottom: '4px' }),
				}
			: {
					position: 'absolute',
					top: '8px',
					whiteSpace: 'nowrap',
					writingMode: 'vertical-rl',
					...(edge === 'start' ? { left: '4px' } : { right: '4px' }),
				};

	// Dot label, inset from the dot toward the cell center.
	const dotLabel: CSSProperties =
		axis === 'block'
			? {
					position: 'absolute',
					left: ALIGN_OFFSET[align],
					transform: 'translateX(-50%)',
					whiteSpace: 'nowrap',
					...(edge === 'start' ? { top: '24px' } : { bottom: '24px' }),
				}
			: {
					position: 'absolute',
					top: ALIGN_OFFSET[align],
					transform: 'translateY(-50%)',
					whiteSpace: 'nowrap',
					...(edge === 'start' ? { left: '24px' } : { right: '24px' }),
				};

	return { borderWidth, borderColor, axisLine, axisLabel, edgeLabel, dot, dotLabel };
}

function cellId(index: number): string {
	return String.fromCharCode('A'.charCodeAt(0) + index);
}

function placementLabel({ axis, edge, align }: TCellPlacement): string {
	return `${axis}-${edge} ${align}`;
}

function PlacementCell({
	id,
	cell,
	color,
	offset,
	isPopupOpen,
	forceFallbackPositioning,
}: {
	id: string;
	cell: TCellPlacement;
	color: string;
	offset: TPlacementOptions['offset'];
	isPopupOpen: boolean;
	forceFallbackPositioning: boolean;
}) {
	const triggerRef = useRef<HTMLDivElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const label = placementLabel(cell);
	const decoration = getTargetDecoration(cell);

	const placement: TPlacementOptions = {
		axis: cell.axis,
		edge: cell.edge,
		align: cell.align,
		offset,
	};

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		forceFallbackPositioning,
	});

	return (
		<div>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic decoration values cannot use cssMap */}
			<div
				ref={triggerRef}
				css={[styles.cellBox, styles.target]}
				style={{
					backgroundColor: color,
					borderWidth: decoration.borderWidth,
					borderColor: decoration.borderColor,
				}}
				aria-label={label}
			>
				<div css={styles.axisLineClip}>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic computed style */}
					<div style={decoration.axisLine} />
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic computed style */}
				<span css={styles.decorationLabel} style={decoration.axisLabel}>
					axis: {cell.axis}
				</span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic computed style */}
				<span css={styles.decorationLabel} style={decoration.edgeLabel}>
					edge: {cell.edge}
				</span>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic computed style */}
				<div style={decoration.dot} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic computed style */}
				<span css={styles.decorationLabel} style={decoration.dotLabel}>
					align: {cell.align}
				</span>
				<span css={styles.idTag}>{id}:target</span>
			</div>
			<Popover
				ref={popoverRef}
				role="note"
				mode="manual"
				isOpen={isPopupOpen}
				placement={placement}
				label={label}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic color */}
				<div css={[styles.cellBox, styles.popoverContent]} style={{ backgroundColor: color }}>
					<strong css={styles.popoverIdTag}>{id}:popup</strong>
				</div>
			</Popover>
		</div>
	);
}

function ModeToggle({
	id,
	mode,
	onChange,
}: {
	id: string;
	mode: TOffsetMode;
	onChange: (next: TOffsetMode) => void;
}) {
	return (
		<div css={styles.modeToggle} role="group" aria-labelledby={id}>
			<button
				type="button"
				css={[styles.modeToggleButton, mode === 'token' && styles.modeToggleButtonActive]}
				aria-pressed={mode === 'token'}
				onClick={() => onChange('token')}
			>
				Token
			</button>
			<button
				type="button"
				css={[styles.modeToggleButton, mode === 'pixels' && styles.modeToggleButtonActive]}
				aria-pressed={mode === 'pixels'}
				onClick={() => onChange('pixels')}
			>
				Pixels
			</button>
		</div>
	);
}

function OffsetControl({
	idPrefix,
	label,
	mode,
	onModeChange,
	pixels,
	onPixelsChange,
	tokenLabel,
	onTokenChange,
}: {
	idPrefix: string;
	label: string;
	mode: TOffsetMode;
	onModeChange: (next: TOffsetMode) => void;
	pixels: number;
	onPixelsChange: (next: number) => void;
	tokenLabel: string;
	onTokenChange: (next: string) => void;
}) {
	const headingId = `${idPrefix}-heading`;
	const inputId = `${idPrefix}-input`;

	return (
		<div css={styles.controlGroup}>
			<div css={styles.controlGroupHeader}>
				<Text id={headingId} weight="medium" as="strong">
					{label}
				</Text>
				<ModeToggle id={headingId} mode={mode} onChange={onModeChange} />
			</div>
			{mode === 'pixels' ? (
				<div css={styles.controlInputRow}>
					<input
						id={inputId}
						aria-labelledby={headingId}
						type="range"
						min={PIXEL_RANGE_MIN}
						max={PIXEL_RANGE_MAX}
						step={PIXEL_RANGE_STEP}
						value={pixels}
						onChange={(event) => onPixelsChange(Number(event.target.value))}
						css={styles.rangeInput}
					/>
					<span css={styles.rangeValue} aria-live="polite">
						{pixels}px
					</span>
				</div>
			) : (
				<div css={styles.controlInputRow}>
					<select
						id={inputId}
						aria-labelledby={headingId}
						value={tokenLabel}
						onChange={(event) => onTokenChange(event.target.value)}
						css={styles.select}
					>
						{spaceTokenChoices.map((choice) => (
							<option key={choice.label} value={choice.label}>
								{choice.label}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
}

function findTokenChoice(label: string): TSpaceTokenChoice {
	const match = spaceTokenChoices.find((choice) => choice.label === label);
	if (match) {
		return match;
	}
	return spaceTokenChoices[0];
}

function resolveOffsetValue({
	mode,
	pixels,
	tokenLabel,
}: {
	mode: TOffsetMode;
	pixels: number;
	tokenLabel: string;
}): number | string {
	if (mode === 'pixels') {
		return pixels;
	}
	return findTokenChoice(tokenLabel).value;
}

function ControlPanel({ children }: { children: ReactNode }) {
	return (
		<Popover role="dialog" mode="manual" isOpen label="Offset controls">
			<div css={styles.controlPanelPin}>
				<div css={styles.controlPanel}>{children}</div>
			</div>
		</Popover>
	);
}

function buildAllVisible(): ReadonlyArray<boolean> {
	return placements.map(() => true);
}

function buildAllHidden(): ReadonlyArray<boolean> {
	return placements.map(() => false);
}

export default function AllPlacements(): JSX.Element {
	const [gapMode, setGapMode] = useState<TOffsetMode>('token');
	const [gapPixels, setGapPixels] = useState<number>(8);
	const [gapTokenLabel, setGapTokenLabel] = useState<string>('space.100');

	const [crossAxisShiftMode, setCrossAxisShiftMode] = useState<TOffsetMode>('token');
	const [crossAxisShiftPixels, setCrossAxisShiftPixels] = useState<number>(0);
	const [crossAxisShiftTokenLabel, setCrossAxisShiftTokenLabel] = useState<string>('space.0');
	const [crossAxisShiftDirection, setCrossAxisShiftDirection] =
		useState<TCrossAxisShiftDirection>('forwards');

	const [popupVisibility, setPopupVisibility] = useState<ReadonlyArray<boolean>>(buildAllVisible);

	const [forceFallbackPositioning, setForceFallbackPositioning] = useState<boolean>(false);

	function togglePopupAt(index: number) {
		setPopupVisibility((current) =>
			current.map((isVisible, currentIndex) => (currentIndex === index ? !isVisible : isVisible)),
		);
	}

	function enableAllPopups() {
		setPopupVisibility(buildAllVisible());
	}

	function disableAllPopups() {
		setPopupVisibility(buildAllHidden());
	}

	const offset: TPlacementOptions['offset'] = {
		gap: resolveOffsetValue({
			mode: gapMode,
			pixels: gapPixels,
			tokenLabel: gapTokenLabel,
		}),
		crossAxisShift: {
			value: resolveOffsetValue({
				mode: crossAxisShiftMode,
				pixels: crossAxisShiftPixels,
				tokenLabel: crossAxisShiftTokenLabel,
			}),
			direction: crossAxisShiftDirection,
		},
	};

	return (
		<Box xcss={styles.root}>
			<ControlPanel>
				<Text as="strong" id="all-placements-controls-heading" weight="bold">
					Offset
				</Text>
				<OffsetControl
					idPrefix="all-placements-gap"
					label="Gap"
					mode={gapMode}
					onModeChange={setGapMode}
					pixels={gapPixels}
					onPixelsChange={setGapPixels}
					tokenLabel={gapTokenLabel}
					onTokenChange={setGapTokenLabel}
				/>
				<OffsetControl
					idPrefix="all-placements-cross-axis-shift"
					label="Cross-axis shift"
					mode={crossAxisShiftMode}
					onModeChange={setCrossAxisShiftMode}
					pixels={crossAxisShiftPixels}
					onPixelsChange={setCrossAxisShiftPixels}
					tokenLabel={crossAxisShiftTokenLabel}
					onTokenChange={setCrossAxisShiftTokenLabel}
				/>
				<div css={styles.controlGroup}>
					<div css={styles.controlGroupHeader}>
						<Text
							id="all-placements-cross-axis-shift-direction-heading"
							weight="medium"
							as="strong"
						>
							Cross-axis shift direction
						</Text>
					</div>
					<div css={styles.controlInputRow}>
						<select
							id="all-placements-cross-axis-shift-direction"
							aria-labelledby="all-placements-cross-axis-shift-direction-heading"
							value={crossAxisShiftDirection}
							onChange={(event) =>
								setCrossAxisShiftDirection(event.target.value as TCrossAxisShiftDirection)
							}
							css={styles.select}
						>
							<option value="forwards">forwards</option>
							<option value="backwards">backwards</option>
						</select>
					</div>
				</div>
				<div css={styles.controlGroup}>
					<div css={styles.controlGroupHeader}>
						<Text id="all-placements-fallback-heading" weight="medium" as="strong">
							Force JS fallback
						</Text>
					</div>
					<label htmlFor="all-placements-fallback" css={styles.visibilityCheckbox}>
						<input
							id="all-placements-fallback"
							type="checkbox"
							checked={forceFallbackPositioning}
							onChange={(event) => setForceFallbackPositioning(event.target.checked)}
						/>
						Use JavaScript positioning
					</label>
				</div>
				<div css={styles.controlGroup}>
					<div css={styles.controlGroupHeader}>
						<Text id="all-placements-visibility-heading" weight="medium" as="strong">
							Show popups
						</Text>
					</div>
					<div css={styles.bulkToggleRow}>
						<button type="button" css={styles.bulkToggleButton} onClick={enableAllPopups}>
							Enable all
						</button>
						<button type="button" css={styles.bulkToggleButton} onClick={disableAllPopups}>
							Disable all
						</button>
					</div>
					<div
						css={styles.visibilityGrid}
						role="group"
						aria-labelledby="all-placements-visibility-heading"
					>
						{placements.map((_cell, index) => {
							const id = cellId(index);
							const checkboxId = `all-placements-visibility-${id}`;
							return (
								<label key={id} htmlFor={checkboxId} css={styles.visibilityCheckbox}>
									<input
										id={checkboxId}
										type="checkbox"
										checked={popupVisibility[index]}
										onChange={() => togglePopupAt(index)}
									/>
									{id}
								</label>
							);
						})}
					</div>
				</div>
			</ControlPanel>

			<Stack space="space.300">
				<div css={styles.grid}>
					{placements.map((cell, index) => (
						<PlacementCell
							key={`${cell.axis}-${cell.edge}-${cell.align}`}
							id={cellId(index)}
							cell={cell}
							color={cellColors[index]}
							offset={offset}
							isPopupOpen={popupVisibility[index]}
							forceFallbackPositioning={forceFallbackPositioning}
						/>
					))}
				</div>
			</Stack>
		</Box>
	);
}
