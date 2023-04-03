import { GetEditorPlugins } from '../types/get-editor-props';
import createPluginsList from '../create-editor/create-plugins-list';

/**
 *
 * Retrieve the editor props using createPluginList default behaviour.
 *
 * @param GetEditorPlugins props used to initialise the plugins
 * @returns list of editor plugins
 */
const getEditorPlugins: GetEditorPlugins = ({
  props,
  prevAppearance,
  createAnalyticsEvent,
  insertNodeAPI,
  editorAnalyticsAPI,
}) => {
  const dangerouslyAppendedPlugins =
    props.dangerouslyAppendPlugins?.__plugins ?? [];
  return [
    ...createPluginsList(
      props,
      { appearance: prevAppearance },
      createAnalyticsEvent,
    ),
    ...dangerouslyAppendedPlugins,
  ];
};

export default getEditorPlugins;
