import React from 'react';
import { Frame } from '../Frame';
import { IconAndTitleLayout } from '../IconAndTitleLayout';

export interface MediaInlineCardLoadedViewProps {
  /** The optional con of the service (e.g. Dropbox/Asana/Google/etc) to display */
  icon?: React.ReactNode;
  /** The name of the resource */
  title?: string;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
  /** The Emoji icon prefix that was added to the title text via Add emoji button */
  titlePrefix?: React.ReactNode;
}

export class MediaInlineCardLoadedView extends React.Component<
  MediaInlineCardLoadedViewProps
> {
  render() {
    const {
      title = '',
      isSelected,
      onClick,
      icon,
      testId = 'media-inline-card-loaded-view',
      titlePrefix,
    } = this.props;
    return (
      <Frame testId={testId} isSelected={isSelected} onClick={onClick}>
        <IconAndTitleLayout emoji={titlePrefix} icon={icon} title={title} />
      </Frame>
    );
  }
}
