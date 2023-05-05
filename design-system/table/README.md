# Table

**WARNING!**

This is an experimental package for exploration and validation of the foundations for the Atlassian Design System.

## Description

A table is used to display and organise complex data.

## Usage

`import Table from '@atlaskit/table';`

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/design-system/table).

### Render Prop

```tsx
import '@atlaskit/css-reset';
import Table, { Row, Cell, TBody, THead, HeadCell } from '@atlaskit/table';

import { presidents } from './data';

type President = (typeof presidents)[number];

/**
 * Primary UI component for user interaction
 */
export const RenderProp = ({ isSelectable }) => {
  return (
    <Table isSelectable={isSelectable}>
      <THead>
        <HeadCell>Name</HeadCell>
        <HeadCell>Party</HeadCell>
        <HeadCell>Year</HeadCell>
      </THead>
      <TBody<President> rows={presidents}>
        {row => (
          <Row key={row.id} {...row}>
            <Cell>{row.nm}</Cell>
            <Cell>{row.pp}</Cell>
            <Cell>{row.tm}</Cell>
          </Row>
        )}
      </TBody>
    </Table>
  );
};
```

### Composition

```tsx
import '@atlaskit/css-reset';
import Table, { Row, Cell, TBody, THead, HeadCell } from '@atlaskit/table';

import { presidents } from './data';

/**
 * Primary UI component for user interaction
 */
export const CompositionExample = ({ isSelectable }) => {
  return (
    <Table isSelectable={isSelectable}>
      <THead>
        <HeadCell>Name</HeadCell>
        <HeadCell>Party</HeadCell>
        <HeadCell>Year</HeadCell>
      </THead>
      <TBody>
        {presidents.map(row => (
          <Row key={row.id}>
            <Cell>{row.nm}</Cell>
            <Cell>{row.pp}</Cell>
            <Cell>{row.tm}</Cell>
          </Row>
        ))}
      </TBody>
    </Table>
  );
};
```
