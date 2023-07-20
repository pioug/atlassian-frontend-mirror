import React from 'react';

import { render } from '@testing-library/react';

import { TableAttributes } from '@atlaskit/adf-schema';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';
import { findTable } from '@atlaskit/editor-tables/utils';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  DocBuilder,
  p,
  table,
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import {
  ResizableTableContainer,
  TableContainer,
} from '../../../plugins/table/nodeviews/TableContainer';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { TablePluginState } from '../../../plugins/table/types';

describe('table -> nodeviews -> TableContainer.tsx', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  const editor = (
    doc: DocBuilder,
    featureFlags?: { [featureFlag: string]: string | boolean },
  ) => {
    return createEditor({
      doc,
      editorProps: {
        allowTables: false,
        dangerouslyAppendPlugins: {
          __plugins: [tablePlugin()],
        },
        featureFlags,
      },
      pluginKey,
    });
  };
  const createNode = (attrs?: TableAttributes) => {
    const { editorView: view } = editor(
      doc(p('text'), table(attrs)(tr(td()(p('{<>}text')), tdEmpty, tdEmpty))),
    );
    const resolvedTable = findTable(view.state.selection);

    return resolvedTable!.node;
  };

  describe('show correct container for FF and options', () => {
    const buildContainer = (
      isTableResizingEnabled: boolean,
      isBreakoutEnabled: boolean = true,
    ) => {
      const node = createNode();

      const { container } = render(
        <TableContainer
          containerWidth={{
            width: 1800,
            lineLength: 720,
          }}
          node={node}
          isTableResizingEnabled={isTableResizingEnabled}
          isBreakoutEnabled={isBreakoutEnabled}
          className={''}
          editorView={{} as any}
          getPos={() => 1}
          tableRef={{} as any}
          isNested={false}
        />,
      );

      return container;
    };

    test('when isTableResizingEnabled is true', () => {
      const container = buildContainer(true);
      expect(!!container.querySelector('.resizer-item')).toBeTruthy();
    });

    test('when isTableResizingEnabled is false', () => {
      const container = buildContainer(false);
      expect(!!container.querySelector('.resizer-item')).toBeFalsy();
    });
  });

  describe('when table is nested', () => {
    const buildContainer = (
      isTableResizingEnabled: boolean,
      isBreakoutEnabled: boolean = true,
    ) => {
      const node = createNode();

      const { container } = render(
        <TableContainer
          containerWidth={{
            width: 1800,
            lineLength: 720,
          }}
          node={node}
          isTableResizingEnabled={isTableResizingEnabled}
          isBreakoutEnabled={isBreakoutEnabled}
          className={''}
          editorView={{} as any}
          getPos={() => 1}
          tableRef={{} as any}
          isNested={true}
        />,
      );

      return container;
    };

    test('when isTableResizingEnabled is true - should not render resizer', () => {
      const container = buildContainer(true);
      expect(!!container.querySelector('.resizer-item')).toBeFalsy();
    });

    test('when isTableResizingEnabled is false - should not render resizer', () => {
      const container = buildContainer(false);
      expect(!!container.querySelector('.resizer-item')).toBeFalsy();
    });
  });

  describe('sets width and margin correctly for resizable container', () => {
    const buildContainer = (attrs: TableAttributes) => {
      const node = createNode(attrs);

      const { container } = render(
        <ResizableTableContainer
          containerWidth={1800}
          lineLength={720}
          node={node}
          className={''}
          editorView={{} as any}
          getPos={() => 1}
          tableRef={{} as any}
        />,
      );

      return container;
    };

    test('when width attribute is not set', () => {
      const container = buildContainer({ layout: 'wide' });

      const style = window.getComputedStyle(container.firstChild as Element);
      expect(style.width).toBe(`${akEditorWideLayoutWidth}px`);
      expect(style.marginLeft).toBe('-120px');
    });
  });
});
