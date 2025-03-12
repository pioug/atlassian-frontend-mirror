/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Avatar, { AvatarContent } from '@atlaskit/avatar';
import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Block } from '../examples-util/helpers';

const styles = {
	custom: css({
		color: token('color.text.inverse'),
		fontWeight: token('font.weight.semibold'),
		textAlign: 'center',
	}),
};

export default () => (
	<Block heading="Circle">
		<Tooltip content="Mike Cannon-Brookes">
			<Avatar
				name="Mike Cannon-Brookes"
				size="large"
				borderColor={token('color.background.brand.bold')}
			>
				<AvatarContent>
					<span css={styles.custom}>MCB</span>
				</AvatarContent>
			</Avatar>
		</Tooltip>
		<Tooltip content="Scott Farquhar">
			<Avatar
				name="Scott Farquhar"
				size="large"
				onClick={() => {
					console.log('onClick');
				}}
				borderColor={token('color.background.brand.bold')}
			>
				<AvatarContent>
					<span css={styles.custom}>SF</span>
				</AvatarContent>
			</Avatar>
		</Tooltip>
	</Block>
);
