import React from 'react';
import QuestionIcon from '@atlaskit/icon/glyph/question-circle';
import Badge from '@atlaskit/badge';
import Avatar from '@atlaskit/avatar';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';

const MAX_NOTIFICATIONS_COUNT = 9;
const isNotEmpty = obj => {
  const values = Object.values(obj);
  return !!(
    values.length && values.reduce((acc, curr) => acc || !!curr, false)
  );
};

const generateAvatar = profileIconUrl => {
  const GeneratedAvatar = ({ className, onClick, label }) => (
    <span className={className}>
      <Avatar
        name={label}
        borderColor="transparent"
        src={profileIconUrl}
        size="small"
        onClick={onClick}
      />
    </span>
  );
  return GeneratedAvatar;
};

function configFactory(onClick, tooltip, otherConfig = {}) {
  const { href } = otherConfig;
  const shouldNotRenderItem = !onClick && !href;
  let { label } = otherConfig;
  if (!label && typeof tooltip === 'string') {
    label = tooltip;
  }
  if (shouldNotRenderItem && (tooltip || isNotEmpty(otherConfig))) {
    // eslint-disable-next-line no-console
    console.warn(
      `One of the items in the Global Navigation is missing an onClick (or an href in case of the productIcon). This item will not be rendered in Global Navigation.`,
    );
  }

  if (shouldNotRenderItem) return null;

  return {
    ...(href ? { href } : null),
    ...(onClick ? { onClick } : null),
    ...(tooltip ? { tooltip } : null),
    label,
    ...otherConfig,
  };
}

function helpConfigFactory(onClick, items, tooltip, otherConfig = {}) {
  if (!items && (tooltip || isNotEmpty(otherConfig))) {
    // eslint-disable-next-line no-console
    console.warn(
      'You have provided some prop(s) for help, but not helpItems. Help will not be rendered in Global Navigation',
    );
  }

  if (!items) return null;
  let { label } = otherConfig;
  if (!label && typeof tooltip === 'string') {
    label = tooltip;
  }
  return {
    onClick,
    icon: QuestionIcon,
    dropdownItems: items,
    ...(tooltip ? { tooltip } : null),
    label,
    ...otherConfig,
  };
}

function profileConfigFactory(
  items,
  tooltip,
  href,
  profileIconUrl,
  otherConfig = {},
) {
  const shouldNotRenderProfile = !items && !href;
  if (shouldNotRenderProfile && (tooltip || isNotEmpty(otherConfig))) {
    // eslint-disable-next-line no-console
    console.warn(
      'You provided some prop(s) for profile, but not profileItems or loginHref. Profile will not be rendered in Global Navigation',
    );
  }

  if (shouldNotRenderProfile) return null;

  if (items && href) {
    // eslint-disable-next-line no-console
    console.warn(
      'You have provided both loginHref and profileItems. loginUrl prop will be ignored by Global Navigation',
    );
  }

  const profileComponent = items
    ? { icon: generateAvatar(profileIconUrl), dropdownItems: items }
    : { icon: SignInIcon, href };
  let { label } = otherConfig;
  if (!label && typeof tooltip === 'string') {
    label = tooltip;
  }
  return {
    ...profileComponent,
    ...(tooltip ? { tooltip } : null),
    label,
    ...otherConfig,
  };
}

function notificationBadge(badgeCount) {
  return {
    badge: badgeCount
      ? () => (
          <Badge max={MAX_NOTIFICATIONS_COUNT} appearance="important">
            {badgeCount}
          </Badge>
        )
      : null,
    badgeCount,
  };
}

function notificationConfigFactory(
  notificationTooltip,
  notificationLabel,
  badgeCount,
  notificationDrawerContents,
  onNotificationClick,
  isNotificationInbuilt,
  openDrawer,
  getNotificationRef,
) {
  const notificationOnClickHandler = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
    openDrawer();
  };
  return isNotificationInbuilt
    ? configFactory(notificationOnClickHandler, notificationTooltip, {
        badgeCount,
        getRef: getNotificationRef,
        label: notificationLabel,
      })
    : configFactory(
        onNotificationClick || (notificationDrawerContents && openDrawer),
        notificationTooltip,
        {
          ...notificationBadge(badgeCount),
          getRef: getNotificationRef,
          label: notificationLabel,
        },
      );
}

