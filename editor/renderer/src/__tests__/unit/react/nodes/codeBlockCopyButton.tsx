import React from 'react';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';

const mockCopyTextToClipboard = jest.fn();
jest.mock('../../../../react/utils/clipboard', () => {
	const module = jest.requireActual('../../../../react/utils/clipboard');
	return {
		...module,
		copyTextToClipboard: (text: string) => mockCopyTextToClipboard(text),
	};
});

import CopyButton from '../../../../react/nodes/codeBlock/components/codeBlockCopyButton';

const renderCopyButton = () => {
	return renderWithIntl(<CopyButton content={'Some code'} />);
};

describe('CopyButton', () => {
	afterEach(() => {
		resetAllExperiments();
	});

	it('should preserve the existing accessible name when the experiment is disabled', () => {
		mockExpDisabled('platform_editor_a11y_codeblock_copy_name');

		renderCopyButton();

		expect(screen.getByRole('button', { name: 'Copy as text' })).toBeInTheDocument();
	});

	it('should use the precise accessible name when the experiment is enabled', async () => {
		mockExpEnabled('platform_editor_a11y_codeblock_copy_name');

		renderCopyButton();

		const copyButton = screen.getByRole('button', { name: 'Copy code text' });
		await userEvent.click(copyButton);
		expect(copyButton).toHaveAttribute('aria-label', 'Copied!');

		await userEvent.hover(copyButton);
		await userEvent.unhover(copyButton);
		expect(copyButton).toHaveAttribute('aria-label', 'Copy code text');
	});

	it('should call CopyTextToClipboard on click', async () => {
		renderCopyButton();

		await userEvent.click(screen.getByRole('button', { name: 'Copy as text' }));

		expect(mockCopyTextToClipboard).toHaveBeenCalledWith('Some code');
	});

	it('should update the component on click and mouseLeave', async () => {
		renderCopyButton();

		const copyButton = screen.getByRole('button', { name: 'Copy as text' });

		await userEvent.click(copyButton);

		expect(copyButton).toHaveClass('clicked');
		expect(copyButton).toHaveAttribute('aria-label', 'Copied!');

		await userEvent.hover(copyButton);
		await userEvent.unhover(copyButton);

		expect(copyButton).not.toHaveClass('clicked');
		expect(copyButton).toHaveAttribute('aria-label', 'Copy as text');
	});

	it('should capture and report a11y violations', async () => {
		const { container } = renderCopyButton();

		await expect(container).toBeAccessible();
	});
});
