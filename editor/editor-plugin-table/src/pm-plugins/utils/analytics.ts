import { useEffect, useRef } from 'react';

import type {
	AnalyticsEventPayload,
	AnalyticsEventPayloadCallback,
	EditorAnalyticsAPI,
	TableEventPayload,
} from '@atlaskit/editor-common/analytics';
import { ACTION_SUBJECT, EVENT_TYPE, TABLE_ACTION } from '@atlaskit/editor-common/analytics';
import type { HigherOrderCommand } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import { findTable, getSelectionRect } from '@atlaskit/editor-tables/utils';

import { hasTableBeenResized } from '../table-resizing/utils';

import { getTableWidth } from './index';

export function getSelectedTableInfo(selection: Selection): {
	table: ReturnType<typeof findTable> | undefined;
	map: TableMap | undefined;
	totalRowCount: number;
	totalColumnCount: number;
} {
	let map;
	let totalRowCount = 0;
	let totalColumnCount = 0;

	const table = findTable(selection);
	if (table) {
		map = TableMap.get(table.node);
		totalRowCount = map.height;
		totalColumnCount = map.width;
	}

	return {
		table,
		map,
		totalRowCount,
		totalColumnCount,
	};
}

export function getSelectedCellInfo(selection: Selection) {
	let horizontalCells = 1;
	let verticalCells = 1;
	let totalCells = 1;

	const { table, map, totalRowCount, totalColumnCount } = getSelectedTableInfo(selection);

	if (table && map) {
		const rect = getSelectionRect(selection);
		if (rect) {
			totalCells = map.cellsInRect(rect).length;
			horizontalCells = rect.right - rect.left;
			verticalCells = rect.bottom - rect.top;
		}
	}

	return {
		totalRowCount,
		totalColumnCount,
		horizontalCells,
		verticalCells,
		totalCells,
	};
}

export const withEditorAnalyticsAPI =
	(payload: AnalyticsEventPayload | AnalyticsEventPayloadCallback) =>
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined | null): HigherOrderCommand => {
		return (command) => (state, dispatch, view) =>
			command(
				state,
				(tr) => {
					const dynamicPayload = payload instanceof Function ? payload(state) : payload;

					if (dynamicPayload) {
						editorAnalyticsAPI?.attachAnalyticsEvent(dynamicPayload)(tr);
					}

					if (dispatch) {
						dispatch(tr);
					}
					return true;
				},
				view,
			);
	};

interface UseMeasureFramerateConfig {
	maxSamples?: number;
	minFrames?: number;
	minTimeMs?: number;
	sampleRateMs?: number;
	timeoutMs?: number;
}

export const generateResizedPayload = (props: {
	originalNode: PMNode;
	resizedNode: PMNode;
}): TableEventPayload => {
	const tableMap = TableMap.get(props.resizedNode);

	return {
		action: TABLE_ACTION.RESIZED,
		actionSubject: ACTION_SUBJECT.TABLE,
		eventType: EVENT_TYPE.TRACK,
		attributes: {
			newWidth: props.resizedNode.attrs.width,
			prevWidth: props.originalNode.attrs.width ?? null,
			nodeSize: props.resizedNode.nodeSize,
			totalTableWidth: hasTableBeenResized(props.resizedNode)
				? getTableWidth(props.resizedNode)
				: null,
			totalRowCount: tableMap.height,
			totalColumnCount: tableMap.width,
		},
	};
};

export const reduceResizeFrameRateSamples = (frameRateSamples: number[]) => {
	if (frameRateSamples.length > 1) {
		const frameRateSum = frameRateSamples.reduce((sum, frameRate, index) => {
			if (index === 0) {
				return sum;
			} else {
				return sum + frameRate;
			}
		}, 0);
		const averageFrameRate = Math.round(frameRateSum / (frameRateSamples.length - 1));
		return [frameRateSamples[0], averageFrameRate];
	} else {
		return frameRateSamples;
	}
};

export const generateResizeFrameRatePayloads = (props: {
	docSize: number;
	frameRateSamples: number[];
	originalNode: PMNode;
}): TableEventPayload[] => {
	const reducedResizeFrameRateSamples = reduceResizeFrameRateSamples(props.frameRateSamples);
	return reducedResizeFrameRateSamples.map((frameRateSample, index) => ({
		action: TABLE_ACTION.RESIZE_PERF_SAMPLING,
		actionSubject: ACTION_SUBJECT.TABLE,
		eventType: EVENT_TYPE.OPERATIONAL,
		attributes: {
			frameRate: frameRateSample,
			nodeSize: props.originalNode.nodeSize,
			docSize: props.docSize,
			isInitialSample: index === 0,
		},
	}));
};

/**
 * Measures the framerate of a component over a given time period.
 */
export const useMeasureFramerate = (config: UseMeasureFramerateConfig = {}) => {
	const {
		maxSamples = 10,
		minFrames = 5,
		minTimeMs = 500,
		sampleRateMs = 1000,
		timeoutMs = 200,
	} = config;

	let frameCount = useRef(0);
	let lastTime = useRef(0);
	let timeoutId = useRef<NodeJS.Timeout | undefined>();
	let frameRateSamples = useRef<number[]>([]);

	useEffect(() => {
		return () => {
			if (timeoutId.current) {
				clearTimeout(timeoutId.current);
			}
		};
	}, []);

	const startMeasure = () => {
		frameCount.current = 0;
		lastTime.current = performance.now();
	};

	/**
	 * Returns an array of frame rate samples as integers.
	 */
	const endMeasure = () => {
		const samples = frameRateSamples.current;
		frameRateSamples.current = [];
		return samples;
	};

	const sampleFrameRate = (delay = 0) => {
		const currentTime = performance.now();
		const deltaTime = currentTime - lastTime.current - delay;
		const isValidSample = deltaTime > minTimeMs && frameCount.current >= minFrames;
		if (isValidSample) {
			const frameRate = Math.round(frameCount.current / (deltaTime / 1000));
			frameRateSamples.current.push(frameRate);
		}
		frameCount.current = 0;
		lastTime.current = 0;
	};

	/**
	 * Counts the number of frames that occur within a given time period. Intended to be called
	 * inside a `requestAnimationFrame` callback.
	 */
	const countFrames = () => {
		if (frameRateSamples.current.length >= maxSamples && timeoutId.current) {
			clearTimeout(timeoutId.current);
			return;
		}

		/**
		 * Allows us to keep counting frames even if `startMeasure` is not called
		 */
		if (lastTime.current === 0) {
			lastTime.current = performance.now();
		}
		frameCount.current++;

		if (timeoutId.current) {
			clearTimeout(timeoutId.current);
		}
		if (performance.now() - lastTime.current > sampleRateMs) {
			sampleFrameRate();
		} else {
			timeoutId.current = setTimeout(() => sampleFrameRate(timeoutMs), timeoutMs);
		}
	};

	return { startMeasure, endMeasure, countFrames };
};
