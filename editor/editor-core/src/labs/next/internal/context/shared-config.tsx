import React from 'react';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import { Transformer } from '@atlaskit/editor-common';
import { EventDispatcher, Dispatch } from '../../../../event-dispatcher';
import { EditorAppearanceComponentProps } from '../../../../types';
import { FireAnalyticsCallback } from '../../../../plugins/analytics';
import EditorActions from '../../../../actions';
import { EditorProps } from '../editor-props-type';

/**
 * Provides access to most commonly used configurations and instances of classes,
 * that most editor components rely on.
 */
export type EditorSharedConfig = {
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
  dispatch: Dispatch;
  transformer?: Transformer<any>;
  dispatchAnalyticsEvent?: FireAnalyticsCallback;

  primaryToolbarComponents: EditorAppearanceComponentProps['primaryToolbarComponents'];
  contentComponents: EditorAppearanceComponentProps['contentComponents'];

  popupsMountPoint: EditorProps['popupsMountPoint'];
  popupsBoundariesElement: EditorProps['popupsBoundariesElement'];
  popupsScrollableElement: EditorProps['popupsScrollableElement'];
  providerFactory: EditorAppearanceComponentProps['providerFactory'];

  editorActions: EditorActions;

  onChange?: EditorProps['onChange'];
  onDestroy?: EditorProps['onDestroy'];
  onMount?: EditorProps['onMount'];
};

const EditorSharedConfigContext = React.createContext<EditorSharedConfig | null>(
  null,
);

export class EditorSharedConfigProvider extends React.Component<
  { value: EditorSharedConfig | null },
  any
> {
  static childContextTypes = {
    editorSharedConfig: PropTypes.object,
  };

  getChildContext() {
    return { editorSharedConfig: this.props.value };
  }

  render() {
    return (
      <EditorSharedConfigContext.Provider value={this.props.value}>
        {this.props.children}
      </EditorSharedConfigContext.Provider>
    );
  }
}

export class EditorSharedConfigConsumer extends React.Component<{
  children: (value: EditorSharedConfig | null) => React.ReactNode | null;
}> {
  static contextTypes = { editorSharedConfig: PropTypes.object };

  render() {
    return (
      <EditorSharedConfigContext.Consumer>
        {(value) =>
          this.props.children(this.context.editorSharedConfig || value)
        }
      </EditorSharedConfigContext.Consumer>
    );
  }
}

export const useEditorSharedConfig = () =>
  React.useContext(EditorSharedConfigContext);
