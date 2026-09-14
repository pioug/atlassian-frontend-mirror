import { render, screen } from '@atlassian/testing-library';
import code from '../../code';

describe('code string literal', () => {
	it('should render an accessible code block', async () => {
		const { container } = render(code`const hello = 'world';`);

		await expect(container).toBeAccessible();
	});

	it('should highlight code', () => {
		const { container } = render(code`highlight=2
      const hello = 'world';
      const maybe = 'people';
    `);

		const highlightedRows = container.querySelectorAll('[data-ds--code--row--highlight]');

		expect(highlightedRows).toHaveLength(1);
		expect(highlightedRows[0]).toHaveTextContent("const maybe = 'people';");
	});

	it('should remove highlight config', () => {
		render(code`highlight=2
    const hello = 'world';
    const maybe = 'people';
  `);

		expect(screen.queryByText(/highlight=2/)).not.toBeInTheDocument();
	});

	it('should not highlight code', () => {
		const { container } = render(code`
    const hello = 'world';
    const maybe = 'people';
  `);

		expect(container.querySelector('[data-ds--code--row--highlight]')).not.toBeInTheDocument();
	});
});
