// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import tickInlineSvg from '../examples-util/tick.svg';
import WithAllAvatarSizes from '../examples-util/withAllAvatarSizes';

// the raw tick svg is wrapped in " quotation marks so we will clean it:
const cleanTickInlineSvg: string = tickInlineSvg.replace(/"/g, '');

const Tick = () => (
	<img
		alt=""
		src={cleanTickInlineSvg}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={{ height: '100%', width: '100%' }}
	/>
);

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const DivPresence = styled.div({
	alignItems: 'center',
	backgroundColor: token('color.background.discovery.bold'),
	color: token('color.text.inverse'),
	display: 'flex',
	fontSize: '0.75em',
	fontWeight: 500,
	height: '100%',
	justifyContent: 'center',
	textAlign: 'center',
	width: '100%',
});

export default () => (
	<div>
		<p>
			You are able to provide a react element to the <code>presence</code> property. For best
			results, it is recommended that whatever you pass in is square and has its height and width
			set to 100%
		</p>
		<h4>SVG</h4>
		<p>Using a custom svg as the presence</p>
		<WithAllAvatarSizes presence={<Tick />} />
		<WithAllAvatarSizes appearance="square" presence={<Tick />} />
		<h4>Your own component</h4>
		<p>This example shows using a styled div as a presence.</p>
		<WithAllAvatarSizes presence={<DivPresence>1</DivPresence>} />
		<WithAllAvatarSizes appearance="square" presence={<DivPresence>1</DivPresence>} />
	</div>
);
