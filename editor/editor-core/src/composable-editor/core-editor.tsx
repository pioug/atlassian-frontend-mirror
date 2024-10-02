/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import isEqual from 'lodash/isEqual';
import uuid from 'uuid/v4';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import type { Transformer } from '@atlaskit/editor-common/types';
import { EditorExperience, ExperienceStore } from '@atlaskit/editor-common/ufo';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils/analytics';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import EditorActions from '../actions';
import { createFeatureFlagsFromProps } from '../create-editor/feature-flags-from-props';
import type { EventDispatcher } from '../event-dispatcher';
import type { EditorNextProps, EditorProps } from '../types/editor-props';
import { type WithAppearanceComponent } from '../types/with-appearance-component';
import { useEditorContext } from '../ui/EditorContext';
import measurements from '../utils/performance/measure-enum';
import { name, version } from '../version-wrapper';

import { EditorInternal } from './editor-internal';
import useMeasureEditorMountTime from './hooks/useMeasureEditorMountTime';
import useMemoEditorProps from './hooks/useMemoEditorProps';
import useProviderFactory from './hooks/useProviderFactory';
import sendDurationAnalytics from './utils/sendDurationAnalytics';

/**
 * Editor wrapper that deals with the lifecycle logic of the editor
 */
function Editor(passedProps: EditorProps & EditorNextProps & WithAppearanceComponent) {
	const propsRef = useRef(passedProps);
	const props = useMemoEditorProps(passedProps);
	useMemo(() => {
		propsRef.current = props;
	}, [props]);

	const editorContext = useEditorContext();
	const editorActionsPlaceholderInstance = useMemo(() => new EditorActions(), []);
	const editorActions = editorContext.editorActions || editorActionsPlaceholderInstance;
	const startTime = useRef(performance.now());
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const experienceStore = useRef<ExperienceStore | undefined>();

	const handleAnalyticsEvent: FireAnalyticsCallback = useCallback(
		(data) => {
			fireAnalyticsEvent(createAnalyticsEvent)(data);
		},
		[createAnalyticsEvent],
	);

	const getExperienceStore = useCallback(() => {
		return experienceStore.current;
	}, []);

	const getFeatureFlagsFromRef = useCallback(() => {
		return createFeatureFlagsFromProps(propsRef.current);
	}, []);

	const onEditorCreated = useCallback(
		(instance: {
			view: EditorView;
			eventDispatcher: EventDispatcher;
			transformer?: Transformer<string>;
		}) => {
			const { contextIdentifierProvider, onEditorReady, performanceTracking, featureFlags } =
				propsRef.current;

			editorActions._privateRegisterEditor(
				instance.view,
				instance.eventDispatcher,
				instance.transformer,
				getFeatureFlagsFromRef,
			);

			if (featureFlags?.ufo) {
				experienceStore.current = ExperienceStore.getInstance(instance.view);
				experienceStore.current?.start(EditorExperience.loadEditor, startTime.current);
			}

			if (onEditorReady) {
				const measureEditorReady =
					performanceTracking?.onEditorReadyCallbackTracking?.enabled || featureFlags?.ufo;
				measureEditorReady && startMeasure(measurements.ON_EDITOR_READY_CALLBACK);

				onEditorReady(editorActions);

				measureEditorReady &&
					stopMeasure(
						measurements.ON_EDITOR_READY_CALLBACK,
						sendDurationAnalytics(
							ACTION.ON_EDITOR_READY_CALLBACK,
							{
								contextIdentifierProvider,
								featureFlags,
							},
							getExperienceStore,
							createAnalyticsEvent,
						),
					);
			}
		},
		[editorActions, createAnalyticsEvent, getFeatureFlagsFromRef, propsRef, getExperienceStore],
	);

	const onEditorDestroyed = useCallback(
		(_instance: { view: EditorView; transformer?: Transformer<string> }) => {
			const { onDestroy } = propsRef.current;
			editorActions._privateUnregisterEditor();

			if (onDestroy) {
				onDestroy();
			}
		},
		[editorActions, propsRef],
	);

	useMeasureEditorMountTime(props, getExperienceStore, createAnalyticsEvent);

	const providerFactory = useProviderFactory(props, editorActions, createAnalyticsEvent);

	const { onSave: onSaveFromProps } = props;
	const handleSave = useCallback(
		(view: EditorView) => {
			if (onSaveFromProps) {
				onSaveFromProps(view);
			}
		},
		[onSaveFromProps],
	);

	return (
		<EditorInternal
			props={props}
			handleAnalyticsEvent={handleAnalyticsEvent}
			createAnalyticsEvent={createAnalyticsEvent}
			preset={props.preset}
			handleSave={handleSave}
			editorActions={editorActions}
			onEditorCreated={onEditorCreated}
			onEditorDestroyed={onEditorDestroyed}
			providerFactory={providerFactory}
			AppearanceComponent={props.AppearanceComponent}
		/>
	);
}

const useMemoEditorFeatureFlags = (featureFlags?: { [featureFlag: string]: string | boolean }) => {
	const ffRef = useRef(featureFlags);

	if (!isEqual(ffRef.current, featureFlags)) {
		ffRef.current = featureFlags;
	}

	return ffRef.current;
};

export function CoreEditor(props: EditorNextProps & WithAppearanceComponent) {
	const editorSessionId = useRef(uuid());
	const data = useMemo(() => {
		return {
			packageName: name,
			packageVersion: version,
			componentName: 'editorCore',
			appearance: getAnalyticsAppearance(props.appearance),
			editorSessionId: editorSessionId.current,
		};
	}, [props.appearance]);
	const memodEditorFeatureFlags = useMemoEditorFeatureFlags(props.featureFlags);

	return (
		<FabricEditorAnalyticsContext
			// @ts-expect-error Type 'string' is not assignable to type '"editorCore" | "renderer"'.
			data={data}
		>
			<Editor {...props} featureFlags={memodEditorFeatureFlags} />
		</FabricEditorAnalyticsContext>
	);
}

CoreEditor.propTypes = {
	minHeight: ({ appearance, minHeight }: Pick<EditorNextProps, 'appearance' | 'minHeight'>) => {
		if (minHeight && appearance && !['comment', 'chromeless'].includes(appearance)) {
			return new Error(
				'minHeight only supports editor appearance chromeless and comment for Editor',
			);
		}
		return null;
	},
};

export default CoreEditor;
