import React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import Button from '@atlaskit/button/custom-theme-button';
import TeamMentionHighlight, {
  Props,
} from '../../../components/TeamMentionHighlight';
import * as TeamMentionHighlightAnalytics from '../../../util/analytics';

const noop = () => {};

function render(props: Partial<Props>) {
  return mountWithIntl(
    <TeamMentionHighlight
      createTeamLink="somelink"
      onClose={() => noop}
      {...props}
    />,
  );
}

let mockRegisterRender = jest.fn();
let mockRegisterCreateLinkClick = jest.fn();
let mockGetSeenCount = jest.fn();
let mockFireAnalyticsHighlightMentionEvent = jest.fn();
let mockIsTeamMentionHighlightEnabled = true;

mockGetSeenCount.mockReturnValue('testValue');

jest.mock(
  '../../../components/TeamMentionHighlight/TeamMentionHighlightController',
  () => ({
    __esModule: true,
    default: {
      registerRender: () => mockRegisterRender(),
      registerCreateLinkClick: () => mockRegisterCreateLinkClick(),
      getSeenCount: () => mockGetSeenCount(),
      isHighlightEnabled: () => mockIsTeamMentionHighlightEnabled,
    },
  }),
);

jest.mock('../../../util/analytics', () => {
  const mockActualAnalytics = jest.requireActual('../../../util/analytics');

  return {
    Actions: mockActualAnalytics.Actions,
    ComponentNames: mockActualAnalytics.ComponentNames,
    fireAnalyticsTeamMentionHighlightEvent: () =>
      mockFireAnalyticsHighlightMentionEvent,
  };
});

describe('MentionHighlight', () => {
  beforeEach(() => {
    mockIsTeamMentionHighlightEnabled = true;
    mockRegisterRender.mockReset();
  });

  // Because we manually bind events, we need to fire events and test outside of React
  it('Should register closed on button click', () => {
    const onClose = jest.fn();
    const highlight = render({ onClose: onClose });

    const closeButton = highlight.find('button').getDOMNode();

    // make sure the click event is able to bubble
    const event = new Event('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    closeButton.dispatchEvent(event);

    expect(onClose).toHaveBeenCalled();
  });

  it('Should register render on mount', () => {
    render({});
    expect(mockRegisterRender).toHaveBeenCalled();
  });

  it('should not call registerRender if Highlight Controller asked not to render highlight', () => {
    mockIsTeamMentionHighlightEnabled = false;
    render({});
    expect(mockRegisterRender).toHaveBeenCalledTimes(0);
  });

  // Because we manually bind events, we need to fire events and test outside of React
  it('Should register link on click', () => {
    const highlight = render({});
    const link = highlight.find('a').getDOMNode();
    mockRegisterCreateLinkClick.mockReset();

    // make sure the click event is able to bubble
    const event = new Event('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    link.dispatchEvent(event);

    expect(mockRegisterCreateLinkClick).toHaveBeenCalled();
  });

  it('should not show the highlight if the highlight has been closed by the user', () => {
    const highlight = render({ onClose: jest.fn() });
    expect(highlight.html()).not.toEqual('');

    const closeButton = highlight.find('button').getDOMNode();
    // make sure the click event is able to bubble
    const event = new Event('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    closeButton.dispatchEvent(event);

    // because above line is an external change, need to force re-rendering
    highlight.update();
    expect(highlight.html()).toEqual('');
  });

  it('should send analytics data if the highlight has been closed by the user', () => {
    const highlight = render({ onClose: jest.fn() });
    expect(highlight.html()).not.toEqual('');
    highlight.find(Button).simulate('click');
    expect(mockFireAnalyticsHighlightMentionEvent).toHaveBeenCalledWith(
      TeamMentionHighlightAnalytics.ComponentNames.TEAM_MENTION_HIGHLIGHT,
      TeamMentionHighlightAnalytics.Actions.CLOSED,
      TeamMentionHighlightAnalytics.ComponentNames.MENTION,
      'closeButton',
    );
  });

  it('should send analytics data if user clicks on highlight link', () => {
    const highlight = render({ onClose: jest.fn() });
    expect(highlight.html()).not.toEqual('');
    highlight.find('a').simulate('click');
    expect(mockFireAnalyticsHighlightMentionEvent).toHaveBeenCalledWith(
      TeamMentionHighlightAnalytics.ComponentNames.TEAM_MENTION_HIGHLIGHT,
      TeamMentionHighlightAnalytics.Actions.CLICKED,
      TeamMentionHighlightAnalytics.ComponentNames.MENTION,
      'createTeamLink',
    );
  });

  it('should send analytics data if the highlight has been displayed', () => {
    mockRegisterRender = jest.fn();
    mockGetSeenCount = jest.fn();
    render({ onClose: jest.fn() });

    expect(mockRegisterRender).toHaveBeenCalledTimes(1);
    expect(mockGetSeenCount).toHaveBeenCalledTimes(1);

    expect(mockFireAnalyticsHighlightMentionEvent).toHaveBeenCalledWith(
      TeamMentionHighlightAnalytics.ComponentNames.TEAM_MENTION_HIGHLIGHT,
      TeamMentionHighlightAnalytics.Actions.VIEWED,
      TeamMentionHighlightAnalytics.ComponentNames.MENTION,
      undefined,
      'testValue',
    );
  });

  it('should not show highlight after re-render if the Highlight Controller asked not to render it at the first mount', () => {
    mockIsTeamMentionHighlightEnabled = false;
    const highlight = render({});

    expect(highlight.html()).toEqual('');

    // after first render, ask controller to show it
    mockIsTeamMentionHighlightEnabled = true;

    //should still hide the highlight after re-render
    highlight.render();
    expect(highlight.html()).toEqual('');
  });

  it('should show highlight after re-render if the Highlight Controller asked to render it at the first mount', () => {
    const highlight = render({});

    // Should render in the first time
    expect(highlight.html()).not.toEqual('');

    //after first render, ask controller to hide it
    mockIsTeamMentionHighlightEnabled = false;

    //should still show the highlight after re-render
    highlight.render();
    expect(highlight.html()).not.toEqual('');
  });
});
