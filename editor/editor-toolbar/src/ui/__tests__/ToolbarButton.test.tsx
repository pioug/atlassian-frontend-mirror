import React from 'react';

import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { render, screen } from '@atlassian/testing-library';

import { ToolbarButton } from '../ToolbarButton';

describe('ToolbarButton accessibility attributes', () => {
	eeTest
		.describe('jira_editor_a11y_toolbar_fixes', 'toolbar button selected state semantics')
		.variant(false, () => {
			it('sets aria-pressed for selected toggle buttons without data-selected', async () => {
				render(<ToolbarButton iconBefore={<span />} isSelected label="Bold" />);

				const button = screen.getByRole('button', { name: 'Bold' });
				expect(button).toHaveAttribute('aria-pressed', 'true');
				expect(button).not.toHaveAttribute('data-selected');
				await expect(document.body).toBeAccessible();
			});

			it('does not set data-selected or aria-pressed=true for unselected toggle buttons', async () => {
				// The `[data-selected="true"]` CSS selector in ToolbarButtonGroup.tsx gates hover-group styling on the
				// attribute being absent (not the string "false") when isSelected is falsy. This test guards that contract.
				render(<ToolbarButton iconBefore={<span />} label="Bold" />);

				const button = screen.getByRole('button', { name: 'Bold' });
				expect(button).not.toHaveAttribute('data-selected');
				expect(button).not.toHaveAttribute('aria-pressed');
				await expect(document.body).toBeAccessible();
			});

			it('exposes aria-pressed="false" for explicitly-unselected toggle buttons', async () => {
				render(<ToolbarButton iconBefore={<span />} isSelected={false} label="Bold" />);

				const button = screen.getByRole('button', { name: 'Bold' });
				expect(button).not.toHaveAttribute('data-selected');
				expect(button).toHaveAttribute('aria-pressed', 'false');
				await expect(document.body).toBeAccessible();
			});

			it('sets aria-pressed for selected popup trigger buttons', async () => {
				render(
					<ToolbarButton
						aria-expanded
						aria-haspopup
						iconBefore={<span />}
						isSelected
						label="More formatting"
					/>,
				);

				const button = screen.getByRole('button', { name: 'More formatting' });
				expect(button).toHaveAttribute('aria-pressed', 'true');
				expect(button).not.toHaveAttribute('data-selected');
				await expect(document.body).toBeAccessible();
			});
		});

	eeTest
		.describe('jira_editor_a11y_toolbar_fixes', 'toolbar button selected state semantics')
		.variant(true, () => {
			it('sets aria-pressed and data-selected for selected toggle buttons', async () => {
				render(<ToolbarButton iconBefore={<span />} isSelected label="Bold" />);

				const button = screen.getByRole('button', { name: 'Bold' });
				expect(button).toHaveAttribute('aria-pressed', 'true');
				expect(button).toHaveAttribute('data-selected', 'true');
				await expect(document.body).toBeAccessible();
			});

			it('does not set aria-pressed for selected popup trigger buttons', async () => {
				render(
					<ToolbarButton
						aria-expanded
						aria-haspopup
						iconBefore={<span />}
						isSelected
						label="More formatting"
					/>,
				);

				const button = screen.getByRole('button', { name: 'More formatting' });
				expect(button).not.toHaveAttribute('aria-pressed');
				expect(button).toHaveAttribute('data-selected', 'true');
				await expect(document.body).toBeAccessible();
			});
		});
});
