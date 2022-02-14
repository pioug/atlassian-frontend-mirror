import React from 'react';
import { Frame, FrameViewProps } from '../InlineCard/Frame';

export class CardLinkView extends React.PureComponent<FrameViewProps> {
  render() {
    return (
      <Frame withoutBackground={true} {...this.props}>
        {this.props.link}
      </Frame>
    );
  }
}
