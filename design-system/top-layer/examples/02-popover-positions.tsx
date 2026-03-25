/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
// eslint-disable-next-line import/no-extraneous-dependencies -- example uses Toggle for legacy placement demo
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';
import {
	fromLegacyPlacement,
	placementMapping,
	type TLegacyPlacement,
} from '@atlaskit/top-layer/placement-map';
import { Popup, type TPlacementOptions } from '@atlaskit/top-layer/popup';
import { PopupSurface } from '@atlaskit/top-layer/popup-surface';

import { ForceFallbackToggle } from '../examples-utils/force-fallback-toggle';

const legacyPlacements = Object.keys(placementMapping) as TLegacyPlacement[];

const styles = cssMap({
	select: {
		paddingBlock: token('space.075'),
		paddingInline: token('space.100'),
		font: token('font.body.small'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border.input'),
		borderRadius: token('radius.small', '3px'),
		backgroundColor: token('color.background.input'),
	},
	demoArea: {
		display: 'flex',
		justifyContent: 'center',
		paddingBlock: token('space.800'),
		paddingInline: token('space.800'),
	},
});

export default function PopoverPositionsExample() {
	const [axis, setAxis] = useState<NonNullable<TPlacementOptions['axis']>>('block');
	const [edge, setEdge] = useState<NonNullable<TPlacementOptions['edge']>>('end');
	const [align, setAlign] = useState<NonNullable<TPlacementOptions['align']>>('center');

	const [useLegacy, setUseLegacy] = useState(false);
	const [legacyPlacement, setTLegacyPlacement] = useState<TLegacyPlacement>('bottom');

	const placement: TPlacementOptions = { axis, edge, align };

	const handleLegacyToggle = useCallback(
		(event: React.SyntheticEvent<HTMLInputElement>) => {
			const checked = (event.target as HTMLInputElement).checked;
			setUseLegacy(checked);
			if (checked) {
				const mapped = fromLegacyPlacement({ legacy: legacyPlacement });
				setAxis(mapped.axis ?? 'block');
				setEdge(mapped.edge ?? 'end');
				setAlign(mapped.align ?? 'center');
			}
		},
		[legacyPlacement],
	);

	const handleLegacyChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value as TLegacyPlacement;
		setTLegacyPlacement(value);
		const mapped = fromLegacyPlacement({ legacy: value });
		setAxis(mapped.axis ?? 'block');
		setEdge(mapped.edge ?? 'end');
		setAlign(mapped.align ?? 'center');
	}, []);

	return (
		<ForceFallbackToggle>
			{(forceFallbackPositioning) => (
				<Box padding="space.400">
					<Stack space="space.300">
						<Stack space="space.200">
							<Text weight="bold">Placement</Text>
							<Inline space="space.200" alignBlock="center">
								<label htmlFor="placement-axis">
									<Text size="small">axis</Text>{' '}
									<select id="placement-axis"
										value={axis}
										onChange={(e) =>
											setAxis(
												e.target.value as NonNullable<TPlacementOptions['axis']>,
											)
										}
										disabled={useLegacy}
										css={styles.select}
									>
										<option value="block">block</option>
										<option value="inline">inline</option>
									</select>
								</label>
								<label htmlFor="placement-edge">
									<Text size="small">edge</Text>{' '}
									<select id="placement-edge"
										value={edge}
										onChange={(e) =>
											setEdge(
												e.target.value as NonNullable<TPlacementOptions['edge']>,
											)
										}
										disabled={useLegacy}
										css={styles.select}
									>
										<option value="start">start</option>
										<option value="end">end</option>
									</select>
								</label>
								<label htmlFor="placement-align">
									<Text size="small">align</Text>{' '}
									<select id="placement-align"
										value={align}
										onChange={(e) =>
											setAlign(
												e.target.value as NonNullable<TPlacementOptions['align']>,
											)
										}
										disabled={useLegacy}
										css={styles.select}
									>
										<option value="start">start</option>
										<option value="center">center</option>
										<option value="end">end</option>
									</select>
								</label>
							</Inline>

							<Inline space="space.100" alignBlock="center">
								<Toggle
									id="legacy-toggle"
									isChecked={useLegacy}
									onChange={handleLegacyToggle}
								/>
								<label htmlFor="legacy-toggle">
									<Text>Use legacy placement</Text>
								</label>
								{useLegacy && (
									<select
										value={legacyPlacement}
										onChange={handleLegacyChange}
										css={styles.select}
									>
										{legacyPlacements.map((p) => (
											<option key={p} value={p}>
												{p}
											</option>
										))}
									</select>
								)}
							</Inline>
						</Stack>

						<div css={styles.demoArea}>
							<Popup
								placement={placement}
								onClose={() => {}}
								forceFallbackPositioning={forceFallbackPositioning}
							>
								<Popup.Trigger>
									<Button>Trigger</Button>
								</Popup.Trigger>
								<Popup.Content role="dialog" label="Placement demo">
									<PopupSurface>
										<Stack space="space.050">
											<Text size="small">axis: {axis}</Text>
											<Text size="small">edge: {edge}</Text>
											<Text size="small">align: {align}</Text>
										</Stack>
									</PopupSurface>
								</Popup.Content>
							</Popup>
						</div>
					</Stack>
				</Box>
			)}
		</ForceFallbackToggle>
	);
}
