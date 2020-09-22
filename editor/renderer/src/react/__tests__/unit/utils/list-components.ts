import { defaultSchema as schema } from '@atlaskit/adf-schema';
import { Node } from 'prosemirror-model';
import { getListIndentLevel } from '../../../utils/lists';

describe('#getListIndentLevel', () => {
  it('should return 1 if list is not nested', () => {
    const pathForSingleLevelList: [] = [];

    const result = getListIndentLevel(pathForSingleLevelList);

    expect(result).toEqual(1);
  });

  it('should return 2 if ordered list is 2 levels deep', () => {
    const {
      nodes: { orderedList, listItem },
    } = schema;
    const pathForTwoLevelList: Node[] = [
      orderedList.createAndFill()!,
      listItem.createAndFill()!,
    ];

    const result = getListIndentLevel(pathForTwoLevelList);

    expect(result).toEqual(2);
  });

  it('should return 3 if bullet list is 3 levels deep', () => {
    const {
      nodes: { bulletList, listItem },
    } = schema;
    const pathForTwoLevelList: Node[] = [
      bulletList.createAndFill()!,
      listItem.createAndFill()!,
      bulletList.createAndFill()!,
      listItem.createAndFill()!,
    ];

    const result = getListIndentLevel(pathForTwoLevelList);

    expect(result).toEqual(3);
  });

  it('should return 4 if mixed bullet & ordered list is 4 levels deep', () => {
    const {
      nodes: { bulletList, orderedList, listItem },
    } = schema;
    const pathForTwoLevelList: Node[] = [
      bulletList.createAndFill()!,
      listItem.createAndFill()!,
      bulletList.createAndFill()!,
      listItem.createAndFill()!,
      orderedList.createAndFill()!,
      listItem.createAndFill()!,
    ];

    const result = getListIndentLevel(pathForTwoLevelList);

    expect(result).toEqual(4);
  });
});
