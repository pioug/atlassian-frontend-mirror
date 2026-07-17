import React from 'react';

import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';

export default (): React.JSX.Element => (
	<TagGroup label="Colored tags">
		<Tag text="standard Tag" color="standard" isRemovable={false} />
		<Tag text="blue Tag" color="blue" isRemovable={false} />
		<Tag text="green Tag" color="green" isRemovable={false} />
		<Tag text="teal Tag" color="teal" isRemovable={false} />
		<Tag text="purple Tag" color="purple" isRemovable={false} />
		<Tag text="red Tag" color="red" isRemovable={false} />
		<Tag text="yellow Tag" color="yellow" isRemovable={false} />
		<Tag text="orange Tag" color="orange" isRemovable={false} />
		<Tag text="magenta Tag" color="magenta" isRemovable={false} />
		<Tag text="lime Tag" color="lime" isRemovable={false} />
		<Tag text="grey Tag" color="grey" isRemovable={false} />
		<Tag text="greenLight Tag" color="greenLight" isRemovable={false} />
		<Tag text="tealLight Tag" color="tealLight" isRemovable={false} />
		<Tag text="blueLight Tag" color="blueLight" isRemovable={false} />
		<Tag text="purpleLight Tag" color="purpleLight" isRemovable={false} />
		<Tag text="redLight Tag" color="redLight" isRemovable={false} />
		<Tag text="yellowLight Tag" color="yellowLight" isRemovable={false} />
		<Tag text="orangeLight Tag" color="orangeLight" isRemovable={false} />
		<Tag text="magentaLight Tag" color="magentaLight" isRemovable={false} />
		<Tag text="limeLight Tag" color="limeLight" isRemovable={false} />
		<Tag text="greyLight Tag" color="greyLight" isRemovable={false} />
	</TagGroup>
);
