import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorExperience, ExperienceStore } from '@atlaskit/editor-common/ufo';

import { Transformer } from '@atlaskit/editor-common/types';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../../actions';
import { EventDispatcher } from '../../event-dispatcher';
import { ACTION } from '@atlaskit/editor-common/analytics';
import { EditorProps, EditorNextProps } from '../../types/editor-props';
import measurements from '../../utils/performance/measure-enum';
import sendDurationAnalytics from './sendDurationAnalytics';

export default function onEditorCreated(
  instance: {
    view: EditorView;
    eventDispatcher: EventDispatcher;
    transformer?: Transformer<string>;
  },
  props: EditorProps | EditorNextProps,
  setExperienceStore: (experienceStore: ExperienceStore) => void,
  getExperienceStore: () => ExperienceStore | undefined,
  getCreateAnalyticsEvent: () => CreateUIAnalyticsEvent | undefined,
  editorActions: EditorActions,
  startTime: number | undefined,
  registerEditorForActions: (
    editorView: EditorView,
    eventDispatcher: EventDispatcher,
    contentTransformer?: Transformer<string>,
  ) => void,
) {
  registerEditorForActions(
    instance.view,
    instance.eventDispatcher,
    instance.transformer,
  );

  if (props.featureFlags?.ufo) {
    setExperienceStore(ExperienceStore.getInstance(instance.view));
    getExperienceStore()?.start(EditorExperience.loadEditor, startTime);
  }

  if (props.onEditorReady) {
    const measureEditorReady =
      props?.performanceTracking?.onEditorReadyCallbackTracking?.enabled ||
      props.featureFlags?.ufo;
    measureEditorReady && startMeasure(measurements.ON_EDITOR_READY_CALLBACK);
    props.onEditorReady(editorActions);
    measureEditorReady &&
      stopMeasure(
        measurements.ON_EDITOR_READY_CALLBACK,
        sendDurationAnalytics(
          ACTION.ON_EDITOR_READY_CALLBACK,
          props,
          getExperienceStore,
          getCreateAnalyticsEvent(),
        ),
      );
  }
}
