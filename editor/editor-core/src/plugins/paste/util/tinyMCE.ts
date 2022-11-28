import chunk from 'lodash/chunk';

const isPastedFromTinyMCE = (pasteEvent: ClipboardEvent): boolean => {
  return (
    pasteEvent?.clipboardData?.types?.some(
      (mimeType) => mimeType === 'x-tinymce/html',
    ) ?? false
  );
};

export const isPastedFromTinyMCEConfluence = (
  pasteEvent: ClipboardEvent,
  html: string,
): boolean => {
  return (
    isPastedFromTinyMCE(pasteEvent) &&
    !!html &&
    !!html.match(/class=\"\s?(confluenceTd|confluenceTh|confluenceTable).+"/gim)
  );
};

/**
 * Wraps html markup with a `<table>` and uses `DOMParser` to generate
 * and return both the table-wrapped and non-table-wrapped DOM document
 * instances.
 */
export const wrapWithTable = (
  html: string,
): { tableWrappedDoc: Document; nonTableWrappedDoc: Document } => {
  const parser = new DOMParser();
  const nonTableWrappedDoc = parser.parseFromString(html, 'text/html');
  const tableWrappedDoc = parser.parseFromString(
    `<table>${html}</table>`,
    'text/html',
  );
  tableWrappedDoc.body.querySelectorAll('meta').forEach((meta) => {
    tableWrappedDoc.head.prepend(meta);
  });
  return { tableWrappedDoc, nonTableWrappedDoc };
};

const exactlyDivisible = (larger: number, smaller: number): boolean =>
  larger % smaller === 0;

const getTableElementsInfo = (doc: Document) => {
  const cellCount = doc.querySelectorAll('td').length;
  const thCount = doc.querySelectorAll('th').length;
  const mergedCellCount = doc.querySelectorAll(
    'td[colspan]:not([colspan="1"])',
  ).length;
  let hasThAfterTd = false;
  const thsAndCells = doc.querySelectorAll('th,td');
  for (let i = 0, cellFound = false; i < thsAndCells.length; i++) {
    if (cellFound && thsAndCells[i].nodeName === 'TH') {
      hasThAfterTd = true;
      break;
    }
    if (thsAndCells[i].nodeName === 'TD') {
      cellFound = true;
    }
  }

  const onlyTh = thCount > 0 && cellCount === 0;
  const onlyCells = cellCount > 0 && thCount === 0;

  const hasCompleteRow =
    // we take header-only and cell-only tables to be
    // row-complete
    onlyTh ||
    onlyCells ||
    // if headers and cells can "fit" against each other,
    // then we assume a complete row exists
    ((exactlyDivisible(thCount, cellCount) ||
      exactlyDivisible(cellCount, thCount)) &&
      // all numbers are divisible by 1, so we carve out a specific
      // check for when there is only 1 table cell, and more than 1
      // table header.
      !(thCount > 1 && cellCount === 1));

  return {
    cellCount,
    thCount,
    mergedCellCount,
    hasThAfterTd,
    hasIncompleteRow: !hasCompleteRow,
  };
};

const configureTableRows = (doc: Document, colsInRow: number): string => {
  const tableHeadersAndCells = Array.from(doc.body.querySelectorAll('th,td'));
  const evenlySplitChunks = chunk(tableHeadersAndCells, colsInRow);
  const tableBody = doc.body.querySelector('tbody') as HTMLTableSectionElement;
  evenlySplitChunks.forEach((chunk) => {
    const tr = doc.createElement('tr');
    tableBody?.append(tr);
    tr.append(...chunk);
  });
  // We remove any leftover empty rows which may cause fabric editor
  // to no-op when parsing the table
  const emptyRows = Array.from(tableBody.querySelectorAll('tr'))?.filter(
    (row) => row.innerHTML.trim().length === 0,
  );
  emptyRows.forEach((row) => row.remove());

  return doc.body.innerHTML;
};

