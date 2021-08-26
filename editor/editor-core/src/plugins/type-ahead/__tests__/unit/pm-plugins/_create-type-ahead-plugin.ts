import { TypeAheadSelectItem } from '../../../types';

export const createTypeAheadPlugin = ({
  trigger,
  getItems,
  selectItem,
  forceSelect,
}: {
  trigger?: string;
  getItems?: Function;
  selectItem?: TypeAheadSelectItem;
  forceSelect?: Function;
} = {}) => {
  return {
    name: 'quickInsert',
    pluginsOptions: {
      typeAhead: {
        trigger: trigger !== undefined ? trigger : '/',
        getItems:
          getItems !== undefined
            ? getItems
            : () => [{ title: '1' }, { title: '2' }, { title: '3' }],
        selectItem:
          selectItem !== undefined
            ? selectItem
            : (((state, item, replaceWith) =>
                replaceWith(
                  state.schema.text(`${item.title} selected`),
                )) as TypeAheadSelectItem),
        forceSelect,
      },
    },
  };
};
