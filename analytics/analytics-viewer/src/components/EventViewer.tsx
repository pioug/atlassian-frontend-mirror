import React from 'react';

import { token } from '@atlaskit/tokens';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';

import { PropertyViewer } from './PropertyViewer';

export type Event = {
	channel?: string;
	event: UIAnalyticsEvent;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const EventViewerWrapper = styled.li({
	font: token('font.body.UNSAFE_small'),
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	padding: '3px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& span:first-child': {
		marginLeft: 0,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'& span:last-child': {
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		marginLeft: '5px',
	},
});

export class EventViewer extends React.PureComponent<Event, { showMore: boolean }> {
	constructor(props: Event) {
		super(props);
		this.state = {
			showMore: false,
		};
	}

	private handleMoreClick = () => {
		this.setState((state) => ({
			showMore: !state.showMore,
		}));
	};

	render() {
		const { event } = this.props;
		return (
			<EventViewerWrapper>
				<PropertyViewer object={this.props} property="channel" />
				<PropertyViewer object={event.payload} property="action" />
				<PropertyViewer object={event.payload} property="actionSubject" />
				<PropertyViewer object={event.payload} property="actionSubjectId" />
				<PropertyViewer object={event.payload} property="type" />
				{this.state.showMore &&
					Object.keys(event.payload.attributes).map((attribute) => (
						<PropertyViewer
							key={attribute}
							object={event.payload.attributes}
							property={attribute}
						/>
					))}
				<span>
					{/* eslint-disable-next-line @atlassian/a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlaskit/design-system/no-html-anchor */}
					<a onClick={this.handleMoreClick}>{this.state.showMore ? 'less' : 'more'}...</a>
				</span>
			</EventViewerWrapper>
		);
	}
}
