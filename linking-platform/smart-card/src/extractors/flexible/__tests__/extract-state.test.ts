import type { JsonLd } from 'json-ld-types';
import jiraTask from '../../../__fixtures__/jira-task';
import extractState from '../extract-state';
import { SmartLinkActionType } from '@atlaskit/linking-types';

describe('extractState', () => {
  const response = (serverAction = {}): JsonLd.Response =>
    ({
      ...jiraTask,
      data: {
        ...jiraTask.data,
        'atlassian:serverAction': serverAction,
      },
    } as JsonLd.Response);

  it('returns state lozenge content', () => {
    const content = extractState(jiraTask as JsonLd.Response);

    expect(content?.text).toBeDefined();
    expect(content?.appearance).toBeDefined();
  });

  describe('server action', () => {
    const id = 'link-id';
    const url = jiraTask.data.url;
    const providerKey = jiraTask.meta.key;
    const resourceIdentifiers =
      jiraTask.data['atlassian:serverAction'][0].resourceIdentifiers;
    const read = {
      action: {
        actionType: SmartLinkActionType.GetStatusTransitionsAction,
        resourceIdentifiers,
      },
      providerKey,
    };

    const update = {
      action: {
        actionType: SmartLinkActionType.StatusUpdateAction,
        resourceIdentifiers,
      },
      providerKey,
      details: { url, id },
    };

    it('returns lozenge action when server action is enabled', () => {
      const state = extractState(jiraTask as JsonLd.Response, true, id);

      expect(state?.action).toBeDefined();
      expect(state?.action?.read).toBeDefined();
      expect(state?.action?.update).toBeDefined();
    });

    it('does not return lozenge action when server action is disabled', () => {
      const state = extractState(jiraTask as JsonLd.Response, false, id);

      expect(state?.action).toBeUndefined();
    });

    it('does not return lozenge action when server action is not provided', () => {
      const state = extractState(jiraTask as JsonLd.Response);

      expect(state?.action).toBeUndefined();
    });

    it('does not return lozenge action when server action is not defined', () => {
      const state = extractState(response(), true, id);

      expect(state?.action).toBeUndefined();
    });

    it('does not return lozenge action when server action are empty', () => {
      const state = extractState(response([]), true, id);

      expect(state?.action).toBeUndefined();
    });

    it('returns read and update action', () => {
      const state = extractState(jiraTask as JsonLd.Response, true, id);

      expect(state?.action).toEqual({ read, update });
    });

    it('returns only read action when update action is not provided', () => {
      const state = extractState(
        response([
          {
            '@type': 'UpdateAction',
            name: 'UpdateAction',
            dataRetrievalAction: {
              '@type': 'ReadAction',
              name: SmartLinkActionType.GetStatusTransitionsAction,
            },
            refField: 'tag',
            resourceIdentifiers,
          },
        ]),
        true,
        id,
      );

      expect(state?.action).toEqual({ read });
    });

    it('returns only update action when read action is not provided', () => {
      const state = extractState(
        response([
          {
            '@type': 'UpdateAction',
            name: 'UpdateAction',
            dataUpdateAction: {
              '@type': 'UpdateAction',
              name: SmartLinkActionType.StatusUpdateAction,
            },
            refField: 'tag',
            resourceIdentifiers,
          },
        ]),
        true,
        id,
      );

      expect(state?.action).toEqual({ update });
    });

    it('does not return action when action name is not provided', () => {
      const state = extractState(
        response([
          {
            '@type': 'UpdateAction',
            name: 'UpdateAction',
            dataRetrievalAction: {
              '@type': 'ReadAction',
            },
            dataUpdateAction: {
              '@type': 'UpdateAction',
            },
            refField: 'tag',
            resourceIdentifiers,
          },
        ]),
        true,
        id,
      );

      expect(state?.action).toBeUndefined();
    });

    it('does not return action when resource identifier is not provided', () => {
      const state = extractState(
        response([
          {
            '@type': 'UpdateAction',
            name: 'UpdateAction',
            dataRetrievalAction: {
              '@type': 'ReadAction',
              name: SmartLinkActionType.GetStatusTransitionsAction,
            },
            refField: 'tag',
          },
        ]),
        true,
        id,
      );

      expect(state?.action).toBeUndefined();
    });
  });
});
