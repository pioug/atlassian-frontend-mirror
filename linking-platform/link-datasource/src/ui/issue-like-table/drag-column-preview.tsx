/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { token } from '@atlaskit/tokens';

import { TableHeading } from './styled';

const maxWidth = '200px';
const firstLastChildOverride = `
  &:first-of-type, &:last-of-type {
    padding-left: ${token('space.100', '8px')};
    padding-right: ${token('space.100', '8px')};
  }
`;
const TablePreviewHeading = styled(TableHeading)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: ${token('color.background.disabled', '#091E4224')};
  color: ${token('color.text.disabled', '#091E424F')};
  max-width: ${maxWidth};
  ${firstLastChildOverride}
`;

const TablePreviewCell = styled.td`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${maxWidth};
  padding: ${token('space.050', '4px')} ${token('space.100', '8px')};
  ${firstLastChildOverride}
`;

const tableStyles = css({
  background: token('elevation.surface', '#FFF'),
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontSize: token('font.size.200', '16px'),
  maxWidth,
});

export const DragColumnPreview = ({
  title,
  rows,
}: {
  title: React.ReactNode;
  rows: React.ReactNode[];
}) => {
  return (
    <table css={tableStyles}>
      <thead>
        <tr>
          <TablePreviewHeading>{title}</TablePreviewHeading>
        </tr>
      </thead>
      <tbody>
        {rows.map((data, i) => (
          <tr key={i}>
            <TablePreviewCell>{data}</TablePreviewCell>
          </tr>
        ))}
        <tr>
          <TablePreviewCell>...</TablePreviewCell>
        </tr>
      </tbody>
    </table>
  );
};
