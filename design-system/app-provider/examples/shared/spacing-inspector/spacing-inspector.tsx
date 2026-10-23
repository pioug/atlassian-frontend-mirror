/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { type GapBand, measureGaps } from './measure-gaps';
import { type InsetBand, measureInsets } from './measure-insets';
import { SpacingPattern } from './spacing-pattern';

type SpacingBand = (GapBand | InsetBand) & { kind: 'gap' | 'inset' };
type Snapshot = { width: number; height: number; bands: SpacingBand[] };

const styles = cssMap({
	root: { position: 'relative', minWidth: 0 },
	overlay: {
		position: 'absolute',
		insetBlockStart: 0,
		insetInlineStart: 0,
		width: '100%',
		height: '100%',
		pointerEvents: 'none',
		overflow: 'hidden',
	},
	labelBackground: {
		fill: token('color.background.neutral.bold'),
		stroke: token('color.border.inverse'),
	},
	label: { fill: token('color.text.inverse'), font: token('font.body.small') },
});

const colors: Record<string, string> = {
	'space.gap.xxsmall': token('color.chart.red.bold'),
	'space.gap.xsmall': token('color.chart.orange.bold'),
	'space.gap.small': token('color.chart.yellow.bold'),
	'space.gap.medium': token('color.chart.green.bold'),
	'space.gap.large': token('color.chart.teal.bold'),
	'space.gap.xlarge': token('color.chart.blue.bold'),
	'space.gap.xxlarge': token('color.chart.purple.bold'),
	'space.inset.xxsmall': token('color.chart.red.bold'),
	'space.inset.xsmall': token('color.chart.orange.bold'),
	'space.inset.small': token('color.chart.yellow.bold'),
	'space.inset.medium': token('color.chart.green.bold'),
	'space.inset.large': token('color.chart.teal.bold'),
	'space.inset.xlarge': token('color.chart.blue.bold'),
	'space.inset.xxlarge': token('color.chart.purple.bold'),
};

function labelFor(band: SpacingBand) {
	const size = `${Number(band.size.toFixed(2))}px`;
	const name = band.token ?? 'Unknown token';
	const fixed = band.token && /^space\.(negative\.)?\d+$/.test(band.token) ? ' · fixed' : '';
	const extra = band.extra > 1 ? ` · ${Number(band.extra.toFixed(2))}px extra alignment` : '';
	return `${name} · ${size}${fixed}${extra}`;
}

/**
 * Inspect rendered flex/grid gaps and inset padding without annotating the layout primitives.
 * All observers and pointer listeners exist only while the overlay is enabled.
 */
