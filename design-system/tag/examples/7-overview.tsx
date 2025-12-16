import React from 'react';

import Avatar from '@atlaskit/avatar';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import Tag, { AvatarTag, SimpleTag } from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<Box role="group" aria-label="Overview examples">
		<SimpleTag text="Text only" />
		<SimpleTag href="https://some.link" text="Linked text" />
		<Tag text="Removable" removeButtonLabel="Remove me" />
		<Tag href="https://some.link" text="Removable & linked" removeButtonLabel="Remove me" />
		<Tag text="Overflowing text that will be cut off" />
		<Tag text="Text with button that will be cut off" removeButtonLabel="Remove me" />
		<AvatarTag text="A. Cool Name" avatar={Avatar} removeButtonLabel="Remove me" />
		<AvatarTag
			href="https://some.link"
			text="A. Cool Name"
			avatar={Avatar}
			removeButtonLabel="Remove me"
		/>
		<SimpleTag text="standard color" color="standard" />
		<SimpleTag text="green color" color="green" />
		<SimpleTag text="teal color" color="teal" />
		<SimpleTag text="blue color" color="blue" />
		<SimpleTag text="purple color" color="purple" />
		<SimpleTag text="red color" color="red" />
		<SimpleTag text="yellow color" color="yellow" />
		<SimpleTag text="grey color" color="grey" />
		<SimpleTag text="greenLight color" color="greenLight" />
		<SimpleTag text="tealLight color" color="tealLight" />
		<SimpleTag text="blueLight color" color="blueLight" />
		<SimpleTag text="purpleLight color" color="purpleLight" />
		<SimpleTag text="redLight color" color="redLight" />
		<SimpleTag text="yellowLight color" color="yellowLight" />
		<SimpleTag text="greyLight color" color="greyLight" />

		<SimpleTag text="red color" color="red" href="https://atlaskit.atlassian.com/" />
		<SimpleTag text="yellow color" color="yellow" href="https://atlaskit.atlassian.com/" />
		<SimpleTag text="grey color" color="grey" href="https://atlaskit.atlassian.com/" />
		<SimpleTag text="greenLight color" color="greenLight" href="https://atlaskit.atlassian.com/" />
		<SimpleTag text="tealLight color" color="tealLight" href="https://atlaskit.atlassian.com/" />
		<SimpleTag text="blueLight color" color="blueLight" href="https://atlaskit.atlassian.com/" />

		<Tag isRemovable text="blue color" color="blue" />
		<SimpleTag text="blue color" color="blue" href="https://atlaskit.atlassian.com/" />
	</Box>
);
