import React, { Component } from 'react';
import fetchMock from 'fetch-mock/cjs/client';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import Button from '@atlaskit/button';
import Tag from '@atlaskit/tag';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import GlobalNavigation from '../src';

const fabricNotificationLogUrl = '/gateway/api/notification-log/';
const cloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';

class Global extends Component {
  state = { isNotificationDrawerOpen: false };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyboardShortcut);
  }

  componentWillUnmount() {
    clearTimeout(this.openTimeoutId);
    clearTimeout(this.closeTimeoutId);
    window.removeEventListener('keydown', this.handleKeyboardShortcut);
  }

  handleKeyboardShortcut = e => {
    if (e.key === 'n' && !this.state.isNotificationDrawerOpen) {
      this.openNotificationDrawer();
    }
    return null;
  };

  updateIframeUrl = () => {
    // Flow doesn't know how to deal with querySelector
    // Therefore casting the return value to HTMLIFrameElement
    const iFrame = document.querySelector('iFrame[title="Notifications"]');

    if (iFrame) {
      // Notification URL is unreachable from the examples.
      // Hence setting it to root
      iFrame.src = '/';
    }
  };

  openNotificationDrawer = () => {
    this.setState({ isNotificationDrawerOpen: true }, () => {
      this.openTimeoutId = setTimeout(this.updateIframeUrl, 350);
    });
  };

  closeNotificationDrawer = () => {
    this.setState({ isNotificationDrawerOpen: false }, () => {
      this.closeTimeoutId = setTimeout(this.props.resetNotificationCount, 350);
    });
  };

  render() {
    return (
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        fabricNotificationLogUrl={fabricNotificationLogUrl}
        cloudId={cloudId}
        isNotificationDrawerOpen={this.state.isNotificationDrawerOpen}
        onNotificationDrawerClose={this.closeNotificationDrawer}
        onNotificationClick={this.openNotificationDrawer}
      />
    );
  }
}

// Need two components because both have state
// eslint-disable-next-line react/no-multi-comp
export default class GlobalNavigationWithNotificationIntegration extends Component {
  state = { count: 5 };

  componentDidMount() {
    const { count } = this.state;
    fetchMock.mock(
      new RegExp(fabricNotificationLogUrl),
      Promise.resolve({ count }),
    );
  }

  componentDidUpdate() {
    const { count } = this.state;
    fetchMock.restore();
    fetchMock.mock(
      new RegExp(fabricNotificationLogUrl),
      Promise.resolve({ count }),
    );
  }

  componentWillUnmount() {
    fetchMock.restore();
    window.onkeydown = null;
  }

  resetNotificationCount = () => {
    this.setState({
      count: 0,
    });
  };

  randomiseNotificationCount = () => {
    this.setState({
      count: Math.floor(1 + Math.random() * 18), // To ensure equal probability of count above and below 9
    });
  };

  render() {
    return (
      <NavigationProvider>
        <LayoutManager
          globalNavigation={() => (
            <AnalyticsListener
              channel="navigation"
              onEvent={analyticsEvent => {
                const { payload, context } = analyticsEvent;
                const eventId = `${payload.actionSubject ||
                  payload.name} ${payload.action || payload.eventType}`;
                console.log(`Received event [${eventId}]: `, {
                  payload,
                  context,
                });
              }}
            >
              <Global resetNotificationCount={this.resetNotificationCount} />
            </AnalyticsListener>
          )}
          productNavigation={() => null}
          containerNavigation={() => null}
        >
          <div css={{ padding: '32px 40px' }}>
            <p>
              <Button onClick={this.randomiseNotificationCount}>
                Randomise Notification Count
              </Button>
            </p>
            <p>
              <Button onClick={this.resetNotificationCount}>
                Reset Notification Count
              </Button>
            </p>
            <p>
              Type <Tag text="n" />
              to open the notification drawer
            </p>
          </div>
        </LayoutManager>
      </NavigationProvider>
    );
  }
}
