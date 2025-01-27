import React, { type FC, useState } from 'react';

import { Presence } from '@atlaskit/avatar';
import { Label } from '@atlaskit/form';
import { Stack, Text } from '@atlaskit/primitives';
import Range from '@atlaskit/range';

const PresenceWidthExample: FC = () => {
	const [width, setWidth] = useState(60);

	return (
		<Stack space="space.200">
			<Text color="color.text.subtlest">
				<Text as="p">
					By default presences will <Text as="strong">stretch</Text> to fill their parents. Try
					resizing the wrapping div below to see this in action.
				</Text>
				<Text as="p">
					Therefore it is <Text as="strong">recommended to always</Text> have a wrapping div around
					presences when consuming them separately to Avatars.
				</Text>
			</Text>
			<Stack>
				<Label htmlFor="width">Width</Label>
				<Range
					id="width"
					min={10}
					max={130}
					onChange={(n) => setWidth(n)}
					step={10}
					title="Width"
					value={width}
				/>
			</Stack>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: width, border: '1px dotted blue' }}>
				<Presence presence="busy" />
			</div>
		</Stack>
	);
};

export default PresenceWidthExample;
