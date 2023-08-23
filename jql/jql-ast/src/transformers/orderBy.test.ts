import { ORDER_BY_DIRECTION_ASC } from '../constants';
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
});
