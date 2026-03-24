import { defaultSchema, getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import WikiMarkupTransformer from '../../../index';

import { doc, taskList, taskItem } from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Task', () => {
	const transformer = new WikiMarkupTransformer();

	test('should convert basic task list', () => {
		const node = doc(
			taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49464' })(
				taskItem({
					localId: '0e87110e-aa58-411a-964b-883942b118cc',
					state: 'DONE',
				})('first'),
				taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
					taskItem({
						localId: '0e87110e-aa58-411a-964b-883942b118aa',
						state: 'TODO',
					})('second'),
					taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
						taskItem({
							localId: '0e87110e-aa58-411a-964b-883942b118aa',
							state: 'TODO',
						})('third'),
					),
				),
				taskItem({
					localId: '0e87110e-aa58-411a-964b-883942b118bb',
					state: 'DONE',
				})('task 2 completed'),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert complex nested task list', () => {
		const node = doc(
			taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49464' })(
				taskItem({
					localId: '0e87110e-aa58-411a-964b-883942b118cc',
					state: 'DONE',
				})('completed'),
				taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
					taskItem({
						localId: '0e87110e-aa58-411a-964b-883942b118aa',
						state: 'TODO',
					})('incompleted'),
					taskItem({
						localId: '0e87110e-aa58-411a-964b-883942b118bb',
						state: 'DONE',
					})('task 2 completed'),
					taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
						taskItem({
							localId: '0e87110e-aa58-411a-964b-883942b118aa',
							state: 'TODO',
						})('incompleted'),
						taskItem({
							localId: '0e87110e-aa58-411a-964b-883942b118bb',
							state: 'DONE',
						})('task 2 completed'),
					),
				),
				taskItem({
					localId: '0e87110e-aa58-411a-964b-883942b118bb',
					state: 'DONE',
				})('task 2 completed'),
			),
		)(defaultSchema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should convert taskList with sibling taskList as first child (flexible indentation)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const node = doc(
			taskList({ localId: 'outer-list' })(
				taskList({ localId: 'inner-list' })(
					taskItem({
						localId: 'inner-task-1',
						state: 'TODO',
					})('nested first'),
					taskItem({
						localId: 'inner-task-2',
						state: 'DONE',
					})('nested second'),
				),
				taskItem({
					localId: 'outer-task-1',
					state: 'TODO',
				})('outer task'),
			),
		)(stage0Schema);
		expect(transformer.encode(node)).toMatchSnapshot();
	});

	test('should encode multi-level step up and down (task: 1 → 3 → 1)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const node = doc(
			taskList({ localId: 'tl-1' })(
				taskItem({ localId: 'ti-1', state: 'TODO' })('Level 1 item'),
				taskList({ localId: 'tl-2' })(
					taskList({ localId: 'tl-3' })(
						taskItem({ localId: 'ti-2', state: 'DONE' })('Level 3 item (stepped down)'),
					),
				),
				taskItem({ localId: 'ti-3', state: 'TODO' })('Level 1 item (stepped up)'),
			),
		)(stage0Schema);

		expect(transformer.encode(node)).toBe(
			['* Level 1 item', '*** -Level 3 item (stepped down)-', '* Level 1 item (stepped up)'].join(
				'\n',
			),
		);
	});

	test('should encode all items at max depth 4 (task: 3 wrapper layers)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const node = doc(
			taskList({ localId: 'tl-1' })(
				taskList({ localId: 'tl-2' })(
					taskList({ localId: 'tl-3' })(
						taskList({ localId: 'tl-4' })(
							taskItem({ localId: 'ti-1', state: 'TODO' })('Depth 4 - first'),
							taskItem({ localId: 'ti-2', state: 'DONE' })('Depth 4 - second'),
							taskItem({ localId: 'ti-3', state: 'TODO' })('Depth 4 - third'),
						),
					),
				),
			),
		)(stage0Schema);

		expect(transformer.encode(node)).toBe(
			['**** Depth 4 - first', '**** -Depth 4 - second-', '**** Depth 4 - third'].join('\n'),
		);
	});

	test('should encode alternating depths (task: 3 → 1 → 3 → 1)', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const node = doc(
			taskList({ localId: 'tl-1' })(
				taskList({ localId: 'tl-2' })(
					taskList({ localId: 'tl-3' })(
						taskItem({ localId: 'ti-1', state: 'TODO' })('Item 1 at level 3'),
					),
				),
				taskItem({ localId: 'ti-2', state: 'DONE' })('Item 2 at level 1'),
				taskList({ localId: 'tl-4' })(
					taskList({ localId: 'tl-5' })(
						taskItem({ localId: 'ti-3', state: 'DONE' })('Item 3 at level 3'),
					),
				),
				taskItem({ localId: 'ti-4', state: 'TODO' })('Item 4 at level 1'),
			),
		)(stage0Schema);

		expect(transformer.encode(node)).toBe(
			[
				'*** Item 1 at level 3',
				'* -Item 2 at level 1-',
				'*** -Item 3 at level 3-',
				'* Item 4 at level 1',
			].join('\n'),
		);
	});

	test('should encode mixed TODO and DONE states across nesting levels', () => {
		const stage0Schema = getSchemaBasedOnStage('stage0');
		const node = doc(
			taskList({ localId: 'tl-1' })(
				taskItem({ localId: 'ti-1', state: 'DONE' })('Level 1 done'),
				taskList({ localId: 'tl-2' })(
					taskItem({ localId: 'ti-2', state: 'TODO' })('Level 2 open'),
					taskItem({ localId: 'ti-3', state: 'DONE' })('Level 2 done'),
					taskList({ localId: 'tl-3' })(
						taskItem({ localId: 'ti-4', state: 'DONE' })('Level 3 done'),
						taskItem({ localId: 'ti-5', state: 'TODO' })('Level 3 open'),
					),
				),
				taskItem({ localId: 'ti-6', state: 'TODO' })('Level 1 open'),
			),
		)(stage0Schema);

		expect(transformer.encode(node)).toBe(
			[
				'* -Level 1 done-',
				'** Level 2 open',
				'** -Level 2 done-',
				'*** -Level 3 done-',
				'*** Level 3 open',
				'* Level 1 open',
			].join('\n'),
		);
	});
});
