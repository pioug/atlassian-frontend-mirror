import { Transform } from '@atlaskit/editor-prosemirror/transform';
import { doc, p, panel } from '@af/adf-test-helpers/src/doc-builder';
import { defaultSchema } from '@af/adf-test-helpers/src/schema';

import { BatchAttrsStep } from '../../batch-attrs-step';

describe('BatchAttrsStep', () => {
	const baseDoc = doc(
		panel({
			panelType: 'info',
		})(p('lol')),
	)(defaultSchema);

	const twoPanelsDoc = doc(
		panel({
			panelType: 'info',
		})(p('lol')),
		panel({
			panelType: 'warn',
		})(p('lol')),
	)(defaultSchema);

	it('should apply the attributes into a document', () => {
		const panelPosition = 0;
		expect(baseDoc.nodeAt(panelPosition)!.attrs.panelType).toEqual('info');

		const basic = [
			{
				position: panelPosition,
				nodeType: 'panel',
				attrs: {
					panelType: 'error',
				},
			},
		];

		const step = new BatchAttrsStep(basic);

		const stepResult = step.apply(baseDoc);

		expect(stepResult.failed).toBeFalsy();
		expect(stepResult.doc!.nodeAt(panelPosition)!.attrs.panelType).toEqual('error');
	});

	describe('when have multiple positions to change', () => {
		it('should apply the attributes', () => {
			expect(twoPanelsDoc.nodeAt(0)!.attrs.panelType).toEqual('info');
			expect(twoPanelsDoc.nodeAt(7)!.attrs.panelType).toEqual('warn');

			const basic = [
				{
					position: 0,
					nodeType: 'panel',
					attrs: {
						panelType: 'error',
					},
				},
				{
					position: 7,
					nodeType: 'panel',
					attrs: {
						panelType: 'info',
					},
				},
			];

			const step = new BatchAttrsStep(basic);

			const stepResult = step.apply(twoPanelsDoc);

			expect(stepResult.failed).toBeFalsy();
			expect(stepResult.doc!.nodeAt(0)!.attrs.panelType).toEqual('error');
			expect(stepResult.doc!.nodeAt(7)!.attrs.panelType).toEqual('info');
		});
	});

	describe('when position is invalid', () => {
		it('should return a failed step', () => {
			const basic = [
				{
					position: 5,
					nodeType: 'panel',
					attrs: {
						panelType: 'error',
					},
				},
			];

			const step = new BatchAttrsStep(basic);

			const stepResult = step.apply(baseDoc);

			expect(stepResult.failed).toEqual('No node at given position: 5');
		});

		it('should return a out of range failed step', () => {
			const basic = [
				{
					position: 99,
					nodeType: 'panel',
					attrs: {
						panelType: 'error',
					},
				},
			];

			const step = new BatchAttrsStep(basic);

			const stepResult = step.apply(baseDoc);

			expect(stepResult.failed).toEqual('Position 99 out of document range.');
		});

		it('should return a out of range failed step for positions less than zero', () => {
			const basic = [
				{
					position: -1,
					nodeType: 'panel',
					attrs: {
						panelType: 'error',
					},
				},
			];

			const step = new BatchAttrsStep(basic);

			const stepResult = step.apply(baseDoc);

			expect(stepResult.failed).toEqual('Position -1 out of document range.');
		});
	});

	describe('invert step', () => {
		const batchAttributes = [
			{
				position: 0,
				nodeType: 'panel',
				attrs: {
					panelType: 'error',
				},
			},
			{
				position: 7,
				nodeType: 'panel',
				attrs: {
					panelType: 'info',
					panelIcon: 'lol',
				},
			},
		];

		it('should generate a revertable step containing previous attributes', () => {
			const step = new BatchAttrsStep(batchAttributes);

			const revertStep = step.invert(twoPanelsDoc);

			expect(revertStep).toBeInstanceOf(BatchAttrsStep);
			expect(revertStep.data).toEqual([
				{
					position: 0,
					nodeType: 'panel',
					attrs: {
						panelType: 'info',
					},
				},
				{
					position: 7,
					nodeType: 'panel',
					attrs: {
						panelType: 'warn',
						panelIcon: null,
					},
				},
			]);
		});

		it('should generate a revertable step adding the previous attribute', () => {
			const step = new BatchAttrsStep(batchAttributes);

			const revertStep = step.invert(twoPanelsDoc);

			const changedDocResult = step.apply(twoPanelsDoc);

			expect(changedDocResult.failed).toBeFalsy();
			expect(changedDocResult.doc!.nodeAt(0)!.attrs.panelType).toEqual('error');
			expect(changedDocResult.doc!.nodeAt(7)!.attrs.panelType).toEqual('info');
			expect(changedDocResult.doc!.nodeAt(7)!.attrs.panelIcon).toEqual('lol');

			const revertedDocResult = revertStep.apply(changedDocResult.doc!);

			expect(revertedDocResult.failed).toBeFalsy();
			expect(revertedDocResult.doc!.nodeAt(0)!.attrs.panelType).toEqual('info');
			expect(revertedDocResult.doc!.nodeAt(7)!.attrs.panelType).toEqual('warn');
			expect(revertedDocResult.doc!.nodeAt(7)!.attrs.panelIcon).toBeNull();
		});
	});

	describe('mapping', () => {
		const batchAttributes = [
			{
				position: 0,
				nodeType: 'panel',
				attrs: {
					panelType: 'error',
				},
			},
			{
				position: 7,
				nodeType: 'panel',
				attrs: {
					panelType: 'info',
					panelIcon: 'lol',
				},
			},
		];

		describe('when the document changes', () => {
			it('should update its positions', () => {
				const step = new BatchAttrsStep(batchAttributes);
				const transformer = new Transform(twoPanelsDoc);
				transformer.insert(0, defaultSchema.text('X'));

				const mappedStep = step.map(transformer.mapping);

				expect(mappedStep).not.toBeNull();

				expect(mappedStep!.data).toEqual([
					{
						position: 3,
						nodeType: 'panel',
						attrs: {
							panelType: 'error',
						},
					},
					{
						position: 10,
						nodeType: 'panel',
						attrs: {
							panelType: 'info',
							panelIcon: 'lol',
						},
					},
				]);
			});
		});

		describe('when a target node is deleted at the start', () => {
			it('should remove the entry from the deleted node', () => {
				const step = new BatchAttrsStep(batchAttributes);
				const transformer = new Transform(twoPanelsDoc);
				transformer.delete(0, 6);

				const mappedStep = step.map(transformer.mapping);

				expect(mappedStep).not.toBeNull();

				expect(mappedStep!.data).toEqual([
					{
						position: 0,
						nodeType: 'panel',
						attrs: {
							panelType: 'info',
							panelIcon: 'lol',
						},
					},
				]);
			});
		});

		describe('when a target node is deleted at the end', () => {
			it('should remove the entry from the deleted node', () => {
				const step = new BatchAttrsStep(batchAttributes);
				const transformer = new Transform(twoPanelsDoc);
				transformer.delete(7, 13);

				const mappedStep = step.map(transformer.mapping);

				expect(mappedStep).not.toBeNull();

				expect(mappedStep!.data).toEqual([
					{
						position: 0,
						nodeType: 'panel',
						attrs: {
							panelType: 'error',
						},
					},
				]);
			});
		});

		describe('when all targets were deleted', () => {
			it('should return null', () => {
				const step = new BatchAttrsStep(batchAttributes);
				const transformer = new Transform(twoPanelsDoc);

				transformer.delete(0, 6);
				transformer.delete(0, 6);

				const mappedStep = step.map(transformer.mapping);

				expect(mappedStep).toBeNull();
			});
		});
	});

	describe('toJSON', () => {
		it('should serialize into an object', () => {
			const batchAttributes = [
				{
					position: 0,
					nodeType: 'panel',
					attrs: {
						panelType: 'error',
					},
				},
				{
					position: 7,
					nodeType: 'panel',
					attrs: {
						panelType: 'info',
						panelIcon: 'lol',
					},
				},
			];
			const step = new BatchAttrsStep(batchAttributes);
			expect(step.toJSON()).toEqual({
				stepType: 'batchAttrs',
				data: batchAttributes,
				inverted: false,
			});
		});
	});

	describe('fromJSON', () => {
		describe('when reading a valid json', () => {
			it('should return a BatchAttrsStep instance', () => {
				const maybeStep = BatchAttrsStep.fromJSON(defaultSchema, {
					data: [
						{
							position: 0,
							nodeType: 'panel',
							attrs: {
								panelType: 'error',
							},
						},
					],
				});
				expect(maybeStep).toBeInstanceOf(BatchAttrsStep);
			});
		});

		describe('when reading a json without valid data', () => {
			it('should thrown an error', () => {
				expect(() => {
					BatchAttrsStep.fromJSON(defaultSchema, {
						data: [{}],
					});
				}).toThrow(/Invalid input for BatchAttrsStep.fromJSON/u);
			});
		});

		describe('when reading a json missing nodeType', () => {
			it('should thrown an error', () => {
				expect(() => {
					BatchAttrsStep.fromJSON(defaultSchema, {
						data: [{ position: 0, attrs: {} }],
					});
				}).toThrow(/Invalid input for BatchAttrsStep.fromJSON/u);
			});
		});

		describe('when reading a json missing position', () => {
			it('should thrown an error', () => {
				expect(() => {
					BatchAttrsStep.fromJSON(defaultSchema, {
						data: [{ nodeType: 'aaa', attrs: {} }],
					});
				}).toThrow(/Invalid input for BatchAttrsStep.fromJSON/u);
			});
		});

		describe('when reading a json missing attrs', () => {
			it('should thrown an error', () => {
				expect(() => {
					BatchAttrsStep.fromJSON(defaultSchema, {
						data: [{ position: 0, nodeType: 'aaa' }],
					});
				}).toThrow(/Invalid input for BatchAttrsStep.fromJSON/u);
			});
		});
	});
});
