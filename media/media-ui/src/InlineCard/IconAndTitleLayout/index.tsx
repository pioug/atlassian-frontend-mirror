import React from 'react';
import { Icon } from '../Icon';
import {
  IconEmptyWrapper,
  IconPositionWrapper,
  IconTitleWrapper,
  IconWrapper,
} from './styled';

export interface IconAndTitleLayoutProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  right?: React.ReactNode;
  titleColor?: string;
  children?: React.ReactNode;
}

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
    const { title, titleColor, children } = this.props;
    return (
      <>
        <IconTitleWrapper style={{ color: titleColor }}>
          <IconPositionWrapper>
            {children || (
              <>
                <IconEmptyWrapper />
                {this.renderIcon()}
              </>
            )}
          </IconPositionWrapper>
          {title}
        </IconTitleWrapper>
      </>
    );
  }
}
