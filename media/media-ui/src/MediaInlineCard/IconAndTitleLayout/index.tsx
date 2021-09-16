import React from 'react';
import ImageLoader from 'react-render-image';
import { Icon } from '../Icon';
import {
  IconEmptyWrapper,
  IconPositionWrapper,
  IconTitleWrapper,
  IconWrapper,
  TitleWrapper,
  EmojiWrapper,
} from './styled';
import LinkIcon from '@atlaskit/icon/glyph/link';

export interface IconAndTitleLayoutProps {
  emoji?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  right?: React.ReactNode;
  titleColor?: string;
  children?: React.ReactNode;
  defaultIcon?: React.ReactNode;
  testId?: string;
}

export class IconAndTitleLayout extends React.Component<
  IconAndTitleLayoutProps
> {
  private renderAtlaskitIcon() {
    const { icon, emoji } = this.props;

    if (emoji) {
      return <EmojiWrapper>{emoji}</EmojiWrapper>;
    }

    if (!icon || typeof icon === 'string') {
      return null;
    }

    return <IconWrapper>{icon}</IconWrapper>;
  }

  private renderImageIcon(errored: React.ReactNode, testId: string) {
    const { icon: url } = this.props;

    if (!url || typeof url !== 'string') {
      return null;
    }

    return (
      <ImageLoader
        src={url}
        loaded={
          <Icon
            className="smart-link-icon"
            src={url}
            data-testid={`${testId}-image`}
          />
        }
        errored={errored}
      />
    );
  }

  private renderIconPlaceholder(testId: string) {
    const { defaultIcon } = this.props;

    if (defaultIcon) {
      return <IconWrapper>{defaultIcon}</IconWrapper>;
    }

    return (
      <IconWrapper>
        <LinkIcon label="link" size="small" testId={`${testId}-default`} />
      </IconWrapper>
    );
  }

  renderIcon(testId: string) {
    // We render two kinds of icons here:
    // - Image: acquired from either DAC or Teamwork Platform Apps;
    // - Atlaskit Icon: an Atlaskit SVG;
    // Each of these are scaled down to 12x12.
    const icon = this.renderAtlaskitIcon();
    if (icon) {
      return icon;
    }

    const placeholder = this.renderIconPlaceholder(testId);
    const image = this.renderImageIcon(placeholder, testId);

    return image || placeholder;
  }

  render() {
    const {
      children,
      title,
      titleColor,
      testId = 'media-inline-card-icon-and-title',
    } = this.props;

    return (
      <>
        <IconTitleWrapper style={{ color: titleColor }}>
          <IconPositionWrapper>
            {children || (
              <>
                <IconEmptyWrapper />
                {this.renderIcon(testId)}
              </>
            )}
          </IconPositionWrapper>
          <TitleWrapper>{title}</TitleWrapper>
        </IconTitleWrapper>
      </>
    );
  }
}
