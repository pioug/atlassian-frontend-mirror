import reducerUtils from '../../reducer-utils';

const item = { id: 'new-item', legacyId: 'legacy-item-id' };

describe('NavigationNext View Controller: Reducer Utils', () => {
  describe('#prependChildren', () => {
    it('should prepend the view item in `items` array', () => {
      const firstViewItem = {
        id: 'menu',
        items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
      };
      const viewItems = [firstViewItem];

      const reducedViewItems = reducerUtils.findId('menu')(
        reducerUtils.prependChildren([item]),
      )(viewItems);

      expect(reducedViewItems).toEqual([
        {
          ...firstViewItem,
          items: [item, ...firstViewItem.items],
        },
      ]);
    });
  });

  describe('#appendChildren', () => {
    it('should append the view item in `items` array', () => {
      const firstViewItem = {
        id: 'menu',
        items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
      };
      const viewItems = [firstViewItem];

      const reducedViewItems = reducerUtils.findId('menu')(
        reducerUtils.appendChildren([item]),
      )(viewItems);

      expect(reducedViewItems).toEqual([
        {
          ...firstViewItem,
          items: [...firstViewItem.items, item],
        },
      ]);
    });
  });

  describe('#insertBefore', () => {
    it('should append the view item in `items` array', () => {
      const firstViewItem = {
        id: 'menu',
        items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
      };
      const viewItems = [firstViewItem];

      const reducedViewItems = reducerUtils.findId('menu')(
        reducerUtils.insertBefore([item]),
      )(viewItems);

      expect(reducedViewItems).toEqual([item, firstViewItem]);
    });
  });

  describe('#insertAfter', () => {
    it('should append the view item in `items` array', () => {
      const firstViewItem = {
        id: 'menu',
        items: [{ id: 'item1' }, { id: 'item2' }, { id: 'item3' }],
      };
      const viewItems = [firstViewItem];

      const reducedViewItems = reducerUtils.findId('menu')(
        reducerUtils.insertAfter([item]),
      )(viewItems);

      expect(reducedViewItems).toEqual([firstViewItem, item]);
    });
  });
});