export function SpacingInspector({
	children,
	showGaps,
	showInsets,
	activeToken,
}: {
	children: React.ReactNode;
	showGaps: boolean;
	showInsets: boolean;
	activeToken: string | null;
}): React.JSX.Element {
	const patternId = useId();
	const rootRef = useRef<HTMLDivElement>(null);
	const labelRef = useRef<SVGTextElement>(null);
	const snapshotRef = useRef<Snapshot>({ width: 0, height: 0, bands: [] });
	const [snapshot, setSnapshot] = useState(snapshotRef.current);
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [labelTextWidth, setLabelTextWidth] = useState(0);

	useEffect(() => {
		const root = rootRef.current;
		if ((!showGaps && !showInsets) || !root) {
			return;
		}
		let disposed = false;
		let frame = 0;
		const observed = new Set<Element>();
		const resize =
			typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => schedule());
		const measure = () => {
			frame = 0;
			if (disposed) {
				return;
			}
			const bounds = root.getBoundingClientRect();
			const next: Snapshot = {
				width: bounds.width,
				height: bounds.height,
				bands: [
					...(showGaps
						? measureGaps(root).bands.map((band) => ({
								...band,
								id: `gap-${band.id}`,
								kind: 'gap' as const,
							}))
						: []),
					...(showInsets
						? measureInsets(root).map((band) => ({
								...band,
								id: `inset-${band.id}`,
								kind: 'inset' as const,
							}))
						: []),
				],
			};
			snapshotRef.current = next;
			setSnapshot(next);
			const elements = new Set<Element>([
				root,
				...Array.from(root.querySelectorAll('*')).filter((node) => node instanceof HTMLElement),
			]);
			for (const node of observed) {
				if (!elements.has(node)) {
					resize?.unobserve(node);
					observed.delete(node);
				}
			}
			for (const node of elements) {
				if (!observed.has(node)) {
					resize?.observe(node);
					observed.add(node);
				}
			}
		};
		const schedule = () => {
			if (!disposed && !frame) {
				frame = requestAnimationFrame(measure);
			}
		};
		const mutation = new MutationObserver((records) => {
			if (
				records.some(
					(record) =>
						!(record.target instanceof Element) ||
						!record.target.closest('[data-testid="spacing-overlay"]'),
				)
			) {
				schedule();
			}
		});
		mutation.observe(root, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['style', 'class', 'hidden', 'dir'],
		});
		const sheets = new MutationObserver(schedule);
		sheets.observe(root.ownerDocument.head, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['media', 'disabled'],
		});
		const move = (event: PointerEvent) => {
			const origin = root.getBoundingClientRect();
			const x = event.clientX - origin.left;
			const y = event.clientY - origin.top;
			// Prefer the narrowest band where nested gutters overlap.
			const band = snapshotRef.current.bands
				.filter(
					(band) =>
						x >= band.x && x <= band.x + band.width && y >= band.y && y <= band.y + band.height,
				)
				.sort((a, b) => a.width * a.height - b.width * b.height)[0];
			setHoveredId(band?.id ?? null);
		};
		const leave = () => setHoveredId(null);
		const unbind = [
			bind(root, { type: 'pointermove', listener: move }),
			bind(root, { type: 'pointerleave', listener: leave }),
			bind(root, { type: 'load', listener: schedule, options: { capture: true } }),
			bind(window, { type: 'resize', listener: schedule }),
			bind(root.ownerDocument, { type: 'scroll', listener: schedule, options: { capture: true } }),
		];
		void root.ownerDocument.fonts?.ready.then(schedule);
		schedule();
		return () => {
			disposed = true;
			cancelAnimationFrame(frame);
			resize?.disconnect();
			mutation.disconnect();
			sheets.disconnect();
			unbind.forEach((unbind) => unbind());
		};
	}, [showGaps, showInsets]);

	const bands = snapshot.bands.filter((band) => (band.kind === 'gap' ? showGaps : showInsets));
	const patterns = Array.from(
		new Map(bands.map((band) => [`${band.kind}-${band.token ?? 'unknown'}`, band])),
	);
	const hovered = bands.find((band) => band.id === hoveredId);
	const highlight = activeToken ?? hovered?.token;
	const label = hovered ? labelFor(hovered) : '';
	useLayoutEffect(() => {
		// Snapshots also update when fonts or styles change, so measure the rendered text again.
		setLabelTextWidth(labelRef.current?.getComputedTextLength() ?? 0);
	}, [label, snapshot]);
	const labelWidth = labelTextWidth + 16;
	const labelX = hovered ? Math.max(0, Math.min(hovered.x, snapshot.width - labelWidth)) : 0;
	const labelY = hovered ? Math.max(0, hovered.y - 28) : 0;

	return (
		<Box ref={rootRef} xcss={styles.root}>
			{children}
			{(showGaps || showInsets) && snapshot.width > 0 && (
				<svg
					viewBox={`0 0 ${snapshot.width} ${snapshot.height}`}
					width={snapshot.width}
					height={snapshot.height}
					aria-hidden="true"
					css={styles.overlay}
					data-testid="spacing-overlay"
				>
					<defs>
						{patterns.map(([key, band]) => (
							<SpacingPattern
								key={key}
								id={`${patternId}-${key}`}
								kind={band.kind}
								color={colors[band.token ?? ''] ?? token('color.background.neutral.bold')}
							/>
						))}
					</defs>
					{bands.map((band) => (
						<rect
							key={band.id}
							x={band.x}
							y={band.y}
							width={band.width}
							height={band.height}
							fill={`url(#${patternId}-${band.kind}-${band.token ?? 'unknown'})`}
							fillOpacity={
								highlight && band.token !== highlight
									? 0.1
									: band.token === highlight || band.id === hoveredId
										? 0.85
										: 0.5
							}
							data-spacing-kind={band.kind}
							data-gap-token={band.kind === 'gap' ? (band.token ?? 'unknown') : undefined}
							data-gap-size={band.kind === 'gap' ? band.size : undefined}
							data-inset-token={band.kind === 'inset' ? band.token : undefined}
							data-inset-size={band.kind === 'inset' ? band.size : undefined}
						>
							<title>{labelFor(band)}</title>
						</rect>
					))}
					{hovered && (
						<g>
							<rect
								x={labelX}
								y={labelY}
								width={labelWidth}
								height={24}
								rx={3}
								css={styles.labelBackground}
							/>
							<text ref={labelRef} x={labelX + 8} y={labelY + 16} css={styles.label}>
								{label}
							</text>
						</g>
					)}
				</svg>
			)}
		</Box>
	);
}
