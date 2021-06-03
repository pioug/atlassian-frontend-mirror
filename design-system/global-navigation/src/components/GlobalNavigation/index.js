import React, { Component, Fragment } from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import { GlobalNav } from '@atlaskit/navigation-next';
import Drawer from '@atlaskit/drawer';
import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';
import ItemComponent from '../ItemComponent';
import ScreenTracker from '../ScreenTracker';
import { analyticsIdMap, fireDrawerDismissedEvents } from './analytics';
import NotificationDrawerContents from '../../platform-integration';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

const noop = () => {};

const localStorage = typeof window === 'object' ? window.localStorage : {};

export default class GlobalNavigation extends Component {
  drawers = {
    search: {
      isControlled: false,
    },
    notification: {
      isControlled: false,
    },
    starred: {
      isControlled: false,
    },
    help: {
      isControlled: false,
    },
    settings: {
      isControlled: false,
    },
    create: {
      isControlled: false,
    },
    recent: {
      isControlled: false,
    },
  };

  isNotificationInbuilt = false;

  static defaultProps = {
    createDrawerWidth: 'wide',
    searchDrawerWidth: 'wide',
    notificationDrawerWidth: 'wide',
    starredDrawerWidth: 'wide',
    helpDrawerWidth: 'wide',
    settingsDrawerWidth: 'wide',
    recentDrawerWidth: 'wide',
    drawerBackIcon: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isCreateDrawerOpen: false,
      isSearchDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isStarredDrawerOpen: false,
      isHelpDrawerOpen: false,
      isSettingsDrawerOpen: false,
      isRecentDrawerOpen: false,
      notificationCount: 0,
    };

