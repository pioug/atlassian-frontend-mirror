import React from 'react';
import { StoryList } from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import {
	resizingDefaultCards,
	croppedCards,
	fitCards,
	fullFitCards,
	stretchyFitCards,
} from '../example-helpers/cards';

export default (): React.JSX.Element => (
	<MainWrapper>
		<div>
			<h3>Default</h3>
			<StoryList>{resizingDefaultCards}</StoryList>
			<h3>Crop</h3>
			<StoryList>{croppedCards}</StoryList>
			<h3>Fit</h3>
			<StoryList>{fitCards}</StoryList>
			<h3>Full Fit</h3>
			<StoryList>{fullFitCards}</StoryList>
			<h3>Stretchy Fit</h3>
			<StoryList>{stretchyFitCards}</StoryList>
		</div>
	</MainWrapper>
);
