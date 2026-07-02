import * as builders from '@atlaskit/adf-utils/builders';

import htmlToAdf from '../html-to-adf';

describe('htmlToAdf', () => {
	it('should returns adf document for prompt message', () => {
		const context = 'Confluence page';
		const url = 'https://smart-link';
		const message =
			'<p>From this <a>{url}</a> and the {context} I’m viewing now as context:</p><ul><li><p>Search across all sources I can access for items that discuss <b>similar concepts, themes, or problems</b>, or that <b>reference similar or closely related sources</b> (including links to the same or related pages, issues, or docs).</p></li><li><p>Return the results as a list or table with columns: <code>Item</code>, <code>Type</code>, <code>Short summary</code>, and <code>Why it’s similar</code>.</p></li><li><p>For each result, give a one‑sentence <b>Short summary</b> of what the item is about.</p></li><li><p>In <b>Why it’s similar</b>, briefly explain (in a phrase or short sentence) what makes it related to this Smart Link and/or the item I’m viewing (for example: same project, similar decision, shared requirements, overlapping stakeholders, similar metrics, or referencing related docs).</p></li><li><p>Order the list from <b>most to least relevant</b> based on Rovo’s assessment of semantic similarity to both the Smart Link target and the current item.  Prioritize items that I do not own or have not contributed to.</p></li><li><p>If there are more than 5 results, show the <b>5 most relevant</b> and state how many additional items you found.</p></li></ul>';

		const html = message.replace('{context}', context).replace('{url}', url);

		const adfDoc = htmlToAdf(html);

		expect(adfDoc).toEqual({
			version: 1,
			type: 'doc',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: 'From this ',
						},
						{
							type: 'inlineCard',
							attrs: {
								url,
							},
						},
						{
							type: 'text',
							text: ` and the ${context} I’m viewing now as context:`,
						},
					],
				},
				{
					type: 'bulletList',
					content: [
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Search across all sources I can access for items that discuss ',
										},
										{
											type: 'text',
											text: 'similar concepts, themes, or problems',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ', or that ',
										},
										{
											type: 'text',
											text: 'reference similar or closely related sources',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ' (including links to the same or related pages, issues, or docs).',
										},
									],
								},
							],
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Return the results as a list or table with columns: ',
										},
										{
											type: 'text',
											text: 'Item',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: ', ',
										},
										{
											type: 'text',
											text: 'Type',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: ', ',
										},
										{
											type: 'text',
											text: 'Short summary',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: ', and ',
										},
										{
											type: 'text',
											text: 'Why it’s similar',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: '.',
										},
									],
								},
							],
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'For each result, give a one‑sentence ',
										},
										{
											type: 'text',
											text: 'Short summary',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ' of what the item is about.',
										},
									],
								},
							],
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'In ',
										},
										{
											type: 'text',
											text: 'Why it’s similar',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ', briefly explain (in a phrase or short sentence) what makes it related to this Smart Link and/or the item I’m viewing (for example: same project, similar decision, shared requirements, overlapping stakeholders, similar metrics, or referencing related docs).',
										},
									],
								},
							],
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'Order the list from ',
										},
										{
											type: 'text',
											text: 'most to least relevant',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ' based on Rovo’s assessment of semantic similarity to both the Smart Link target and the current item.  Prioritize items that I do not own or have not contributed to.',
										},
									],
								},
							],
						},
						{
							type: 'listItem',
							content: [
								{
									type: 'paragraph',
									content: [
										{
											type: 'text',
											text: 'If there are more than 5 results, show the ',
										},
										{
											type: 'text',
											text: '5 most relevant',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ' and state how many additional items you found.',
										},
									],
								},
							],
						},
					],
				},
			],
		});
	});

	it('should return html string on error', () => {
		jest.spyOn(builders, 'p').mockImplementationOnce(() => {
			throw new Error();
		});
		const html = '<p>test</p>';

		const adfDoc = htmlToAdf(html);

		expect(adfDoc).toEqual(html);
	});
});
