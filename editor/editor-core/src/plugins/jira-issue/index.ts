import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { confluenceJiraIssue } from '@atlaskit/adf-schema';
import type { NextEditorPlugin, PMPluginFactory } from '../../types';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';

import ReactJIRAIssueNode from './nodeviews/jira-issue';

export const pluginKey = new PluginKey('jiraIssuePlugin');

const createPlugin: PMPluginFactory = ({
  portalProviderAPI,
  eventDispatcher,
}) => {
  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceJiraIssue: ReactNodeView.fromComponent(
          ReactJIRAIssueNode,
          portalProviderAPI,
          eventDispatcher,
        ),
      },
    },
  });
};

const jiraIssuePlugin: NextEditorPlugin<'confluenceJiraIssue'> = () => ({
  name: 'confluenceJiraIssue',

  nodes() {
    return [{ name: 'confluenceJiraIssue', node: confluenceJiraIssue }];
  },

  pmPlugins() {
    return [
      {
        name: 'jiraIssue',
        plugin: createPlugin,
      },
    ];
  },
});

export default jiraIssuePlugin;
