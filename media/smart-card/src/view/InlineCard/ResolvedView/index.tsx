import React from 'react';
import { Frame } from '../Frame';
import Lozenge from '@atlaskit/lozenge';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { LozengeWrapper } from '../IconAndTitleLayout/styled';
import { LozengeProps } from '../../../types';
import { HoverCard } from '../../../view/HoverCard/index';

export interface InlineCardResolvedViewProps {
  /** The optional con of the service (e.g. Dropbox/Asana/Google/etc) to display */
  icon?: React.ReactNode;
  /** The name of the resource */
  title?: string;
  /** The the optional lozenge that might represent the statux of the resource */
  lozenge?: LozengeProps;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** The optional url */
  link?: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /** The color of the title text only (not including the icon) */
  titleTextColor?: string;
  /** The Emoji icon prefix that was added to the title text via Add emoji button */
  titlePrefix?: React.ReactNode;
  /** Enables showing a custom preview on hover of link */
  showHoverPreview?: boolean;
}

export class InlineCardResolvedView extends React.Component<
  InlineCardResolvedViewProps
> {
  renderLozenge() {
    const { lozenge } = this.props;
    if (!lozenge) {
      return null;
    }
    return (
      <LozengeWrapper>
        <Lozenge
          appearance={lozenge.appearance || 'default'}
          isBold={lozenge.isBold}
        >
          {lozenge.text}
        </Lozenge>
      </LozengeWrapper>
    );
  }

  render() {
    const {
      title = '',
      isSelected,
      onClick,
      icon,
      link,
      testId = 'inline-card-resolved-view',
      titleTextColor,
      titlePrefix,
      showHoverPreview = false,
    } = this.props;

    const inlineCardResolvedView = (
      <Frame
        testId={testId}
        link={link}
        isSelected={isSelected}
        onClick={onClick}
      >
        <IconAndTitleLayout
          emoji={titlePrefix}
          icon={icon}
          title={title}
          titleTextColor={titleTextColor}
        />
        {this.renderLozenge()}
      </Frame>
    );

    if (showHoverPreview && link) {
      return <HoverCard url={link}>{inlineCardResolvedView}</HoverCard>;
    }

    return inlineCardResolvedView;
  }
}
