/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Avatar, { AvatarContent } from '@atlaskit/avatar';
import { css, jsx } from '@atlaskit/css';
import PeopleGroupIcon from '@atlaskit/icon/core/migration/people-group';
import { token } from '@atlaskit/tokens';

const styles = {
	iconContainer: css({
		display: 'grid',
		height: '100%',
		backgroundColor: token('elevation.surface'),
		placeItems: 'center',
	}),
};

function AvatarContentExample() {
	return (
		<Avatar size="large" borderColor={token('color.background.brand.bold')}>
			<AvatarContent>
				<div css={styles.iconContainer}>
					<PeopleGroupIcon label="More users" />
				</div>
			</AvatarContent>
		</Avatar>
	);
}

export default AvatarContentExample;
