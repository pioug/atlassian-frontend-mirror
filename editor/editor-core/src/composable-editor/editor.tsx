/** @jsx jsx */
import { useRef } from 'react';

import { jsx } from '@emotion/react';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import uuid from 'uuid/v4';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Transformer } from '@atlaskit/editor-common/types';
import { EditorExperience, ExperienceStore } from '@atlaskit/editor-common/ufo';
import {
  getAnalyticsAppearance,
  startMeasure,
  stopMeasure,
} from '@atlaskit/editor-common/utils';
import { basePlugin } from '@atlaskit/editor-plugin-base';

import EditorActions from '../actions';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import type { EventDispatcher } from '../event-dispatcher';
import type { EditorNextProps } from '../types/editor-props';
import { name, version } from '../version-wrapper';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import { useConstructor } from '@atlaskit/editor-common/hooks';
import { useEditorContext } from '../ui/EditorContext';
import measurements from '../utils/performance/measure-enum';
import { EditorInternal } from './editor-internal';
import sendDurationAnalytics from './utils/sendDurationAnalytics';
import trackEditorActions from './utils/trackEditorActions';
import useMeasureEditorMountTime from './hooks/useMeasureEditorMountTime';
import useProviderFactory from './hooks/useProviderFactory';

/**
 * Editor wrapper that deals with the lifecycle logic of the editor
 */
function Editor(passedProps: EditorNextProps) {
  const defaultProps: Partial<EditorNextProps> = {
    appearance: 'comment',
    disabled: false,
    quickInsert: true,
  };
  const props = { ...defaultProps, ...passedProps };

  const editorContext = useEditorContext();
  const editorActions = useRef(
    editorContext?.editorActions ?? new EditorActions(),
  );
  const startTime = useRef(performance.now());
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const experienceStore = useRef<ExperienceStore | undefined>();

  const handleAnalyticsEvent: FireAnalyticsCallback = (data) =>
    fireAnalyticsEvent(createAnalyticsEvent)(data);

  useConstructor(() => {
    trackEditorActions(
      editorActions.current,
      props.performanceTracking,
      (value) => handleAnalyticsEvent(value),
    );
  });

  const getExperienceStore = () => experienceStore.current;

  const onEditorCreated = (instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  }) => {
    editorActions.current._privateRegisterEditor(
      instance.view,
      instance.eventDispatcher,
      instance.transformer,
      () => createFeatureFlagsFromProps(props),
    );

    if (props.featureFlags?.ufo) {
      experienceStore.current = ExperienceStore.getInstance(instance.view);
      experienceStore.current?.start(
        EditorExperience.loadEditor,
        startTime.current,
      );
    }

    if (props.onEditorReady) {
      const measureEditorReady =
        props?.performanceTracking?.onEditorReadyCallbackTracking?.enabled ||
        props.featureFlags?.ufo;
      measureEditorReady && startMeasure(measurements.ON_EDITOR_READY_CALLBACK);
      props.onEditorReady(editorActions.current);
      measureEditorReady &&
        stopMeasure(
          measurements.ON_EDITOR_READY_CALLBACK,
          sendDurationAnalytics(
            ACTION.ON_EDITOR_READY_CALLBACK,
            props,
            getExperienceStore,
            createAnalyticsEvent,
          ),
        );
    }
  };

  const onEditorDestroyed = (_instance: {
    view: EditorView;
    transformer?: Transformer<string>;
  }) => {
    editorActions.current._privateUnregisterEditor();
    props.onDestroy?.();
  };

  useMeasureEditorMountTime(props, getExperienceStore, createAnalyticsEvent);

  const providerFactory = useProviderFactory(
    props,
    editorActions.current,
    createAnalyticsEvent,
  );

  return (
    <EditorInternal
      props={props}
      handleAnalyticsEvent={handleAnalyticsEvent}
      createAnalyticsEvent={createAnalyticsEvent}
      preset={props.preset}
      handleSave={(view) => props.onSave?.(view)}
      editorActions={editorActions.current}
      onEditorCreated={onEditorCreated}
      onEditorDestroyed={onEditorDestroyed}
      providerFactory={providerFactory}
    />
  );
}

export function ComposableEditor(props: EditorNextProps) {
  const editorSessionId = useRef(uuid());

  return (
    <FabricEditorAnalyticsContext
      data={{
        packageName: name,
        packageVersion: version,
        componentName: 'editorCore',
        appearance: getAnalyticsAppearance(props.appearance),
        editorSessionId: editorSessionId.current,
      }}
    >
      <Editor {...props} />
    </FabricEditorAnalyticsContext>
  );
}

ComposableEditor.propTypes = {
  minHeight: ({
    appearance,
    minHeight,
  }: Pick<EditorNextProps, 'appearance' | 'minHeight'>) => {
    if (
      minHeight &&
      appearance &&
      !['comment', 'chromeless'].includes(appearance)
    ) {
      return new Error(
        'minHeight only supports editor appearance chromeless and comment for Editor',
      );
    }
    return null;
  },

  preset: ({ preset }: Pick<EditorNextProps, 'preset'>) => {
    if (!preset.has(basePlugin)) {
      return new Error('Presets must contain the base plugin');
    }
    return null;
  },
};
