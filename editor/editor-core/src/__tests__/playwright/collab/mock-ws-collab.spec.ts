import { expect, editorMockCollaborativeTestCase as test } from '@af/editor-libra';
import { EditorTelepointerModel } from '@af/editor-libra/page-models';
import { fixTest } from '@af/integration-testing';
import { BROWSERS } from '@af/integration-testing/config/constants';
import { doc, p, table, tr, tdEmpty, thEmpty } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('collab', () => {
	test.slow();

	test.use({
		exampleName: 'collab',
	});

	test('collab should work', async ({ firstEditor, secondEditor, thirdEditor, page }) => {
		fixTest({
			jiraIssueId: 'TODO-123',
			reason: 'Firefox is skipped as it is a very slow browser on this test',
			browsers: [BROWSERS.firefox],
		});
		await firstEditor.focus();
		await firstEditor.keyboard.type('I am Rosa', { delay: 200 });

		await expect(secondEditor).toHaveDocument(doc(p('I am Rosa')));
		await expect(thirdEditor).toHaveDocument(doc(p('I am Rosa')));

		await secondEditor.waitForEditorStable();
		await secondEditor.focus();
		await secondEditor.keyboard.type('I am Malcolm', { delay: 200 });

		await firstEditor.waitForEditorStable();
		await thirdEditor.waitForEditorStable();

		await expect(firstEditor).toHaveDocument(doc(p('I am MalcolmI am Rosa')));
		await expect(secondEditor).toHaveDocument(doc(p('I am MalcolmI am Rosa')));
		await expect(thirdEditor).toHaveDocument(doc(p('I am MalcolmI am Rosa')));
		await expect(page).toBeAccessible({ violationCount: 1 });
	});

	test('rich text collab should work', async ({ firstEditor, secondEditor, thirdEditor, page }) => {
		await firstEditor.focus();
		await firstEditor.typeAhead.searchAndInsert('table');

		await expect(secondEditor).toMatchDocument(
			doc(
				table({ localId: expect.any(String), width: 760 })(
					tr(thEmpty, thEmpty, thEmpty),
					tr(tdEmpty, tdEmpty, tdEmpty),
					tr(tdEmpty, tdEmpty, tdEmpty),
				),
			),
		);
		await expect(thirdEditor).toMatchDocument(
			doc(
				table({ localId: expect.any(String), width: 760 })(
					tr(thEmpty, thEmpty, thEmpty),
					tr(tdEmpty, tdEmpty, tdEmpty),
					tr(tdEmpty, tdEmpty, tdEmpty),
				),
			),
		);
		await expect(page).toBeAccessible({ violationCount: 2 });
	});

	test('offline should resync', async ({ firstEditor, secondEditor, thirdEditor, page }) => {
		fixTest({
			jiraIssueId: 'TODO-123',
			reason: 'Firefox is skipped as it is a very slow browser on this test',
			browsers: [BROWSERS.firefox],
		});
		await firstEditor.focus();
		await firstEditor.keyboard.type('Hello', { delay: 200 });

		await expect(secondEditor).toHaveDocument(doc(p('Hello')));
		await expect(thirdEditor).toHaveDocument(doc(p('Hello')));

		// Disconnect second editor from NCS
		await secondEditor.page.getByTestId('disconnect_button_middle').click();

		await firstEditor.focus();
		await firstEditor.keyboard.type('World', { delay: 200 });

		await expect(firstEditor).toHaveDocument(doc(p('HelloWorld')));
		await expect(secondEditor).toHaveDocument(doc(p('Hello')));
		await expect(thirdEditor).toHaveDocument(doc(p('HelloWorld')));

		// Reconnect second editor from NCS
		await secondEditor.page.getByTestId('disconnect_button_middle').click();
		await expect(secondEditor.page.getByTestId('disconnect_button_middle')).toHaveText(
			'Disconnect',
		);

		await firstEditor.focus();
		await firstEditor.keyboard.type('!!!', { delay: 200 });
		await expect(firstEditor).toHaveDocument(doc(p('HelloWorld!!!')));
		await expect(thirdEditor).toHaveDocument(doc(p('HelloWorld!!!')));
		await expect(secondEditor).toHaveDocument(doc(p('HelloWorld!!!')));
		await expect(page).toBeAccessible();
	});

	test.describe('telepointer', () => {
		test('Should backspace when telepointers are in the same position', async ({
			firstEditor,
			secondEditor,
			thirdEditor,
			page,
		}) => {
			fixTest({
				jiraIssueId: 'TODO-123',
				reason: 'Firefox is skipped as it is a very slow browser on this test',
				browsers: [BROWSERS.firefox],
			});
			const secondEditorTelepointer = EditorTelepointerModel.from(secondEditor);

			await firstEditor.focus();
			await firstEditor.keyboard.type('Hello');

			// ensure second editor has received the text
			await secondEditor.waitForEditorStable();
			await thirdEditor.waitForEditorStable();
			await expect(secondEditor).toHaveDocument(doc(p('Hello')));
			await expect(thirdEditor).toHaveDocument(doc(p('Hello')));

			// ensure that both telepointers are in the correct place
			await firstEditor.keyboard.press('ArrowLeft');

			// Telepointer must be set to Hell<{}>o after left arrow
			await secondEditorTelepointer.centerClick();
			await secondEditor.keyboard.type('World');

			await expect(firstEditor).toHaveDocument(doc(p('HellWorldo')));
			await expect(thirdEditor).toHaveDocument(doc(p('HellWorldo')));
			await expect(page).toBeAccessible({ violationCount: 2 });
		});
	});
});
