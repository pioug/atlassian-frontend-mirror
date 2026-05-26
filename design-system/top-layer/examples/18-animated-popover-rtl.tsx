/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import { token } from '@atlaskit/tokens';
import { fade, scaleAndFade, slideAndFade } from '@atlaskit/top-layer/animations';
import { Popover } from '@atlaskit/top-layer/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

/**
 * All animation presets to demonstrate.
 */
const presets = [
	{ label: 'slideAndFade (4px)', preset: slideAndFade() },
	{ label: 'slideAndFade (8px)', preset: slideAndFade({ distance: 8 }) },
	{ label: 'fade', preset: fade() },
	{ label: 'scaleAndFade', preset: scaleAndFade() },
] as const;

const styles = cssMap({
	wrapper: {
		paddingBlock: token('space.400'),
		paddingInline: token('space.400'),
	},
	controlBar: {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: token('space.200'),
		paddingBlock: token('space.200'),
		paddingInline: token('space.300'),
		borderRadius: token('radius.large', '8px'),
		backgroundColor: token('color.background.neutral'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
	controlLabel: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
	},
	demoArea: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		gap: token('space.300'),
		paddingBlock: token('space.600'),
		paddingInline: token('space.400'),
		borderRadius: token('radius.large', '8px'),
		borderWidth: token('border.width'),
		borderStyle: 'dashed',
		borderColor: token('color.border'),
	},
});

const axisOptions = [
	{ label: 'block', value: 'block' },
	{ label: 'inline', value: 'inline' },
] as const;

const edgeOptions = [
	{ label: 'end', value: 'end' },
	{ label: 'start', value: 'start' },
] as const;

/**
 * Animated popover example testing animation presets against right-to-left (RTL)
 * text direction, with controls for:
 *
 * - **RTL toggle**: wraps the entire example in `dir="rtl"`.
 * - **Axis toggle**: switches between `block` axis (above/below) and `inline`
 *   axis (inline-start / inline-end).
 * - **Edge toggle**: switches between `start` and `end` edges on the chosen axis.
 *
 * Each animation preset is rendered as a separate popover so you can compare
 * them side-by-side while toggling direction and axis.
 */
export default function AnimatedPopoverRtlExample(): React.JSX.Element {
	const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
	const [axis, setAxis] = useState<NonNullable<TPlacementOptions['axis']>>('inline');
	const [edge, setEdge] = useState<NonNullable<TPlacementOptions['edge']>>('end');

	const placement: TPlacementOptions = { axis, edge };

	// Top-layer elements (popover API) are not descendants of any element in the
	// normal DOM tree, so they cannot inherit `dir` from a wrapper div. The only
	// ancestor that top-layer elements share is `<html>` (document.documentElement).
	// Setting `dir` there makes the `[dir='rtl'] [data-ds-popover-*]` CSS selectors
	// in the animation presets match correctly.
	useLayoutEffect(() => {
		const htmlEl = document.documentElement;
		const previous = htmlEl.getAttribute('dir');
		htmlEl.setAttribute('dir', direction);
		return () => {
			if (previous === null) {
				htmlEl.removeAttribute('dir');
			} else {
				htmlEl.setAttribute('dir', previous);
			}
		};
	}, [direction]);

	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Stack space="space.400" xcss={styles.wrapper}>
					<div css={styles.controlBar}>
						<div css={styles.controlLabel}>
							<Checkbox
								id="rtl-toggle"
								label='Right-to-left (dir="rtl")'
								isChecked={direction === 'rtl'}
								onChange={(event) => setDirection(event.target.checked ? 'rtl' : 'ltr')}
							/>
						</div>

						<div css={styles.controlLabel}>
							<Text size="small">Axis:</Text>
							<Select
								inputId="placement-axis"
								value={{ label: axis, value: axis }}
								options={axisOptions}
								onChange={(option) => {
									if (option) {
										setAxis(option.value);
									}
								}}
								isSearchable={false}
								label="Axis"
							/>
						</div>

						<div css={styles.controlLabel}>
							<Text size="small">Edge:</Text>
							<Select
								inputId="placement-edge"
								value={{ label: edge, value: edge }}
								options={edgeOptions}
								onChange={(option) => {
									if (option) {
										setEdge(option.value);
									}
								}}
								isSearchable={false}
								label="Edge"
							/>
						</div>
					</div>

					<div css={styles.demoArea}>
						{presets.map(({ label, preset }) => (
							<AnimatedPopoverDemo
								key={label}
								label={label}
								preset={preset}
								placement={placement}
								forceFallbackPositioning={forceFallbackPositioning}
							/>
						))}
					</div>
				</Stack>
			)}
		</ForceFallbackToggle>
	);
}

// ─── Individual demo ──────────────────────────────────────────────────────────

function AnimatedPopoverDemo({
	label,
	preset,
	placement,
	forceFallbackPositioning,
}: {
	label: string;
	preset: ReturnType<typeof slideAndFade>;
	placement: TPlacementOptions;
	forceFallbackPositioning: boolean;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	useAnchorPosition({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		forceFallbackPositioning,
	});

	return (
		<Fragment>
			<Button
				ref={triggerRef}
				isSelected={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}
				aria-expanded={isOpen}
				aria-haspopup="dialog"
			>
				{label}
			</Button>
			<Popover
				ref={popoverRef}
				role="dialog"
				label={`${label} popover`}
				animate={preset}
				placement={placement}
				isOpen={isOpen}
				onClose={handleClose}
			>
				<PopupSurface>
					<Stack space="space.100">
						<Heading size="xsmall">{label}</Heading>
						<Text>
							This popover uses the <Text as="strong">{label}</Text> animation preset.
						</Text>
						<Text size="small" color="color.text.subtlest">
							Open in both LTR and RTL to verify the slide direction adapts to the writing mode.
						</Text>
					</Stack>
				</PopupSurface>
			</Popover>
		</Fragment>
	);
}
