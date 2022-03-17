import React from 'react';
import { TableLayout } from '@atlaskit/adf-schema';
import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';
import Table from '../../../../react/nodes/table';
import { TableHeader } from '../../../../react/nodes/tableCell';
import TableRow from '../../../../react/nodes/tableRow';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { table, tr, th, p } from '@atlaskit/adf-utils';
import { defaultSchema as schema } from '@atlaskit/adf-schema';
import Heading, { HeadingLevels } from '../../../../react/nodes/heading';
import ReactSerializer from '../../../../react';

const renderWidth = akEditorDefaultLayoutWidth;
let serialiser = new ReactSerializer({});
const tableDoc = {
  ...table(
    tr([
      th()(p('Heading content 1')),
      th()(p('Header content 2')),
      th()(p('Header content 3')),
    ]),
  ),
};
const tableFromSchema = schema.nodeFromJSON(tableDoc);
const headingProps = {
  level: 1 as HeadingLevels,
  headingId: 'This-is-a-Heading-1',
  dataAttributes: {
    'data-renderer-start-pos': 0,
  },
  nodeType: 'heading',
  marks: [],
  serializer: serialiser,
};
const tableProps = {
  layout: 'default' as TableLayout,
  renderWidth,
  tableNode: tableFromSchema,
  isNumberColumnEnabled: true,
};

describe('Renderer - React/Nodes/Sticky', () => {
  it('should not have invisible prop in visible table when sticky headers exist', () => {
    const wrap = mountWithIntl(
      <Table
        {...tableProps}
        stickyHeaders={{
          offsetTop: 30,
        }}
      >
        <TableRow>
          <TableHeader />
          <TableHeader />
          <TableHeader />
        </TableRow>
      </Table>,
    );
    expect(wrap.find('table')).toHaveLength(2);
    const visibleRow = wrap.find(TableRow).last();
    expect(visibleRow.prop('invisible')).toBeUndefined();
  });
  it('should have invisible prop in invisible structure of sticky table', () => {
    const wrap = mountWithIntl(
      <Table
        {...tableProps}
        stickyHeaders={{
          offsetTop: 30,
        }}
      >
        <TableRow>
          <TableHeader />
          <TableHeader />
          <TableHeader />
        </TableRow>
      </Table>,
    );
    const invisibleRow = wrap.find(TableRow).first();
    expect(invisibleRow.prop('invisible')).toEqual(true);
  });
  it('should remove heading id from invisible structure', () => {
    const headingDocInVisible = mountWithIntl(
      <Heading {...headingProps} invisible={true}>
        This is a Heading 1
      </Heading>,
    );
    expect(headingDocInVisible.find('h1').exists()).toBe(true);
    expect(headingDocInVisible.find('h1').prop('id')).toBeUndefined();
  });
  it('should keep heading id in visible structure', () => {
    const headingDocInVisible = mountWithIntl(
      <Heading {...headingProps}>This is a Heading 1</Heading>,
    );
    expect(headingDocInVisible.find('h1').exists()).toBe(true);
    expect(headingDocInVisible.find('h1').prop('id')).toEqual(
      'This-is-a-Heading-1',
    );
  });
});
