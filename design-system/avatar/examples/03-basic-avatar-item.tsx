import React from 'react';

import Avatar, { AvatarItem, type PresenceType, type StatusType } from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';

import { RANDOM_USERS } from '../examples-util/data';

const presenceOptions: PresenceType[] = ['online', 'busy', 'focus', 'offline'];
const statusOptions: StatusType[] = ['approved', 'declined', 'locked'];

const presenceOptionsLength = presenceOptions.length;
const statusOptionsLength = statusOptions.length;

export default () => {
	const data = RANDOM_USERS.slice(0, presenceOptionsLength + statusOptionsLength).map((user, i) => {
		const presence = presenceOptions[i % presenceOptionsLength];
		const status = i > statusOptionsLength ? statusOptions[i % statusOptionsLength] : undefined;
		return {
			...user,
			presence,
			status,
			label: `${user.name} ${user.email} (${status || presence})`,
		};
	});

	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div id="avatar-item-examples" style={{ display: 'flex' }}>
			<div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ maxWidth: 270, padding: token('space.250', '20px') }}>
					<h1>onClick</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={<Avatar name={user.name} presence={user.presence} status={user.status} />}
							key={user.email}
							onClick={console.log}
							primaryText={user.name}
							secondaryText={user.email}
							testId={`avataritem-onClick-${index}`}
							label={user.label}
						/>
					))}
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ maxWidth: 270, padding: token('space.250', '20px') }}>
					<h1>href</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={<Avatar name={user.name} presence={user.presence} status={user.status} />}
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
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ maxWidth: 270, padding: token('space.250', '20px') }}>
					<h1>non-interactive</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={<Avatar name={user.name} presence={user.presence} status={user.status} />}
							key={user.email}
							primaryText={user.name}
							secondaryText={user.email}
							testId={`avataritem-non-interactive-${index}`}
							label={user.label}
						/>
					))}
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ maxWidth: 270, padding: token('space.250', '20px') }}>
					<h1>disabled</h1>
					{data.map((user, index) => (
						<AvatarItem
							avatar={<Avatar name={user.name} presence={user.presence} status={user.status} />}
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
