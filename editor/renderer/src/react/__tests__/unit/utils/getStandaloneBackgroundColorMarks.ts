import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { type Node } from '@atlaskit/editor-prosemirror/model';
import { getStandaloneBackgroundColorMarks } from '../../../utils/getStandaloneBackgroundColorMarks';

describe('getStandaloneBackgroundColorMarks()', () => {
	it('returns empty array when no backgroundColor marks', () => {
		const content: Node[] = [schema.text('Hello'), schema.text('World')];

		const result = getStandaloneBackgroundColorMarks(content);
		expect(result.length).toBe(0);
	});

	it('returns backgroundColor mark when surrounded by spaces', () => {
		const mark = schema.marks.backgroundColor.create({ color: '#f8e6a0' });
		const content: Node[] = [
			schema.text(' ', []),
			schema.text('highlighted', [mark]),
			schema.text(' ', []),
		];

		const result = getStandaloneBackgroundColorMarks(content);
		expect(result.length).toBe(1);
	});

	it('does not return backgroundColor mark when not surrounded by spaces', () => {
		const mark = schema.marks.backgroundColor.create({ color: '#f8e6a0' });
		const content: Node[] = [
			schema.text('Hello', []),
			schema.text('highlighted', [mark]),
			schema.text('World', []),
		];

		const result = getStandaloneBackgroundColorMarks(content);
		expect(result.length).toBe(0);
	});

	it('returns multiple standalone backgroundColor marks when separated by spaces', () => {
		const mark1 = schema.marks.backgroundColor.create({ color: '#f8e6a0' });
		const mark2 = schema.marks.backgroundColor.create({ color: '#f8e6a0' });
		const content: Node[] = [
			schema.text(' ', []),
			schema.text('first', [mark1]),
			schema.text(' ', []),
			schema.text('second', [mark2]),
			schema.text(' ', []),
		];

		const result = getStandaloneBackgroundColorMarks(content);
		expect(result.length).toBe(2);
	});

	it('works with multiple marks on same text node', () => {
		const bgMark = schema.marks.backgroundColor.create({ color: '#f8e6a0' });
		const emMark = schema.marks.em.create();
		const strongMark = schema.marks.strong.create();
		const content: Node[] = [
			schema.text('strong ', [strongMark]),
			schema.text('highlighted', [bgMark, emMark]),
			schema.text(' end.', []),
		];

		const result = getStandaloneBackgroundColorMarks(content);
		expect(result.length).toBe(1);
	});
});
