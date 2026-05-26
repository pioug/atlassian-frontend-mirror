import React from 'react';
import { render, screen } from '@atlassian/testing-library';
import { NameCell } from '../component/nameCell';

jest.mock('@atlaskit/tooltip', () => ({
	__esModule: true,
	default: ({ content, children }: { content: React.ReactNode; children: React.ReactNode }) => (
		<div data-testid="tooltip-mock" data-content={typeof content === 'string' ? content : ''}>
			{children}
		</div>
	),
}));

describe('NameCell', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<NameCell text="This is the file name.png" />);
		await expect(container).toBeAccessible();
	});

	it('renders Truncate component with correct text', async () => {
		render(<NameCell text="This is the file name.png" />);

		// Truncate splits text into truncate-left and truncate-right spans
		const leftSpan = screen.getByTestId('truncate-left');
		const rightSpan = screen.getByTestId('truncate-right');
		expect(leftSpan).toBeInTheDocument();
		expect(rightSpan).toBeInTheDocument();
		// Combined text should contain the full filename
		const fullText = (leftSpan.textContent ?? '') + (rightSpan.textContent ?? '');
		expect(fullText).toBe('This is the file name.png');
	});

	it('renders Tooltip component with correct content', () => {
		render(<NameCell text="This is the file name.png" />);

		// Tooltip is mocked above to expose its `content` prop via data-content;
		// this verifies the same prop assertion as the original Enzyme test.
		const tooltip = screen.getByTestId('tooltip-mock');
		expect(tooltip).toHaveAttribute('data-content', 'This is the file name.png');
	});

	it('renders MediaTypeIcon component with the correct mediaType', async () => {
		render(<NameCell text="This is the file name.png" mediaType="image" />);

		// MediaTypeIcon renders with data-testid="file-type-icon" and data-type attribute
		const icon = screen.getByTestId('file-type-icon');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('data-type', 'image');
	});

	it('does not render a MediaTypeIcon component when mediaType is not provided', async () => {
		render(<NameCell text="This is the file name.png" />);

		expect(screen.queryByTestId('file-type-icon')).not.toBeInTheDocument();
	});
});
