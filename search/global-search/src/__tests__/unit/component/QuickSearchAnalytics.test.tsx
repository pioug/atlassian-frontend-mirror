import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  setupMocks,
  teardownMocks,
  ZERO_DELAY_CONFIG,
} from '../../../../example-helpers/mocks/mockApis';
import { GlobalQuickSearch, Props } from '../../..';
import { QuickSearchContainer } from '../../../components/common/QuickSearchContainer';
import { ABTestProvider } from '../../../components/AbTestProvider';
import LocaleIntlProvider from '../../../../example-helpers/components/LocaleIntlProvider';
import { ResultBase } from '@atlaskit/quick-search';
import keycode from 'keycode';

import { mount, ReactWrapper } from 'enzyme';

import {
  validateEvent,
  getGlobalSearchDrawerEvent,
  getPreQuerySearchResultsEvent,
  getPostQuerySearchResultsEvent,
  getTextEnteredEvent,
  getAdvancedSearchLinkSelectedEvent,
  getResultSelectedEvent,
  getHighlightEvent,
  getDismissedEvent,
  getExperimentExposureEvent,
} from '../../unit/helpers/_events_payloads';

const spyOnComponentDidUpdate = () => {
  const componentsToWaitFor = [QuickSearchContainer, ABTestProvider];

  const spy = jest.fn();

  componentsToWaitFor.forEach(component => {
    const baseComponentDidUpdateImplementation =
      component.prototype.componentDidUpdate;

    if (!baseComponentDidUpdateImplementation) {
      component.prototype.componentDidUpdate = spy;
    } else {
      component.prototype.componentDidUpdate = function (
        prevProps: any,
        prevState: any,
        snapshot: any,
      ) {
        spy(prevProps, prevState, snapshot);
        // @ts-ignore there's some complex typing around `this` here
        return baseComponentDidUpdateImplementation.apply(this, [
          prevProps,
          prevState,
          snapshot,
        ]);
      };
    }
  });

  return spy;
};

/**
 * Find an analytic event by looking into the event spy and finding the analytic event that matches the given
 * set of properties.
 * Use {#validateEvent} to validate that the attributes of said event is correct.
 * @param eventSpy
 * @param analyticProperties
 */
const findAnalyticEventWithProperties = (
  eventSpy: jest.Mock<{}>,
  analyticProperties: Object,
) => {
  const foundEvents = [...eventSpy.mock.calls]
    .reverse()
    .find(([event]) =>
      Object.keys(analyticProperties).every(
        key => event.payload[key] === (analyticProperties as any)[key],
      ),
    );

  expect(foundEvents).not.toBeUndefined();

  return foundEvents && foundEvents[0];
};

const CONFLUENCE_RECENT_ITEMS = [
  {
    id: 'confluence-object-result',
    hasContainerId: true,
    resultsCount: 10,
  },
  {
    id: 'generic-container-result',
    hasContainerId: false,
    resultsCount: 3,
  },
  {
    id: 'person-result',
    hasContainerId: false,
    resultsCount: 3,
  },
];

const JIRA_RECENT_ITEMS = [
  {
    id: 'jira-object-result',
    hasContainerId: true,
    resultsCount: 8,
  },
  {
    id: 'jira-project-result',
    hasContainerId: false,
    resultsCount: 6,
  },
  {
    id: 'person-result',
    hasContainerId: false,
    resultsCount: 3,
  },
];

const AB_TEST_DATA = {
  experimentId: 'default',
  controlId: 'control-id',
  abTestId: 'default',
};

const getRecentItems = (product: string) =>
  product === 'jira' ? JIRA_RECENT_ITEMS : CONFLUENCE_RECENT_ITEMS;

