import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Box } from '@atlaskit/primitives/compiled';
import Tag, { AvatarTag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';

export default (): React.JSX.Element => (
	<Box role="group" aria-label="Overview examples">
		<Tag text="Text only" isRemovable={false} />
		<Tag href="https://some.link" text="Linked text" isRemovable={false} />
		<Tag text="Removable" removeButtonLabel="Remove me" />
		<Tag href="https://some.link" text="Removable & linked" removeButtonLabel="Remove me" />
		<Tag text="Overflowing text that will be cut off" />
		<Tag text="Text with button that will be cut off" removeButtonLabel="Remove me" />
		<AvatarTag
			type="user"
			text="A. Cool Name"
			avatar={(props: any) => <Avatar {...props} />}
			removeButtonLabel="Remove me"
		/>
		<AvatarTag
			type="user"
			href="https://some.link"
			text="A. Cool Name"
			avatar={(props: any) => <Avatar {...props} />}
			removeButtonLabel="Remove me"
		/>
		<AvatarTag
			type="other"
			text="Design System Team"
			avatar={(props: any) => <TeamAvatar {...props} name="Design System Team" />}
			removeButtonLabel="Remove me"
		/>
		<AvatarTag
			type="other"
			href="https://some.link"
			text="Engineering Team"
			avatar={(props: any) => <TeamAvatar {...props} name="Engineering Team" />}
			removeButtonLabel="Remove me"
		/>
		<Tag text="standard color" color="standard" isRemovable={false} />
		<Tag text="green color" color="green" isRemovable={false} />
		<Tag text="teal color" color="teal" isRemovable={false} />
		<Tag text="blue color" color="blue" isRemovable={false} />
		<Tag text="purple color" color="purple" isRemovable={false} />
		<Tag text="red color" color="red" isRemovable={false} />
		<Tag text="yellow color" color="yellow" isRemovable={false} />
		<Tag text="grey color" color="grey" isRemovable={false} />
		<Tag text="greenLight color" color="greenLight" isRemovable={false} />
		<Tag text="tealLight color" color="tealLight" isRemovable={false} />
		<Tag text="blueLight color" color="blueLight" isRemovable={false} />
		<Tag text="purpleLight color" color="purpleLight" isRemovable={false} />
		<Tag text="redLight color" color="redLight" isRemovable={false} />
		<Tag text="yellowLight color" color="yellowLight" isRemovable={false} />
		<Tag text="greyLight color" color="greyLight" isRemovable={false} />

		<Tag text="red color" color="red" href="https://atlaskit.atlassian.com/" isRemovable={false} />
		<Tag
			text="yellow color"
			color="yellow"
			href="https://atlaskit.atlassian.com/"
			isRemovable={false}
		/>
		<Tag
			text="grey color"
			color="grey"
			href="https://atlaskit.atlassian.com/"
			isRemovable={false}
		/>
		<Tag
			text="greenLight color"
			color="greenLight"
			href="https://atlaskit.atlassian.com/"
			isRemovable={false}
		/>
		<Tag
			text="tealLight color"
			color="tealLight"
			href="https://atlaskit.atlassian.com/"
			isRemovable={false}
		/>
		<Tag
			text="blueLight color"
			color="blueLight"
			href="https://atlaskit.atlassian.com/"
			isRemovable={false}
		/>

		<Tag isRemovable text="blue color" color="blue" />
		<Tag
			text="blue color"
			color="blue"
			href="https://atlaskit.atlassian.com/"
			isRemovable={false}
		/>
	</Box>
);
