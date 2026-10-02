import React from 'react';

import { Box } from '@atlaskit/primitives/compiled/box';
import Tag from '@atlaskit/tag/removable-tag';

export default (): React.JSX.Element => (
	<Box id="simpleTags" role="group" aria-label="Simple tag examples">
		<Tag isRemovable={false} text="standard Tag" color="standard" />
		<Tag isRemovable={false} text="blue Tag" color="blue" />
		<Tag isRemovable={false} text="green Tag" color="green" />
		<Tag isRemovable={false} text="teal Tag" color="teal" />
		<Tag isRemovable={false} text="purple Tag" color="purple" />
		<Tag isRemovable={false} text="red Tag" color="red" />
		<Tag isRemovable={false} text="yellow Tag" color="yellow" />
		<Tag isRemovable={false} text="orange Tag" color="orange" />
		<Tag isRemovable={false} text="magenta Tag" color="magenta" />
		<Tag isRemovable={false} text="lime Tag" color="lime" />
		<Tag isRemovable={false} text="grey Tag" color="grey" />
		<Tag isRemovable={false} text="greenLight Tag" color="greenLight" />
		<Tag isRemovable={false} text="tealLight Tag" color="tealLight" />
		<Tag isRemovable={false} text="blueLight Tag" color="blueLight" />
		<Tag isRemovable={false} text="purpleLight Tag" color="purpleLight" />
		<Tag isRemovable={false} text="redLight Tag" color="redLight" />
		<Tag isRemovable={false} text="yellowLight Tag" color="yellowLight" />
		<Tag isRemovable={false} text="orangeLight Tag" color="orangeLight" />
		<Tag isRemovable={false} text="magentaLight Tag" color="magentaLight" />
		<Tag isRemovable={false} text="limeLight Tag" color="limeLight" />
		<Tag isRemovable={false} text="greyLight Tag" color="greyLight" />
	</Box>
);
