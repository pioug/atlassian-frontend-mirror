import { Style, Attrs } from './interfaces';
import { serializeStyle } from './serialize-style';
import { createTag } from './create-tag';
import { createClassName } from './styles/util';
import { fontFamily, fontSize, fontWeight } from './styles/common';

export type TableData = {
  text?: string | null;
  style?: Style;
  attrs?: Attrs;
};

const className = createClassName('commonTable');

export const styles = `
.${className} {
  font-family: ${fontFamily};
  font-size: ${fontSize};
  font-weight: ${fontWeight};
  margin: 0px;
  padding: 0px;
  display: table;
  border-spacing: 0px;
  width: 100%;
}
`;

export const createTableAttrs = (
  tableAttrs: Attrs = {},
  tableStyle: Style = {},
) => ({
  cellspacing: 0,
  cellpadding: 0,
  border: 0,
  style: serializeStyle(tableStyle),
  ...tableAttrs,
  class: `${tableAttrs.class || ''} ${className}`,
});

export const tableDataMapper = ({ style, text, attrs }: TableData) => {
  const css = style ? serializeStyle(style) : '';
  return createTag('td', { style: css, ...attrs }, text ? text : '');
};

export const tableRowMapper = (tableRow: TableData[]) => {
  const tableColumns = tableRow.map(tableDataMapper);
  return createTag('tr', {}, tableColumns.join(''));
};

export const createTable = (
  tableData: TableData[][],
  tableStyle: Style = {},
  tableAttrs: Attrs = {},
): string => {
  const attrs = { ...createTableAttrs(tableAttrs, tableStyle) };
  const tableRows = tableData.map(tableRowMapper).join('');
  return createTag('table', attrs, tableRows);
};
