import { snapshot } from '@af/visual-regression';

import FlexUiBlockAiSummaryDoneOnMount from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-done-on-mount.vr.ap';
import FlexUiBlockAiSummaryDone from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-done.vr.ap';
import FlexUiBlockAiSummaryError from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-error.vr.ap';
import FlexUiBlockAiSummaryLoading from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-loading.vr.ap';
import FlexUiBlockAiSummaryReady from '../../../examples/vr-flexible-card/vr-flexible-ui-block-ai-summary-ready.vr.ap';

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
	},
	waitForReactLazy: true,
});
