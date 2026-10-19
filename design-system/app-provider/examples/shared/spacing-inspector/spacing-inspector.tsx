/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useRef, useState } from 'react';

import { bind } from 'bind-event-listener';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { type GapBand, measureGaps } from './measure-gaps';

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
	'space.gap.xxsmall': token('color.chart.categorical.1'),
	'space.gap.xsmall': token('color.chart.categorical.2'),
	'space.gap.small': token('color.chart.categorical.3'),
	'space.gap.medium': token('color.chart.categorical.4'),
	'space.gap.large': token('color.chart.categorical.5'),
	'space.gap.xlarge': token('color.chart.categorical.6'),
	'space.gap.xxlarge': token('color.chart.categorical.7'),
};

function labelFor(band: GapBand) {
	const size = `${Number(band.size.toFixed(2))}px`;
	const name = band.token ?? 'Unknown token';
	const fixed = band.token && !band.token.startsWith('space.gap.') ? ' · fixed' : '';
	const extra = band.extra > 1 ? ` · ${Number(band.extra.toFixed(2))}px extra alignment` : '';
	return `${name} · ${size}${fixed}${extra}`;
}

/**
 * Inspect rendered flex/grid gaps without annotating or replacing the layout primitives.
 * All observers and pointer listeners exist only while the overlay is enabled.
 */
export function SpacingInspector({
	children,
	enabled,
	activeToken,
}: {
	children: React.ReactNode;
	enabled: boolean;
	activeToken: string | null;
}): React.JSX.Element {
	const rootRef = useRef<HTMLDivElement>(null);
	const snapshotRef = useRef<ReturnType<typeof measureGaps>>({ width: 0, height: 0, bands: [] });
	const [snapshot, setSnapshot] = useState(snapshotRef.current);
	const [hoveredId, setHoveredId] = useState<string | null>(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!enabled || !root) {
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
			const next = measureGaps(root);
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
						!record.target.closest('[data-testid="spacing-gap-overlay"]'),
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
	}, [enabled]);

	const hovered = snapshot.bands.find((band) => band.id === hoveredId);
	const highlight = activeToken ?? hovered?.token;
	const label = hovered ? labelFor(hovered) : '';
	const labelWidth = Math.min(snapshot.width, label.length * 7 + 16);
	const labelX = hovered ? Math.max(0, Math.min(hovered.x, snapshot.width - labelWidth)) : 0;
	const labelY = hovered ? Math.max(0, hovered.y - 28) : 0;

	return (
		<Box ref={rootRef} xcss={styles.root}>
			{children}
			{enabled && snapshot.width > 0 && (
				<svg
					viewBox={`0 0 ${snapshot.width} ${snapshot.height}`}
					width={snapshot.width}
					height={snapshot.height}
					aria-hidden="true"
					css={styles.overlay}
					data-testid="spacing-gap-overlay"
				>
					{snapshot.bands.map((band) => (
						<rect
							key={band.id}
							x={band.x}
							y={band.y}
							width={band.width}
							height={band.height}
							fill={colors[band.token ?? ''] ?? token('color.background.neutral.bold')}
							stroke={colors[band.token ?? ''] ?? token('color.border.bold')}
							fillOpacity={
								highlight && band.token !== highlight
									? 0.06
									: band.token === highlight || band.id === hoveredId
										? 0.5
										: 0.2
							}
							strokeOpacity={highlight && band.token !== highlight ? 0.2 : 0.75}
							strokeWidth={band.token === highlight || band.id === hoveredId ? 2 : 1}
							strokeDasharray={band.token === null ? '3 2' : undefined}
							data-gap-token={band.token ?? 'unknown'}
							data-gap-size={band.size}
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
							<text
								x={labelX + 8}
								y={labelY + 16}
								textLength={Math.min(label.length * 7, labelWidth - 16)}
								lengthAdjust="spacingAndGlyphs"
								css={styles.label}
							>
								{label}
							</text>
						</g>
					)}
				</svg>
			)}
		</Box>
	);
}
