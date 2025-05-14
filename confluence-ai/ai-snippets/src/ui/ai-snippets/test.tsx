import React from 'react';

import { render, screen } from '@testing-library/react';

import { PROGRESS_BAR_TEST_ID } from './constants';

import AiSnippets from './index';

const testId = 'ai-snippets';

describe('AiSnippets', () => {
	it('should find AiSnippets by its testid', async () => {
		render(<AiSnippets testId={testId} />);

		expect(screen.getByTestId(testId)).toBeTruthy();
	});
});

describe('Progress bar', () => {
	it('should have a left margin', () => {
		render(<AiSnippets testId={testId} />);

		expect(screen.getByTestId(PROGRESS_BAR_TEST_ID)).toHaveCompiledCss({
			marginLeft: 'var(--ds-space-100,8px)',
		});
	});
});
