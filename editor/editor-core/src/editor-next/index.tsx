/** @jsx jsx */
import { Transformer } from '@atlaskit/editor-common/types';
import { WithCreateAnalyticsEvent } from '@atlaskit/editor-common/ui';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { name, version } from '../version-wrapper';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import uuid from 'uuid/v4';
import EditorActions from '../actions';
import { EventDispatcher } from '../event-dispatcher';
import {
  FireAnalyticsCallback,
  fireAnalyticsEvent,
} from '@atlaskit/editor-common/analytics';
import { EditorProps } from '../types/editor-props';
import EditorInternal from './editor-internal';
import { Context, defaultProps, propTypes } from './utils/editorPropTypes';
import trackEditorActions from './utils/trackEditorActions';
import onEditorCreated from './utils/onEditorCreated';
import deprecationWarnings from './utils/deprecationWarnings';
import { EditorPlugin } from '../types';
import { GetEditorPluginsProps } from '../types/get-editor-props';
import getEditorPlugins from '../utils/get-editor-plugins';

export default class EditorNext extends React.Component<EditorProps> {
  /**
   * WARNING: Code should be shared between Editor + EditorNext
   * If you are making changes that affect both, consider making them
   * in editor-next/editor-internal.tsx or editor-next/editor-utils.ts
   */

  static defaultProps = defaultProps;

  static contextTypes = {
    editorActions: PropTypes.object,
  };

  static propTypes = propTypes(
    'minHeight only supports editor appearance chromeless and comment for EditorNext',
  );

  private editorActions: EditorActions;
  private createAnalyticsEvent?: CreateUIAnalyticsEvent;
  private editorSessionId: string;
  private experienceStore?: ExperienceStore;
  private startTime?: number;

  constructor(props: EditorProps, context: Context) {
    super(props);

    deprecationWarnings(props);
    this.editorActions = (context || {}).editorActions || new EditorActions();
    this.editorSessionId = uuid();
    this.startTime = performance.now();
    this.onEditorCreated = this.onEditorCreated.bind(this);
    this.onEditorDestroyed = this.onEditorDestroyed.bind(this);
    this.getExperienceStore = this.getExperienceStore.bind(this);
    this.getEditorPlugins = this.getEditorPlugins.bind(this);
    trackEditorActions(this.editorActions, props.performanceTracking, (value) =>
      this.handleAnalyticsEvent(value),
    );
  }

  private onEditorCreated(instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) {
    onEditorCreated(
      instance,
      this.props,
      (experienceStore) => (this.experienceStore = experienceStore),
      this.getExperienceStore,
      () => this.createAnalyticsEvent,
      this.editorActions,
      this.startTime,
      (view, dispatcher, transformerForActions) =>
        this.registerEditorForActions(view, dispatcher, transformerForActions),
    );
  }

  private onEditorDestroyed(_instance: {
    view: EditorView;
    transformer?: Transformer<string>;
  }) {
    this.unregisterEditorFromActions();
    this.props.onDestroy?.();
  }

  private handleSave = (view: EditorView): void => this.props.onSave?.(view);

  private handleAnalyticsEvent: FireAnalyticsCallback = (data) =>
    fireAnalyticsEvent(this.createAnalyticsEvent)(data);

  private registerEditorForActions(
    editorView: EditorView,
    eventDispatcher: EventDispatcher,
    contentTransformer?: Transformer<string>,
  ) {
    this.editorActions._privateRegisterEditor(
      editorView,
      eventDispatcher,
      contentTransformer,
    );
  }

  private unregisterEditorFromActions() {
    this.editorActions._privateUnregisterEditor();
  }

  private getExperienceStore = () => this.experienceStore;

  render() {
    return (
      <FabricEditorAnalyticsContext
        data={{
          packageName: name,
          packageVersion: version,
          componentName: 'editorCore',
          appearance: getAnalyticsAppearance(this.props.appearance),
          editorSessionId: this.editorSessionId,
        }}
      >
        <WithCreateAnalyticsEvent
          render={(createAnalyticsEvent) =>
            (this.createAnalyticsEvent = createAnalyticsEvent) && (
              <EditorInternal
                props={this.props}
                handleAnalyticsEvent={this.handleAnalyticsEvent}
                createAnalyticsEvent={this.createAnalyticsEvent}
                getEditorPlugins={this.getEditorPlugins}
                handleSave={this.handleSave}
                editorActions={this.editorActions}
                getExperienceStore={this.getExperienceStore}
                onEditorCreated={this.onEditorCreated}
                onEditorDestroyed={this.onEditorDestroyed}
              />
            )
          }
        />
      </FabricEditorAnalyticsContext>
    );
  }

  private getEditorPlugins(props: GetEditorPluginsProps): EditorPlugin[] {
    return getEditorPlugins(props);
  }
}
