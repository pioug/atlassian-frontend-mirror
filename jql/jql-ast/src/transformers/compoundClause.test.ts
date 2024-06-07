import {
	getAssigneeIsEmptyClause,
	getCreatedRecentlyClause,
	getMockAstNode,
	getStatusEqualsOpenClause,
	getTypeEqualsBugClause,
} from '../../test-utils/ast';
import { COMPOUND_OPERATOR_AND, COMPOUND_OPERATOR_OR } from '../constants';
import creators from '../creators';

const andOperator = creators.compoundOperator(COMPOUND_OPERATOR_AND);
const orOperator = creators.compoundOperator(COMPOUND_OPERATOR_OR);

describe('CompoundClause transformer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const removeClauseMock = jest.fn();
	const replaceClauseMock = jest.fn();
	const mockParent = {
		...getMockAstNode(),
		removeClause: removeClauseMock,
		replaceClause: replaceClauseMock,
	};

	describe('appendClause', () => {
		it('adds the provided clause to the end of the clause array', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);

			baseClause.appendClause(assigneeIsEmptyClause);

			expect(baseClause.clauses).toEqual([
				typeEqualsBugClause,
				statusEqualsOpenClause,
				assigneeIsEmptyClause,
			]);
		});

		it('adds nested compound clause with a different operator', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClauseA = getStatusEqualsOpenClause();
			const statusEqualsOpenClauseB = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClauseA,
			]);
			const nextClause = creators.compoundClause(orOperator, [
				statusEqualsOpenClauseB,
				assigneeIsEmptyClause,
			]);

			baseClause.appendClause(nextClause);

			expect(baseClause.clauses).toEqual([
				typeEqualsBugClause,
				statusEqualsOpenClauseA,
				nextClause,
			]);
		});

		it('flattens nested compound clause with the same operator', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClauseA = getStatusEqualsOpenClause();
			const statusEqualsOpenClauseB = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClauseA,
			]);
			const nextClause = creators.compoundClause(andOperator, [
				statusEqualsOpenClauseB,
				assigneeIsEmptyClause,
			]);

			baseClause.appendClause(nextClause);

			expect(baseClause.clauses).toEqual([
				typeEqualsBugClause,
				statusEqualsOpenClauseA,
				statusEqualsOpenClauseB,
				assigneeIsEmptyClause,
			]);
		});
	});

	describe('remove', () => {
		it('delegates to parent removeClause', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);
			baseClause.parent = mockParent;
			baseClause.remove();

			expect(removeClauseMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('removeClause', () => {
		it('removes clause from list of clauses', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
				assigneeIsEmptyClause,
			]);

			baseClause.removeClause(typeEqualsBugClause);

			expect(baseClause.clauses).toEqual([statusEqualsOpenClause, assigneeIsEmptyClause]);
		});

		it('does not modify list of clauses if clause could not be found', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);

			baseClause.removeClause(assigneeIsEmptyClause);

			expect(baseClause.clauses).toEqual([typeEqualsBugClause, statusEqualsOpenClause]);
		});

		it('delegates to parent removeClause if the last clause in the list is removed', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();

			const baseClause = creators.compoundClause(andOperator, [typeEqualsBugClause]);
			baseClause.parent = mockParent;

			baseClause.removeClause(typeEqualsBugClause);
			expect(removeClauseMock).toHaveBeenCalledTimes(1);
		});

		it('replaces compound clause with child clause if there is only one child left in list of clauses', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);
			const parentClause = creators.compoundClause(orOperator, [baseClause, assigneeIsEmptyClause]);

			baseClause.removeClause(typeEqualsBugClause);

			expect(parentClause.clauses).toEqual([statusEqualsOpenClause, assigneeIsEmptyClause]);
		});
	});

	describe('replace', () => {
		it('delegates to parent replaceClause', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);
			baseClause.parent = mockParent;
			baseClause.replace(assigneeIsEmptyClause);

			expect(replaceClauseMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('replaceClause', () => {
		it('replaces clause from list of clauses', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);

			baseClause.replaceClause(typeEqualsBugClause, assigneeIsEmptyClause);

			expect(baseClause.clauses).toEqual([assigneeIsEmptyClause, statusEqualsOpenClause]);
		});

		it('does not modify list of clauses if clause could not be found', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();
			const createdRecentlyClause = getCreatedRecentlyClause();

			const baseClause = creators.compoundClause(andOperator, [
				typeEqualsBugClause,
				statusEqualsOpenClause,
			]);

			baseClause.replaceClause(assigneeIsEmptyClause, createdRecentlyClause);

			expect(baseClause.clauses).toEqual([typeEqualsBugClause, statusEqualsOpenClause]);
		});
	});
});