function appSwitcherConfigFactory(props) {
  let { label } = props;
  if (!label && typeof props.tooltip === 'string') {
    label = props.tooltip;
  }
  return {
    ...props,
    label,
  };
}

export default function generateProductConfig(
  props,
  openDrawer,
  isNotificationInbuilt,
) {
  const {
    onProductClick,
    productTooltip,
    productLabel,
    productIcon,
    productHref,
    getProductRef,

    onRecentClick,
    recentLabel,
    recentTooltip,
    recentDrawerContents,
    getRecentRef,

    onInviteClick,
    inviteLabel,
    inviteTooltip,
    inviteDrawerContents,
    getInviteRef,

    onCreateClick,
    createLabel,
    createTooltip,
    createDrawerContents,
    getCreateRef,

    searchTooltip,
    searchLabel,
    onSearchClick,
    searchDrawerContents,
    getSearchRef,

    onStarredClick,
    starredLabel,
    starredTooltip,
    starredDrawerContents,
    getStarredRef,

    notificationTooltip,
    notificationsLabel,
    notificationCount,
    notificationDrawerContents,
    onNotificationClick,
    getNotificationRef,

    appSwitcherComponent,
    appSwitcherLabel,
    appSwitcherTooltip,
    getAppSwitcherRef,

    enableHelpDrawer,
    helpItems,
    onHelpClick,
    helpLabel,
    helpTooltip,
    helpBadge,
    helpDrawerContents,
    getHelpRef,

    onSettingsClick,
    settingsLabel,
    settingsTooltip,
    settingsDrawerContents,
    getSettingsRef,

    profileItems,
    profileLabel,
    profileTooltip,
    loginHref,
    profileIconUrl,
    getProfileRef,
  } = props;

  if (props.enableAtlassianSwitcher) {
    // eslint-disable-next-line no-console
    console.warn(
      'Use of `enableAtlassianSwitcher` has been deprecated because `atlassian-switcher` is no longer bundled. Please use `appSwitcherComponent` instead.',
    );
  }

  return {
    product: configFactory(onProductClick, productTooltip, {
      icon: productIcon,
      href: productHref,
      getRef: getProductRef,
      label: productLabel,
    }),
    recent: configFactory(
      onRecentClick || (recentDrawerContents && openDrawer('recent')),
      recentTooltip,
      { getRef: getRecentRef, label: recentLabel },
    ),
    invite: configFactory(
      onInviteClick || (inviteDrawerContents && openDrawer('invite')),
      inviteTooltip,
      { getRef: getInviteRef, label: inviteLabel },
    ),
    create: configFactory(
      onCreateClick || (createDrawerContents && openDrawer('create')),
      createTooltip,
      { getRef: getCreateRef, label: createLabel },
    ),
    search: configFactory(
      onSearchClick || (searchDrawerContents && openDrawer('search')),
      searchTooltip,
      { getRef: getSearchRef, label: searchLabel },
    ),
    starred: configFactory(
      onStarredClick || (starredDrawerContents && openDrawer('starred')),
      starredTooltip,
      { getRef: getStarredRef, label: starredLabel },
    ),
    help: enableHelpDrawer
      ? configFactory(
          onHelpClick || (helpDrawerContents && openDrawer('help')),
          helpTooltip,
          { getRef: getHelpRef, label: helpLabel, badge: helpBadge },
        )
      : helpConfigFactory(onHelpClick, helpItems, helpTooltip, {
          getRef: getHelpRef,
          label: helpLabel,
          badge: helpBadge,
        }),
    settings: configFactory(
      onSettingsClick || (settingsDrawerContents && openDrawer('settings')),
      settingsTooltip,
      { getRef: getSettingsRef, label: settingsLabel },
    ),

    notification: notificationConfigFactory(
      notificationTooltip,
      notificationsLabel,
      notificationCount,
      notificationDrawerContents,
      onNotificationClick,
      isNotificationInbuilt,
      openDrawer('notification'),
      getNotificationRef,
    ),
    profile: profileConfigFactory(
      profileItems,
      profileTooltip,
      loginHref,
      profileIconUrl,
      { getRef: getProfileRef, label: profileLabel },
    ),
    appSwitcher: appSwitcherComponent
      ? appSwitcherConfigFactory({
          itemComponent: appSwitcherComponent,
          label: appSwitcherLabel,
          tooltip: appSwitcherTooltip,
          getRef: getAppSwitcherRef,
        })
      : null,
  };
}
