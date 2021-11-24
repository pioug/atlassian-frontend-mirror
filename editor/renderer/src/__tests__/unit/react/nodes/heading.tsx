import React from 'react';
import Heading, { HeadingLevels } from '../../../../react/nodes/heading';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';
import AnalyticsContext from '../../../../analytics/analyticsContext';
import HeadingAnchor from '../../../../react/nodes/heading-anchor';
import { CopyTextContext } from '../../../../react/nodes/copy-text-provider';
import ReactSerializer from '../../../../react';

describe('<Heading />', () => {
  let heading: any;
  let serialiser = new ReactSerializer({});
  const copyTextToClipboard = jest.fn();
  const fireAnalyticsEvent = jest.fn();

  test.each([1, 2, 3, 4, 5, 6])(
    'should wrap content with <h%s>-tag',
    (headingLevel) => {
      heading = mountWithIntl(
        <Heading
          level={headingLevel as HeadingLevels}
          headingId={`This-is-a-Heading-${headingLevel}`}
          showAnchorLink={true}
          dataAttributes={{
            'data-renderer-start-pos': 0,
          }}
          nodeType="heading"
          marks={[]}
          serializer={serialiser}
        >
          This is a Heading {headingLevel}
        </Heading>,
      );

      expect(heading.find(`h${headingLevel}`).exists()).toBe(true);
      expect(heading.find(`h${headingLevel}`).prop('id')).toEqual(
        `This-is-a-Heading-${headingLevel}`,
      );
    },
  );

  describe('When showAnchorLink is set to false', () => {
    beforeEach(() => {
      heading = mountWithIntl(
        <Heading
          level={1}
          headingId={'This-is-a-Heading-1'}
          showAnchorLink={false}
          dataAttributes={{
            'data-renderer-start-pos': 0,
          }}
          nodeType="heading"
          marks={[]}
          serializer={serialiser}
        >
          This is a Heading 1
        </Heading>,
      );
    });

    it('does not render heading anchor', () => {
      expect(heading.find(HeadingAnchor).exists()).toBe(false);
    });
  });

  const renderHeadingWithCopyProvider = () => {
    return mountWithIntl(
      <CopyTextContext.Provider
        value={{
          copyTextToClipboard: copyTextToClipboard,
        }}
      >
        <AnalyticsContext.Provider
          value={{
            fireAnalyticsEvent: fireAnalyticsEvent,
          }}
        >
          <Heading
            level={1}
            headingId="This-is-a-Heading-1"
            showAnchorLink={true}
            dataAttributes={{
              'data-renderer-start-pos': 0,
            }}
            nodeType="heading"
            marks={[]}
            serializer={serialiser}
          >
            This is a Heading 1
          </Heading>
        </AnalyticsContext.Provider>
        ,
      </CopyTextContext.Provider>,
    );
  };

  describe('When click on copy anchor link button', () => {
    let locationBackup: Location;
    beforeEach(() => {
      locationBackup = window.location;
    });

    afterEach(() => {
      window.location = locationBackup;
    });

    it('should call "fireAnalyticsEvent" with correct event data', () => {
      heading = renderHeadingWithCopyProvider();
      heading.find('button').simulate('click');
      expect(fireAnalyticsEvent).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'headingAnchorLink',
        eventType: 'ui',
      });
    });

    it('Should call "copyTextToClipboard" with correct param', () => {
      heading = renderHeadingWithCopyProvider();
      heading.find('button').simulate('click');
      expect(copyTextToClipboard).toHaveBeenCalledWith(
        'http://localhost/#This-is-a-Heading-1',
      );
    });

    it('Should call "copyTextToClipboard" with correct hash replaced', () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: {
          href: 'http://localhost/#some-other-link',
          hash: '#some-other-link',
        },
      });
      heading = renderHeadingWithCopyProvider();
      heading.find('button').simulate('click');
      expect(copyTextToClipboard).toHaveBeenCalledWith(
        'http://localhost/#This-is-a-Heading-1',
      );
    });
  });
});
