/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';
import { Component } from 'react';
import { Identifier } from '@atlaskit/media-client';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { hideControlsClassName } from '@atlaskit/media-ui';
import Button from '@atlaskit/button/standard-button';
import { Shortcut } from '@atlaskit/media-ui';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  ArrowsWrapper,
  RightWrapper,
  LeftWrapper,
  Arrow,
} from './styleWrappers';
import { getSelectedIndex } from './utils';
import { createNavigatedEvent } from './analytics/events/ui/navigated';
import { fireAnalytics } from './analytics';

export type NavigationDirection = 'prev' | 'next';

export type NavigationProps = Readonly<{
  items: Identifier[];
  selectedItem: Identifier;
  onChange: (item: Identifier) => void;
  isArchiveSideBarVisible?: boolean;
}> &
  WithAnalyticsEventsProps;

export const nextNavButtonId = 'media-viewer-navigation-next';
export const prevNavButtonId = 'media-viewer-navigation-prev';

export type NavigationSource = 'keyboard' | 'mouse';
export class NavigationBase extends Component<NavigationProps, {}> {
  private navigate(direction: NavigationDirection, source: NavigationSource) {
    return () => {
      const { onChange, items, createAnalyticsEvent } = this.props;
      const { selectedIndex } = this;
      const newItem =
        direction === 'next'
          ? items[selectedIndex + 1]
          : items[selectedIndex - 1];

      if (newItem) {
        fireAnalytics(
          createNavigatedEvent(direction, source, newItem),
          createAnalyticsEvent,
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
    const { items, isArchiveSideBarVisible } = this.props;
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
        <LeftWrapper isArchiveSideBarVisible={!!isArchiveSideBarVisible}>
          {isLeftVisible ? (
            <Arrow className={hideControlsClassName}>
              <Shortcut
                code={'ArrowLeft'}
                handler={prev('keyboard')}
                eventType={'keyup'}
              />
              <Button
                testId={prevNavButtonId}
                onClick={prev('mouse')}
                iconBefore={
                  <ArrowLeftCircleIcon
                    // DN800
                    primaryColor="#9FADBC"
                    // DN0
                    secondaryColor="#161A1D"
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
              <Shortcut
                code={'ArrowRight'}
                handler={next('keyboard')}
                eventType={'keyup'}
              />
              <Button
                testId={nextNavButtonId}
                onClick={next('mouse')}
                iconBefore={
                  <ArrowRightCircleIcon
                    // DN800
                    primaryColor="#9FADBC"
                    // DN0
                    secondaryColor="#161A1D"
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
