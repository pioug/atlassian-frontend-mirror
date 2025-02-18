/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo, useRef, Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import isEqual from 'lodash/isEqual';
import uuid from 'uuid/v4';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import { ACTION, fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import type { Transformer } from '@atlaskit/editor-common/types';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils/analytics';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import EditorActions from '../actions';
import type { EditorNextProps, EditorProps } from '../types/editor-props';
import { type WithAppearanceComponent } from '../types/with-appearance-component';
import { useEditorContext } from '../ui/EditorContext';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';
import measurements from '../utils/performance/measure-enum';
import { name, version } from '../version-wrapper';

import { EditorUFOBridge, EditorPerformanceMetrics } from './core-performance-metrics';
import { EditorInternal } from './editor-internal';
import useMeasureEditorMountTime from './hooks/useMeasureEditorMountTime';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import useMemoEditorProps from './hooks/useMemoEditorProps';
import useProviderFactory from './hooks/useProviderFactory';
import { useTrackDangerouslyAppendPlugins } from './temp_useTrackDangerousPlugins';
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
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleAnalyticsEvent: FireAnalyticsCallback = useCallback(
		(data) => {
			fireAnalyticsEvent(createAnalyticsEvent)(data);
		},
		[createAnalyticsEvent],
	);

	useTrackDangerouslyAppendPlugins(passedProps, handleAnalyticsEvent);

	const getFeatureFlagsFromRef = useCallback(() => {
		return {
			...createFeatureFlagsFromProps(propsRef.current.featureFlags),
			useNativeCollabPlugin: Boolean(
				typeof propsRef.current.collabEdit?.useNativePlugin === 'boolean'
					? !!propsRef.current.collabEdit?.useNativePlugin
					: false,
			),
		};
	}, []);

	const onEditorCreated = useCallback(
		(instance: {
			view: EditorView;
			eventDispatcher: EventDispatcher;
			transformer?: Transformer<string>;
		}) => {
			const { contextIdentifierProvider, onEditorReady, featureFlags } = propsRef.current;

			editorActions._privateRegisterEditor(
				instance.view,
				instance.eventDispatcher,
				instance.transformer,
				getFeatureFlagsFromRef,
			);

			if (onEditorReady) {
				startMeasure(measurements.ON_EDITOR_READY_CALLBACK);

				onEditorReady(editorActions);

				stopMeasure(
					measurements.ON_EDITOR_READY_CALLBACK,
					sendDurationAnalytics(
						ACTION.ON_EDITOR_READY_CALLBACK,
						{
							contextIdentifierProvider,
							featureFlags,
						},
						createAnalyticsEvent,
					),
				);
			}
		},
		[editorActions, createAnalyticsEvent, getFeatureFlagsFromRef, propsRef],
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

	useMeasureEditorMountTime(props, createAnalyticsEvent);

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
	const isFullPageApperance = Boolean(
		props.appearance && ['full-page', 'full-width'].includes(props.appearance),
	);

	return (
		<Fragment>
			{isFullPageApperance && fg('platform_editor_fe--ufo-bridge') ? <EditorUFOBridge /> : null}
			{isFullPageApperance && fg('platform_editor_fe--performance_metrics') ? (
				<EditorPerformanceMetrics />
			) : null}
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
		</Fragment>
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
			<Editor
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
				featureFlags={memodEditorFeatureFlags}
			/>
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
