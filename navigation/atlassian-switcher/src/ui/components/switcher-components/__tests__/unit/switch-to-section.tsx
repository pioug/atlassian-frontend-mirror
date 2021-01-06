import React from 'react';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';
import { mount } from 'enzyme';
import { SwitchToSection } from '../../switch-to-section';
import { Section, SectionWithLinkItem } from '../../../../primitives';
import { IntlProvider } from 'react-intl';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import createStream from '../../../../../../test-helpers/stream';
import { createIcon } from '../../../../../common/utils/icon-themes';

const TEST_ATTRS = {
  switcherStartLink: '[data-testid="section-title__link"]',
};

describe('SwitchToSection', () => {
  // Define setup + expectations based on disableSwitchToHeading
  [
    { disableSwitchToHeading: true, expectedHeadingText: '' },
    { disableSwitchToHeading: false, expectedHeadingText: 'Switch to' },
  ].forEach(({ disableSwitchToHeading, expectedHeadingText }) => {
    describe(`when disableSwitchToHeading is ${disableSwitchToHeading}`, () => {
      // Define setup + expectations based on showStartLink
      [
        {
          showStartLink: false,
          showNewHeading: false,
          expected: {
            TitleComponent: Section,
            titleText: expectedHeadingText,
          },
        },
        {
          showStartLink: true,
          showNewHeading: true,
          expected: {
            TitleComponent: SectionWithLinkItem,
            titleText: expectedHeadingText + 'Atlassian Start',
          },
        },
      ].forEach(({ showStartLink, showNewHeading, expected }) => {
        const PRECEDING_EVENTS = 1;
        it(`should render with expected title "${expected.titleText}" when showStartLink is ${showStartLink}`, async () => {
          const eventStream = createStream<UIAnalyticsEvent>();
          const wrapper = mount(
            <AnalyticsListener channel="*" onEvent={eventStream}>
              <IntlProvider locale="en">
                <SwitchToSection
                  adminLinks={[]}
                  appearance="drawer"
                  disableHeading={disableSwitchToHeading}
                  fixedLinks={[
                    {
                      key: 'admin',
                      label: 'Administration',
                      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
                      href: 'http://admin.atlassian.com',
                    },
                  ]}
                  isDiscoverSectionEnabled
                  licensedProductLinks={[]}
                  onDiscoverMoreClicked={jest.fn()}
                  showStartLink={showStartLink}
                  showNewHeading={showNewHeading}
                  suggestedProductLinks={[]}
                  triggerXFlow={jest.fn()}
                  getExtendedAnalyticsAttributes={() => ({})}
                />
              </IntlProvider>
            </AnalyticsListener>,
          );
          expect(wrapper).toMatchSnapshot();
          expect(wrapper.find(expected.TitleComponent)).toHaveLength(1);
          expect(wrapper.find(expected.TitleComponent).text()).toMatch(
            new RegExp(`${expected.titleText}`, ''),
          );

          // Test analytics if showStartLink is true
          if (showStartLink) {
            eventStream.skip(PRECEDING_EVENTS);
            const switcherStartLink = wrapper.find(
              TEST_ATTRS.switcherStartLink,
            );
            switcherStartLink.hostNodes().simulate('click');
            const { payload } = await eventStream.next();
            expect(payload).toEqual({
              action: 'clicked',
              actionSubject: 'atlassianSwitcherItem',
              eventType: 'ui',
            });
          }
        });
      });
    });
  });
});
