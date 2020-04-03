import React from 'react';
import {
  IconTitleWrapper,
  IconWrapper,
  IconTitleHeadNoBreakWrapper,
  IconEmptyWrapper,
  IconPositionWrapper,
} from './styled';
import { Icon } from '../Icon';

export interface IconAndTitleLayoutProps {
  icon?: string | React.ReactNode;
  title: string;
  right?: React.ReactNode;
  titleColor?: string;
}

const CHAR_LENGTH_BREAK_AT = 7;

export class IconAndTitleLayout extends React.Component<
  IconAndTitleLayoutProps
> {
  renderIcon() {
    const { icon } = this.props;
    // We render two kinds of icons here:
    // - Image: acquired from either DAC or Teamwork Platform Apps;
    // - Atlaskit Icon: an Atlaskit SVG;
    // Each of these are scaled down to 12x12.
    if (icon) {
      if (typeof icon === 'string') {
        return <Icon className="inline-card-icon" src={icon} />;
      } else {
        return <IconWrapper>{icon}</IconWrapper>;
      }
    }
    return null;
  }

  render() {
    const { title, titleColor } = this.props;
    const head = title.slice(0, CHAR_LENGTH_BREAK_AT);
    const rest = title.slice(CHAR_LENGTH_BREAK_AT);

    return (
      <>
        <IconTitleWrapper style={{ color: titleColor }}>
          <IconTitleHeadNoBreakWrapper>
            <IconPositionWrapper>
              <IconEmptyWrapper />
              {this.renderIcon()}
            </IconPositionWrapper>
            {head}
          </IconTitleHeadNoBreakWrapper>
          {rest}
        </IconTitleWrapper>
      </>
    );
  }
}
