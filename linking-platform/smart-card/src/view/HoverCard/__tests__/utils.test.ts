import { JsonLd } from 'json-ld-types';

import { toActionableMetadata } from '../utils';
import { ElementItem, ElementName } from '@atlaskit/smart-card';

describe('toActionableMetadata', () => {
  const onActionClick = jest.fn();
  const extensionKey = 'link-object-provider';
  const types: JsonLd.Primitives.ObjectType[] = ['Object'];

  describe('Jira', () => {
    const jiraExtensionKey = 'jira-object-provider';
    const jiraIssueTypes: JsonLd.Primitives.ObjectType[] = [
      'Object',
      'atlassian:Task',
    ];
    const jiraElementItems = [
      { name: ElementName.AuthorGroup },
      { name: ElementName.State },
      { name: ElementName.Priority },
    ] as ElementItem[];
    const jiraCardActions = [
      {
        id: 'preview-content',
        text: 'Preview',
        invoke: jest.fn(),
      },
    ];

    it('returns actionable element items for jira task link with preview action', () => {
      const elementItems = toActionableMetadata(
        onActionClick,
        jiraExtensionKey,
        jiraIssueTypes,
        jiraCardActions,
        jiraElementItems,
      );

      expect(elementItems).toEqual([
        { name: ElementName.AuthorGroup },
        { name: ElementName.State, onClick: expect.any(Function) },
        { name: ElementName.Priority },
      ]);
    });

    it('calls onActionClick and invoke functions on click', () => {
      const elementItems = toActionableMetadata(
        onActionClick,
        jiraExtensionKey,
        jiraIssueTypes,
        jiraCardActions,
        jiraElementItems,
      );
      const state = elementItems.find(({ name }) => name === ElementName.State);
      // @ts-ignore For testing purpose
      state?.onClick();

      expect(onActionClick).toHaveBeenNthCalledWith(1, 'preview-content');
      expect(jiraCardActions[0].invoke).toHaveBeenNthCalledWith(1, {
        isReloadRequired: true,
      });
    });

    it('does not change the order of element item', () => {
      const elementItems = toActionableMetadata(
        onActionClick,
        jiraExtensionKey,
        jiraIssueTypes,
        jiraCardActions,
        jiraElementItems,
      );

      expect(elementItems[0].name).toBe(ElementName.AuthorGroup);
      expect(elementItems[1].name).toBe(ElementName.State);
      expect(elementItems[2].name).toBe(ElementName.Priority);
    });

    it('does not return actionable element items for jira task link without preview action', () => {
      const elementItems = toActionableMetadata(
        onActionClick,
        jiraExtensionKey,
        jiraIssueTypes,
        [],
        jiraElementItems,
      );

      expect(elementItems).toEqual([
        { name: ElementName.AuthorGroup },
        { name: ElementName.State },
        { name: ElementName.Priority },
      ]);
    });

    it('does not return actionable element item for non task type jira link', () => {
      const elementItems = toActionableMetadata(
        onActionClick,
        jiraExtensionKey,
        ['Object', 'atlassian:Project'],
        jiraCardActions,
        jiraElementItems,
      );

      expect(elementItems).toEqual([
        { name: ElementName.AuthorGroup },
        { name: ElementName.State },
        { name: ElementName.Priority },
      ]);
    });
  });

  it('returns element items', () => {
    const expectedElementItems = [
      { name: ElementName.CommentCount },
    ] as ElementItem[];
    const elementItems = toActionableMetadata(
      onActionClick,
      extensionKey,
      types,
      [],
      expectedElementItems,
    );

    expect(elementItems).toEqual(expectedElementItems);
  });

  it('does not change the order of element items', () => {
    const expectedElementItems = [
      { name: ElementName.CommentCount },
      { name: ElementName.SubscriberCount },
    ] as ElementItem[];
    const elementItems = toActionableMetadata(
      onActionClick,
      extensionKey,
      types,
      [],
      expectedElementItems,
    );

    expect(elementItems[0].name).toBe(ElementName.CommentCount);
    expect(elementItems[1].name).toBe(ElementName.SubscriberCount);
  });
});
