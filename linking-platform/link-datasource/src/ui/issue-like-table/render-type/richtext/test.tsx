import React from 'react';

import { render } from '@testing-library/react';

import { type RichText } from '@atlaskit/linking-types';

import RichTextType from './index';

describe('RichText Type', () => {
	const buildValidADF = (numberOfNodes: number) => {
		return {
			version: 1,
			type: 'doc',
			content: new Array(numberOfNodes).fill(1).map((_, idx) => ({
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: `normal paragraph ${idx + 1}`,
					},
				],
			})),
		};
	};

	it('renders rich text preview with first 2 nodes from a 3-node ADF via the renderer', async () => {
		const adfDoc = buildValidADF(3);
		const value = {
			type: 'adf',
			text: JSON.stringify(adfDoc),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('normal paragraph 1normal paragraph 2');
	});

	it('renders rich text preview with first 2 nodes from a 2-node ADF via the renderer', async () => {
		const adfDoc = buildValidADF(2);
		const value = {
			type: 'adf',
			text: JSON.stringify(adfDoc),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('normal paragraph 1normal paragraph 2');
	});

	it('renders rich text preview with first 1 node from a 1-node ADF via the renderer', async () => {
		const adfDoc = buildValidADF(1);
		const value = {
			type: 'adf',
			text: JSON.stringify(adfDoc),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('normal paragraph 1');
	});

	it('renders rich text preview with no node from a 0-node ADF via the renderer', async () => {
		const adfDoc = buildValidADF(0);
		const value = {
			type: 'adf',
			text: JSON.stringify(adfDoc),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('');
	});

	it('renders unknown node if incorrect value type is supplied', async () => {
		const adfDoc = buildValidADF(2);
		const value = {
			type: 'adfZ',
			text: JSON.stringify(adfDoc),
		} as any;

		const { container } = render(<RichTextType value={value} />);
		expect(container.innerHTML).toEqual('<span data-testid="richtext-unsupported"></span>');
	});

	it('blows up if invalid json supplied to text', async () => {
		const value = {
			type: 'adf',
			text: '{{{{{{{',
		} as any;

		const { container } = render(<RichTextType value={value} />);

		expect(container.querySelector('[data-testid="richtext-unsupported"]')).toBeInTheDocument();
	});

	it('renders inlineLink with URL', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'bluelink ' },
							{
								type: 'text',
								text: 'https://sdog.jira-dev.com/browse/MAY2023-11',
								marks: [
									{ type: 'link', attrs: { href: 'https://sdog.jira-dev.com/browse/MAY2023-11' } },
								],
							},
							{ type: 'text', text: '  inlinecard' },
							{ type: 'inlineCard', attrs: { url: 'https://sdog.jira-dev.com/browse/MAY2023-11' } },
							{ type: 'paragraph', content: [{ type: 'text', text: 'asdf' }] },
						],
					},
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual(
			'bluelink https://sdog.jira-dev.com/browse/MAY2023-11  inlinecardhttps://sdog.jira-dev.com/browse/MAY2023-11asdf',
		);
	});

	it('renders inlineLinks that do not have url in their attrs', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'bluelink ' },
							{
								type: 'text',
								text: 'https://sdog.jira-dev.com/browse/MAY2023-11',
								marks: [
									{ type: 'link', attrs: { href: 'https://sdog.jira-dev.com/browse/MAY2023-11' } },
								],
							},
							{ type: 'text', text: '  inlinecard' },
							{ type: 'inlineCard', attrs: {} },
							{ type: 'paragraph', content: [{ type: 'text', text: 'asdf' }] },
						],
					},
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual(
			'bluelink https://sdog.jira-dev.com/browse/MAY2023-11  inlinecardasdf',
		);
	});

	it('renders inlineLinks with and without url at the same time', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{ type: 'text', text: 'bluelink ' },
							{
								type: 'text',
								text: 'https://sdog.jira-dev.com/browse/MAY2023-11',
								marks: [
									{ type: 'link', attrs: { href: 'https://sdog.jira-dev.com/browse/MAY2023-11' } },
								],
							},
							{ type: 'inlineCard', attrs: { url: 'https://sdog.jira-dev.com/browse/APR2023-12' } },
							{ type: 'inlineCard', attrs: {} },
							{ type: 'paragraph', content: [{ type: 'text', text: 'asdf' }] },
						],
					},
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual(
			'bluelink https://sdog.jira-dev.com/browse/MAY2023-11https://sdog.jira-dev.com/browse/APR2023-12asdf',
		);
	});

	it('renders blockCards with url attr', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{ type: 'blockCard', attrs: { url: 'https://sdog.jira-dev.com/browse/MAY2023-11' } },
					{ type: 'paragraph', content: [{ type: 'text', text: 'asdf' }] },
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('https://sdog.jira-dev.com/browse/MAY2023-11asdf');
	});

	it('renders blockCards that do not have url in their attrs', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{ type: 'blockCard', attrs: {} },
					{ type: 'paragraph', content: [{ type: 'text', text: 'asdf' }] },
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('asdf');
	});

	it('renders blockCards with url attr and without url attr at the same time', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{ type: 'blockCard', attrs: { url: 'https://sdog.jira-dev.com/browse/MAY2023-11' } },
					{ type: 'blockCard', attrs: { url: 'https://sdog.jira-dev.com/browse/APR2023-12' } },
					{ type: 'paragraph', content: [{ type: 'text', text: 'asdf' }] },
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual(
			'https://sdog.jira-dev.com/browse/MAY2023-11https://sdog.jira-dev.com/browse/APR2023-12',
		);
	});

	it('renders embedCards with url attr', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'embedCard',
						attrs: {
							url: 'https://sdog.jira-dev.com/browse/MAY2023-11',
							layout: 'center',
							width: 100,
						},
					},
					{ type: 'paragraph', content: [{ type: 'text', text: '<<embedCard' }] },
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('https://sdog.jira-dev.com/browse/MAY2023-11<<embedCard');
	});

	it('renders embedCards that do not have url in their attrs', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{ type: 'embedCard', attrs: { layout: 'center', width: 100 } },
					{ type: 'paragraph', content: [{ type: 'text', text: '<<embedCard' }] },
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual('<<embedCard');
	});

	it('renders embedCards with and without a url attr at the same time', () => {
		const value = {
			type: 'adf',
			text: JSON.stringify({
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'embedCard',
						attrs: {
							url: 'https://sdog.jira-dev.com/browse/MAY2023-11',
							layout: 'center',
							width: 100,
						},
					},
					{
						type: 'embedCard',
						attrs: {
							url: 'https://sdog.jira-dev.com/browse/APR2023-12',
							layout: 'center',
							width: 100,
						},
					},
					{ type: 'paragraph', content: [{ type: 'text', text: '<<embedCard' }] },
				],
			}),
		} satisfies RichText;

		const { container } = render(<RichTextType value={value} />);

		expect(container.textContent).toEqual(
			'https://sdog.jira-dev.com/browse/MAY2023-11https://sdog.jira-dev.com/browse/APR2023-12',
		);
	});
});
