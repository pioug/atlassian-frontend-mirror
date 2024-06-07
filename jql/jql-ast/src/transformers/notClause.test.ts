import {
	getAssigneeIsEmptyClause,
	getMockAstNode,
	getStatusEqualsOpenClause,
	getTypeEqualsBugClause,
} from '../../test-utils/ast';
import creators from '../creators';

describe('NotClause transformer', () => {
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

	describe('remove', () => {
		it('delegates to parent removeClause', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();

			const baseClause = creators.notClause(typeEqualsBugClause);
			baseClause.parent = mockParent;
			baseClause.remove();

			expect(removeClauseMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('removeClause', () => {
		it('delegates to parent removeClause', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();

			const baseClause = creators.notClause(typeEqualsBugClause);
			baseClause.parent = mockParent;
			baseClause.removeClause(typeEqualsBugClause);

			expect(removeClauseMock).toHaveBeenCalledTimes(1);
		});

		it('does not delegate to parent removeClause if clause did not match', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();

			const baseClause = creators.notClause(typeEqualsBugClause);
			baseClause.parent = mockParent;
			baseClause.removeClause(statusEqualsOpenClause);

			expect(removeClauseMock).not.toHaveBeenCalled();
		});
	});

	describe('replace', () => {
		it('delegates to parent replaceClause', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();

			const baseClause = creators.notClause(typeEqualsBugClause);
			baseClause.parent = mockParent;
			baseClause.replace(statusEqualsOpenClause);

			expect(replaceClauseMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('replaceClause', () => {
		it('replaces sub-clause', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();

			const baseClause = creators.notClause(typeEqualsBugClause);
			baseClause.replaceClause(typeEqualsBugClause, statusEqualsOpenClause);

			expect(baseClause.clause).toEqual(statusEqualsOpenClause);
		});

		it('does not modify sub-clause if clause could not be found', () => {
			const typeEqualsBugClause = getTypeEqualsBugClause();
			const statusEqualsOpenClause = getStatusEqualsOpenClause();
			const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

			const baseClause = creators.notClause(typeEqualsBugClause);
			baseClause.replaceClause(assigneeIsEmptyClause, statusEqualsOpenClause);

			expect(baseClause.clause).toEqual(typeEqualsBugClause);
		});
	});
});
