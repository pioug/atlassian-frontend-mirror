import React from 'react';

import { Frame, type FrameViewProps } from '../InlineCard/Frame';

export interface CardLinkViewProps extends FrameViewProps {
	placeholder?: string;
}
export class CardLinkView extends React.PureComponent<CardLinkViewProps> {
	render(): React.JSX.Element {
		return (
			<Frame withoutBackground={true} {...this.props}>
				{this.props.placeholder || this.props.link}
			</Frame>
		);
	}
}
