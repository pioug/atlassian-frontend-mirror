import { expect, editorPerformanceTestCase as test } from '@af/editor-libra';

import { bigTable } from '../fixtures';

const TTI_SEVERITY_THRESHOLD_DEFAULTS = {
	NORMAL: 40000,
	DEGRADED: 60000,
};

const TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS = {
	NORMAL: 5000,
	DEGRADED: 8000,
};

// copied from 'packages/editor/editor-core/src/create-editor/consts';
const PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD = 2000;
const PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD = 3000;

test.use({
	editorProps: {
		appearance: 'full-page',
		allowTables: {
			advanced: true,
		},
		allowAnalyticsGASV3: true,
		performanceTracking: {
			ttiTracking: {
				enabled: true,
				trackSeverity: true,
				ttiIdleThreshold: 0,
				ttiSeverityNormalThreshold: TTI_SEVERITY_THRESHOLD_DEFAULTS.NORMAL,
				ttiSeverityDegradedThreshold: TTI_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
				ttiFromInvocationSeverityNormalThreshold:
					TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.NORMAL,
				ttiFromInvocationSeverityDegradedThreshold:
					TTI_FROM_INVOCATION_SEVERITY_THRESHOLD_DEFAULTS.DEGRADED,
			},
			transactionTracking: { enabled: true },
			uiTracking: { enabled: true },
			nodeViewTracking: { enabled: true },
			inputTracking: {
				enabled: true,
				countNodes: true,
				trackSingleKeypress: true,
				trackRenderingTime: true,
			},
			proseMirrorRenderedTracking: {
				trackSeverity: true,
				severityNormalThreshold: PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD,
				severityDegradedThreshold: PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD,
			},
			onEditorReadyCallbackTracking: { enabled: true },
			pasteTracking: { enabled: true },
			renderTracking: {
				editor: {
					enabled: true,
					useShallow: false,
				},
				reactEditorView: {
					enabled: true,
					useShallow: false,
				},
			},
		},
	},
	adf: bigTable,
});

test.describe('@composable-full-page__operational-events', () => {
	test.describe('full-page__with-big-table', () => {
		test.use({
			editorPerformanceTestOptions: {
				editorVersion: 'composable',
				performanceTestType: 'operational-events',
			},
		});
		test('load and process events within page example', async ({ editor }) => {
			expect(true).toBe(true);
		});
	});
});

test.describe('@confluence-full-page__operational-events', () => {
	test.describe('full-page__with-big-table', () => {
		test.use({
			editorPerformanceTestOptions: {
				editorVersion: 'complex-full-page-example',
				performanceTestType: 'operational-events',
			},
		});
		test('load and process events within page example', async ({ editor }) => {
			expect(true).toBe(true);
		});
	});
});
