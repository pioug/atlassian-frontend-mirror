import { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import styled from 'styled-components';
import { AnalyticsViewer, type EventsArray } from './AnalyticsViewer';

type Props = {
	children: React.ReactNode;
	channel?: string;
};

type State = {
	events: EventsArray;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const ChildrenWrapper = styled.div({
	flexGrow: 1,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const StyledAnalyticsViewer = styled(AnalyticsViewer)({
	flexGrow: 0,
	flexShrink: 1,
	height: '100px',
	overflowY: 'scroll',
});

export class AnalyticsViewerContainer extends React.Component<Props, State> {
	static defaultProps = {
		channel: '*',
	};

	constructor(props: Props) {
		super(props);
		this.state = {
			events: [],
		};
	}

	handleOnEvent = (event: UIAnalyticsEvent, channel?: string) => {
		this.setState((state) => ({
			events: [{ event, channel }, ...state.events],
		}));
	};

	render() {
		return (
			<AnalyticsListener onEvent={this.handleOnEvent} channel={this.props.channel}>
				<Container>
					<ChildrenWrapper>{this.props.children}</ChildrenWrapper>
					<StyledAnalyticsViewer events={this.state.events} />
				</Container>
			</AnalyticsListener>
		);
	}
}
