import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import StarLargeIcon from '@atlaskit/icon/glyph/star-large';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import RecentIcon from '../components/CustomIcons';

export default function generateDefaultConfig() {
  return {
    product: {
      label: 'Atlassian',
      rank: 1,
      section: 'primary',
      tooltip: 'Atlassian',
      id: 'productLogo',
    },
    recent: {
      icon: RecentIcon,
      label: 'Recently visited',
      rank: 2,
      section: 'primary',
      tooltip: 'Recently visited',
      id: 'recentIcon',
    },
    starred: {
      icon: StarLargeIcon,
      label: 'Starred and recent',
      rank: 3,
      section: 'primary',
      tooltip: 'Starred and recent',
      id: 'starDrawer',
    },
    search: {
      icon: SearchIcon,
      label: 'Search',
      section: 'primary',
      rank: 4,
      tooltip: 'Search',
      id: 'quickSearch',
    },
    create: {
      icon: CreateIcon,
      label: 'Create',
      section: 'primary',
      rank: 5,
      tooltip: 'Create',
      id: 'create',
    },
    invite: {
      icon: InviteTeamIcon,
      label: 'Invite',
      rank: 6,
      section: 'primary',
      tooltip: 'Invite',
      id: 'inviteIcon',
    },
    // ==============  secondary section  ==============
    notification: {
      icon: NotificationIcon,
      label: 'Notifications',
      section: 'secondary',
      rank: 1,
      tooltip: 'Notifications',
      id: 'notifications',
    },
    appSwitcher: {
      section: 'secondary',
      rank: 2,
      id: 'appSwitcher',
    },
    help: {
      icon: QuestionCircleIcon,
      label: 'Help',
      section: 'secondary',
      rank: 3,
      tooltip: 'Help',
      id: 'help',
    },
    settings: {
      icon: SettingsIcon,
      label: 'Settings',
      section: 'secondary',
      rank: 4,
      tooltip: 'Settings',
      id: 'settings',
    },
    profile: {
      label: 'Your profile and Settings',
      section: 'secondary',
      rank: 5,
      tooltip: 'Your profile and Settings',
      id: 'profile',
    },
  };
}
