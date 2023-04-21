/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

const staticData = [
  {
    title: 'Chapter One: Introduction',
    description: 'Description One',
  },
  {
    title:
      "Chapter Two: With a Very Very Long Title That Should Be Cut Off Because We Don't Want It To Span Multiple Lines",
    description: 'Description Two. This column can span multiple lines.',
  },
];

const overflowingBoxStyles = css({
  width: '150px',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  marginBottom: '-15px',
  position: 'absolute',
  right: token('space.0', '0px'),
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage-spacing
  bottom: '100%',
  background: token('color.background.danger.bold', 'red'),
  border: `5px solid ${token('color.border', '#800')}`,
  color: token('color.text.inverse', '#000'),
});

export default () => (
  <TableTree>
    <Headers>
      <Header width={300}>Title</Header>
      <Header width={200}>Description</Header>
    </Headers>
    <Rows
      items={staticData}
      render={({ title, description }) => (
        <Row itemId={title} hasChildren={false}>
          <Cell singleLine>{title}</Cell>
          <Cell>
            {description} <div css={overflowingBoxStyles}>Overflowing box</div>
          </Cell>
        </Row>
      )}
    />
  </TableTree>
);
