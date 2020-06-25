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

  describe('resized table/with colgroup', () => {
    let row: HTMLTableRowElement;

    // create a table that has 3 columns: 100px 200px 300px
    beforeEach(() => {
      row = createRow(3);

      for (let colWidth of [100, 200, 300]) {
        const col = document.createElement('col');
        col.style.width = `${colWidth}px`;
        colgroup.appendChild(col);
      }
    });

    afterEach(() => {
      row.remove();
    });

    it('works for unmerged cells', () => {
      expect(colWidthsForRow(colgroup, row)).toEqual('100px 200px 300px');
    });

    it('works for merged cells', () => {
      // merge columns 1 and 2
      // to give 300px 300px
      row.children[0].setAttribute('colspan', '2');
      row.children[1].remove();

      expect(row.childElementCount).toEqual(2);
      expect(colWidthsForRow(colgroup, row)).toEqual('300px 300px');
    });

    it('works if the whole row is a single merged cell', () => {
      // merge all the columns
      row.children[0].setAttribute('colspan', '3');
      row.children[1].remove();
      row.children[1].remove();

      expect(row.childElementCount).toEqual(1);
      expect(colWidthsForRow(colgroup, row)).toEqual('600px');
    });
  });
});
