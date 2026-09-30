import React from 'react';

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { BaseSearch } from '../../src/ui/jql-editor-controls-content/base-search';

/**
 * The search button's focus ring is painted outside its border box
 * (`outline-width: 2px` + `outline-offset: 2px`), so an ancestor with
 * `overflow: hidden` that shrink-wraps the button clips the ring away entirely,
 * leaving no visible focus indicator. See A11Y-35618.
 */
describe('BaseSearch', () => {
	const renderSearch = () =>
		render(<BaseSearch label="Search" onSearch={() => {}} isSearching={false} />);

	beforeEach(() => {
		passGate('platform-component-visual-refresh');
	});

	it('does not wrap the search button in a container that clips its focus ring', () => {
		mockExpEnabled('a11y-oct-22nd-batch');

		renderSearch();

		const button = screen.getByTestId('jql-editor-search');
		expect(button.parentElement).not.toHaveStyle({ overflow: 'hidden' });
	});

	it('retains the existing container for the experiment control cohort', () => {
		mockExpDisabled('a11y-oct-22nd-batch');

		renderSearch();

		const button = screen.getByTestId('jql-editor-search');
		expect(button.parentElement).toHaveStyle({ overflow: 'hidden' });
	});

	it('should capture and report a11y violations', async () => {
		mockExpEnabled('a11y-oct-22nd-batch');

		const { container } = renderSearch();

		await expect(container).toBeAccessible();
	});
});
