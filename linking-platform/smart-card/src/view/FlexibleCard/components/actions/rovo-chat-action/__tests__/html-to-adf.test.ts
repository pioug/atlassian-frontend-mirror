import * as builders from '@atlaskit/adf-utils/builders';

import { messages } from '../../../../../../messages.ts';
import htmlToAdf from '../html-to-adf';

describe('htmlToAdf', () => {
	it('should returns adf document for "Recommend other sources" prompt message', () => {
		const context = 'Confluence page';
		const url = 'https://smart-link';
		const html = (messages.rovo_prompt_message_recommend_other_sources.defaultMessage as string)
			.replace('{context}', context)
			.replace('{url}', url);

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

	it('should returns adf document for "Show other mentions" prompt message', () => {
		const context = 'Confluence page';
		const url = 'https://smart-link';
		const html = (messages.rovo_prompt_message_show_other_mentions.defaultMessage as string)
			.replace(/\{context\}/g, context)
			.replace('{url}', url);

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
							text: 'From ',
						},
						{
							type: 'inlineCard',
							attrs: {
								url,
							},
						},
						{
							type: 'text',
							text: ` and the ${context} I’m viewing now:`,
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
											text: 'Search across all Confluence pages and Jira work items I can access for other items that contain this exact Smart Link (same underlying URL/resource).',
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
											text: 'List all matching items in a table with columns: ',
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
											text: ', ',
										},
										{
											type: 'text',
											text: 'How this item uses the link',
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
											text: 'Relevance to current item',
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
											text: 'For ',
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
											text: `, give a one‑sentence description of what the ${context} is about.`,
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
											text: 'For ',
										},
										{
											type: 'text',
											text: 'How this item uses the link',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: ', briefly explain the role this link plays there (e.g., decision doc, background context, implementation details, status update).',
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
											text: 'For ',
										},
										{
											type: 'text',
											text: 'Relevance to current item',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: `, compare each item to the ${context} I’m viewing now and label it `,
										},
										{
											type: 'text',
											text: 'High',
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
											text: 'Medium',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: ', or ',
										},
										{
											type: 'text',
											text: 'Low',
											marks: [
												{
													type: 'code',
												},
											],
										},
										{
											type: 'text',
											text: ' relevance, with a short reason (a phrase or single clause).',
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
											text: 'If there are more than 15 matches, show the 15 most relevant and tell me how many additional matches exist.',
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

	it('should returns adf document for "Suggest improvement" prompt message', () => {
		const context = 'Confluence page';
		const url = 'https://smart-link';
		const html = (messages.rovo_prompt_message_suggest_improvement.defaultMessage as string)
			.replace('{context}', context)
			.replace('{url}', url);

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
							text: `Using the ${context} I’m viewing now, plus all files and links referenced in it (including `,
						},
						{
							type: 'inlineCard',
							attrs: {
								url,
							},
						},
						{
							type: 'text',
							text: '):',
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
											text: 'Identify unclear reasoning, missing context, or contradictions between the item and its linked files.',
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
											text: 'Call out any places where assumptions are not backed up by data or prior docs.',
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
											text: 'Stay concise: summarize your findings in ',
										},
										{
											type: 'text',
											text: 'no more than three short paragraphs of content listed as bullets',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ' of no more than a couple of sentences long focused only on the two points above.',
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
											text: 'After presenting that summary, ',
										},
										{
											type: 'text',
											text: 'ask me explicitly',
											marks: [
												{
													type: 'strong',
												},
											],
										},
										{
											type: 'text',
											text: ' if I want you to go deeper. Only if I say yes, then:',
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
															text: 'Suggest concrete rewrites (bullets or short paragraphs) to make the argument clearer, more concise, and better aligned with the supporting files.',
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
															text: 'Propose 3–5 follow‑up edits or additions that would make this item and its linked docs “share‑ready” for stakeholders.',
														},
													],
												},
											],
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
