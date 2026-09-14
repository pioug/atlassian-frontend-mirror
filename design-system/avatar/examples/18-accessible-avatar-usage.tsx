import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';
import AvatarItem from '@atlaskit/avatar/avatar-item';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

const containerStyle = {
	padding: token('space.250'),
};

export default (): React.JSX.Element => (
	<>
		{/* These should be replaced by just using a Stack primitive, but can't
    because of a styling issue. See DSP-16480. */}
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={containerStyle}>
			<h2>Decorative images</h2>
			<p>
				Use <code>label=""</code> to mark an avatar as decorative when it is accompanied by a
				visible text label that already identifies the user. Screen readers will skip the avatar
				image.
			</p>
			<Avatar
				src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6Skh_400x400.jpg"
				name="John Smith"
				label=""
				testId="accessible-avatar-decorative"
			/>
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={containerStyle}>
			<h2>Non-Interactive Elements</h2>
			<Avatar name="John Smith" testId="accessible-avatar-1" status="approved" />
			<Avatar name="John Smith" testId="accessible-avatar-1" presence="busy" />
			<AvatarItem
				avatar={<Avatar name="John Smith" status="approved" />}
				testId="accessible-avatar-2"
				primaryText="John Smith"
				secondaryText="ACME co."
			/>
			<AvatarItem
				avatar={<Avatar name="John Smith" presence="busy" />}
				testId="accessible-avatar-2"
				primaryText="John Smith"
				secondaryText="ACME co."
			/>
		</div>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<div style={containerStyle}>
			<h2>Interactive Elements</h2>
			<Tooltip content="John Smith (approved)">
				<Avatar
					name="John Smith"
					onClick={() => {}}
					testId="accessible-avatar-3"
					status="approved"
					label="John Smith (approved)"
				/>
			</Tooltip>
			<Tooltip content="John Smith (busy)">
				<Avatar
					name="John Smith"
					onClick={() => {}}
					testId="accessible-avatar-3"
					presence="busy"
					label="John Smith (busy)"
				/>
			</Tooltip>
			<Tooltip content="John Smith, ACME co. (approved)">
				<AvatarItem
					avatar={<Avatar name="John Smith" status="approved" />}
					onClick={() => {}}
					testId="accessible-avatar-4"
					primaryText="John Smith"
					secondaryText="ACME co."
					label="John Smith, ACME co. (approved)"
				/>
			</Tooltip>
			<Tooltip content="John Smith, ACME co. (busy)">
				<AvatarItem
					avatar={<Avatar name="John Smith" presence="busy" />}
					onClick={() => {}}
					testId="accessible-avatar-4"
					primaryText="John Smith"
					secondaryText="ACME co."
					label="John Smith, ACME co. (busy)"
				/>
			</Tooltip>
		</div>
	</>
);
