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
	description:
		'FlexUiBlockAiSummaryReady Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': false,
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
	description: 'FlexUiBlockAiSummaryReady',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
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
	description:
		'FlexUiBlockAiSummaryLoading Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': false,
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
	description: 'FlexUiBlockAiSummaryLoading',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
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
	description:
		'FlexUiBlockAiSummaryDone Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': false,
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
	description: 'FlexUiBlockAiSummaryDone',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
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
	description:
		'FlexUiBlockAiSummaryDoneOnMount Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': false,
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
	description: 'FlexUiBlockAiSummaryDoneOnMount',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
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
	description:
		'FlexUiBlockAiSummaryError Old - remove when cleaning platform-linking-visual-refresh-v2',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': false,
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
	description: 'FlexUiBlockAiSummaryError',
	featureFlags: {
		'platform-component-visual-refresh': [true, false],
		'platform-linking-visual-refresh-v1': true,
		'platform-linking-visual-refresh-v2': true,
	},
});
