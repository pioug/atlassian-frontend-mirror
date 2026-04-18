import React, { act } from 'react';
import { render, screen, userEvent } from '@atlassian/testing-library';
import { HeadingWithSectionLink } from '../../heading/heading-with-section-link';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('HeadingWithSectionLink', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>,
		);

		await expect(container).toBeAccessible();
	});

	it('should render a heading', () => {
		render(<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>);

		expect(screen.getByRole('heading', { name: 'Test heading' })).toBeInTheDocument();
	});

	it.each([1, 2, 3, 4, 5, 6] as const)(
		'should render the correct heading level when level is %s',
		(level) => {
			render(<HeadingWithSectionLink level={level}>Test heading</HeadingWithSectionLink>);

			expect(screen.getByRole('heading', { level })).toBeInTheDocument();
		},
	);

	it('should render a button to copy a link to the section', () => {
		render(<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>);

		expect(screen.getByRole('button', { name: 'Copy link to heading' })).toBeInTheDocument();
	});

	it('should display a tooltip when the button is hovered', async () => {
		const user = createUser();
		render(<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>);

		await user.hover(screen.getByRole('button', { name: 'Copy link to heading' }));

		expect(
			await screen.findByRole('tooltip', { name: 'Copy link to heading' }),
		).toBeInTheDocument();
	});

	it('should update the tooltip content to "Copied!" when the button is clicked', async () => {
		const user = createUser();
		render(<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>);

		await user.hover(screen.getByRole('button', { name: 'Copy link to heading' }));

		expect(
			await screen.findByRole('tooltip', { name: 'Copy link to heading' }),
		).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Copy link to heading' }));

		expect(await screen.findByRole('tooltip', { name: 'Copied!' })).toBeInTheDocument();
	});

	it('should reset the tooltip content with a delay, after being clicked', async () => {
		const user = createUser();
		render(<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>);

		await user.click(screen.getByRole('button', { name: 'Copy link to heading' }));

		expect(await screen.findByRole('tooltip', { name: 'Copied!' })).toBeInTheDocument();

		act(() => {
			jest.runAllTimers();
		});

		expect(
			await screen.findByRole('tooltip', { name: 'Copy link to heading' }),
		).toBeInTheDocument();
	});

	it('should copy the link to the section to the clipboard when the button is clicked', async () => {
		const writeTextMock = jest.fn();
		jest.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeTextMock);
		const user = createUser();
		render(<HeadingWithSectionLink level={2}>Test heading</HeadingWithSectionLink>);

		await user.click(screen.getByRole('button', { name: 'Copy link to heading' }));

		expect(writeTextMock).toHaveBeenCalledWith('http://localhost/#test-heading');
	});

	it('should have the correct heading id when the heading content is one word', () => {
		render(<HeadingWithSectionLink level={2}>Test</HeadingWithSectionLink>);

		expect(screen.getByRole('heading', { name: 'Test' })).toHaveAttribute('id', 'test');
	});

	it('should have the correct heading id when the heading content is multiple words', () => {
		render(<HeadingWithSectionLink level={2}>Test heading 2</HeadingWithSectionLink>);

		expect(screen.getByRole('heading', { name: 'Test heading 2' })).toHaveAttribute(
			'id',
			'test-heading-2',
		);
	});

	it('should have the correct heading id when the heading content is a just number', () => {
		render(<HeadingWithSectionLink level={2}>123</HeadingWithSectionLink>);

		expect(screen.getByRole('heading', { name: '123' })).toHaveAttribute('id', '123');
	});

	it('should have the correct heading id when the heading content is an array of strings', () => {
		// This reflects what is actually provided by the Atlaskit site for the markdown.
		render(<HeadingWithSectionLink level={2}>{['Test heading']}</HeadingWithSectionLink>);

		expect(screen.getByRole('heading', { name: 'Test heading' })).toHaveAttribute(
			'id',
			'test-heading',
		);
	});

	it('should not have a heading id or copy button when the heading content is empty', () => {
		render(<HeadingWithSectionLink level={2}>{null}</HeadingWithSectionLink>);

		expect(screen.getByRole('heading')).not.toHaveAttribute('id');
		expect(screen.queryByRole('button', { name: 'Copy link to heading' })).not.toBeInTheDocument();
	});

	it('should support nested elements in the heading content', () => {
		render(
			<HeadingWithSectionLink level={2}>
				Test <code>heading</code>
			</HeadingWithSectionLink>,
		);

		expect(screen.getByRole('heading', { name: 'Test heading' })).toHaveAttribute(
			'id',
			'test-heading',
		);
	});

	it('should support multiple levels of nesting in the heading content', () => {
		render(
			<HeadingWithSectionLink level={2}>
				Test{' '}
				<code>
					heading <span>nested</span>
				</code>
			</HeadingWithSectionLink>,
		);

		expect(screen.getByRole('heading', { name: 'Test heading nested' })).toHaveAttribute(
			'id',
			'test-heading-nested',
		);
	});

	it('should support the heading content being wrapped in an element', () => {
		render(
			<HeadingWithSectionLink level={2}>
				<div>
					Test <code>heading</code>
				</div>
			</HeadingWithSectionLink>,
		);

		expect(screen.getByRole('heading', { name: 'Test heading' })).toHaveAttribute(
			'id',
			'test-heading',
		);
	});
});
