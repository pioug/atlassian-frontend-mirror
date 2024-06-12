// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React, { type FC, useState } from 'react';

import { Label } from '@atlaskit/form';
import Range from '@atlaskit/range';

import { Note } from '../examples-util/helpers';
import { Presence } from '../src';

const PresenceWidthExample: FC = () => {
	const [width, setWidth] = useState(60);

	return (
		<div>
			<Note>
				<p>
					By default presences will <strong>stretch</strong> to fill their parents. Try resizing the
					wrapping div below to see this in action.
				</p>
				<p>
					Therefore it is <strong>recommended to always</strong> have a wrapping div around
					presences when consuming them separately to Avatars.
				</p>
			</Note>
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

			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ maxWidth: width, border: '1px dotted blue' }}>
				<Presence presence="busy" />
			</div>
		</div>
	);
};

export default PresenceWidthExample;
