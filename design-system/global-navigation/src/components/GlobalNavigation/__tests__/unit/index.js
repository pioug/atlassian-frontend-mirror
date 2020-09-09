import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount, shallow } from 'enzyme';
import Badge from '@atlaskit/badge';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import Avatar from '@atlaskit/avatar';
import Drawer from '@atlaskit/drawer';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import StarLargeIcon from '@atlaskit/icon/glyph/star-large';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import SettingsIcon from '@atlaskit/icon/glyph/settings';
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import QuestionIcon from '@atlaskit/icon/glyph/question-circle';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import GlobalNavigation from '../../index';
import ScreenTracker from '../../../ScreenTracker';
import ItemComponent from '../../../ItemComponent';
import RecentIcon from '../../../CustomIcons';
import { NAVIGATION_CHANNEL } from '../../../../constants';

const DrawerContents = () => <div>drawer</div>;
const EmojiAtlassianIcon = () => <button>EmojiAtlassianIcon</button>;
const noop = () => {};

const escKeyDown = () => {
  const event = document.createEvent('Events');
  event.initEvent('keydown', true, true);
  event.key = 'Escape';
  global.window.dispatchEvent(event);
};

describe('GlobalNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    //  Silence GlobalNavigation warnings for improper props
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('Product logo', () => {
    it('should not render product logo when href and onClick are absent', () => {
      const wrapper = mount(
        <GlobalNavigation productIcon={EmojiAtlassianIcon} />,
      );
      const productIcon = wrapper.find(EmojiAtlassianIcon);
      expect(productIcon.exists()).toBeFalsy();
    });

    it('should href for product logo', () => {
      const wrapper = mount(
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          productHref="/testtest"
        />,
      );

      const productIcon = wrapper.find(EmojiAtlassianIcon);
      expect(productIcon.exists()).toBeTruthy();
      expect(wrapper.find('a').prop('href')).toEqual('/testtest');
    });

    it('should pass both href and onClick for product logo', () => {
      const mockProductClick = jest.fn();
      const wrapper = mount(
        <GlobalNavigation
          productIcon={EmojiAtlassianIcon}
          productHref="/testtest"
          onProductClick={mockProductClick}
        />,
      );

      const productIcon = wrapper.find(EmojiAtlassianIcon);

      expect(productIcon.exists()).toBeTruthy();
      expect(wrapper.find('a').prop('href')).toEqual('/testtest');

      productIcon.simulate('click');
      expect(mockProductClick).toHaveBeenCalled();
    });
  });

  describe('Drawers', () => {
    const drawerItems = [
      {
        akIcon: SearchIcon,
        capitalisedName: 'Search',
        name: 'search',
      },
      {
        akIcon: CreateIcon,
        capitalisedName: 'Create',
        name: 'create',
      },
      {
        akIcon: StarLargeIcon,
        capitalisedName: 'Starred',
        name: 'starred',
      },
      {
        akIcon: NotificationIcon,
        capitalisedName: 'Notification',
        name: 'notification',
      },
      {
        akIcon: SettingsIcon,
        capitalisedName: 'Settings',
        name: 'settings',
      },
      {
        akIcon: RecentIcon,
        capitalisedName: 'Recent',
        name: 'recent',
      },
      {
        akIcon: InviteTeamIcon,
        capitalisedName: 'Invite',
        name: 'invite',
      },
    ];

    drawerItems.forEach(({ name, akIcon, capitalisedName }) => {
      describe(`"${name}" drawer`, () => {
        it(`should not add "${name}" icon if both "on${capitalisedName}Click" and "${name}DrawerContents" are absent`, () => {
          // Testing onXClick and XDrawerContents props (negative)
          const props = {
            [`${name}Tooltip`]: 'test tooltip',
          };
          const wrapper = mount(<GlobalNavigation {...props} />);
          const icon = wrapper.find(akIcon);
          expect(icon.exists()).toBeFalsy();
        });

        it(`should not bind "${name}Drawer" when "on${capitalisedName}Click" prop is passed`, () => {
          // Testing onXClick positive
          const props = {
            [`on${capitalisedName}Click`]: jest.fn(),
          };
          const wrapper = mount(<GlobalNavigation {...props} />);
          expect(wrapper.find(DrawerContents).exists()).toBeFalsy();

          const icon = wrapper.find(akIcon);
          expect(icon.exists()).toBeTruthy();
          icon.simulate('click');

          expect(props[`on${capitalisedName}Click`]).toHaveBeenCalled();
          expect(wrapper.find(DrawerContents).exists()).toBeFalsy();
        });

        it(`should honour the shouldUnmountOnExit prop for "${name}" drawer`, () => {
          // test shouldXUnmountOnExit
          const props = {
            [`${name}DrawerContents`]: DrawerContents,
            [`on${capitalisedName}DrawerClose`]: jest.fn(),
            [`on${capitalisedName}DrawerOpen`]: jest.fn(),
          };
          const wrapper = mount(<GlobalNavigation {...props} />);

          const icon = wrapper.find(akIcon);
          icon.simulate('click');
          expect(
            wrapper.find('DrawerBase').prop('shouldUnmountOnExit'),
          ).toBeFalsy();

          wrapper.setProps({
            [`should${capitalisedName}DrawerUnmountOnExit`]: true,
          });
          wrapper.update();
          expect(
            wrapper.find('DrawerBase').prop('shouldUnmountOnExit'),
          ).toBeTruthy();
        });

        it(`should default the width of the "${name}" drawer to "wide" when the drawer width is not passed in`, () => {
          const props = {
            [`${name}DrawerContents`]: DrawerContents,
          };
          const wrapper = shallow(<GlobalNavigation {...props} />);
          expect(wrapper.find(Drawer).props()).toMatchObject({
            width: 'wide',
          });
        });

        it(`should set the width of the "${name}" drawer when the drawer width is passed in`, () => {
          const props = {
            [`${name}DrawerWidth`]: 'full',
            [`${name}DrawerContents`]: DrawerContents,
          };

          const wrapper = shallow(<GlobalNavigation {...props} />);
          expect(wrapper.find(Drawer).props()).toMatchObject({
            width: 'full',
          });
        });

        it(`should pass onCloseComplete to the "${name}" drawer`, () => {
          const onCloseComplete = jest.fn();
          const props = {
            [`${name}DrawerContents`]: DrawerContents,
            [`on${capitalisedName}DrawerCloseComplete`]: onCloseComplete,
          };

          const wrapper = shallow(<GlobalNavigation {...props} />);
          expect(wrapper.find(Drawer).props()).toMatchObject({
            onCloseComplete,
          });
        });

        describe('BackIcon', () => {
          it(`should render correct backIcon`, () => {
            // Testing XDrawerContents positive
            const props = {
              drawerBackIcon: CrossIcon,
              [`${name}DrawerContents`]: DrawerContents,
            };
            const wrapper = mount(<GlobalNavigation {...props} />);
            expect(wrapper.find(CrossIcon).exists()).toBeFalsy();

            const icon = wrapper.find(akIcon);
            icon.simulate('click');

            expect(wrapper.find(CrossIcon).exists()).toBeTruthy();
          });
          it(`should render correct default backIcon`, () => {
            // Testing XDrawerContents positive
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
            };
            const wrapper = mount(<GlobalNavigation {...props} />);
            expect(wrapper.find(ArrowLeftIcon).exists()).toBeFalsy();

            const icon = wrapper.find(akIcon);
            icon.simulate('click');

            expect(wrapper.find(ArrowLeftIcon).exists()).toBeTruthy();
          });
        });

        describe('Uncontrolled', () => {
          it(`should open "${name}" drawer when "${name}" icon is clicked`, () => {
            // Testing XDrawerContents positive
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
            };
            const wrapper = mount(<GlobalNavigation {...props} />);
            expect(wrapper.find(DrawerContents).exists()).toBeFalsy();

            const icon = wrapper.find(akIcon);
            icon.simulate('click');

            expect(wrapper.find(DrawerContents).exists()).toBeTruthy();
          });

          it(`should trigger drawer "on${capitalisedName}DrawerOpen" for uncontrolled "${name}" drawer`, () => {
            // Test  onXDrawerClose, onXDrawerOpen
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
              [`on${capitalisedName}DrawerOpen`]: jest.fn(),
            };
            const wrapper = mount(<GlobalNavigation {...props} />);

            const icon = wrapper.find(akIcon);
            icon.simulate('click');
            expect(props[`on${capitalisedName}DrawerOpen`]).toHaveBeenCalled();
          });

          it(`should fire drawer "on${capitalisedName}DrawerClose" for uncontrolled "${name}" drawer`, () => {
            // Test  onXDrawerClose, onXDrawerOpen
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
              [`on${capitalisedName}DrawerClose`]: jest.fn(),
            };
            const wrapper = mount(<GlobalNavigation {...props} />);

            const icon = wrapper.find(akIcon);
            icon.simulate('click');
            escKeyDown();

            expect(props[`on${capitalisedName}DrawerClose`]).toHaveBeenCalled();
          });
        });

        describe('Controlled', () => {
          it(`should allow "${name}" drawer to be controlled by passing "is${capitalisedName}DrawerOpen"`, () => {
            // Test onXClick, onXDrawerClose, isXDrawerOpen
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
              [`is${capitalisedName}DrawerOpen`]: false,
              [`on${capitalisedName}Click`]: jest.fn(),
            };
            const wrapper = mount(<GlobalNavigation {...props} />);
            expect(wrapper.find(DrawerContents).exists()).toBeFalsy();

            const icon = wrapper.find(akIcon);
            icon.simulate('click');
            expect(props[`on${capitalisedName}Click`]).toHaveBeenCalled();
            // Assert that it should not behave as an uncontrolled drawer
            expect(wrapper.find(DrawerContents).exists()).toBeFalsy();
          });

          it(`should display "${name}" drawer when "is${capitalisedName}DrawerOpen" is true`, () => {
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
              [`is${capitalisedName}DrawerOpen`]: true,
              [`on${capitalisedName}Click`]: jest.fn(),
            };
            const wrapper = mount(<GlobalNavigation {...props} />);

            expect(wrapper.find(DrawerContents).exists()).toBeTruthy();
          });

          it(`should NOT display "${name}" drawer when "is${capitalisedName}DrawerOpen" is false`, () => {
            const props = {
              [`${name}DrawerContents`]: DrawerContents,
              [`is${capitalisedName}DrawerOpen`]: false,
              [`on${capitalisedName}Click`]: jest.fn(),
            };
            const wrapper = mount(<GlobalNavigation {...props} />);

            // Cannot assert for the drawer to be absent because it is
            // dismounted by ReactTransitionGroup on animationEnd, which is not
            // being captured by enzyme.
            expect(wrapper.find('DrawerPrimitive').exists()).toBe(false);
          });

          //  There is no onXOpen callback for controlled drawers. A consumer can
          //  perform necessary callbacks in the onXClick method.

          it(`should trigger "on${capitalisedName}DrawerClose" callback for "${name}" drawer`, () => {
            // Test  onXDrawerClose
            const props = {
              [`is${capitalisedName}DrawerOpen`]: true,
              [`${name}DrawerContents`]: DrawerContents,
              [`on${capitalisedName}DrawerClose`]: jest.fn(),
            };
            const wrapper = mount(<GlobalNavigation {...props} />);

            wrapper.setProps({
              [`is${capitalisedName}DrawerOpen`]: false,
            });
            wrapper.update();
            escKeyDown();
            expect(props[`on${capitalisedName}DrawerClose`]).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('Tooltips', () => {
    const customTooltipWrapper = mount(
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        productTooltip="product tooltip"
        onProductClick={noop}
        createTooltip="create tooltip"
        onCreateClick={noop}
        searchTooltip="search tooltip"
        onSearchClick={noop}
        starredTooltip="starred tooltip"
        onStarredClick={noop}
        helpTooltip="help tooltip"
        onHelpClick={noop}
        helpItems={() => <div>items</div>}
        notificationTooltip="notification tooltip"
        onNotificationClick={noop}
        profileTooltip="profile tooltip"
        loginHref="#login"
        onSettingsClick={noop}
        settingsTooltip="settings tooltip"
      />,
    );
    const defaultWrapper = mount(
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        onProductClick={noop}
        onCreateClick={noop}
        onSearchClick={noop}
        onStarredClick={noop}
        onHelpClick={noop}
        helpItems={() => <div>items</div>}
        onNotificationClick={noop}
        onSettingsClick={noop}
        loginHref="#login"
      />,
    );

    const navItems = [
      {
        icon: EmojiAtlassianIcon,
        name: 'product',
        defaultTooltip: 'Atlassian',
      },
      {
        icon: StarLargeIcon,
        name: 'starred',
        defaultTooltip: 'Starred and recent',
      },
      {
        icon: SearchIcon,
        name: 'search',
        defaultTooltip: 'Search',
      },
      {
        icon: CreateIcon,
        name: 'create',
        defaultTooltip: 'Create',
      },
      {
        icon: NotificationIcon,
        name: 'notification',
        defaultTooltip: 'Notifications',
      },
      {
        icon: SignInIcon,
        name: 'profile',
        defaultTooltip: 'Your profile and Settings',
      },
      {
        icon: QuestionIcon,
        name: 'help',
        defaultTooltip: 'Help',
      },
      {
        icon: SettingsIcon,
        name: 'settings',
        defaultTooltip: 'Settings',
      },
    ];

    navItems.forEach(({ icon, name, defaultTooltip }) => {
      it(`should render default tooltip for "${name}" item`, () => {
        expect(
          defaultWrapper.find(icon).parents('Tooltip').prop('content'),
        ).toBe(defaultTooltip);
        expect(defaultWrapper.find(icon).prop('label')).toBe(defaultTooltip);
      });
    });

    navItems.forEach(({ icon, name }) => {
      it(`should render a custom tooltip for "${name}" item`, () => {
        const customTooltip = `${name} tooltip`;
        expect(
          customTooltipWrapper.find(icon).parents('Tooltip').prop('content'),
        ).toBe(`${customTooltip}`);
        expect(customTooltipWrapper.find(icon).prop('label')).toBe(
          `${customTooltip}`,
        );
      });
    });
  });

  describe('Section and ranking of global nav items', () => {
    const wrapper = mount(
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        onProductClick={noop}
        onCreateClick={noop}
        onSearchClick={noop}
        onStarredClick={noop}
        onHelpClick={noop}
        helpItems={() => <div>items</div>}
        onNotificationClick={noop}
        onSettingsClick={noop}
        loginHref="#login"
      />,
    );

    const navItems = [
      {
        id: 'productLogo',
        name: 'product',
        section: 'primary',
        rank: 1,
      },
      {
        id: 'starDrawer',
        name: 'starred',
        section: 'primary',
        rank: 2,
      },
      {
        id: 'quickSearch',
        name: 'search',
        section: 'primary',
        rank: 3,
      },
      {
        id: 'create',
        name: 'create',
        section: 'primary',
        rank: 4,
      },
      {
        id: 'notifications',
        name: 'notification',
        section: 'secondary',
        rank: 1,
      },
      {
        id: 'profile',
        name: 'profile',
        section: 'secondary',
        rank: 4,
      },
      {
        id: 'help',
        name: 'help',
        section: 'secondary',
        rank: 2,
      },
      {
        id: 'settings',
        name: 'settings',
        section: 'secondary',
        rank: 3,
      },
    ];

    navItems.forEach(({ id, section, rank, name }) => {
      const globalSection =
        section === 'primary' ? 'PrimaryItemsList' : 'SecondaryItemsList';

      it(`should pick up section for "${name}" from defaultConfig`, () => {
        expect(
          wrapper
            .find(`[id="${id}"]`)
            .filter('GlobalItemBase')
            .parents()
            .exists(globalSection),
        ).toBeTruthy();
      });

      it(`should pick up rank for "${name}" from defaultConfig`, () => {
        expect(
          wrapper
            .find(globalSection)
            .find('GlobalItemBase')
            .at(rank - 1) // arrays start at 0
            .is(`[id="${id}"]`),
        ).toBeTruthy();
      });
    });
  });

  describe('Notification', () => {
    it('should handle the notificationCount prop', () => {
      const wrapper = mount(
        <GlobalNavigation
          onNotificationClick={() => {}}
          notificationCount={5}
        />,
      );
      expect(wrapper.find(Badge).text()).toEqual('5');
    });

    it('should show "9+" when notificationCount is more than 10', () => {
      const wrapper = mount(
        <GlobalNavigation
          onNotificationClick={() => {}}
          notificationCount={15}
        />,
      );

      expect(wrapper.find(Badge).text()).toEqual('9+');
    });

    it('should not show a badge when notificationCount is 0', () => {
      const wrapper = mount(
        <GlobalNavigation
          onNotificationClick={() => {}}
          notificationCount={0}
        />,
      );
      expect(wrapper.find(Badge).exists()).toBeFalsy();
    });

    it('should pass the correct badgeCount to ItemComponent', () => {
      const wrapper = mount(
        <GlobalNavigation
          onNotificationClick={() => {}}
          notificationCount={15}
        />,
      );

      expect(wrapper.find(ItemComponent).prop('badgeCount')).toBe(15);
    });
  });

  describe('Inbuilt Notification', () => {
    const fabricNotificationLogUrl = '/gateway/api/notification-log/';
    const cloudId = 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b';
    it('should not render when either fabricID or fabricNotificationLogUrl are missing', () => {
      const wrapper = mount(<GlobalNavigation product="jira" locale="en" />);

      const icon = wrapper.find(NotificationIcon);
      expect(icon.exists()).toBeFalsy();
    });

    it('should render the notification icon when both fabricID and fabricNotificationLogUrl are present', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );
      const icon = wrapper.find(NotificationIcon);
      expect(icon.exists()).toBeTruthy();
    });

    it('should render tooltip passed from the product', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
          notificationTooltip="Notification tooltip from product"
        />,
      );

      expect(
        wrapper.find(NotificationIcon).parents('Tooltip').prop('content'),
      ).toBe('Notification tooltip from product');
      expect(wrapper.find(NotificationIcon).prop('label')).toBe(
        'Notification tooltip from product',
      );
    });

    it('should open notification drawer when clicked', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );
      const icon = wrapper.find(NotificationIcon);
      icon.simulate('click');

      expect(wrapper.find('NotificationDrawer').exists()).toBeTruthy();
    });

    it('should not render iframe in drawer when notificationDrawerContents is passed', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
          notificationDrawerContents={DrawerContents}
        />,
      );
      const icon = wrapper.find(NotificationIcon);
      icon.simulate('click');

      expect(wrapper.find(DrawerContents).exists()).toBeTruthy();
      expect(
        wrapper.find(DrawerContents).children('iframe').exists(),
      ).toBeFalsy();
    });

    it('should poll for notification every 1 minute when there is no badge', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );

      wrapper.setState({
        notificationCount: 5,
      });
      wrapper.update();

      wrapper.setState({
        notificationCount: 0,
      });
      wrapper.update();
      expect(wrapper.find(NotificationIndicator).prop('refreshRate')).toEqual(
        60000,
      );
    });

    it('should poll for notification every 3 minutes when there is a badge', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );

      wrapper.setState({
        notificationCount: 5,
      });
      wrapper.update();

      expect(wrapper.find(NotificationIndicator).prop('refreshRate')).toEqual(
        180000,
      );
    });

    it('should pass "countOverride" to NotificationIndicator when local notificationCount is the NOT same as cachedCount', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );

      localStorage.setItem('notificationBadgeCountCache', '2');
      wrapper.setState({
        notificationCount: 5,
      });

      const spy = jest.spyOn(wrapper.instance(), 'onCountUpdating');
      const spyReturn = spy(1); // 1 is the visibilityChangesSinceTimer, passed by NotificationIndicator

      expect(spyReturn).toMatchObject({
        countOverride: 2,
      });
    });

    it('should pass "skip" to NotificationIndicator when local notificationCount is the same as cachedCount', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );

      localStorage.setItem('notificationBadgeCountCache', '5');
      wrapper.setState({
        notificationCount: 5,
      });

      const spy = jest.spyOn(wrapper.instance(), 'onCountUpdating');
      const spyReturn = spy(1);

      expect(spyReturn).toMatchObject({
        skip: true,
      });
    });

    it('should pass the correct badgeCount to ItemComponent', () => {
      const wrapper = mount(
        <GlobalNavigation
          product="jira"
          locale="en"
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );
      wrapper.setState({
        notificationCount: 5,
      });

      expect(wrapper.find(ItemComponent).prop('badgeCount')).toBe(5);
    });

    it('should unmount NotificationIndicator when notification drawer is open', () => {
      const wrapper = mount(
        <GlobalNavigation
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );

      const icon = wrapper.find(NotificationIcon);
      icon.simulate('click');

      expect(wrapper.find(NotificationIndicator).exists()).toBeFalsy();
    });

    it('should mount NotificationIndicator when notification drawer is closed', () => {
      const wrapper = mount(
        <GlobalNavigation
          fabricNotificationLogUrl={fabricNotificationLogUrl}
          cloudId={cloudId}
        />,
      );

      expect(wrapper.find(NotificationIndicator).exists()).toBeTruthy();
    });

    describe('Controlled inbuilt notification', () => {
      it('should be controllable', () => {
        const wrapper = mount(
          <GlobalNavigation
            fabricNotificationLogUrl={fabricNotificationLogUrl}
            cloudId={cloudId}
            onNotificationClick={() => {}}
          />,
        );
        expect(wrapper.find('NotificationDrawer').exists()).toBeFalsy();
        wrapper.setProps({ isNotificationDrawerOpen: true });
        wrapper.update();
        expect(wrapper.find('NotificationDrawer').exists()).toBeTruthy();
      });

      it('should reset notification count', () => {
        const wrapper = mount(
          <GlobalNavigation
            product="jira"
            locale="en"
            fabricNotificationLogUrl={fabricNotificationLogUrl}
            onNotificationClick={() => {}}
            cloudId={cloudId}
          />,
        );
        wrapper.setState({
          notificationCount: 5,
        });
        const spy = jest.spyOn(wrapper.instance(), 'onCountUpdated');

        expect(wrapper.find(ItemComponent).prop('badgeCount')).toBe(5);
        const icon = wrapper.find(NotificationIcon);
        icon.simulate('click');

        expect(spy).toHaveBeenCalledWith({ newCount: 0 });
      });
    });
  });

  describe('AppSwitcher', () => {
    it('should not render AppSwitcher when appSwitcherComponent is missing', () => {
      const wrapper = mount(
        <GlobalNavigation appSwitcherTooltip="appSwitcher tooltip" />,
      );
      expect(wrapper.find('[id="appSwitcher"]').exists()).toBeFalsy();
    });

    const AppSwitcher = () => <div />;
    AppSwitcher.displayName = 'AppSwitcher';
    const defaultWrapper = mount(
      <GlobalNavigation
        productIcon={EmojiAtlassianIcon}
        productHref="#"
        onProductClick={noop}
        onCreateClick={noop}
        onSearchClick={noop}
        onStarredClick={noop}
        onHelpClick={noop}
        helpItems={() => <div>items</div>}
        onNotificationClick={noop}
        onSettingsClick={noop}
        appSwitcherComponent={AppSwitcher}
        appSwitcherTooltip="appSwitcher tooltip"
        // Intentionally passes these props in. We expect this to be ignored.
        product="jira"
        cloudId="some-cloud-id"
        enableAtlassianSwitcher
        loginHref="#login"
      />,
    );
    it('should render the AppSwitcher component', () => {
      expect(defaultWrapper.children().find(AppSwitcher)).toHaveLength(1);
    });

    it('should render the correct tooltip', () => {
      // AppSwitcher doesn't have a default tooltip in global navigation as it's handled by the base app switcher component
      expect(defaultWrapper.find(AppSwitcher).prop('label')).toBe(
        'appSwitcher tooltip',
      );
      expect(defaultWrapper.find(AppSwitcher).prop('tooltip')).toBe(
        'appSwitcher tooltip',
      );
    });
    it('should render in SecondaryItemsList by default', () => {
      expect(
        defaultWrapper.find(AppSwitcher).parents().exists('SecondaryItemsList'),
      ).toBeTruthy();
    });

    it('should render at 2nd position in the SecondaryItemsList by default', () => {
      const appSwitcherRank = 2;
      expect(
        defaultWrapper
          .find('SecondaryItemsList')
          .find('AnalyticsContext')
          .children()
          .at(appSwitcherRank - 1) // arrays start at 0
          .is('[id="appSwitcher"]'),
      ).toBeTruthy();
    });
  });

  describe('AtlassianSwitcher', () => {
    jest.useFakeTimers();
    const cloudId = 'some-cloud-id';

    const AppSwitcher = () => <div />;
    AppSwitcher.displayName = 'AppSwitcher';
    const getDefaultWrapper = (propsToOverride = {}) =>
      mount(
        <IntlProvider locale="en">
          <GlobalNavigation
            product="jira"
            productIcon={EmojiAtlassianIcon}
            productHref="#"
            cloudId={cloudId}
            onProductClick={noop}
            onCreateClick={noop}
            onSearchClick={noop}
            onStarredClick={noop}
            onHelpClick={noop}
            helpItems={() => <div>items</div>}
            onNotificationClick={noop}
            onSettingsClick={noop}
            appSwitcherComponent={AppSwitcher}
            appSwitcherTooltip="appSwitcher tooltip"
            enableAtlassianSwitcher
            loginHref="#login"
            {...propsToOverride}
          />
        </IntlProvider>,
      );
    let globalNavWrapper = getDefaultWrapper();

    it('should render AppSwitcher when enableAtlassianSwitcher is false', () => {
      globalNavWrapper = getDefaultWrapper({
        enableAtlassianSwitcher: false,
      });
      expect(globalNavWrapper.find(AppSwitcher)).toHaveLength(1);
    });

    it('should STILL render AppSwitcher when enableAtlassianSwitcher is truthy', () => {
      globalNavWrapper = getDefaultWrapper();
      expect(globalNavWrapper.children().find(AppSwitcher)).toHaveLength(1);
    });
  });

  describe('Help', () => {
    it('should render help menu when "helpItems" is passed', () => {
      const HelpItems = () => <div />;
      HelpItems.displayName = 'HelpItems';
      const wrapper = mount(<GlobalNavigation helpItems={HelpItems} />);

      expect(wrapper.find('[id="help"]').exists()).toBeTruthy();
      expect(wrapper.children().exists('DropdownItem')).toBeTruthy();
    });

    it('should not render help menu when "helpItems" is not passed', () => {
      const wrapper = shallow(<GlobalNavigation helpTooltip="help tooltip" />);
      expect(wrapper.find('[id="help"]').exists()).toBeFalsy();
    });

    it('should render helpBadge when passed in', () => {
      const HelpBadge = () => <div />;
      const HelpItems = () => <div />;
      const wrapper = mount(
        <GlobalNavigation helpItems={HelpItems} helpBadge={HelpBadge} />,
      );

      expect(wrapper.find(HelpBadge).exists()).toBeTruthy();
    });
  });

  describe('Profile', () => {
    it('should render neither avatar nor login icon if loginHref and profileItems are missing', () => {
      const wrapper = mount(
        <GlobalNavigation profileTooltip="profile tooltip" />,
      );
      expect(wrapper.find('[id="profile"]').exists()).toBeFalsy();
    });

    it('should render login icon if loginHref is passed', () => {
      const wrapper = mount(
        <GlobalNavigation
          loginHref="/test_login"
          profileTooltip="profile tooltip"
        />,
      );
      expect(wrapper.find('[id="profile"]').exists()).toBeTruthy();
      expect(wrapper.find('a[href="/test_login"]').exists()).toBeTruthy();
      expect(wrapper.find('SignInIcon').exists()).toBeTruthy();
    });

    xit('should render dropdown menu if profileItems is passed', () => {
      const ProfileItems = () => <div />;
      const wrapper = mount(
        <GlobalNavigation
          profileItems={ProfileItems}
          profileTooltip="profile tooltip"
        />,
      );
      expect(wrapper.find('[id="profile"]').exists()).toBeTruthy();
      expect(wrapper.children().exists(ProfileItems)).toBeTruthy();
      expect(wrapper.children().exists(DropdownItem)).toBeTruthy();
    });

    it('should show default avatar when profileIconUrl is missing', () => {
      const ProfileItems = () => <div />;
      const wrapper = mount(<GlobalNavigation profileItems={ProfileItems} />);
      expect(wrapper.find(Avatar).exists()).toBeTruthy();
    });

    it('should show profile photo when profileIconUrl is present', () => {
      const ProfileItems = () => <div />;
      const wrapper = mount(
        <GlobalNavigation
          profileItems={ProfileItems}
          profileIconUrl="//url.to.image/fancy"
        />,
      );

      expect(wrapper.find(Avatar).prop('src')).toEqual('//url.to.image/fancy');
    });
  });

  describe('Analytics', () => {
    it('should call dismissDrawer when drawer is closed', () => {
      const onEvent = jest.fn();
      const wrapper = mount(
        <AnalyticsListener onEvent={onEvent} channel={NAVIGATION_CHANNEL}>
          <GlobalNavigation searchDrawerContents={DrawerContents} />,
        </AnalyticsListener>,
      );
      function wasDismissCalled() {
        return Boolean(
          onEvent.mock.calls.find(call => {
            const { payload } = call[0];
            return (
              payload.action === 'dismissed' &&
              payload.actionSubject === 'drawer' &&
              payload.attributes.trigger === 'escKey'
            );
          }),
        );
      }

      const searchIcon = wrapper.find('SearchIcon');
      searchIcon.simulate('click');

      expect(wasDismissCalled()).toBe(false);

      escKeyDown();
    });

    [
      {
        drawerName: 'search',
        analyticsId: 'quickSearchDrawer',
      },
      {
        drawerName: 'create',
        analyticsId: 'createDrawer',
      },
      {
        drawerName: 'invite',
        analyticsId: 'inviteDrawer',
      },
      {
        drawerName: 'notification',
        analyticsId: 'notificationsDrawer',
      },
      {
        drawerName: 'starred',
        analyticsId: 'starDrawer',
      },
      {
        drawerName: 'help',
        analyticsId: 'helpDrawer',
      },
      {
        drawerName: 'settings',
        analyticsId: 'settingsDrawer',
      },
    ].forEach(({ drawerName, analyticsId }) => {
      it(`should render ScreenTracker with correct props for "${drawerName}" drawer when drawer is open`, () => {
        const capitalisedDrawerName = `${drawerName[0].toUpperCase()}${drawerName.slice(
          1,
        )}`;
        const isOpenPropName = `is${capitalisedDrawerName}DrawerOpen`;
        const props = {
          [`${drawerName}DrawerContents`]: DrawerContents,
          [`on${capitalisedDrawerName}Click`]: () => {},
          [isOpenPropName]: false,
        };

        const wrapper = mount(<GlobalNavigation {...props} />);
        expect(wrapper.find(ScreenTracker).exists()).toBeFalsy();
        wrapper.setProps({
          [isOpenPropName]: true,
        });
        wrapper.update();

        const screenTracker = wrapper.find(ScreenTracker);
        expect(screenTracker.exists()).toBeTruthy();
        expect(screenTracker.props()).toEqual({
          name: analyticsId,
          isVisible: true,
        });

        wrapper.setProps({
          [isOpenPropName]: false,
        });
        wrapper.update();
        expect(wrapper.find(ScreenTracker).props()).toEqual({
          name: analyticsId,
          isVisible: false,
        });
      });
    });
  });
});
