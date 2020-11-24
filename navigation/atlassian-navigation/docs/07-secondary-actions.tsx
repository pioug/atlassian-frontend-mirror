import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  These components should be used for the right actions in [Atlassian-navigation](atlassian-navigation).
  They each have a specific prop to slot the component in.
  It is up to you to implement the behaviour behind the buttons.

  ## Help

  Used for showing help in your application.
  Generally you'll want to compose this with [Popup](/packages/design-system/popup) and [Menu](/packages/design-system/menu).

  ${code`
import { Help } from '@atlaskit/atlassian-navigation';

<Help onClick={console.log} tooltip="Get help" />;
`}

  ${(
    <Example
      title="Help button"
      Component={require('../examples/help-button.tsx').default}
      source={require('!!raw-loader!../examples/help-button.tsx')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/Help')}
    />
  )}

  ## Profile

  Used for showing an authenticated user.
  Generally you'll want to compose this with [Popup](/packages/design-system/popup) and [Menu](/packages/design-system/menu).

  You are required to correctly style the avatar image.
  You will want to use the \`SignIn\` component if they are not logged in.

  ${code`
import { Profile } from '@atlaskit/atlassian-navigation';

<Profile
  tooltip="Your profile and settings"
  onClick={onClick}
  icon={
    <img
      style={{ borderRadius: '50%', width: 24, height: 24 }}
      src={avatarUrl}
    />
  }
/>
`}

  ${(
    <Example
      title="Profile button"
      Component={require('../examples/profile').default}
      source={require('!!raw-loader!../examples/profile')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/Profile')}
    />
  )}

  ## Search

  Used for showing a search textbox,
  will display a textbox at large viewports and an icon at small viewports.
  You will need to handle hooking up events accordingly.
  Search includes its own \`search\` landmark internally for users navigating with screen readers.

  This is made to be composed with [Global search](/packages/search/global-search) or [Quick search](/packages/search/quick-search)

  ### Prop information
  Search has three similar required props:  \`placeholder\` \`tooltip\` and \`label\`. Each has a different purpose and use cases
  and so must be provided separately:
  - \`placeholder\` text displays inside the search box before the user has input text
  - \`tooltip\` can contain not just text, but any React node – such as a badge for a keyboard shortcut
  - \`label\` text is read to users who visit the search field with a screen reader

  ${code`
import { Search } from '@atlaskit/atlassian-navigation';

<Search onClick={onClick} placeholder="Search..." tooltip="Search" label="Search" />
`}

  ${(
    <Example
      title="Search"
      Component={require('../examples/search').default}
      source={require('!!raw-loader!../examples/search')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/Search')}
    />
  )}

  ## Settings

  Used for showing a settings button,
  Generally you'll want to compose this with [Popup](/packages/design-system/popup) and [Menu](/packages/design-system/menu).

  ${code`
import { Settings } from '@atlaskit/atlassian-navigation';

<Settings onClick={console.log} tooltip="Product settings" />
`}

  ${(
    <Example
      title="Settings"
      Component={require('../examples/settings').default}
      source={require('!!raw-loader!../examples/settings')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/Settings')}
    />
  )}

  ## Sign in

  Used for showing a sign in button.
  You will want to link to the Atlassian account log in page.
  Make sure to only show this when the user is not logged in,
  otherwise use the \`Profile\` component.

  ${code`
import { Settings } from '@atlaskit/atlassian-navigation';

<SignIn href="#" tooltip="Sign in" />
`}

  ${(
    <Example
      title="Settings"
      Component={require('../examples/sign-in').default}
      source={require('!!raw-loader!../examples/sign-in')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/SignIn')}
    />
  )}

  ## Notifications

  Used for showing Atlassian notifications.
  You'll want to compose this with [notification indicator](/packages/notifications/notification-indicator),
  [notification log client](/packages/notifications/notification-log-client),
  and [Atlassian notifications](/packages/navigation/atlassian-notifications).

  See the examples for patterns regarding clearing the notification badge count.

  ${code`
import { Notifications } from '@atlaskit/atlassian-navigation';

<Notifications badge={null} tooltip="Notifications" />
`}

  ${(
    <Example
      title="Notifications"
      Component={require('../examples/notifications').default}
      source={require('!!raw-loader!../examples/notifications')}
    />
  )}

  ### Props

  ${(
    <Props
      heading=""
      props={require('!!extract-react-types-loader!../src/components/Notifications')}
    />
  )}
`;
