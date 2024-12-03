import { expect, test } from '@af/integration-testing';

test('Comment should pass basic aXe audit', async ({ page }) => {
	page.visitExample('design-system', 'comment', 'example-comment-highlighted');
	const commentActionReply = page.locator('button:has-text("reply")');
	const replyParentElement = commentActionReply.locator('..');
	const commentActionEdit = page.locator('button:has-text("edit")');
	const editParentElement = commentActionEdit.locator('..');
	const commentActionLike = page.locator('button:has-text("like")');
	const likeParentElement = commentActionLike.locator('..');

	await commentActionReply.focus();
	await expect(commentActionReply).toBeFocused();
	await expect(replyParentElement).toHaveRole('presentation');

	await commentActionEdit.focus();
	await expect(commentActionEdit).toBeFocused();
	await expect(editParentElement).toHaveRole('presentation');

	await commentActionLike.focus();
	await expect(commentActionLike).toBeFocused();
	await expect(likeParentElement).toHaveRole('presentation');
});
