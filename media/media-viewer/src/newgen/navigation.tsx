import React from 'react';
import { Component } from 'react';
import { Identifier } from '@atlaskit/media-client';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { N800 } from '@atlaskit/theme/colors';
import { hideControlsClassName } from '@atlaskit/media-ui';
import Button from '@atlaskit/button';
import { Shortcut } from '@atlaskit/media-ui';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { ArrowsWrapper, RightWrapper, LeftWrapper, Arrow } from './styled';
import { getSelectedIndex } from './utils';
import { createNavigatedEvent } from './analytics/events/ui/navigated';
import { fireAnalytics } from './analytics';

export type NavigationDirection = 'prev' | 'next';

export type NavigationProps = Readonly<{
  items: Identifier[];
  selectedItem: Identifier;
  onChange: (item: Identifier) => void;
}> &
  WithAnalyticsEventsProps;

export const nextNavButtonId = 'media-viewer-navigation-next';
export const prevNavButtonId = 'media-viewer-navigation-prev';

export type NavigationSource = 'keyboard' | 'mouse';
export class NavigationBase extends Component<NavigationProps, {}> {
  private navigate(direction: NavigationDirection, source: NavigationSource) {
    return () => {
      const { onChange, items } = this.props;
      const { selectedIndex } = this;
      const newItem =
        direction === 'next'
          ? items[selectedIndex + 1]
          : items[selectedIndex - 1];

      if (newItem) {
        fireAnalytics(
          createNavigatedEvent(direction, source, newItem),
          this.props,
        );
        onChange(newItem);
      }
    };
  }

  get selectedIndex() {
    const { items, selectedItem } = this.props;
    return getSelectedIndex(items, selectedItem);
  }

  render() {
    const { items } = this.props;
    const { selectedIndex } = this;

    if (selectedIndex === -1) {
      return null;
    }

    const isLeftVisible = selectedIndex > 0;
    const isRightVisible = selectedIndex < items.length - 1;

    const prev = (source: NavigationSource) => this.navigate('prev', source);
    const next = (source: NavigationSource) => this.navigate('next', source);

    return (
      <ArrowsWrapper>
        <LeftWrapper>
          {isLeftVisible ? (
            <Arrow className={hideControlsClassName}>
              <Shortcut keyCode={37} handler={prev('keyboard')} />
              <Button
                testId={prevNavButtonId}
                onClick={prev('mouse')}
                iconBefore={
                  <ArrowLeftCircleIcon
                    primaryColor={N800}
                    size="xlarge"
                    label="Previous"
                  />
                }
              />
            </Arrow>
          ) : null}
        </LeftWrapper>

        <RightWrapper>
          {isRightVisible ? (
            <Arrow className={hideControlsClassName}>
              <Shortcut keyCode={39} handler={next('keyboard')} />
              <Button
                testId={nextNavButtonId}
                onClick={next('mouse')}
                iconBefore={
                  <ArrowRightCircleIcon
                    primaryColor={N800}
                    size="xlarge"
                    label="Next"
                  />
                }
              />
            </Arrow>
          ) : null}
        </RightWrapper>
      </ArrowsWrapper>
    );
  }
}

export const Navigation = withAnalyticsEvents({})(NavigationBase);
