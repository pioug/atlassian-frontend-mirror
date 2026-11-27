import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { wasExperimentExposed } from '@atlassian/experiment-test-utils/was-experiment-exposed';

import type { ADFEntity } from '../../../types';
import { validator } from '../../validator';

const EXPERIMENT = 'platform_editor_fix_tuple_content_variants';

const smallText = { type: 'fontSize', attrs: { fontSize: 'small' } };

const paragraph = (text: string, marks?: ADFEntity['marks']): ADFEntity => ({
	type: 'paragraph',
	...(marks ? { marks } : {}),
	content: [{ type: 'text', text }],
});

// blockTaskItem's content spec is tuple-like and offers several paragraph variants.
const docWithBlockTask = (content: ADFEntity[]): ADFEntity => ({
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'taskList',
			attrs: { localId: 'list' },
			content: [{ type: 'blockTaskItem', attrs: { localId: 'task', state: 'TODO' }, content }],
		},
	],
});

const annotation = {
	type: 'annotation',
	attrs: { id: 'comment', annotationType: 'inlineComment' },
};

const extension = (marks?: ADFEntity['marks']): ADFEntity => ({
	type: 'extension',
	attrs: { extensionType: 'com.atlassian.confluence.macro.core', extensionKey: 'toc' },
	...(marks ? { marks } : {}),
});

// mediaSingle's content spec is also tuple-like, but offers one variant per type.
const docWithCaptionedMedia: ADFEntity = {
	version: 1,
	type: 'doc',
	content: [
		{
			type: 'mediaSingle',
			attrs: { layout: 'center' },
			content: [
				{ type: 'media', attrs: { id: 'media', type: 'file', collection: '' } },
				{ type: 'caption', content: [{ type: 'text', text: 'Caption' }] },
			],
		},
	],
};

const getTaskContent = (doc: ADFEntity | undefined) => doc?.content?.[0]?.content?.[0]?.content;

