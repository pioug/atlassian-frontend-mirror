/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';

import { token } from '../../../src';

/**
 * Card for displaying a single pairing and its contrast
 */
export default function ContrastCard({
	foregroundName,
	middleLayerName,
	backgroundName,
	foregroundValue,
	middleLayerValue,
	backgroundValue,
	baseThemeType,
	contrastBase,
	contrastCustom,
	style,
}: {
	foregroundName: string;
	middleLayerName?: string;
	backgroundName: string;
	foregroundValue: string;
	middleLayerValue?: string;
	backgroundValue: string;
	baseThemeType: string;
	contrastBase: string;
	contrastCustom?: string;
	style: any;
}) {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<li style={{ listStyleType: 'none', padding: 0, ...style }}>
			<Box
				paddingBlock="space.100"
				paddingInline="space.150"
				backgroundColor="color.background.neutral"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				xcss={xcss({
					flex: '1',
					borderRadius: 'border.radius.200',
					overflowX: 'auto',
				})}
			>
				<Box
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					xcss={xcss({
						minWidth: 'size.100',
					})}
				>
					<Inline space="space.150">
						<div
							css={{
								backgroundColor: backgroundValue,
								alignSelf: 'center',
							}}
						>
							<div
								css={{
									backgroundColor: middleLayerValue || 'transparent',
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									padding: token('space.150', '0.75rem'),
								}}
							>
								<div
									css={{
										backgroundColor: foregroundValue,
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
										padding: token('space.150', '0.75rem'),
									}}
								/>
							</div>
						</div>

						<Stack space="space.050">
							<code>{foregroundName}</code>
							{middleLayerName && <code>{middleLayerName}</code>}
							<code>{backgroundName}</code>
							<dl
								css={{
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									paddingBlock: middleLayerName ? token('space.100', '8px') : 0,
									paddingInline: 0,
									margin: 0,
									display: 'flex',
									flexFlow: 'row',
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									gap: token('space.200', '16px'),
								}}
							>
								<ValueListItem
									description={`${baseThemeType}:`}
									value={middleLayerName ? `~ ${contrastBase} ± 0.05` : contrastBase}
								/>
								{contrastCustom && (
									<ValueListItem
										description="Custom:"
										value={middleLayerName ? `${contrastCustom} ± ~0.05` : contrastCustom}
									/>
								)}
							</dl>
						</Stack>
					</Inline>
				</Box>
			</Box>
		</li>
	);
}

const ValueListItem = ({ description, value }: { description: string; value?: string }) => (
	<Inline spread="space-between" space="space.100">
		<dt>
			<strong css={{ textTransform: 'capitalize' }}>{description}</strong>
		</dt>
		<dd css={{ marginTop: 0, marginInlineStart: 0 }}>
			<p css={{ margin: 0 }}>{value}</p>
		</dd>
	</Inline>
);
