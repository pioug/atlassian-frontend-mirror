/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import { token } from '@atlaskit/tokens';
import { type Avatar } from '../src';
import { AvatarList } from '../src/avatar-list';
import { PredefinedAvatarList } from '../src/predefined-avatar-list';
import { PredefinedAvatarView } from '../src/predefined-avatar-view';

import { generateAvatars } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

const avatars: Array<Avatar> = generateAvatars(5);

const wrapperStyles = css({
	marginTop: token('space.100', '8px'),
	marginRight: token('space.100', '8px'),
	marginBottom: token('space.100', '8px'),
	marginLeft: token('space.100', '8px'),
});

export default () => (
	<IntlProvider locale="en">
		<div>
			<div>
				<h1>Avatar List</h1>
				<div css={wrapperStyles}>
					<AvatarList avatars={avatars} />
				</div>
			</div>
			<div>
				<h1>Predefined Avatars (none preselected)</h1>
				<div css={wrapperStyles}>
					<PredefinedAvatarList
						avatars={avatars}
						onAvatarSelected={() => {
							console.log('onAvatarSelected');
						}}
					/>
				</div>
			</div>
			<div>
				<h1>Predefined Avatars (preselected)</h1>
				<div css={wrapperStyles}>
					<PredefinedAvatarList
						avatars={avatars}
						selectedAvatar={avatars[2]}
						onAvatarSelected={() => {
							console.log('onAvatarSelected');
						}}
					/>
				</div>
			</div>
			<div>
				<h1>Predefined Avatar View</h1>
				<div css={wrapperStyles}>
					<PredefinedAvatarView
						avatars={generateAvatars()}
						onAvatarSelected={() => {
							console.log('onAvatarSelected');
						}}
					/>
				</div>
			</div>
		</div>
	</IntlProvider>
);
