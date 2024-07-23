/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import AIStateLoading from './ai-state-loading';
import AIStateDone from './ai-state-done';
import type { AIStateIndicatorProps } from './types';
import AIStateError from './ai-state-error';

const AIStateIndicator = ({
	state,
	appearance = 'default',
	testId = 'ai-state-indicator',
	error,
}: AIStateIndicatorProps) => {
	switch (state) {
		case 'error':
			return <AIStateError appearance={appearance} testId={testId} error={error} />;
		case 'loading':
			return <AIStateLoading appearance={appearance} testId={testId} />;
		case 'done':
			return <AIStateDone appearance={appearance} testId={testId} />;
		default:
			return null;
	}
};
export default AIStateIndicator;
