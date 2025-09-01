/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import { Box, Inline, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	card: {
		flex: '1',
		borderRadius: token('radius.large'),
		overflowX: 'auto',
		paddingBlock: token('space.100'),
		paddingInline: token('space.150'),
		backgroundColor: token('color.background.neutral'),
	},
	cardInner: {
		minWidth: '1rem',
	},
	cardContent: {
		alignSelf: 'center',
	},
	middleLayer: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
	},
	foreground: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
	},
	valueList: {
		paddingInline: 0,
		paddingBlock: 0,
		marginBlock: 0,
		marginInline: 0,
		display: 'flex',
		flexFlow: 'row',
		gap: token('space.200'),
	},
	valueListWithName: {
		paddingBlock: token('space.100'),
	},
	valueListItemDescription: {
		textTransform: 'capitalize',
	},
	valueListItemValue: {
		marginTop: 0,
		marginInlineStart: 0,
	},
	valueListItemValueText: {
		margin: 0,
	},
});

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
			<Box xcss={styles.card}>
				<Box xcss={styles.cardInner}>
					<Inline space="space.150">
						<div
							css={styles.cardContent}
							style={{
								backgroundColor: backgroundValue,
							}}
						>
							<div
								css={styles.middleLayer}
								style={{
									backgroundColor: middleLayerValue || 'transparent',
								}}
							>
								<div
									css={styles.foreground}
									style={{
										backgroundColor: foregroundValue,
									}}
								/>
							</div>
						</div>

						<Stack space="space.050">
							<code>{foregroundName}</code>
							{middleLayerName && <code>{middleLayerName}</code>}
							<code>{backgroundName}</code>
							<dl css={[styles.valueList, middleLayerName && styles.valueListWithName]}>
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
			<strong css={styles.valueListItemDescription}>{description}</strong>
		</dt>
		<dd css={styles.valueListItemValue}>
			<p css={styles.valueListItemValueText}>{value}</p>
		</dd>
	</Inline>
);
