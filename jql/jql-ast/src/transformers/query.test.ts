import {
  getAssigneeIsEmptyClause,
  getCompoundAndClause,
  getStatusEqualsOpenClause,
  getTypeEqualsBugClause,
} from '../../test-utils/ast';
import {
  CLAUSE_TYPE_COMPOUND,
  COMPOUND_OPERATOR_AND,
  COMPOUND_OPERATOR_OR,
  ORDER_BY_DIRECTION_ASC,
} from '../constants';
import creators from '../creators';

describe('Query transformer', () => {
  describe('appendClause', () => {
    it('sets where to the provided clause when where is undefined', () => {
      const baseQuery = creators.query(undefined, undefined);
      const assigneeIsEmptyClause = getAssigneeIsEmptyClause();
      baseQuery.appendClause(assigneeIsEmptyClause, COMPOUND_OPERATOR_AND);

      expect(baseQuery.where).toEqual(assigneeIsEmptyClause);
    });

    it('wraps existing non-compound clause in a compound clause', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();
      const baseQuery = creators.query(typeEqualsBugClause, undefined);

      const assigneeIsEmptyClause = getAssigneeIsEmptyClause();
      baseQuery.appendClause(assigneeIsEmptyClause, COMPOUND_OPERATOR_OR);

      expect(baseQuery.where).toEqual(
        expect.objectContaining({
          clauseType: CLAUSE_TYPE_COMPOUND,
          operator: expect.objectContaining({
            value: COMPOUND_OPERATOR_OR,
          }),
          clauses: [typeEqualsBugClause, assigneeIsEmptyClause],
        }),
      );
    });

    it('wraps existing compound clause with mismatched operator in a compound clause', () => {
      const baseClause = getCompoundAndClause();
      const baseQuery = creators.query(baseClause, undefined);

      const typeEqualsBugClause = getTypeEqualsBugClause();
      baseQuery.appendClause(typeEqualsBugClause, COMPOUND_OPERATOR_OR);

      expect(baseQuery.where).toEqual(
        expect.objectContaining({
          clauseType: CLAUSE_TYPE_COMPOUND,
          operator: expect.objectContaining({
            value: COMPOUND_OPERATOR_OR,
          }),
          clauses: [baseClause, typeEqualsBugClause],
        }),
      );
    });

    it('merges existing compound clause with matching operator', () => {
      const baseClause = getCompoundAndClause();
      const baseQuery = creators.query(baseClause, undefined);

      const typeEqualsBugClause = getTypeEqualsBugClause();
      baseQuery.appendClause(typeEqualsBugClause, COMPOUND_OPERATOR_AND);

      expect(baseQuery.where).toEqual(
        expect.objectContaining({
          clauseType: CLAUSE_TYPE_COMPOUND,
          operator: expect.objectContaining({
            value: COMPOUND_OPERATOR_AND,
          }),
          clauses: [...baseClause.clauses, typeEqualsBugClause],
        }),
      );
    });

    it('merges existing compound clause with matching operator when appending a compound clause', () => {
      const baseClause = getCompoundAndClause();
      const baseQuery = creators.query(baseClause, undefined);

      const nextClause = getCompoundAndClause();
      baseQuery.appendClause(nextClause, COMPOUND_OPERATOR_AND);

      expect(baseQuery.where).toEqual(
        expect.objectContaining({
          clauseType: CLAUSE_TYPE_COMPOUND,
          operator: expect.objectContaining({
            value: COMPOUND_OPERATOR_AND,
          }),
          clauses: [...baseClause.clauses, ...nextClause.clauses],
        }),
      );
    });
  });

  describe('prependOrderField', () => {
    it('sets orderBy to the provided node when orderBy is undefined', () => {
      const baseQuery = creators.query(undefined, undefined);
      const orderFieldA = creators.orderByField(creators.field('issuetype'));
      baseQuery.prependOrderField(orderFieldA);

      expect(baseQuery.orderBy).toEqual(
        expect.objectContaining({
          fields: [orderFieldA],
        }),
      );
    });

    it('prepends orderByField to the existing list of fields when orderBy is undefined', () => {
      const orderFieldA = creators.orderByField(creators.field('issuetype'));
      const baseQuery = creators.query(
        undefined,
        creators.orderBy([orderFieldA]),
      );

      const orderFieldB = creators.orderByField(creators.field('status'));
      baseQuery.prependOrderField(orderFieldB);

      expect(baseQuery.orderBy).toEqual(
        expect.objectContaining({
          fields: [orderFieldB, orderFieldA],
        }),
      );
    });
  });

  describe('setOrderDirection', () => {
    it('sets the direction of the primary order field to the provided value', () => {
      const orderFieldA = creators.orderByField(creators.field('issuetype'));
      const orderFieldB = creators.orderByField(creators.field('status'));
      const orderByNode = creators.orderBy([orderFieldA, orderFieldB]);
      const baseQuery = creators.query(undefined, orderByNode);

      const direction = creators.orderByDirection(ORDER_BY_DIRECTION_ASC);
      baseQuery.setOrderDirection(direction);

      expect(orderFieldA.direction).toEqual(direction);
    });

    it('does not set the direction when orderBy is undefined', () => {
      const baseQuery = creators.query(undefined, undefined);
      const direction = creators.orderByDirection(ORDER_BY_DIRECTION_ASC);
      baseQuery.setOrderDirection(direction);

      expect(baseQuery.orderBy).toEqual(undefined);
    });
  });

  describe('removeClause', () => {
    it('removes where clause', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();

      const baseQuery = creators.query(typeEqualsBugClause);
      baseQuery.removeClause(typeEqualsBugClause);

      expect(baseQuery.where).toEqual(undefined);
    });

    it('does not modify where clause if clause could not be found', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();
      const statusEqualsOpenClause = getStatusEqualsOpenClause();

      const baseQuery = creators.query(typeEqualsBugClause);
      baseQuery.removeClause(statusEqualsOpenClause);

      expect(baseQuery.where).toEqual(typeEqualsBugClause);
    });
  });

  describe('replaceClause', () => {
    it('replaces where clause', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();
      const statusEqualsOpenClause = getStatusEqualsOpenClause();

      const baseQuery = creators.query(typeEqualsBugClause);
      baseQuery.replaceClause(typeEqualsBugClause, statusEqualsOpenClause);

      expect(baseQuery.where).toEqual(statusEqualsOpenClause);
    });

    it('does not modify where clause if clause could not be found', () => {
      const typeEqualsBugClause = getTypeEqualsBugClause();
      const statusEqualsOpenClause = getStatusEqualsOpenClause();
      const assigneeIsEmptyClause = getAssigneeIsEmptyClause();

      const baseQuery = creators.query(typeEqualsBugClause);
      baseQuery.replaceClause(assigneeIsEmptyClause, statusEqualsOpenClause);

      expect(baseQuery.where).toEqual(typeEqualsBugClause);
    });
  });
});
