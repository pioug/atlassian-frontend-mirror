import { ORDER_BY_DIRECTION_ASC, ORDER_BY_DIRECTION_DESC } from '../constants';
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
});
