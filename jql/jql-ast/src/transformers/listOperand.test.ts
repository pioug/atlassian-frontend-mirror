import { OPERAND_TYPE_FUNCTION, OPERAND_TYPE_KEYWORD, OPERAND_TYPE_LIST } from '../constants';
import creators from '../creators';

describe('ListOperand transformer', () => {
	describe('appendOperand', () => {
		it('append value operand to a list operand', () => {
			const listOperand = creators.listOperand([
				creators.valueOperand('bug'),
				creators.valueOperand('epic'),
			]);

			const newOperand = creators.valueOperand('issue');

			listOperand.appendOperand(newOperand);

			expect(listOperand).toEqual(
				expect.objectContaining({
					operandType: OPERAND_TYPE_LIST,
					values: [
						expect.objectContaining({ value: 'bug' }),
						expect.objectContaining({ value: 'epic' }),
						expect.objectContaining({ value: 'issue' }),
					],
				}),
			);
		});

		it('append function operand to a list operand', () => {
			const listOperand = creators.listOperand([
				creators.valueOperand('bug'),
				creators.valueOperand('epic'),
			]);

			const newOperand = creators.functionOperand(creators.functionString('all'), []);

			listOperand.appendOperand(newOperand);

			expect(listOperand).toEqual(
				expect.objectContaining({
					operandType: OPERAND_TYPE_LIST,
					values: [
						expect.objectContaining({ value: 'bug' }),
						expect.objectContaining({ value: 'epic' }),
						expect.objectContaining({
							operandType: OPERAND_TYPE_FUNCTION,
							function: expect.objectContaining({ value: 'all' }),
						}),
					],
				}),
			);
		});

		it('append keyword operand to a list operand', () => {
			const listOperand = creators.listOperand([
				creators.valueOperand('bug'),
				creators.valueOperand('epic'),
			]);

			const newOperand = creators.keywordOperand();

			listOperand.appendOperand(newOperand);

			expect(listOperand).toEqual(
				expect.objectContaining({
					operandType: OPERAND_TYPE_LIST,
					values: [
						expect.objectContaining({ value: 'bug' }),
						expect.objectContaining({ value: 'epic' }),
						expect.objectContaining({
							operandType: OPERAND_TYPE_KEYWORD,
							value: 'empty',
						}),
					],
				}),
			);
		});

		it('append list operand to a list operand', () => {
			const listOperand = creators.listOperand([
				creators.valueOperand('bug'),
				creators.valueOperand('epic'),
			]);

			const newOperand = creators.listOperand([
				creators.valueOperand('issue'),
				creators.valueOperand('task'),
			]);

			listOperand.appendOperand(newOperand);

			expect(listOperand).toEqual(
				expect.objectContaining({
					operandType: OPERAND_TYPE_LIST,
					values: [
						expect.objectContaining({ value: 'bug' }),
						expect.objectContaining({ value: 'epic' }),
						expect.objectContaining({ value: 'issue' }),
						expect.objectContaining({ value: 'task' }),
					],
				}),
			);
		});
	});
});
