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
import { EditorNextProps } from '../types/editor-props';
import EditorInternal from './editor-internal';
import { Context, propTypes } from './utils/editorPropTypes';
import trackEditorActions from './utils/trackEditorActions';
import onEditorCreated from './utils/onEditorCreated';
import deprecationWarnings from './utils/deprecationWarnings';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import { basePlugin } from '../plugins';

export default class EditorNext extends React.Component<EditorNextProps> {
  static defaultProps = {
    appearance: 'comment',
    disabled: false,
    quickInsert: true,
  };

  static contextTypes = {
    editorActions: PropTypes.object,
  };

  static propTypes = {
    ...propTypes(
      'minHeight only supports editor appearance chromeless and comment for EditorNext',
    ),
    preset: ({ preset }: Pick<EditorNextProps, 'preset'>) => {
      if (!preset.has(basePlugin)) {
        return new Error('Presets must contain the base plugin');
      }
      return null;
    },
  };

  private editorActions: EditorActions;
  private createAnalyticsEvent?: CreateUIAnalyticsEvent;
  private editorSessionId: string;
  private experienceStore?: ExperienceStore;
  private startTime?: number;

  constructor(props: EditorNextProps, context: Context) {
    super(props);

    deprecationWarnings(props);
    this.editorActions = (context || {}).editorActions || new EditorActions();
    this.editorSessionId = uuid();
    this.startTime = performance.now();
    this.onEditorCreated = this.onEditorCreated.bind(this);
    this.onEditorDestroyed = this.onEditorDestroyed.bind(this);
    this.getExperienceStore = this.getExperienceStore.bind(this);
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
      this.getFeatureFlags,
    );
  }

  private getFeatureFlags = () => {
    return createFeatureFlagsFromProps(this.props);
  };

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
                preset={this.props.preset}
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
}
