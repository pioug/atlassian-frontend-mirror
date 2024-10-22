/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect } from 'react';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { ACTION } from '@atlaskit/editor-common/analytics';
import { clearMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';

import type { EditorNextProps, EditorProps } from '../../types/editor-props';
import measurements from '../../utils/performance/measure-enum';
import sendDurationAnalytics from '../utils/sendDurationAnalytics';

import useEditorConstructor from './useEditorMeasuresConstructor';

/**
 *
 * Hook to run the analytics for the Editor component.
 * WARNING: Consider any changes to also make to `src/editor.tsx`
 *
 * @param props EditorProps
 * @param createAnalyticsEvent
 */
export default function useMeasureEditorMountTime(
	props: EditorProps | EditorNextProps,
	createAnalyticsEvent: CreateUIAnalyticsEvent,
): void {
	useEditorConstructor();

	useEffect(() => {
		stopMeasure(
			measurements.EDITOR_MOUNTED,
			sendDurationAnalytics(ACTION.EDITOR_MOUNTED, props, createAnalyticsEvent),
		);
		return () => {
			clearMeasure(measurements.EDITOR_MOUNTED);
			clearMeasure(measurements.ON_EDITOR_READY_CALLBACK);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	// Disable Exhaustive Deps here since we only want to stop the measure on mount.
}
