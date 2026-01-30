/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
/* eslint-disable @atlaskit/platform/use-entrypoints-in-examples */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import Heading from '@atlaskit/heading';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import BadgeNew from '../src/badge-new';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.300', '24px'),
		paddingInlineEnd: token('space.300', '24px'),
		paddingBlockEnd: token('space.300', '24px'),
		paddingInlineStart: token('space.300', '24px'),
		maxWidth: '800px',
	},
	card: {
		paddingBlockStart: token('space.200', '16px'),
		paddingInlineEnd: token('space.200', '16px'),
		paddingBlockEnd: token('space.200', '16px'),
		paddingInlineStart: token('space.200', '16px'),
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.small', '3px'),
		marginBlockEnd: token('space.200', '16px'),
	},
	title: {
		fontWeight: token('font.weight.bold'),
		fontSize: '16px',
		marginBlockEnd: token('space.100', '8px'),
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
		gap: token('space.200', '16px'),
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingBlockStart: token('space.100', '8px'),
		paddingInlineEnd: token('space.100', '8px'),
		paddingBlockEnd: token('space.100', '8px'),
		paddingInlineStart: token('space.100', '8px'),
		backgroundColor: token('color.background.neutral'),
		borderRadius: token('radius.small', '3px'),
	},
	invertedBox: {
		backgroundColor: token('color.background.brand.bold'),
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderRadius: token('radius.xsmall', '2px'),
	},
});

export default function BadgeVisualUplifts(): JSX.Element {
	return (
		<div css={styles.container}>
			<div css={styles.card}>
				<Heading size="large">📊 All Appearances</Heading>
				<div css={styles.grid}>
					<div css={styles.item}>
						<span>added</span>
						<Badge appearance="added">{5}</Badge>
					</div>
					<div css={styles.item}>
						<span>default</span>
						<Badge appearance="default">{10}</Badge>
					</div>
					<div css={styles.item}>
						<span>important</span>
						<Badge appearance="important">{25}</Badge>
					</div>
					<div css={styles.item}>
						<span>primary</span>
						<Badge appearance="primary">{15}</Badge>
					</div>
					<div css={styles.item}>
						<span>removed</span>
						<Badge appearance="removed">{99}</Badge>
					</div>
					<Box xcss={styles.invertedBox}>
						<Inline space="space.100" alignBlock="center">
							<span style={{ color: token('color.text.inverse') }}>primaryInverted</span>
							<Badge appearance="primaryInverted">{8}</Badge>
						</Inline>
					</Box>
				</div>

				<div css={styles.card}>
					<Heading size="medium">✨ New Appearances (Warning & Discovery)</Heading>
					<p style={{ marginBottom: token('space.200', '16px') }}>
						These appearances are only available in BadgeNew with the visual refresh.
					</p>
					<div css={styles.grid}>
						<div css={styles.item}>
							<span>warning</span>
							<BadgeNew appearance="warning">{35}</BadgeNew>
						</div>
						<div css={styles.item}>
							<span>discovery</span>
							<BadgeNew appearance="discovery">{40}</BadgeNew>
						</div>
					</div>
				</div>
			</div>

			<div css={styles.card}>
				<Heading size="large">🔢 With Max Values</Heading>
				<div css={styles.grid}>
					<div css={styles.item}>
						<span>max=99 (default)</span>
						<Badge appearance="added">{150}</Badge>
					</div>
					<div css={styles.item}>
						<span>max=999</span>
						<Badge appearance="primary" max={999}>
							{2000}
						</Badge>
					</div>
					<div css={styles.item}>
						<span>max=false</span>
						<Badge appearance="important" max={false}>
							{9999}
						</Badge>
					</div>
				</div>
			</div>

			<div css={styles.card}>
				<Heading size="large">📏 What Changes with Feature Flag?</Heading>
				<ul>
					<li>
						<strong>Appearance Names:</strong> Internal mapping to new names (API stays the same)
					</li>
					<li>
						<strong>Colors:</strong> New color values
					</li>
				</ul>
			</div>

			<div css={styles.card}>
				<Heading size="large">🧪 Appearance Mapping Reference</Heading>
				<table
					style={{
						width: '100%',
						borderCollapse: 'collapse',
						fontSize: '14px',
					}}
				>
					<thead>
						<tr style={{ borderBottom: `2px solid ${token('color.border')}` }}>
							<th style={{ padding: '8px', textAlign: 'left' }}>Old Name (Public API)</th>
							<th style={{ padding: '8px', textAlign: 'left' }}>New Name (Internal)</th>
							<th style={{ padding: '8px', textAlign: 'left' }}>Preview</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style={{ padding: '8px' }}>added</td>
							<td style={{ padding: '8px' }}>success</td>
							<td style={{ padding: '8px' }}>
								<Badge appearance="added">{5}</Badge>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>removed</td>
							<td style={{ padding: '8px' }}>danger</td>
							<td style={{ padding: '8px' }}>
								<Badge appearance="removed">{10}</Badge>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>default</td>
							<td style={{ padding: '8px' }}>neutral</td>
							<td style={{ padding: '8px' }}>
								<Badge appearance="default">{15}</Badge>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>primary</td>
							<td style={{ padding: '8px' }}>information</td>
							<td style={{ padding: '8px' }}>
								<Badge appearance="primary">{20}</Badge>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>primaryInverted</td>
							<td style={{ padding: '8px' }}>inverse</td>
							<td style={{ padding: '8px' }}>
								<Box xcss={styles.invertedBox}>
									<Badge appearance="primaryInverted">{25}</Badge>
								</Box>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>important</td>
							<td style={{ padding: '8px' }}>danger</td>
							<td style={{ padding: '8px' }}>
								<Badge appearance="important">{30}</Badge>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }} colSpan={2}>
								<strong>New appearances (BadgeNew only):</strong>
							</td>
							<td style={{ padding: '8px' }}></td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>-</td>
							<td style={{ padding: '8px' }}>warning</td>
							<td style={{ padding: '8px' }}>
								<BadgeNew appearance="warning">{35}</BadgeNew>
							</td>
						</tr>
						<tr>
							<td style={{ padding: '8px' }}>-</td>
							<td style={{ padding: '8px' }}>discovery</td>
							<td style={{ padding: '8px' }}>
								<BadgeNew appearance="discovery">{40}</BadgeNew>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
