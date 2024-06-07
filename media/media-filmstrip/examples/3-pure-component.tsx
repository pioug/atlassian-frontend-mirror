import React from 'react';
import { FilmstripView } from '../src/filmstripView';
import { type FilmstripState } from '../src';
import { PureComponentBox } from '../example-helpers/wrapper';

export interface StoryProps {}

export interface StoryState {
	animate: boolean;
	offset: number;
}

export class Story extends React.PureComponent<StoryProps, StoryState> {
	state: StoryState = {
		animate: false,
		offset: 0,
	};

	handleSizeChange = ({ offset }: Pick<FilmstripState, 'offset'>) => this.setState({ offset });
	handleScrollChange = ({ offset, animate }: FilmstripState) => this.setState({ offset, animate });

	render() {
		const { animate, offset } = this.state;
		return (
			<div>
				<h1>In a PureComponent</h1>
				<p>
					This story renders a filmstrip inside a React.PureComponent to assert that the state
					updates correctly. There once was a bug in filmstrip that resulted in the smart-card not
					displaying the arrows. See{' '}
					<a href="https://product-fabric.atlassian.net/browse/MSW-181">MSW-181</a>.
				</p>
				<FilmstripView
					animate={animate}
					offset={offset}
					onSize={this.handleSizeChange}
					onScroll={this.handleScrollChange}
				>
					<PureComponentBox />
					<PureComponentBox />
					<PureComponentBox />
					<PureComponentBox />
					<PureComponentBox />
					<PureComponentBox />
					<PureComponentBox />
				</FilmstripView>
			</div>
		);
	}
}

export default () => <Story />;
