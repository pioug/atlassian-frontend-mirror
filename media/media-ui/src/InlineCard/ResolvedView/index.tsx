import React from 'react';
import { Frame } from '../Frame';
import Lozenge from '@atlaskit/lozenge';
import { LozengeProps } from '../../common';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { LozengeWrapper } from '../IconAndTitleLayout/styled';

export interface InlineCardResolvedViewProps {
  /** The optional con of the service (e.g. Dropbox/Asana/Google/etc) to display */
  icon?: string | React.ReactNode;
  /** The name of the resource */
  title: string;
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
    const { title, isSelected, onClick, icon, link, testId } = this.props;
    return (
      <Frame
        testId={testId}
        link={link}
        isSelected={isSelected}
        onClick={onClick}
      >
        <IconAndTitleLayout icon={icon} title={title} />
        {this.renderLozenge()}
      </Frame>
    );
  }
}
