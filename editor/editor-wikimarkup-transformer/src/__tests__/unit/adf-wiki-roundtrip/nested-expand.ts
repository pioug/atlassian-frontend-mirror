import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { adf2wiki } from '../_test-helpers';

import {
	blockquote,
	doc,
	p,
	table,
	tr,
	td,
	ul,
	li,
	nestedExpand,
	code_block,
	taskList,
	taskItem,
	decisionItem,
	decisionList,
	panel,
	hr as rule,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup => ADF - Nested expand', () => {
	test('should convert a list inside a nested expand', () => {
		adf2wiki(
			doc(
				table()(
					tr(td({})(nestedExpand({ title: 'expand title' })(ul(li(p('item 1')), li(p('item 2')))))),
				),
			)(defaultSchema),
		);
	});

	test('should convert code-block inside a nested expand', () => {
		adf2wiki(
			doc(
				table()(
					tr(
						td({})(
							nestedExpand({ title: 'expand title' })(code_block()(`console.log("Hello World")`)),
						),
					),
				),
			)(defaultSchema),
		);
	});

	test('should convert actions and decisions inside a nested expand', () => {
		adf2wiki(
			doc(
				table()(
					tr(
						td({})(
							nestedExpand({ title: 'expand title' })(
								taskList()(taskItem()('task item 1'), taskItem()('task item 2')),
								decisionList()(
									decisionItem({ localId: 'decision-item-1' })('Decision'),
									decisionItem({ localId: 'decision-item-1' })('Decision'),
								),
							),
						),
					),
				),
			)(defaultSchema),
		);
	});

	test('should convert panel inside a nested expand', () => {
		adf2wiki(
			doc(
				table()(
					tr(
						td({})(
							nestedExpand({ title: 'expand title' })(
								panel({ panelType: 'info' })(p('This is a panel')),
							),
						),
					),
				),
			)(defaultSchema),
		);
	});

	test('should convert a blockquote inside a nested expand', () => {
		adf2wiki(
			doc(
				table()(
					tr(td({})(nestedExpand({ title: 'expand title' })(blockquote(p('This is a quote'))))),
				),
			)(defaultSchema),
		);
	});

	test('should convert a rule inside a nested expand', () => {
		adf2wiki(
			doc(table()(tr(td({})(nestedExpand({ title: 'expand title' })(rule())))))(defaultSchema),
		);
	});
});
