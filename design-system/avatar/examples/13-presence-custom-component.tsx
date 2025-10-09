/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
import { Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import tickInlineSvg from '../examples-util/tick.svg';
import WithAllAvatarSizes from '../examples-util/withAllAvatarSizes';

const styles = cssMap({
	presence: {
		alignItems: 'center',
		backgroundColor: token('color.background.discovery.bold'),
		color: token('color.text.inverse'),
		display: 'flex',
		fontSize: '0.75em',
		fontWeight: token('font.weight.medium'),
		height: '100%',
		justifyContent: 'center',
		textAlign: 'center',
		width: '100%',
	},
});

// the raw tick svg is wrapped in " quotation marks so we will clean it:
const cleanTickInlineSvg: string = tickInlineSvg.replace(/"/g, '');

const Tick = () => (
	<img
		alt=""
		src={cleanTickInlineSvg}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={{ height: '100%', width: '100%' }}
	/>
);

export default () => (
	<Stack space="space.200">
		<Text as="p">
			You are able to provide a react element to the <code>presence</code> property. For best
			results, it is recommended that whatever you pass in is square and has its height and width
			set to 100%
		</Text>
		<Stack space="space.050">
			<Heading size="small">SVG</Heading>
			<Text as="p">Using a custom svg as the presence</Text>
			<WithAllAvatarSizes presence={<Tick />} />
			<WithAllAvatarSizes appearance="square" presence={<Tick />} />
			<WithAllAvatarSizes appearance="hexagon" presence={<Tick />} />
		</Stack>
		<Stack space="space.050">
			<Heading size="small">Your own component</Heading>
			<Text as="p">This example shows using a styled div as a presence.</Text>
			<WithAllAvatarSizes presence={<div css={styles.presence}>1</div>} />
			<WithAllAvatarSizes appearance="square" presence={<div css={styles.presence}>1</div>} />
			<WithAllAvatarSizes appearance="hexagon" presence={<div css={styles.presence}>1</div>} />
		</Stack>
	</Stack>
);
