import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import {
  ObjectResult as ObjectResultComponent,
  PersonResult as PersonResultComponent,
  ContainerResult as ContainerResultComponent,
} from '@atlaskit/quick-search';
import BoardIcon from '@atlaskit/icon/glyph/board';
import { UnwrappedResultList as ResultList, Props } from '../../ResultList';
import {
  Result,
  JiraResult,
  PersonResult,
  AnalyticsType,
  ConfluenceObjectResult,
  ContentType,
  ContainerResult,
} from '../../../model/Result';
import {
  makeConfluenceObjectResult,
  makeConfluenceContainerResult,
  makePersonResult,
  makeJiraObjectResult,
} from '../../../__tests__/unit/_test-util';
import * as JiraAvatarUtil from '../../../util/jira-avatar-util';
import {
  DEFAULT_FEATURES,
  ConfluenceFeatures,
  JiraFeatures,
} from '../../../util/features';
import { messages } from '../../../messages';

const DUMMY_ANALYTICS_DATA = {
  resultCount: 123,
};

function render(
  partialProps: Partial<Props>,
  features?: ConfluenceFeatures & JiraFeatures,
) {
  const props: Props = {
    results: [],
    sectionIndex: 0,
    ...partialProps,
    features: features || DEFAULT_FEATURES,
  };

  return shallow(<ResultList {...props} />);
}

it('should pass the correct properties to ObjectResult for Jira results', () => {
  const jiraResults: JiraResult[] = [
    makeJiraObjectResult({
      resultId: 'resultId',
    }),
  ];

  const wrapper = render({
    results: jiraResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(ObjectResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'jira-issue-resultId',
    type: 'result-jira',
    objectKey: 'objectKey',
    avatarUrl: 'avatarUrl',
    name: 'name',
    containerName: 'containerName',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

it('should pass the correct properties to PersonResult for people results', () => {
  const peopleResults: PersonResult[] = [
    makePersonResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultPerson,
    }),
  ];

  const wrapper = render({
    results: peopleResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(PersonResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'person-resultId',
    type: 'result-person',
    avatarUrl: 'avatarUrl',
    name: 'name',
    mentionName: 'mentionName',
    presenceMessage: 'presenceMessage',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

it('should pass the correct properties to ObjectResult for Confluence results', () => {
  const confluenceResults: ConfluenceObjectResult[] = [
    makeConfluenceObjectResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
  ];

  const wrapper = render({
    results: confluenceResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(ObjectResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'confluence-page-resultId',
    type: 'result-confluence',
    name: 'name',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });

  const expectedI18nMessage =
    messages.confluence_container_subtext_with_modified_date;
  const message = shallow(wrapper.props().containerName);

  expect(message.find(FormattedMessage).props()).toMatchObject({
    ...expectedI18nMessage,
    values: {
      containerName: 'containerName',
      friendlyLastModified: 'friendly-last-modified',
    },
  } as {});
});

it('should pass the correct properties to ContainerResult for Confluence spaces', () => {
  const confluenceSpaceResults: ContainerResult[] = [
    makeConfluenceContainerResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
  ];

  const wrapper = render({
    results: confluenceSpaceResults,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  expect(wrapper.find(ContainerResultComponent).props()).toMatchObject({
    href: 'href',
    resultId: 'confluence-space-resultId',
    type: 'result-confluence',
    avatarUrl: 'avatarUrl',
    name: 'name',
    analyticsData: expect.objectContaining(DUMMY_ANALYTICS_DATA),
  });
});

it('should avoid duplicate result keys', () => {
  const results: Result[] = [
    makeConfluenceContainerResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
    makeConfluenceObjectResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultConfluence,
    }),
    makePersonResult({
      resultId: 'resultId',
      analyticsType: AnalyticsType.ResultPerson,
    }),
  ];

  const wrapper = render({
    results,
    analyticsData: DUMMY_ANALYTICS_DATA,
  });

  const containerKey = wrapper.find(ContainerResultComponent).key();
  const objectKey = wrapper.find(ObjectResultComponent).key();
  const personKey = wrapper.find(PersonResultComponent).key();

  expect(containerKey).toEqual(
    expect.stringMatching('confluence-space-resultId_*'),
  );
  expect(objectKey).toEqual(
    expect.stringMatching('confluence-page-resultId_*'),
  );
  expect(personKey).toEqual(expect.stringMatching('person-resultId'));
});

describe.skip('Jira Avatar default Icons', () => {
  let spy: jest.SpyInstance<JSX.Element | null, [ContentType]>;
  beforeEach(() => {
    spy = jest.spyOn(JiraAvatarUtil, 'getDefaultAvatar');
    spy.mockReturnValue(<BoardIcon label="blah" />);
  });

  afterEach(() => {
    spy.mockRestore();
  });
  it('should support default icons for jira if avatar is missing', () => {
    let jiraItem = makeJiraObjectResult({
      resultId: 'resultId',
    });
    jiraItem.contentType = ContentType.JiraBoard;
    jiraItem.avatarUrl = undefined;
    const jiraResults: JiraResult[] = [jiraItem];
    const wrapper = render({
      results: jiraResults,
      analyticsData: DUMMY_ANALYTICS_DATA,
    });

    const avatar = wrapper.find(ObjectResultComponent).prop('avatar');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(avatar).toEqual(BoardIcon);
  });
});