const fillIncompleteRowWithEmptyCells = (
  doc: Document,
  thCount: number,
  cellCount: number,
): { updatedCellCount: number } => {
  let extraCellsCount = 0;
  while (!exactlyDivisible(cellCount + extraCellsCount, thCount)) {
    extraCellsCount++;
  }
  const extraEmptyCells = Array.from<HTMLTableCellElement>(
    Array(extraCellsCount),
  ).map(() => doc.createElement('td'));
  const lastCell = doc.body.querySelector('td:last-of-type');
  lastCell?.parentElement?.append(...extraEmptyCells);
  return { updatedCellCount: cellCount + extraCellsCount };
};

/**
 * Given a DOM document, it will try to rebuild table rows by using the
 * table headers count as an initial starting point for the assumed
 * number of columns that make up a row (`colsInRow`). It will slowly
 * decrease that `colsInRow` count until it finds exact fit for table
 * headers and cells with `colsInRow` else it returns the original
 * document's markup.
 *
 * NOTE: It will NOT try to rebuild table rows if it encounters merged cells
 * or compex table configurations (where table headers exist after normal
 * table cells). It will build a single column table if NO table
 * headers exist.
 */
export const tryReconstructTableRows = (doc: Document): string => {
  let { cellCount, thCount, mergedCellCount, hasThAfterTd, hasIncompleteRow } =
    getTableElementsInfo(doc);

  if (mergedCellCount || hasThAfterTd) {
    // bail out to avoid handling more complex table structures
    return doc.body.innerHTML;
  }

  if (!thCount) {
    // if no table headers exist for reference, fallback to a single column table structure
    return configureTableRows(doc, 1);
  }

  if (hasIncompleteRow) {
    // if shift-click selection copies a partial table row to the clipboard,
    // and we do have table headers for reference, then we add empty table cells
    // to fill out the partial row
    const { updatedCellCount } = fillIncompleteRowWithEmptyCells(
      doc,
      thCount,
      cellCount,
    );
    cellCount = updatedCellCount;
  }

  for (
    let possibleColsInRow = thCount;
    possibleColsInRow > 0;
    possibleColsInRow--
  ) {
    if (
      exactlyDivisible(thCount, possibleColsInRow) &&
      exactlyDivisible(cellCount, possibleColsInRow)
    ) {
      return configureTableRows(doc, possibleColsInRow);
    }
  }

  return doc.body.innerHTML;
};

export const htmlHasIncompleteTable = (html: string) => {
  return (
    !html.includes('<table ') &&
    (html.includes('<td ') || html.includes('<th '))
  );
};

/**
 * Strictly for ED-7331. Given incomplete table html from tinyMCE, it will try to rebuild
 * a whole valid table. If it rebuilds the table, it may first rebuild it as a single
 * row table, so this also then tries to reconstruct the table rows/columns if
 * possible (best effort).
 */
export const tryRebuildCompleteTableHtml = (
  incompleteTableHtml: string,
): string | null => {
  // first we try wrapping the table elements with <table> and let DOMParser try to rebuild
  // a valid DOM tree. we also keep the non-wrapped table for comparison purposes.
  const { nonTableWrappedDoc, tableWrappedDoc } =
    wrapWithTable(incompleteTableHtml);

  const didPreserveTableElements = Boolean(
    !nonTableWrappedDoc.body.querySelector('th, td') &&
      tableWrappedDoc.body.querySelector('th, td'),
  );

  const isExpectedStructure =
    tableWrappedDoc.querySelectorAll('body > table:only-child') &&
    !tableWrappedDoc.querySelector(`body > table > tbody > tr > :not(th,td)`);

  // if DOMParser saves table elements that we would otherwise lose, and
  // if the table html is what we'd expect (a single table, with no extraneous
  // elements in table rows other than th, td), then we can now also try to
  // rebuild table rows/columns.
  if (didPreserveTableElements && isExpectedStructure) {
    const completeTableHtml = tryReconstructTableRows(tableWrappedDoc);
    return completeTableHtml;
  }
  return null;
};