['confluence', 'jira'].forEach(product => {
  describe.skip(`${product} Quick Search Analytics`, () => {
    const updateSpy = spyOnComponentDidUpdate();
    const onEventSpy = jest.fn();
    let wrapper: ReactWrapper;
    let originalWindowLocation = window.location;

    const keyPress = (key: 'ArrowUp' | 'ArrowDown' | 'Enter') => {
      const input = wrapper.find('input');
      expect(input.length).toBe(1);
      input.simulate('keyDown', {
        key,
        shiftKey: false,
        keyCode: keycode(key.replace('Arrow', '')),
      });
    };

    beforeAll(() => {
      delete window.location;
      window.location = Object.assign({}, window.location, {
        assign: jest.fn(),
      });
      setupMocks(ZERO_DELAY_CONFIG);
      jest.setTimeout(10000);
    });

    afterAll(() => {
      window.location = originalWindowLocation;
      teardownMocks();
    });

    beforeEach(async () => {
      jest.clearAllMocks();
      wrapper = await renderAndWaitForUpdate();
    });

    const renderComponent = (onEvent: jest.Mock<{}>) => {
      const wrapper = mount(
        <AnalyticsListener onEvent={onEvent} channel="fabric-elements">
          <LocaleIntlProvider locale="en">
            <GlobalQuickSearch
              cloudId="cloudId"
              context={product as Props['context']}
              userId="abc123"
              referralContextIdentifiers={{
                currentContentId: '123',
                currentContainerId: '456',
                searchReferrerId: '123',
              }}
            />
          </LocaleIntlProvider>
        </AnalyticsListener>,
      );

      return wrapper;
    };

    const checkIfNoMoreUpdates = (
      resolve: Function,
      lastCount: number = 0,
      noUpdateCycles = 0,
    ) => {
      // Keep checking until the component no longer sees anymore updates.

      // Due to timing issues we will wait double check there is no updates by checking that
      // at least 2 event loops have passed with no updates.
      setTimeout(() => {
        const updateCallCount = updateSpy.mock.calls.length;
        if (updateCallCount === lastCount && noUpdateCycles >= 2) {
          resolve();
        } else {
          // reset no update cycle count if the number of update call changes
          const newNoUpdateCycleCount =
            updateCallCount > lastCount ? 0 : noUpdateCycles + 1;
          checkIfNoMoreUpdates(resolve, updateCallCount, newNoUpdateCycleCount);
        }
      }, 0);
    };

    const waitForAllUpdates = () =>
      new Promise(resolve => checkIfNoMoreUpdates(resolve));

    const renderAndWaitForUpdate = async () => {
      const wrapper = renderComponent(onEventSpy);
      await waitForAllUpdates();
      wrapper.update();
      return wrapper;
    };

    describe('Initial events', () => {
      it('should trigger globalSearchDrawer', async () => {
        expect(onEventSpy).toBeCalled();
        const event = findAnalyticEventWithProperties(onEventSpy, {
          actionSubject: 'globalSearchDrawer',
          action: 'viewed',
        });

        validateEvent(
          event,
          getGlobalSearchDrawerEvent({
            subscreen: 'GlobalSearchPreQueryDrawer',
            timesViewed: 1,
          }),
        );
      });

      it('should trigger show prequery results event ', () => {
        expect(onEventSpy).toBeCalled();
        const event = onEventSpy.mock.calls[2][0];
        validateEvent(
          event,
          getPreQuerySearchResultsEvent(getRecentItems(product), AB_TEST_DATA),
        );
      });

      it.skip('should trigger experiment exposure event', () => {
        const event = findAnalyticEventWithProperties(onEventSpy, {
          actionSubject: 'quickSearchExperiment',
          action: 'exposed',
        });

        validateEvent(
          event,
          getExperimentExposureEvent({
            searchSessionId: expect.any(String),
            abTest: AB_TEST_DATA,
          }),
        );
      });
    });

    describe('Highlight and select', () => {
      beforeEach(() => {
        // This clears all the onMount events so we can start on a clean slate
        onEventSpy.mockClear();
      });

      if (product === 'confluence') {
        it.skip('should trigger highlight result event', () => {
          const count = 11;
          for (let i = 0; i < count; i++) {
            keyPress('ArrowDown');
          }
          expect(onEventSpy).toHaveBeenCalledTimes(count);
          onEventSpy.mock.calls.forEach(([event]: any, index: number) => {
            validateEvent(
              event,
              getHighlightEvent({
                key: 'ArrowDown',
                globalIndex: index,
                indexWithinSection: index % (count - 1),
                sectionIndex: Math.floor(index / (count - 1)),
                resultCount: 18, // 16 + 2 advanced
                sectionId: 'recent-confluence',
                type: index >= 10 ? 'confluence-space' : 'confluence-page',
              }),
            );
          });
        });
      }

      if (product === 'jira') {
        it.skip('should trigger highlight result event', () => {
          const count = 9;
          for (let i = 0; i < count; i++) {
            keyPress('ArrowDown');
          }
          expect(onEventSpy).toHaveBeenCalledTimes(count);

          // skip the first link which is advanced issue search link
          const callsWithoutFirstLink = onEventSpy.mock.calls.slice(1);
          callsWithoutFirstLink.forEach(([event]: any, index: number) => {
            validateEvent(
              event,
              getHighlightEvent({
                key: 'ArrowDown',
                globalIndex: index + 1,
                indexWithinSection: index % (count - 2),
                sectionIndex: Math.floor(index / (count - 2)),
                resultCount: 17,
                sectionId: 'recent-jira',
                type: index >= 7 ? 'jira-board' : 'jira-issue',
              }),
            );
          });
        });
      }

      it.skip('should trigger highlight result event on arrow up', () => {
        keyPress('ArrowUp');
        expect(onEventSpy).toHaveBeenCalledTimes(1);
        const event = onEventSpy.mock.calls[0][0];
        validateEvent(
          event,
          getHighlightEvent({
            key: 'ArrowUp',
            indexWithinSection: undefined,
            ...(product === 'confluence'
              ? {
                  globalIndex: 17,
                  resultCount: 18, // 16 + 2 advanced
                  sectionIndex: undefined, // advanced results is not a section
                  sectionId: 'advanced-search-confluence',
                  type: undefined,
                }
              : {
                  // got jira no advanced results in results count, new design advanced is not part of result list
                  globalIndex: 16,
                  resultCount: 17,
                  sectionIndex: 2,
                  indexWithinSection: 2,
                  sectionId: 'recent-person',
                  type: 'person',
                }),
          }),
        );
      });

      it.skip('should trigger advanced result selected', async () => {
        keyPress('Enter');
        const results = wrapper.find(ResultBase);
        const expectedResultsCount = product === 'confluence' ? 18 : 17;
        expect(results.length).toBe(expectedResultsCount);
        const advancedSearchResult = results.last();
        advancedSearchResult.simulate('click', {
          metaKey: true,
        });

        const event = findAnalyticEventWithProperties(onEventSpy, {
          actionSubject: 'navigationItem',
          action: 'selected',
        });

        const payload =
          product === 'confluence'
            ? {
                actionSubjectId: 'advanced_search_confluence',
                resultContentId: 'search_confluence',
                sectionId: 'advanced-search-confluence',
                globalIndex: 17,
                resultCount: 16, // does not include advanced search links
              }
            : {
                actionSubjectId: 'navigationItem',
                sectionIndex: 2,
                resultCount: 16, // does not include advanced search links
                globalIndex: 16,
                indexWithinSection: 2,
                sectionId: 'recent-person',
                type: 'person',
                newTab: true,
                trigger: 'click',
              };
        product === 'confluence'
          ? validateEvent(event, getAdvancedSearchLinkSelectedEvent(payload))
          : validateEvent(event, getResultSelectedEvent(payload));
      });

      it('should trigger result selected', () => {
        keyPress('Enter');
        const results = wrapper.find(ResultBase);
        const expectedResultsCount = 18;
        expect(results.length).toBe(expectedResultsCount);
        const result = results.at(10);
        result.simulate('click', {
          metaKey: true,
        });

        const event = findAnalyticEventWithProperties(onEventSpy, {
          actionSubject: 'navigationItem',
          action: 'selected',
        });

        const payload =
          product === 'confluence'
            ? {
                sectionId: 'recent-confluence',
                globalIndex: 10,
                resultCount: 16, // does not include advanced search links
                sectionIndex: 1,
                indexWithinSection: 0,
                trigger: 'click',
                newTab: true,
                type: 'confluence-space',
              }
            : {
                sectionId: 'recent-jira',
                globalIndex: 10,
                resultCount: 17, // does not include advanced search links
                sectionIndex: 1,
                indexWithinSection: 1,
                trigger: 'click',
                newTab: true,
                type: 'jira-board',
              };
        validateEvent(event, getResultSelectedEvent(payload));
      });

      it('should trigger result selected via keyboard navigation', () => {
        keyPress('ArrowDown');
        keyPress('ArrowDown');
        keyPress('Enter');
        expect(onEventSpy).toHaveBeenCalled();
        const event =
          onEventSpy.mock.calls[onEventSpy.mock.calls.length - 1][0];
        const payload =
          product === 'confluence'
            ? {
                sectionId: 'recent-confluence',
                globalIndex: 1,
                resultCount: 18, // include advanced search links
                sectionIndex: 0,
                indexWithinSection: 1,
                trigger: 'returnKey',
                newTab: false,
                type: 'confluence-page',
              }
            : {
                sectionId: 'recent-jira',
                globalIndex: 1,
                resultCount: 18, // include advanced search links
                sectionIndex: 0,
                indexWithinSection: 0,
                trigger: 'returnKey',
                newTab: false,
                type: 'jira-issue',
              };
        validateEvent(event, getResultSelectedEvent(payload));
      });
    });

    [
      {
        query: 'Robust',
        expectedResults: {
          textEnteredEvent: {
            queryLength: 6,
            queryVersion: 0,
            wordCount: 1,
          },
          postQueryResults:
            product === 'confluence'
              ? [
                  {
                    id: 'confluence-object-result',
                    hasContainerId: true,
                    resultsCount: 10,
                  },
                ]
              : [
                  {
                    id: 'jira-object-result',
                    hasContainerId: true,
                    resultsCount: 6,
                  },
                  {
                    id: 'JiraIssueAdvancedSearch',
                    hasContainerId: false,
                    resultsCount: 1,
                  },
                  {
                    id: expect.stringMatching(/jira-(object|project)-result/), // since it's random this can be either, not great, QS-200
                    hasContainerId: false,
                    resultsCount: 6,
                  },
                ],
          postQueryResultsTimings:
            product === 'confluence'
              ? {
                  confSearchElapsedMs: expect.any(Number),
                  postQueryRequestDurationMs: expect.any(Number),
                }
              : {
                  postQueryRequestDurationMs: expect.any(Number),
                  peopleElapsedMs: expect.any(Number),
                },
        },
      },
      {
        query: 'No Result',
        expectedResults: {
          textEnteredEvent: {
            queryLength: 9,
            queryVersion: 0,
            wordCount: 2,
          },
          postQueryResults: [],
        },
      },
    ].forEach(({ query, expectedResults }) => {
      describe(`Search query=${query}`, () => {
        const writeQuery = async (query: string) => {
          const input = wrapper.find('input');
          expect(input.length).toBe(1);
          input.simulate('input', {
            target: {
              value: query,
            },
          });

          await waitForAllUpdates();
        };

        beforeEach(async () => {
          await writeQuery(query);
        });

        it('should trigger entered text event', () => {
          const event = findAnalyticEventWithProperties(onEventSpy, {
            actionSubject: 'text',
            action: 'entered',
          });

          validateEvent(
            event,
            getTextEnteredEvent(expectedResults.textEnteredEvent),
          );
        });

        it('should trigger postquery drawer view event', () => {
          const event = findAnalyticEventWithProperties(onEventSpy, {
            actionSubject: 'globalSearchDrawer',
            action: 'viewed',
          });

          validateEvent(
            event,
            getGlobalSearchDrawerEvent({
              subscreen: 'GlobalSearchPostQueryDrawer',
              timesViewed: 1,
            }),
          );
        });

        it('should trigger post query search results event', () => {
          const event = findAnalyticEventWithProperties(onEventSpy, {
            actionSubject: 'searchResults',
            actionSubjectId: 'postQuerySearchResults',
            action: 'shown',
          });

          validateEvent(
            event,
            getPostQuerySearchResultsEvent(
              expectedResults.postQueryResults,
              expectedResults.postQueryResultsTimings,
              AB_TEST_DATA,
            ),
          );
        });

        describe('Clear Query', () => {
          beforeEach(async () => {
            await writeQuery('');
          });

          it('should trigger entered text event', () => {
            const event = findAnalyticEventWithProperties(onEventSpy, {
              actionSubject: 'text',
              action: 'entered',
            });

            validateEvent(
              event,
              getTextEnteredEvent({
                queryLength: 0,
                queryVersion: 1,
                wordCount: 0,
              }),
            );
          });

          // https://product-fabric.atlassian.net/browse/QS-1049
          it.skip('should trigger prequery drawer view event', () => {
            const event = findAnalyticEventWithProperties(onEventSpy, {
              actionSubject: 'globalSearchDrawer',
              action: 'viewed',
            });

            validateEvent(
              event,
              getGlobalSearchDrawerEvent({
                subscreen: 'GlobalSearchPreQueryDrawer',
                timesViewed: 2,
              }),
            );
          });

          it('should trigger show prequery results event ', () => {
            const event = findAnalyticEventWithProperties(onEventSpy, {
              actionSubject: 'searchResults',
              actionSubjectId: 'preQuerySearchResults',
              action: 'shown',
            });

            validateEvent(
              event,
              getPreQuerySearchResultsEvent(
                getRecentItems(product),
                AB_TEST_DATA,
              ),
            );
          });
        });
      });
    });

    // https://product-fabric.atlassian.net/browse/QS-1049
    describe.skip('Dismissed Event', () => {
      it('should not trigger dismissed Event when result is selected', () => {
        // setup
        keyPress('Enter');
        onEventSpy.mockClear();

        // execute
        wrapper.unmount();

        // assert
        expect(onEventSpy).not.toHaveBeenCalled();
      });

      it('should be trigger dismissed event', () => {
        // execute
        wrapper.mount();
        wrapper.unmount();

        // assert
        const dismissedEvent = findAnalyticEventWithProperties(onEventSpy, {
          actionSubject: 'globalSearchDrawer',
          action: 'dismissed',
        });
        validateEvent(dismissedEvent, getDismissedEvent());
      });
    });
  });
});
