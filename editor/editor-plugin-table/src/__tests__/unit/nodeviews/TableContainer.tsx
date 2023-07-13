import React from 'react';
import { render } from '@testing-library/react';

import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import {
  doc,
  p,
  table,
  tr,
  td,
  tdEmpty,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { findTable } from '@atlaskit/editor-tables/utils';

import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import {
  ResizableTableContainer,
  TableContainer,
} from '../../../plugins/table/nodeviews/TableContainer';
import { TablePluginState } from '../../../plugins/table/types';
import tablePlugin from '../../../plugins/table-plugin';
import { TableAttributes } from '@atlaskit/adf-schema';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';

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
    const buildContainer = (allowResizing: boolean) => {
      const node = createNode();

      const { container } = render(
        <TableContainer
          containerWidth={{
            width: 1800,
            lineLength: 720,
          }}
          node={node}
          isFullWidthModeEnabled={allowResizing}
          isBreakoutEnabled={allowResizing}
          className={''}
          editorView={{} as any}
          getPos={() => 1}
          tableRef={{} as any}
          isNested={false}
        />,
      );

      return container;
    };

    const buildTest = (
      allowResizing: boolean,
      expected?: { ffTrue?: boolean; ffFalse?: boolean },
    ) => {
      ffTest(
        'platform.editor.custom-table-width',
        async () => {
          const container = buildContainer(allowResizing);

          expect(!!container.querySelector('.resizer-item')).toBe(
            expected?.ffTrue ?? true,
          );
        },
        async () => {
          const container = buildContainer(allowResizing);

          expect(!!container.querySelector('.resizer-item')).toBe(
            expected?.ffFalse ?? false,
          );
        },
      );
    };

    describe('when allowResizing is true', () => {
      buildTest(true);
    });

    describe('when allowResizing is false', () => {
      buildTest(false, {
        ffTrue: false,
      });
    });
  });

  describe('show correct continaer for nested tables', () => {
    const buildContainer = (allowResizing: boolean) => {
      const node = createNode();

      const { container } = render(
        <TableContainer
          containerWidth={{
            width: 1800,
            lineLength: 720,
          }}
          node={node}
          isFullWidthModeEnabled={allowResizing}
          isBreakoutEnabled={allowResizing}
          className={''}
          editorView={{} as any}
          getPos={() => 1}
          tableRef={{} as any}
          isNested={true}
        />,
      );

      return container;
    };

    const buildTest = (
      allowResizing: boolean,
      expected?: { ffTrue?: boolean; ffFalse?: boolean },
    ) => {
      ffTest(
        'platform.editor.custom-table-width',
        async () => {
          const container = buildContainer(allowResizing);

          expect(!!container.querySelector('.resizer-item')).toBe(
            expected?.ffTrue ?? true,
          );
        },
        async () => {
          const container = buildContainer(allowResizing);

          expect(!!container.querySelector('.resizer-item')).toBe(
            expected?.ffFalse ?? false,
          );
        },
      );
    };

    describe('when allowResizing is true', () => {
      buildTest(true, { ffTrue: false, ffFalse: false });
    });

    describe('when allowResizing is false', () => {
      buildTest(false, {
        ffTrue: false,
        ffFalse: false,
      });
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

    describe('when width attribute is not set', () => {
      ffTest('platform.editor.custom-table-width', () => {
        const container = buildContainer({ layout: 'wide' });

        const style = window.getComputedStyle(container.firstChild as Element);
        expect(style.width).toBe(`${akEditorWideLayoutWidth}px`);
        expect(style.marginLeft).toBe('-120px');
      });
    });

    describe('when width attribute is set', () => {
      ffTest(
        'platform.editor.custom-table-width',
        () => {
          const container = buildContainer({ width: 860 });

          const style = window.getComputedStyle(
            container.firstChild as Element,
          );
          expect(style.width).toBe(`860px`);
          expect(style.marginLeft).toBe('-70px');
        }, // fallback to layout because width can't be an attribute in schema
        () => {
          const container = buildContainer({ width: 860 });

          const style = window.getComputedStyle(
            container.firstChild as Element,
          );
          expect(style.width).toBe(`760px`);
          expect(style.marginLeft).toBe('-20px');
        },
      );
    });
  });
});
