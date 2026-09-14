import React from 'react';
import { initialDoc } from '../../__fixtures__/initial-doc';
import type { RendererProps } from '../../../ui/renderer-props';
import { Renderer } from '../../../entry-points/renderer-default';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const tooltipMessage =
	'Content is not available in this editor, this will be preserved when you edit and save';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Unsupported Content', () => {
	describe('Block Node', () => {
		const doc = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'FooBarNode',
					attrs: {
						panelType: 'info',
					},
					content: [
						{
							type: 'paragraph',
							content: [],
						},
					],
				},
			],
		};

		const initRendererWithIntl = (
			doc: any = initialDoc,
			props: Partial<RendererProps> = {},
			locale: string = 'en',
			messages = {},
		) =>
			render(
				<IntlProvider locale={locale} messages={messages}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Renderer document={doc} {...props} />
				</IntlProvider>,
			);

		it('should return a node of type div', () => {
			const { container } = initRendererWithIntl(doc, {
				useSpecBasedValidator: true,
			});

			expect(container.querySelector('.unsupported')?.tagName).toEqual('DIV');
		});

		it('should node contains tooltip', () => {
			initRendererWithIntl(doc, {
				useSpecBasedValidator: true,
			});

			// the tooltip hangs off the help icon rendered next to the message
			expect(screen.getByLabelText('?')).toBeInTheDocument();
		});

		it('should show correct message when hover on tooltip', async () => {
			initRendererWithIntl(doc, {
				useSpecBasedValidator: true,
			});

			await userEvent.hover(screen.getByLabelText('?'));

			expect(await screen.findByRole('tooltip')).toHaveTextContent(tooltipMessage);
		});

		it(
			'should have text content as string "Unsupported content"' +
				' when language non-english locale provided',
			() => {
				const messages = {
					'fabric.editor.unsupportedContent':
						'This editor does not support displaying this content',
				};

				const { container } = initRendererWithIntl(
					doc,
					{ useSpecBasedValidator: true },
					'de',
					messages,
				);

				expect(container.textContent).toEqual(
					'This editor does not support displaying this content',
				);
			},
		);

		it(
			'should have text content as string "Unsupported Status"' +
				' when language english locale provided',
			() => {
				const { container } = initRendererWithIntl(doc, {
					useSpecBasedValidator: true,
				});

				expect(container.textContent).toEqual(
					'This editor does not support displaying this content: FooBarNode',
				);
			},
		);
	});

	describe('Inline Node', () => {
		const doc = {
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'FooBarNode',
							attrs: {
								id: '0',
								texts: '@Carolyn',
								accessLevel: '',
							},
						},
					],
				},
			],
		};

		const initRendererWithIntl = (
			doc: any = initialDoc,
			props: Partial<RendererProps> = {},
			locale: string = 'en',
			messages = {},
		) =>
			render(
				<IntlProvider locale={locale} messages={messages}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Renderer document={doc} {...props} />
				</IntlProvider>,
			);

		it('should return a node of type span', () => {
			const { container } = initRendererWithIntl(doc, {
				useSpecBasedValidator: true,
			});

			expect(container.querySelector('[class*="-UnsupportedInlineNode"]')?.tagName).toEqual('SPAN');
		});

		it('should node contains tooltip', () => {
			initRendererWithIntl(doc, {
				useSpecBasedValidator: true,
			});

			expect(screen.getByLabelText('?')).toBeInTheDocument();
		});

		it('should show correct message when hover on tooltip', async () => {
			initRendererWithIntl(doc, {
				useSpecBasedValidator: true,
			});

			await userEvent.hover(screen.getByLabelText('?'));

			expect(await screen.findByRole('tooltip')).toHaveTextContent(tooltipMessage);
		});

		it(
			'should have text content as string "Unsupported content"' +
				' when language non-english locale provided',
			() => {
				const messages = {
					'fabric.editor.unsupportedContent': 'Unsupported content',
				};

				const { container } = initRendererWithIntl(
					doc,
					{ useSpecBasedValidator: true },
					'de',
					messages,
				);

				expect(container.textContent).toEqual('Unsupported content');
			},
		);

		it(
			'should have text content as string "Unsupported Status"' +
				' when language english locale provided',
			() => {
				const { container } = initRendererWithIntl(doc, {
					useSpecBasedValidator: true,
				});

				expect(container.textContent).toEqual('Unsupported FooBarNode');
			},
		);
	});
});
