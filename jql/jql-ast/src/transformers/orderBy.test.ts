import {getMockAstNode} from "../../test-utils/ast";
import {ORDER_BY_DIRECTION_ASC, ORDER_BY_DIRECTION_DESC} from '../constants';
import creators from '../creators';

describe('OrderBy transformer', () => {
  describe('prependOrderField', () => {
    it('adds the provided order field to the beginning of the fields array', () => {
      const orderFieldA = creators.orderByField(creators.field('issuetype'));
      const orderByNode = creators.orderBy([orderFieldA]);

      const orderFieldB = creators.orderByField(creators.field('status'));
      orderByNode.prependOrderField(orderFieldB);

      expect(orderByNode.fields).toEqual([orderFieldB, orderFieldA]);
    });
  });

  describe('setOrderDirection', () => {
    it('sets the direction of the primary order field to the provided value', () => {
      const orderFieldA = creators.orderByField(creators.field('issuetype'));
      const orderFieldB = creators.orderByField(creators.field('status'));
      const orderByNode = creators.orderBy([orderFieldA, orderFieldB]);

      const direction = creators.orderByDirection(ORDER_BY_DIRECTION_ASC);
      orderByNode.setOrderDirection(direction);

      expect(orderFieldA.direction).toEqual(direction);
    });

    it('does not set the direction when there are no order fields', () => {
      const orderByNode = creators.orderBy([]);
      const direction = creators.orderByDirection(ORDER_BY_DIRECTION_ASC);
      orderByNode.setOrderDirection(direction);

      expect(orderByNode.fields).toEqual([]);
    });
  });

  describe('replace', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const removeClauseMock = jest.fn();
    const replaceClauseMock = jest.fn();
    const replaceOrderByMock = jest.fn();
    const mockParent = {
      ...getMockAstNode(),
      removeClause: removeClauseMock,
      replaceClause: replaceClauseMock,
      replaceOrderBy: replaceOrderByMock,
      removeOrderBy: jest.fn(),
    };

    it('delegates to parent orderBy clause', () => {
      const orderByNode = creators.orderBy([creators.orderByField(creators.field('issuetype'))]);
      orderByNode.parent = mockParent;

      const newField = creators.orderByField(creators.field('reporter'));
      const newOrderByNode = creators.orderBy([newField]);

      orderByNode.replace(newOrderByNode);
      expect(replaceOrderByMock).toHaveBeenCalledTimes(1);
    });
  })

  describe('replaceOrderByField', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const removeClauseMock = jest.fn();
    const replaceClauseMock = jest.fn();
    const replaceOrderByMock = jest.fn();
    const mockParent = {
      ...getMockAstNode(),
      removeClause: removeClauseMock,
      replaceClause: replaceClauseMock,
      replaceOrderBy: replaceOrderByMock,
      removeOrderBy: jest.fn(),
    };

    it('replaces provided orderByField with provided new orderByField', () => {
      const fieldOld = creators.orderByField(creators.field('issuetype'));
      const orderByNode = creators.orderBy([fieldOld]);
      orderByNode.parent = mockParent;

      const fieldNew = creators.orderByField(creators.field('reporter'));

      orderByNode.replaceOrderField(fieldOld, fieldNew);
      expect(orderByNode).toEqual(
        expect.objectContaining({
          fields: [fieldNew],
        }),
      );
    });

    it('does not replace provided orderByField with provided new orderByField when field is not found', () => {
      const fieldOld = creators.orderByField(creators.field('issuetype'));
      const orderByNode = creators.orderBy([fieldOld]);
      orderByNode.parent = mockParent;

      const fieldNew = creators.orderByField(creators.field('reporter'));

      orderByNode.replaceOrderField(creators.orderByField(creators.field('status')), fieldNew);
      expect(orderByNode).toEqual(
        expect.objectContaining({
          fields: [fieldOld],
        }),
      );
    });

  })

  describe('remove', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const removeClauseMock = jest.fn();
    const replaceClauseMock = jest.fn();
    const replaceOrderByMock = jest.fn();
    const removeOrderByMock = jest.fn();
    const mockParent = {
      ...getMockAstNode(),
      removeClause: removeClauseMock,
      replaceClause: replaceClauseMock,
      replaceOrderBy: replaceOrderByMock,
      removeOrderBy: removeOrderByMock,
    };

    it('delegates to parent orderBy clause', () => {
      const orderByNode = creators.orderBy([creators.orderByField(creators.field('issuetype'))]);
      orderByNode.parent = mockParent;


      orderByNode.remove();
      expect(removeOrderByMock).toHaveBeenCalledTimes(1);
    });
  })

  describe('removeOrderByField', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const removeClauseMock = jest.fn();
    const replaceClauseMock = jest.fn();
    const replaceOrderByMock = jest.fn();
    const removeOrderByMock = jest.fn();
    const mockParent = {
      ...getMockAstNode(),
      removeClause: removeClauseMock,
      replaceClause: replaceClauseMock,
      replaceOrderBy: replaceOrderByMock,
      removeOrderBy: removeOrderByMock,
    };

    it('removes a given field', () => {
      const field1 = creators.orderByField(
        creators.field('issuetype'),
        creators.orderByDirection(ORDER_BY_DIRECTION_DESC),
      );
      const field2 = creators.orderByField(creators.field('status'));

      const orderByNode = creators.orderBy([field1, field2]);
      orderByNode.parent = mockParent;


      orderByNode.removeOrderField(field2);
      expect(orderByNode.fields).toHaveLength(1);
    });

    it('does not remove a given field when it is not found', () => {
      const field = creators.orderByField(creators.field('status'));
      const fieldNotAddedToNode = creators.orderByField(creators.field('status'));

      const orderByNode = creators.orderBy([field]);
      orderByNode.parent = mockParent;


      orderByNode.removeOrderField(fieldNotAddedToNode);
      expect(orderByNode.fields).toHaveLength(1);
    });

    it('can handle empty orderBy node', () => {
      const field = creators.orderByField(creators.field('status'));

      const orderByNode = creators.orderBy([]);
      orderByNode.parent = mockParent;


      orderByNode.removeOrderField(field);
      expect(orderByNode.fields).toHaveLength(0);
    });
  })
});
