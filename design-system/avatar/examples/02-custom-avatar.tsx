import React, { type CSSProperties } from 'react';

import Avatar from '@atlaskit/avatar';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { Block } from '../examples-util/helpers';

const customStyles: CSSProperties = {
	textAlign: 'center',
	fontWeight: token('font.weight.semibold'),
	color: token('color.text.inverse'),
	backgroundColor: token('color.background.brand.bold'),
};

export default () => (
	<Block heading="Circle">
		<Tooltip content="Mike Cannon-Brookes">
			<Avatar name="Mike Cannon-Brookes" size="large">
				{(props) => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<span {...props} style={customStyles}>
						MCB
					</span>
				)}
			</Avatar>
		</Tooltip>
		<Tooltip content="Scott Farquhar">
			<Avatar name="Scott Farquhar" size="large">
				{(props) => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<span {...props} style={customStyles}>
						SF
					</span>
				)}
			</Avatar>
		</Tooltip>
		<Tooltip content="Daniel Del Core">
			<Avatar name="Daniel Del Core" size="large">
				{({ children, ...props }) => (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<span {...props} style={customStyles}>
						DDC
					</span>
				)}
			</Avatar>
		</Tooltip>
	</Block>
);
