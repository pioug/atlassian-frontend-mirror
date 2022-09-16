import { colWidthsForRow } from '../../../utils/column-controls';

const createRow = (colCount: number, childType = 'td') => {
  const tr = document.createElement('tr');
  for (let i = 0; i < colCount; i++) {
    const child = document.createElement(childType);
    child.innerText = `Cell ${i}`;
    tr.appendChild(child);
  }

  return tr;
};

describe('table utilities', () => {
  let table: HTMLTableElement;
  let tbody: HTMLElement;
  let colgroup: HTMLTableColElement;

  beforeEach(() => {
    table = document.createElement('table');

    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    colgroup = document.createElement('colgroup');
    table.appendChild(colgroup);
  });

  afterEach(() => {
    table.remove();
  });

  describe('pctWidthsForRow', () => {
    it('returns nothing for an empty table and empty row', () => {
      expect(colWidthsForRow(colgroup, createRow(0))).toEqual('');
    });

    describe('unresized table/no colgroup', () => {
      it('returns 100% for single cell', () => {
        expect(colWidthsForRow(colgroup, createRow(1))).toEqual('100%');
      });

      it('returns split 50% for two cells', () => {
        expect(colWidthsForRow(colgroup, createRow(2))).toEqual('50% 50%');
      });

      it('works for merged cells', () => {
        const rowWithColspan = createRow(2);

        // first column should spans 3
        rowWithColspan.children[0].setAttribute('colspan', '3');

        // last row should still span 1 row
        // giving 4 visual rows, and only 2 in DOM

        // colgroup is still empty
        expect(colWidthsForRow(colgroup, rowWithColspan)).toEqual('75% 25%');
      });
    });
  });
});
