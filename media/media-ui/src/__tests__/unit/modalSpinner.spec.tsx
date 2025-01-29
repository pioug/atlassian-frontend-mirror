import { token } from '@atlaskit/tokens';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ModalSpinner } from '../../index';

// skipping this test as it does not work with jsdom.reconfigure. Need to rewrite this test.
// https://hello.jira.atlassian.cloud/browse/UTEST-2000
describe.skip('Modal Spinner', () => {
	it('should show spinner', async () => {
		render(
			<ModalSpinner blankedColor={token('color.blanket', 'white')} invertSpinnerColor={false} />,
		);

		expect(await screen.findByTestId('media-modal-spinner')).toBeDefined();
	});
	it('should set spinner to inverted mode when specified to do so', async () => {
		render(
			<ModalSpinner blankedColor={token('color.blanket', 'white')} invertSpinnerColor={true} />,
		);

		expect((await screen.findByTestId('media-modal-spinner')).childNodes[1]).toHaveStyle(
			'stroke: var(--ds-icon-inverse, #FFFFFF)',
		);
	});
	it('should set blanked background color to specified one', async () => {
		render(<ModalSpinner blankedColor={'white'} invertSpinnerColor={false} />);

		expect(await screen.findByTestId('media-modal-spinner-blanket')).toHaveStyle(
			'background-color: white',
		);
	});
	it('should handle default (no props provided) case', async () => {
		render(<ModalSpinner />);

		expect(await screen.findByTestId('media-modal-spinner-blanket')).toHaveStyle(
			'background-color: none',
		);
		expect((await screen.findByTestId('media-modal-spinner')).childNodes[1]).toHaveStyle(
			'stroke: var(--ds-icon-subtle, #42526E)',
		);
	});
});
