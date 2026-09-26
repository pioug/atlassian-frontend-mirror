import React, { useCallback, useMemo, useRef } from 'react';

import isEqual from 'lodash/isEqual';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuid } from 'uuid';

import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context/FabricEditorAnalyticsContext';
import { useAnalyticsEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';
import { ACTION } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import type { Transformer } from '@atlaskit/editor-common/types';
import { getAnalyticsAppearance } from '@atlaskit/editor-common/utils/analytics';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import EditorActions from '../actions';
import type { EditorNextProps, EditorProps } from '../types/editor-props';
import type { WithAppearanceComponent } from '../types/with-appearance-component';
import { useEditorContext } from '../ui/EditorContext';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';
import measurements from '../utils/performance/measure-enum';
import { name, version } from '../version-wrapper';
import { EditorInternal } from './editor-internal';
import useMeasureEditorMountTime from './hooks/useMeasureEditorMountTime';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import useMemoEditorProps from './hooks/useMemoEditorProps';
import useProviderFactory from './hooks/useProviderFactory';
import sendDurationAnalytics from './utils/sendDurationAnalytics';

/**
 * Editor wrapper that deals with the lifecycle logic of the editor
 * @param passedProps
 * @example
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
			eventDispatcher: EventDispatcher;
			transformer?: Transformer<string>;
			view: EditorView;
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
		(_instance: { transformer?: Transformer<string>; view: EditorView }) => {
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

	return (
		<EditorInternal
			props={props}
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

/**
 *
 * @param props
 * @example
 */
// oxlint-disable-next-line eslint/no-redeclare
export function CoreEditor(props: EditorNextProps & WithAppearanceComponent): React.JSX.Element {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
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
// eslint-disable-next-line @typescript-eslint/no-namespace, @atlaskit/volt-strict-mode/no-multiple-exports
export declare namespace CoreEditor {
	// eslint-disable-next-line no-var
	export var propTypes: {
		minHeight: ({
			appearance,
			minHeight,
		}: Pick<EditorNextProps, 'appearance' | 'minHeight'>) => Error | null;
	};
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

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default CoreEditor;
