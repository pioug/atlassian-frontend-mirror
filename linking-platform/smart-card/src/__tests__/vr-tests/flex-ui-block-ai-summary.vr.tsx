import { snapshot } from '@af/visual-regression';

import FlexUiBlockAiSummaryDone from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-done';
import FlexUiBlockAiSummaryDoneOnMount from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-done-on-mount';
import FlexUiBlockAiSummaryError from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-error';
import FlexUiBlockAiSummaryLoading from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-loading';
import FlexUiBlockAiSummaryReady from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-ready';

snapshot(FlexUiBlockAiSummaryReady, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(FlexUiBlockAiSummaryReady, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-linking-visual-refresh-v2': [true, false],
	},
});

snapshot(FlexUiBlockAiSummaryLoading, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(FlexUiBlockAiSummaryDone, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(FlexUiBlockAiSummaryDoneOnMount, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});

snapshot(FlexUiBlockAiSummaryError, {
	drawsOutsideBounds: true,
	states: [
		{
			selector: {
				byTestId: 'smart-element-link',
			},
			state: 'hovered',
		},
	],
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': [true, false],
	},
});
