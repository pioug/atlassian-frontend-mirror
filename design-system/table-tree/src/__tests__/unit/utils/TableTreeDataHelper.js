import TableTreeDataHelper from '../../../utils/TableTreeDataHelper';

describe('updateItems', () => {
  it('should return rootIds and itemsById for root items with defaults', () => {
    const rootData = [
      { title: 'Chapter One', page: 10, key: 1 },
      { title: 'Chapter Two', page: 20, key: 2 },
      { title: 'Chapter Three', page: 30, key: 3 },
    ];
    const tableTreeDataHelper = new TableTreeDataHelper();
    const formatedData = tableTreeDataHelper.updateItems(rootData);
    expect(formatedData).toEqual([
      { title: 'Chapter One', page: 10, key: 1 },
      { title: 'Chapter Two', page: 20, key: 2 },
      { title: 'Chapter Three', page: 30, key: 3 },
    ]);
  });
  it('should throw exception if root items do not have key property', () => {
    const rootData = [
      { title: 'Chapter One', page: 10, id: 1 },
      { title: 'Chapter Two', page: 20, id: 2 },
      { title: 'Chapter Three', page: 30, id: 3 },
    ];
    const tableTreeDataHelper = new TableTreeDataHelper();
    expect(() => {
      tableTreeDataHelper.updateItems(rootData);
    }).toThrowError(/Property 'key' not found in rootItem\[0\]/);
  });
  it('should throw exception if parent item does not have key property', () => {
    const parentItem = { title: 'Chapter One', page: 10, id: 1 };
    const childItems = [{ title: 'Chapter Two', page: 20, id: 2 }];
    const tableTreeDataHelper = new TableTreeDataHelper({ key: 'author' });
    expect(() => {
      tableTreeDataHelper.updateItems(childItems, [], parentItem);
    }).toThrowError(/Property 'author' not found in parent item/);
  });
  it('should return rootIds and itemsById for root items with custom id', () => {
    const rootData = [
      { title: 'Chapter One', page: 10, id: 1 },
      { title: 'Chapter Two', page: 20, id: 2 },
      { title: 'Chapter Three', page: 30, id: 3 },
    ];
    const tableTreeDataHelperInstance = new TableTreeDataHelper({
      key: 'title',
    });
    const formatedData = tableTreeDataHelperInstance.updateItems(rootData);
    expect(formatedData).toEqual([
      { id: 1, page: 10, title: 'Chapter One' },
      { id: 2, page: 20, title: 'Chapter Two' },
      { id: 3, page: 30, title: 'Chapter Three' },
    ]);
  });
  it('should update the parent item with child ids', () => {
    const parentItems = [
      { title: 'Chapter One', page: 10, key: 1 },
      { title: 'Chapter Two', page: 20, key: 2 },
    ];
    const childItem = [{ title: 'Section One', page: 30, key: 3 }];
    const tableTreeDataHelperInstance = new TableTreeDataHelper();
    const allItems = tableTreeDataHelperInstance.updateItems(parentItems);
    const formatedData = tableTreeDataHelperInstance.updateItems(
      childItem,
      allItems,
      parentItems[0],
    );
    expect(formatedData).toEqual([
      {
        children: [{ key: 3, page: 30, title: 'Section One' }],
        key: 1,
        page: 10,
        title: 'Chapter One',
      },
      {
        key: 2,
        page: 20,
        title: 'Chapter Two',
      },
    ]);
  });
  it('should update the parent item with child ids - with custom ids', () => {
    const parentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
    const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
    const tableTreeDataHelperInstance = new TableTreeDataHelper({
      key: 'title',
    });
    tableTreeDataHelperInstance.updateItems(parentItem);

    const formatedData = tableTreeDataHelperInstance.updateItems(
      childItem,
      parentItem,
      ...parentItem,
    );
    expect(formatedData).toEqual([
      {
        id: 1,
        page: 10,
        title: 'Chapter One',
        children: [{ id: 2, page: 20, title: 'Chapter Two' }],
      },
    ]);
  });
});

