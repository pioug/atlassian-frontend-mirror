import React from 'react';
import PropTypes from 'prop-types';
import { WidthProvider } from '@atlaskit/editor-common/ui';
import { injectIntl, IntlShape, WrappedComponentProps } from 'react-intl-next';
import { useProviderFactory } from '@atlaskit/editor-common/provider-factory';
import EditorContext from '../../../../ui/EditorContext';
import EditorActions from '../../../../actions';
import { EditorPropsExtended } from '../editor-props-type';
import { EditorSharedConfigProvider } from '../context/shared-config';
import { useEditor } from '../hooks/use-editor';
import { EditorContentProvider } from './EditorContent';
function BaseEditorInternal(
  {
    onAnalyticsEvent,
    disabled,
    transformer,
    defaultValue,
    plugins,
    portalProviderAPI,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    onChange,
    onDestroy,
    onMount,
    children,
    intl,
  }: EditorPropsExtended & WrappedComponentProps,
  context: any,
) {
  // Need to memoize editor actions otherwise in case when editor is not
  // wrapped with EditorContext every prop change triggers all hooks
  // that depend on editorActions
  const maybeEditorActions = (context || {}).editorActions;
  const editorActions = React.useMemo(
    () => maybeEditorActions || new EditorActions(),
    [maybeEditorActions],
  );

  // Get the provider factory from context
  const providerFactory = useProviderFactory();
  const getIntl = (): IntlShape => intl;
  const [editorSharedConfig, mountEditor] = useEditor({
    context,
    editorActions,
    onAnalyticsEvent,

    disabled,

    transformer,
    defaultValue,

    plugins,

    portalProviderAPI,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,

    onChange,
    onDestroy,
    onMount,

    providerFactory,
    featureFlags: {},
    getIntl,
  });

  return (
    <WidthProvider>
      <EditorContext editorActions={editorActions}>
        <EditorSharedConfigProvider value={editorSharedConfig}>
          <EditorContentProvider value={mountEditor}>
            {children}
          </EditorContentProvider>
        </EditorSharedConfigProvider>
      </EditorContext>
    </WidthProvider>
  );
}

BaseEditorInternal.contextTypes = {
  editorActions: PropTypes.object,
};

export const EditorInternal = injectIntl(BaseEditorInternal);
