import React from 'react';

import { easeIn, easeInOut, easeOut, linear } from '@atlaskit/motion';

import { MovesRightBlock } from './utils/blocks';

export default () => {
	return (
		<div>
			<h1>Curves</h1>
			<h2>Ease In</h2>
			<MovesRightBlock duration={1000} curve={easeIn} />
			<h2>Ease Out</h2>
			<MovesRightBlock duration={1000} curve={easeOut} />
			<h2>Ease In Out</h2>
			<MovesRightBlock duration={1000} curve={easeInOut} />
			<h2>Linear</h2>
			<MovesRightBlock duration={1000} curve={linear} />
		</div>
	);
};