    Object.keys(this.drawers).forEach((drawer) => {
      this.updateDrawerControlledStatus(drawer, props);

      const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);

      if (
        props[`${drawer}DrawerContents`] &&
        !props[`on${capitalisedDrawerName}Close`]
      ) {
        /* eslint-disable no-console */
        console.warn(`You have provided an onClick handler for ${drawer}, but no close handler for the drawer.
        Please pass on${capitalisedDrawerName}Close prop to handle closing of the ${drawer} drawer.`);
        /* eslint-enable */
      }

      // Set it's initial state using a prop with the same name.
      this.state[`is${capitalisedDrawerName}Open`] =
        props[`is${capitalisedDrawerName}Open`];
    });

    const {
      cloudId,
      fabricNotificationLogUrl,
      notificationDrawerContents,
    } = this.props;
    this.isNotificationInbuilt = !!(
      !notificationDrawerContents &&
      cloudId &&
      fabricNotificationLogUrl
    );
  }

  componentDidUpdate(prevProps) {
    Object.keys(this.drawers).forEach((drawerName) => {
      this.updateDrawerControlledStatus(drawerName, this.props);

      const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
      // Do nothing if it's a controlled drawer
      if (this.drawers[drawerName].isControlled) {
        return;
      }

      if (
        prevProps[`is${capitalisedDrawerName}Open`] !==
        this.props[`is${capitalisedDrawerName}Open`]
      ) {
        // Update the state based on the prop
        this.setState({
          [`is${capitalisedDrawerName}Open`]: this.props[
            `is${capitalisedDrawerName}Open`
          ],
        });
      }
    });

    const {
      cloudId,
      fabricNotificationLogUrl,
      notificationDrawerContents,
    } = this.props;
    this.isNotificationInbuilt = !!(
      !notificationDrawerContents &&
      cloudId &&
      fabricNotificationLogUrl
    );
  }

  onCountUpdating = (
    param = {
      visibilityChangesSinceTimer: 0,
    },
  ) => {
    if (
      !this.state.notificationCount ||
      param.visibilityChangesSinceTimer <= 1
    ) {
      // fetch the notificationCount
      return {};
    }

    // skip fetch, refresh from local storage if newer
    const cachedCount = parseInt(this.getLocalStorageCount(), 10);
    const result = {};
    if (cachedCount && cachedCount !== this.state.notificationCount) {
      result.countOverride = cachedCount;
    } else {
      result.skip = true;
    }
    return result;
  };

  onCountUpdated = (param = { newCount: 0 }) => {
    this.updateLocalStorageCount(param.newCount);
    this.setState({
      notificationCount: param.newCount,
    });
  };

  getLocalStorageCount = () => {
    try {
      return localStorage.getItem('notificationBadgeCountCache');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
    return null;
  };

  updateLocalStorageCount = (newCount) => {
    try {
      localStorage.setItem('notificationBadgeCountCache', newCount);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  updateDrawerControlledStatus = (drawerName, props) => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);

    if (props[`on${capitalisedDrawerName.replace('Drawer', '')}Click`]) {
      this.drawers[drawerName].isControlled = false;
    } else {
      // If a drawer doesn't have an onClick handler, mark it as a controlled drawer.
      this.drawers[drawerName].isControlled = true;
    }
  };

  getCapitalisedDrawerName = (drawerName) => {
    return `${drawerName[0].toUpperCase()}${drawerName.slice(1)}Drawer`;
  };

  openDrawer = (drawerName) => () => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    let onOpenCallback = noop;

    if (typeof this.props[`on${capitalisedDrawerName}Open`] === 'function') {
      onOpenCallback = this.props[`on${capitalisedDrawerName}Open`];
    }

    if (drawerName === 'notification' && this.isNotificationInbuilt) {
      this.onCountUpdated({ newCount: 0 });
    }

    // Update the state only if it's a controlled drawer.
    // componentDidMount takes care of the uncontrolled drawers
    if (this.drawers[drawerName].isControlled) {
      this.setState(
        {
          [`is${capitalisedDrawerName}Open`]: true,
        },
        onOpenCallback,
      );
    } else {
      // invoke callback in both cases
      onOpenCallback();
    }
  };

  closeDrawer = (drawerName) => (
    // eslint-disable-next-line no-undef
    event,
    analyticsEvent,
    trigger,
  ) => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    let onCloseCallback = noop;

    if (typeof this.props[`on${capitalisedDrawerName}Close`] === 'function') {
      onCloseCallback = this.props[`on${capitalisedDrawerName}Close`];
    }

    fireDrawerDismissedEvents(drawerName, analyticsEvent, trigger);
    // Update the state only if it's a controlled drawer.
    // componentDidMount takes care of the uncontrolled drawers
    if (this.drawers[drawerName].isControlled) {
      this.setState(
        {
          [`is${capitalisedDrawerName}Open`]: false,
        },
        onCloseCallback,
      );
    } else {
      // invoke callback in both cases
      onCloseCallback();
    }
  };

  renderNotificationBadge = () => {
    if (this.state.isNotificationDrawerOpen) {
      // Unmount the badge when the drawer is open
      // So that it can remount with the latest badgeCount when the drawer closes.
      return null;
    }

    const { cloudId, fabricNotificationLogUrl } = this.props;
    const refreshRate = this.state.notificationCount ? 180000 : 60000;

    return (
      <NotificationIndicator
        notificationLogProvider={
          new NotificationLogClient(fabricNotificationLogUrl, cloudId)
        }
        refreshRate={refreshRate}
        onCountUpdated={this.onCountUpdated}
        onCountUpdating={this.onCountUpdating}
      />
    );
  };

  renderNotificationDrawerContents = () => {
    const { locale, product } = this.props;

    return <NotificationDrawerContents product={product} locale={locale} />;
  };

  constructNavItems = () => {
    const productConfig = generateProductConfig(
      this.props,
      this.openDrawer,
      this.isNotificationInbuilt,
    );
    const defaultConfig = generateDefaultConfig();
    const badge = this.renderNotificationBadge;
    const { notificationCount: badgeCount } = this.isNotificationInbuilt
      ? this.state
      : this.props;

    const navItems = Object.keys(productConfig).map((item) => ({
      ...(productConfig[item]
        ? {
            ...(item === 'notification' && this.isNotificationInbuilt
              ? { id: 'notifications', badge }
              : {}),
            ...defaultConfig[item],
            ...productConfig[item],
            ...(item === 'notification'
              ? { id: 'notifications', badgeCount }
              : {}),
          }
        : null),
    }));

    return {
      primaryItems: navItems
        .filter(({ section }) => section === 'primary')
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2)
        .map((navItem) => {
          const { section, rank, ...props } = navItem;
          return props;
        }),
      secondaryItems: navItems
        .filter(({ section }) => section === 'secondary')
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2)
        .map((navItem) => {
          const { section, rank, ...props } = navItem;
          return props;
        }),
    };
  };

  getDrawerContents = (drawerName) => {
    switch (drawerName) {
      case 'notification':
        return this.isNotificationInbuilt
          ? this.renderNotificationDrawerContents
          : this.props.notificationDrawerContents;
      default:
        return this.props[`${drawerName}DrawerContents`];
    }
  };

  render() {
    // TODO: Look into memoizing this to avoid memory bloat
    const { primaryItems, secondaryItems } = this.constructNavItems();
    const { drawerBackIcon } = this.props;

    return (
      <NavigationAnalyticsContext
        data={{
          packageName,
          packageVersion,
          componentName: 'globalNavigation',
        }}
      >
        <Fragment>
          <GlobalNav
            itemComponent={ItemComponent}
            primaryItems={primaryItems}
            secondaryItems={secondaryItems}
          />
          {Object.keys(this.drawers).map((drawerName) => {
            const capitalisedDrawerName = this.getCapitalisedDrawerName(
              drawerName,
            );
            const shouldUnmountOnExit = this.props[
              `should${capitalisedDrawerName}UnmountOnExit`
            ];

            const DrawerContents = this.getDrawerContents(drawerName);

            if (!DrawerContents) {
              return null;
            }

            const isFocusLockEnabled = this.props[
              `is${capitalisedDrawerName}FocusLockEnabled`
            ];
            const onCloseComplete = this.props[
              `on${capitalisedDrawerName}CloseComplete`
            ];

            return (
              <Drawer
                key={drawerName}
                isOpen={this.state[`is${capitalisedDrawerName}Open`]}
                onClose={this.closeDrawer(drawerName)}
                onCloseComplete={onCloseComplete}
                shouldUnmountOnExit={shouldUnmountOnExit}
                isFocusLockEnabled={isFocusLockEnabled}
                width={this.props[`${drawerName}DrawerWidth`]}
                icon={drawerBackIcon}
              >
                <ScreenTracker
                  name={analyticsIdMap[drawerName]}
                  isVisible={this.state[`is${capitalisedDrawerName}Open`]}
                />
                <DrawerContents />
              </Drawer>
            );
          })}
        </Fragment>
      </NavigationAnalyticsContext>
    );
  }
}
