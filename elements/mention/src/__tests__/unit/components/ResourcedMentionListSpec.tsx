import React from 'react';
import { type ReactWrapper } from 'enzyme';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import MentionList from '../../../components/MentionList';
import ResourcedMentionList, {
  type Props,
  type State,
} from '../../../components/ResourcedMentionList';
import * as Analytics from '../../../util/analytics';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import MentionItem from '../../../components/MentionItem';

describe('ResourcedMentionList', () => {
  const mockResourceProvider = new MockMentionResource({
    minWait: 0,
    maxWait: 0,
  });

  const defaultProps: Props = {
    resourceProvider: mockResourceProvider,
  };

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
