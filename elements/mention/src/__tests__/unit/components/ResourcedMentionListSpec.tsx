import React from 'react';
import { shallow, ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import MentionList from '../../../components/MentionList';
import ResourcedMentionList, {
  ResourcedMentionListWithoutAnalytics,
  Props,
  State,
} from '../../../components/ResourcedMentionList';
import * as Analytics from '../../../util/analytics';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import MentionItem from '../../../components/MentionItem';

let mockRegisterClosed = jest.fn();
let mockIsHighlightEnabled = jest.fn();

jest.mock(
  '../../../components/TeamMentionHighlight/TeamMentionHighlightController',
  () => ({
    __esModule: true,
    default: {
      registerClosed: () => mockRegisterClosed(),
      isHighlightEnabled: () => mockIsHighlightEnabled(),
    },
  }),
);

describe('ResourcedMentionList', () => {
  const mockResourceProvider = new MockMentionResource({
    minWait: 0,
    maxWait: 0,
  });

  const defaultProps: Props = {
    resourceProvider: mockResourceProvider,
  };

  function render(props?: Partial<Props>) {
    return shallow(
      <ResourcedMentionListWithoutAnalytics {...defaultProps} {...props} />,
    );
  }

  function setupComponent(props?: Partial<Props>): ReactWrapper<Props, State> {
    const resourceProvider = new MockMentionResource({
      minWait: 0,
      maxWait: 0,
    });
    return mountWithIntl(
      <ResourcedMentionList
        //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
        resourceProvider={resourceProvider}
        query=""
        {...defaultProps}
        {...props}
      />,
    ) as ReactWrapper<Props, State>;
  }

  it('should show the highlight if conditions are just right', () => {
    mockIsHighlightEnabled.mockReturnValue(true);
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const highlight = element.find(MentionList).props().initialHighlightElement;
    expect(highlight).toBeDefined();
  });

  it('should not show the highlight if there are no users', () => {
    mockIsHighlightEnabled.mockReturnValue(true);
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({ mentions: [] });

    const highlight = element.find(MentionList).props().initialHighlightElement;
    expect(highlight).toBeNull();
  });

  it('should not show the highlight if the highlight flag is disabled', () => {
    mockIsHighlightEnabled.mockReturnValue(true);
    const element = render({ isTeamMentionHighlightEnabled: false });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const highlight = element.find(MentionList).props().initialHighlightElement;
    expect(highlight).toBeNull();
  });

  it('should not show the highlight if the user has opted out', () => {
    mockIsHighlightEnabled.mockReturnValue(false);
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const highlight = element.find(MentionList).props().initialHighlightElement;
    expect(highlight).toBeNull();
  });

  it('should register a closed event when users closes', () => {
    mockIsHighlightEnabled.mockReturnValue(true);
    const element = render({ isTeamMentionHighlightEnabled: true });
    element.setState({ mentions: [{ id: 'someUser' }] });

    const highlight = element.find(MentionList).props().initialHighlightElement;
    highlight && highlight.props.onClose();

    expect(mockRegisterClosed).toHaveBeenCalled();
  });

  it('should show mentions after loading using resource', async () => {
    const component = setupComponent({
      query: 's',
    });

    expect(component).toBeDefined();
    expect(component.find(MentionList).find(MentionItem).length).toBe(0);
    await waitUntil(() => {
      component.update();
      return component.find(MentionList).find(MentionItem).length > 0;
    });

    expect(component.find(MentionList).find(MentionItem).length).toBe(6);
  });

  it('should trigger SLI analytics if search has been called', async () => {
    const analytics = jest.spyOn(Analytics, 'fireSliAnalyticsEvent');
    const component = setupComponent({
      isTeamMentionHighlightEnabled: false,
      query: 's',
    });

    expect(component).toBeDefined();
    await waitUntil(() => {
      component.update();
      return component.find(MentionList).find(MentionItem).length > 0;
    });

    expect(analytics).toHaveBeenCalled();
  });
});
