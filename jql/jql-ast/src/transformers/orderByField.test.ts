import { getMockAstNode } from '../../test-utils/ast';
import { NODE_TYPE_ORDER_BY, ORDER_BY_DIRECTION_ASC, ORDER_BY_DIRECTION_DESC } from '../constants';
import creators from '../creators';

describe('OrderByField transformer', () => {
	describe('setOrderDirection', () => {
		it('sets the direction to the provided value', () => {
			const orderField = creators.orderByField(
				creators.field('issuetype'),
				creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
			);
			const direction = creators.orderByDirection(ORDER_BY_DIRECTION_ASC);
			orderField.setOrderDirection(direction);

			expect(orderField.direction).toEqual(direction);
			expect(direction.parent).toEqual(orderField);
		});
	});

	describe('replaceOrderBy', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		const replaceOrderFieldMock = jest.fn();
		const mockParent = {
			...getMockAstNode(),
			replaceOrderField: replaceOrderFieldMock,
			prependOrderField: jest.fn(),
			setOrderDirection: jest.fn(),
			replace: jest.fn(),
			type: NODE_TYPE_ORDER_BY as typeof NODE_TYPE_ORDER_BY,
			operator: creators.orderByOperator(),
			fields: [],
			removeOrderField: jest.fn(),
			remove: jest.fn(),
			parent: { replaceOrderBy: jest.fn(), removeOrderBy: jest.fn(), ...getMockAstNode() },
		};

		it('delegates to parent orderBy node', () => {
			const orderField = creators.orderByField(creators.field('issuetype'));
			orderField.parent = mockParent;

			const newField = creators.orderByField(creators.field('reporter'));

			orderField.replace(newField);
			expect(replaceOrderFieldMock).toHaveBeenCalledTimes(1);
		});
	});

	describe('remove', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		const removeOrderFieldMock = jest.fn();
		const mockParent = {
			...getMockAstNode(),
			replaceOrderField: jest.fn(),
			prependOrderField: jest.fn(),
			setOrderDirection: jest.fn(),
			replace: jest.fn(),
			type: NODE_TYPE_ORDER_BY as typeof NODE_TYPE_ORDER_BY,
			operator: creators.orderByOperator(),
			fields: [],
			removeOrderField: removeOrderFieldMock,
			remove: jest.fn(),
			parent: { replaceOrderBy: jest.fn(), removeOrderBy: jest.fn(), ...getMockAstNode() },
		};

		it('delegates to parent orderBy node', () => {
			const orderField = creators.orderByField(creators.field('issuetype'));
			orderField.parent = mockParent;

			orderField.remove();
			expect(removeOrderFieldMock).toHaveBeenCalledTimes(1);
		});
	});
});
