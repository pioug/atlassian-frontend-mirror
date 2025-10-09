/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import Avatar, {
	type AppearanceType,
	AvatarItem,
	type PresenceType,
	type StatusType,
} from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { RANDOM_USERS } from '../examples-util/data';

const presenceOptions: PresenceType[] = ['online', 'busy', 'focus', 'offline'];
const statusOptions: StatusType[] = ['approved', 'declined', 'locked'];
const appearanceOptions: AppearanceType[] = ['circle', 'square', 'hexagon'];

const styles = cssMap({
	container: { display: 'flex' },
	column: {
		maxWidth: 270,
		paddingBlockStart: token('space.250'),
		paddingInlineEnd: token('space.250'),
		paddingBlockEnd: token('space.250'),
		paddingInlineStart: token('space.250'),
	},
});

export default () => {
	const data = RANDOM_USERS.slice(0, presenceOptions.length + statusOptions.length).map(
		(user, i) => {
			const presence = presenceOptions[i % presenceOptions.length];
			const status = i > statusOptions.length ? statusOptions[i % statusOptions.length] : undefined;
			return {
				...user,
				presence,
				status,
				label: `${user.name} ${user.email} (${status || presence})`,
			};
		},
	);

	return (
		<div id="avatar-item-examples" css={styles.container}>
			<div>
				<div css={styles.column}>
					<h1>onClick</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={
								<Avatar
									name={user.name}
									presence={user.presence}
									status={user.status}
									appearance={appearanceOptions[index % appearanceOptions.length]}
								/>
							}
							key={user.email}
							onClick={console.log}
							primaryText={user.name}
							secondaryText={user.email}
							testId={`avataritem-onClick-${index}`}
							label={user.label}
						/>
					))}
				</div>

				<div css={styles.column}>
					<h1>href</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={
								<Avatar
									name={user.name}
									presence={user.presence}
									appearance={appearanceOptions[index % appearanceOptions.length]}
									status={user.status}
								/>
							}
							key={user.email}
							href="#"
							primaryText={user.name}
							secondaryText={user.email}
							testId={`avataritem-href-${index}`}
							label={user.label}
						/>
					))}
				</div>
			</div>
			<div>
				<div css={styles.column}>
					<h1>non-interactive</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={
								<Avatar
									name={user.name}
									presence={user.presence}
									status={user.status}
									appearance={appearanceOptions[index % appearanceOptions.length]}
								/>
							}
							key={user.email}
							primaryText={user.name}
							secondaryText={user.email}
							testId={`avataritem-non-interactive-${index}`}
							label={user.label}
						/>
					))}
				</div>

				<div css={styles.column}>
					<h1>disabled</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={
								<Avatar
									name={user.name}
									presence={user.presence}
									appearance={appearanceOptions[index % appearanceOptions.length]}
									status={user.status}
								/>
							}
							key={user.email}
							primaryText={user.name}
							secondaryText={user.email}
							href="#"
							testId={`avataritem-disabled-${index}`}
							label={user.label}
							isDisabled
						/>
					))}
				</div>
			</div>
		</div>
	);
};
