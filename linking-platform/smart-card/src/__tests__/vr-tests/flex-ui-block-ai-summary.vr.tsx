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
	description: 'FlexUiBlockAiSummaryReady',
	featureFlags: {
		'platform-component-visual-refresh': true,
	},
	waitForReactLazy: true,
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
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
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
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
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
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
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
		'platform-component-visual-refresh': true,
		'navx-1895-new-logo-design': [true, false],
	},
	waitForReactLazy: true,
});
