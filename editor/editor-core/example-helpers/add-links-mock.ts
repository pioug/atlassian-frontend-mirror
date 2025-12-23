/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Helper function to create a mock inline card ADF node
 */
export const createMockInlineCard = (url: string) => ({
	type: 'inlineCard',
	attrs: { url },
});

/**
 * Helper function to add an inline card to the last paragraph of content,
 * or create a new paragraph with the card if needed
 */
function addInlineCardToContent(content: any[], url: string) {
	if (content.length > 0) {
		const lastChild = content[content.length - 1];
		if (lastChild.type === 'paragraph') {
			if (!lastChild.content) {
				lastChild.content = [];
			}
			lastChild.content.push(createMockInlineCard(url));
		} else {
			content.push({
				type: 'paragraph',
				content: [createMockInlineCard(url)],
			});
		}
	} else {
		content.push({
			type: 'paragraph',
			content: [createMockInlineCard(url)],
		});
	}
}

/**
 * Helper function to add mock inline cards to table rows
 */
export function addLinksToTable(tableAdf: any): void {
	for (const content of tableAdf.content) {
		if (content.type === 'tableRow' && content.content.length > 0) {
			const firstCell = content.content[0];
			if (firstCell.type === 'tableCell') {
				if (!firstCell.content) {
					firstCell.content = [];
				}
				addInlineCardToContent(firstCell.content, 'https://example.atlassian.net/browse/TEST-123');
			}
		}
	}
}

/**
 * Helper function to add mock inline cards to task list items
 */
export function addLinksToTaskList(taskListAdf: any): void {
	if (taskListAdf.content) {
		for (const item of taskListAdf.content) {
			if (item.type === 'taskItem') {
				if (!item.content) {
					item.content = [];
				}
				item.content.push(createMockInlineCard('https://example.atlassian.net/browse/TEST-123'));
			}
		}
	}
}
