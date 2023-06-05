import type { JsonLd } from 'json-ld-types';
import jiraTask from '../../../__fixtures__/jira-task';
import extractState from '../extract-state';
import { SmartLinkActionType } from '@atlaskit/linking-types';

describe('extractState', () => {
  const response = (serverAction = {}, preview = {}): JsonLd.Response =>
    ({
      ...jiraTask,
      data: {
        ...jiraTask.data,
        preview: { ...preview },
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

    const previewData = {
      isSupportTheming: true,
      linkIcon: {
        url: 'https://some-jira-instance/rest/api/2/universal_avatar/view/type/issuetype/avatar/10315',
      },
      providerName: 'Jira',
      src: 'https://some-jira-instance/browse/AT-1/embed?parentProduct=smartlink',
      title: 'AT-1: TESTTTTTT',
      url,
    };

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

    it('does not return preview data inside the action when preview is not provided in response', () => {
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

      expect(state?.action).toBeDefined();
      expect(state?.action?.update?.details).toEqual({
        id,
        url,
      });
    });

    it('returns preview data inside the action when preview is provided in response', () => {
      const state = extractState(
        response(
          [
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
          ],
          previewData,
        ),
        true,
        id,
      );

      expect(state?.action).toBeDefined();
      expect(state?.action?.update?.details).toEqual({
        id,
        url,
        previewData: {
          isSupportTheming: true,
          linkIcon: {
            url: 'https://icon-url',
          },
          providerName: 'Jira',
          src: 'https://jira-url/browse/id',
          title: 'Flexible UI Task',
          url,
        },
      });
    });

    describe('server action options', () => {
      it('returns action when server action options is an object (truthy)', () => {
        const state = extractState(jiraTask as JsonLd.Response, {}, id);

        expect(state?.action).toEqual({ read, update });
      });

      describe('feature discovery', () => {
        it('returns feature discovery option with truthy value', () => {
          const state = extractState(
            jiraTask as JsonLd.Response,
            { showStateActionFeatureDiscovery: true },
            id,
          );

          expect(state?.action).toEqual({
            read,
            update,
            showFeatureDiscovery: true,
          });
        });

        it('returns feature discovery option with falsy value', () => {
          const state = extractState(
            jiraTask as JsonLd.Response,
            { showStateActionFeatureDiscovery: false },
            id,
          );

          expect(state?.action).toEqual({
            read,
            update,
            showFeatureDiscovery: false,
          });
        });
      });
    });
  });
});