describe('validator: tuple-like content with several variants of one type', () => {
	const validate = validator();
	let errorCallback: jest.Mock;

	beforeEach(() => {
		errorCallback = jest.fn((entity) => entity);
	});

	describe('when the experiment is on', () => {
		beforeEach(() => mockExpEnabled(EXPERIMENT));

		it('keeps fontSize on a blockTaskItem paragraph', () => {
			const { entity } = validate(
				docWithBlockTask([paragraph('Hello', [smallText])]),
				errorCallback,
			);

			expect(errorCallback).not.toHaveBeenCalled();
			expect(getTaskContent(entity)).toEqual([paragraph('Hello', [smallText])]);
		});

		it('validates each child against its own matching variant', () => {
			const content = [paragraph('Hello', [smallText]), paragraph('World')];
			const { entity } = validate(docWithBlockTask(content), errorCallback);

			expect(errorCallback).not.toHaveBeenCalled();
			expect(getTaskContent(entity)).toEqual(content);
		});

		it('still reports a mark that no variant allows', () => {
			validate(
				docWithBlockTask([paragraph('Hello', [{ type: 'alignment', attrs: { align: 'center' } }])]),
				errorCallback,
			);

			expect(errorCallback).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'alignment' }),
				expect.objectContaining({ code: 'INVALID_TYPE' }),
				expect.anything(),
			);
		});
	});

	// Cases the fix must not change: each runs with the experiment on and off.
	describe.each([
		['on', mockExpEnabled],
		['off', mockExpDisabled],
	])('when the experiment is %s', (_state, mockExperiment) => {
		beforeEach(() => mockExperiment(EXPERIMENT));

		// `extension_with_annotation` is stage-0 only, so the default validator declines it.
		it.each([
			['an annotation', annotation],
			['a mark no extension allows', { type: 'strong' }],
		])('keeps an extension with %s and reports the mark once', (_name, mark) => {
			const { entity } = validate(docWithBlockTask([extension([mark])]), errorCallback);

			expect(getTaskContent(entity)).toEqual([extension([mark])]);
			expect(errorCallback).toHaveBeenCalledTimes(1);
			expect(errorCallback).toHaveBeenCalledWith(
				mark,
				expect.objectContaining({ code: 'INVALID_TYPE' }),
				expect.anything(),
			);
		});

		it('reports both marks when no single variant allows them together', () => {
			const alignment = { type: 'alignment', attrs: { align: 'center' } };
			const { entity } = validate(
				docWithBlockTask([paragraph('Hello', [smallText, alignment])]),
				errorCallback,
			);

			expect(getTaskContent(entity)).toEqual([paragraph('Hello', [smallText, alignment])]);
			expect(errorCallback.mock.calls.map(([mark]) => mark.type)).toEqual([
				'fontSize',
				'alignment',
			]);
		});

		it('reports invalid content inside a small-text paragraph once', () => {
			const smallParagraphWithRule: ADFEntity = {
				...paragraph('Hello', [smallText]),
				content: [{ type: 'text', text: 'Hello' }, { type: 'rule' }],
			};
			validate(docWithBlockTask([smallParagraphWithRule]), errorCallback);

			const ruleErrors = errorCallback.mock.calls.filter(([entity]) => entity.type === 'rule');
			expect(ruleErrors).toHaveLength(1);
		});

		it('lets the error callback recover a paragraph with malformed marks', () => {
			const malformedParagraph = {
				...paragraph('Hello'),
				marks: [null],
				extraProperty: true,
			} as unknown as ADFEntity;
			const { entity } = validate(docWithBlockTask([malformedParagraph]), errorCallback);

			expect(errorCallback).toHaveBeenCalledWith(
				expect.objectContaining({ type: 'paragraph' }),
				expect.objectContaining({ code: 'REDUNDANT_PROPERTIES' }),
				expect.anything(),
			);
			expect(getTaskContent(entity)).toEqual([
				expect.objectContaining({ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }),
			]);
		});
	});

	describe('when the experiment is on and stage-0 specs are allowed', () => {
		beforeEach(() => mockExpEnabled(EXPERIMENT));

		it('keeps annotations on extensions', () => {
			const validateStage0 = validator(undefined, undefined, { stage0: true });
			const { entity } = validateStage0(docWithBlockTask([extension([annotation])]), errorCallback);

			expect(errorCallback).not.toHaveBeenCalled();
			expect(getTaskContent(entity)).toEqual([extension([annotation])]);
		});
	});

	describe('when the experiment is on and the later variant rejects the mark attrs', () => {
		beforeEach(() => mockExpEnabled(EXPERIMENT));

		it('keeps the paragraph and reports the mark once', () => {
			const largeText = { type: 'fontSize', attrs: { fontSize: 'large' } };
			const { entity } = validate(
				docWithBlockTask([paragraph('Hello', [largeText])]),
				errorCallback,
			);

			expect(getTaskContent(entity)).toEqual([paragraph('Hello', [largeText])]);
			expect(errorCallback).toHaveBeenCalledTimes(1);
			expect(errorCallback).toHaveBeenCalledWith(largeText, expect.anything(), expect.anything());
		});
	});

	describe('experiment exposure', () => {
		it('is not logged without tuple-like content', () => {
			validate({ version: 1, type: 'doc', content: [paragraph('Hello', [])] }, errorCallback);

			expect(wasExperimentExposed(EXPERIMENT)).toBe(false);
		});

		// The experiment is checked before anything else, so any tuple-like child logs it.
		it('is logged for tuple-like content with one variant per type', () => {
			validate(docWithCaptionedMedia, errorCallback);

			expect(wasExperimentExposed(EXPERIMENT)).toBe(true);
		});

		it('is logged when a child needs a later variant', () => {
			validate(docWithBlockTask([paragraph('Hello', [smallText])]), errorCallback);

			expect(wasExperimentExposed(EXPERIMENT)).toBe(true);
		});
	});

	describe('when the experiment is off', () => {
		beforeEach(() => mockExpDisabled(EXPERIMENT));

		it('reports fontSize as unsupported on a blockTaskItem paragraph', () => {
			validate(docWithBlockTask([paragraph('Hello', [smallText])]), errorCallback);

			expect(errorCallback).toHaveBeenCalledWith(
				smallText,
				expect.objectContaining({ code: 'INVALID_TYPE', message: 'fontSize: unsupported mark.' }),
				expect.anything(),
			);
		});
	});
});