describe('appendItems', () => {
  it('should throw exception if root items do not have key property when appending', () => {
    const rootData = [
      { title: 'Chapter One', page: 10, id: 1 },
      { title: 'Chapter Two', page: 20, id: 2 },
      { title: 'Chapter Three', page: 30, id: 3 },
    ];
    const tableTreeDataHelper = new TableTreeDataHelper();
    expect(() => {
      tableTreeDataHelper.appendItems(rootData);
    }).toThrowError(/Property 'key' not found in rootItem\[0\]/);
  });
  it('should throw exception if parent item does not have key property when appending', () => {
    const parentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
    const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
    const tableTreeDataHelper = new TableTreeDataHelper({ key: 'author' });
    expect(() => {
      tableTreeDataHelper.appendItems(childItem, [], ...parentItem);
    }).toThrowError(/Property 'author' not found in parent item/);
  });
  it('should return rootIds and itemsById for root items with defaults when appending', () => {
    const rootData = [
      { title: 'Chapter One', page: 10, key: 1 },
      { title: 'Chapter Two', page: 20, key: 2 },
      { title: 'Chapter Three', page: 30, key: 3 },
    ];
    const tableTreeDataHelper = new TableTreeDataHelper();
    const formatedData = tableTreeDataHelper.appendItems(rootData);
    expect(formatedData).toEqual([
      { title: 'Chapter One', page: 10, key: 1 },
      { title: 'Chapter Two', page: 20, key: 2 },
      { title: 'Chapter Three', page: 30, key: 3 },
    ]);
  });
  it('should update the parent item with child ids when appending', () => {
    const parentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
    const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
    const tableTreeDataHelperInstance = new TableTreeDataHelper({ key: 'id' });
    tableTreeDataHelperInstance.updateItems(parentItem);
    const formatedData = tableTreeDataHelperInstance.appendItems(
      childItem,
      parentItem,
      ...parentItem,
    );
    expect(formatedData).toEqual([
      {
        children: [{ id: 2, page: 20, title: 'Chapter Two' }],
        id: 1,
        page: 10,
        title: 'Chapter One',
      },
    ]);
  });
  it('should append the parent item with child ids when appending', () => {
    const parentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
    const childItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
    const secondChildItem = [{ title: 'Chapter Three', page: 30, id: 3 }];

    const tableTreeDataHelperInstance = new TableTreeDataHelper({ key: 'id' });
    const rootItems = tableTreeDataHelperInstance.updateItems(parentItem);
    const items = tableTreeDataHelperInstance.appendItems(
      childItem,
      rootItems,
      ...parentItem,
    );
    const formatedData = tableTreeDataHelperInstance.appendItems(
      secondChildItem,
      items,
      ...parentItem,
    );
    expect(formatedData).toEqual([
      {
        children: [
          { id: 2, page: 20, title: 'Chapter Two' },
          { id: 3, page: 30, title: 'Chapter Three' },
        ],
        id: 1,
        page: 10,
        title: 'Chapter One',
      },
    ]);
  });
  it('should update the root items when appending', () => {
    const initialParentItem = [{ title: 'Chapter One', page: 10, id: 1 }];
    const secondParentItem = [{ title: 'Chapter Two', page: 20, id: 2 }];
    const tableTreeDataHelperInstance = new TableTreeDataHelper({ key: 'id' });

    const items = tableTreeDataHelperInstance.updateItems(initialParentItem);
    const formatedData = tableTreeDataHelperInstance.appendItems(
      secondParentItem,
      items,
    );
    expect(formatedData).toEqual([
      {
        id: 1,
        page: 10,
        title: 'Chapter One',
      },
      {
        id: 2,
        page: 20,
        title: 'Chapter Two',
      },
    ]);
  });
});
