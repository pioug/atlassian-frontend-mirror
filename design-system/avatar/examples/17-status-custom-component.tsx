/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Avatar from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { Block } from '../examples-util/helpers';

const styles = cssMap({
	presence: {
		alignItems: 'center',
		backgroundColor: token('color.background.discovery.bold'),
		color: token('elevation.surface'),
		display: 'flex',
		font: token('font.body.small'),
		fontWeight: token('font.weight.medium'),
		height: '100%',
		justifyContent: 'center',
		textAlign: 'center',
		width: '100%',
	},
});

export default () => (
	<Block heading="Custom div as status">
		<Avatar
			name="xxlarge"
			size="xxlarge"
			appearance="square"
			status={<div css={styles.presence}>1</div>}
		/>
		<Avatar
			name="xlarge"
			size="xlarge"
			appearance="square"
			status={<div css={styles.presence}>1</div>}
		/>
		<Avatar
			name="large"
			size="large"
			appearance="square"
			status={<div css={styles.presence}>1</div>}
		/>
		<Avatar
			name="medium"
			size="medium"
			appearance="square"
			status={<div css={styles.presence}>1</div>}
		/>
		<Avatar
			name="small"
			size="small"
			appearance="square"
			status={<div css={styles.presence}>1</div>}
		/>
		<Avatar
			name="xsmall"
			size="xsmall"
			appearance="square"
			status={<div css={styles.presence}>1</div>}
		/>
	</Block>
);
