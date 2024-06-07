import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../__tests__/_testing-library';
import { Trigger } from './Trigger';

// Add the custom matchers provided by '@emotion/jest'
expect.extend(matchers);

describe('@atlaskit/reactions/components/Trigger', () => {
	mockReactDomWarningGlobal();
	it('should render a button', async () => {
		renderWithIntl(<Trigger tooltipContent="" />);
		const btn = await screen.findByLabelText('Add reaction');
		expect(btn).toBeInTheDocument();
	});

	it('should have miniMode css when miniMode is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" miniMode />);

		const button = await screen.findByLabelText('Add reaction');
		expect(button).toBeInTheDocument();
		expect(button).toHaveStyleRule('width', '16px');
	});

	it('should have disabled css when disabled is true', async () => {
		renderWithIntl(<Trigger tooltipContent="" disabled />);
		const btn = await screen.findByRole('button');
		expect(btn).toBeInTheDocument();
		expect(btn).toHaveAttribute('aria-disabled', 'true');
	});

	it('should call "onClick" when clicked', async () => {
		const mockOnClick = jest.fn();
		renderWithIntl(<Trigger tooltipContent="" onClick={mockOnClick} />);
		const button = await screen.findByLabelText('Add reaction');
		fireEvent.click(button);
		expect(mockOnClick).toHaveBeenCalled();
	});

	it('should disable button', async () => {
		const mockOnClick = jest.fn();
		renderWithIntl(<Trigger tooltipContent="" disabled onClick={mockOnClick} />);
		fireEvent.click(await screen.findByLabelText('Add reaction'));
		expect(mockOnClick).not.toHaveBeenCalled();
	});
});
