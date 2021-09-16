import React from 'react';
import { R300 } from '@atlaskit/theme/colors';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';
import { AKIconWrapper } from '../Icon';
import { NoLinkAppearance } from '../styled';

export interface MediaInlineCardErroredViewProps {
  /** The error message to display */
  message: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /* Icon to be provided to show this error state */
  icon?: React.ReactNode;
}

export class MediaInlineCardErroredView extends React.Component<
  MediaInlineCardErroredViewProps
> {
  renderMessage = () => {
    const { message } = this.props;
    const errorMessage = <NoLinkAppearance>{message}</NoLinkAppearance>;
    return <>{errorMessage}</>;
  };

  render() {
    const {
      onClick,
      isSelected,
      testId = 'media-inline-card-errored-view',
      icon,
    } = this.props;
    return (
      <Frame testId={testId} onClick={onClick} isSelected={isSelected}>
        <IconAndTitleLayout
          icon={
            icon || (
              <AKIconWrapper>
                <WarningIcon label="error" size="small" primaryColor={R300} />
              </AKIconWrapper>
            )
          }
          title={this.renderMessage()}
        />
      </Frame>
    );
  }
}
