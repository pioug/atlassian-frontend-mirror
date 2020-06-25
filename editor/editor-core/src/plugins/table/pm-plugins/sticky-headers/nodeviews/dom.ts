export type TableDOMElements = {
  wrapper: HTMLDivElement;
  table: HTMLTableElement;
};

export const getTree = (tr: HTMLTableRowElement): TableDOMElements | null => {
  // pm renders into tbody, owned by react
  const tbody = tr.parentElement;
  if (!tbody) {
    return null;
  }

  // rendered by react
  const table = tbody.parentElement;
  if (!table) {
    return null;
  }

  // rendered by react
  const wrapper = table.parentElement;
  if (!wrapper) {
    return null;
  }

  return {
    wrapper: wrapper as HTMLDivElement,
    table: table as HTMLTableElement,
  };
};

export const getTop = (element: HTMLElement | Window | undefined): number => {
  if (!element || element instanceof Window) {
    return 0;
  }

  return element.getBoundingClientRect().top;
};
