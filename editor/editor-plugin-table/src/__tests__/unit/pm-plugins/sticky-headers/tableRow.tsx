import React from 'react';

import { render, screen } from '@testing-library/react';
import type { Stub } from 'raf-stub';
import createStub from 'raf-stub';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  tdEmpty,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../../plugins/table';
import TableComponent from '../../../../plugins/table/nodeviews/TableComponent';
import TableRow from '../../../../plugins/table/nodeviews/TableRow';
import { pluginKey } from '../../../../plugins/table/pm-plugins/plugin-key';
import { updateStickyState } from '../../../../plugins/table/pm-plugins/sticky-headers/commands';
import { TableCssClassName } from '../../../../plugins/table/types';
import type { PluginConfig } from '../../../../plugins/table/types';
import {
  stickyRowOffsetTop,
  tableScrollbarOffset,
} from '../../../../plugins/table/ui/consts';

jest.mock(
  '../../../../plugins/table/pm-plugins/sticky-headers/commands',
  () => ({
    ...jest.requireActual<Object>(
      '../../../../plugins/table/pm-plugins/sticky-headers/commands',
    ),
    updateStickyState: jest.fn(() => jest.fn()),
  }),
);
jest.mock('@atlaskit/editor-common/ui', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/ui'),
  findOverflowScrollParent: jest.fn(() => jest.fn()),
}));

describe('TableRow', () => {
  const tableOptions = {
    allowNumberColumn: true,
    allowHeaderRow: true,
    allowHeaderColumn: true,
    permittedLayouts: 'all',
    allowColumnResizing: true,
    stickyHeaders: true,
  } as PluginConfig;

  let tableRowNodeView: TableRow;
  const fakeGetEditorFeatureFlags = jest.fn(() => ({}));
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) => {
    const featureFlags = {};
    fakeGetEditorFeatureFlags.mockReturnValue(featureFlags);
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add([
          tablePlugin,
          {
            tableOptions,
          },
        ]),
      pluginKey,
      attachTo: document.body,
    });
  };
  let editorView: EditorView;
  let eventDispatcher: EventDispatcher;
  let tableRowNode: ProseMirrorNode;
  let tableRowDom: HTMLTableRowElement;

  const baseBoundingRect = {
    width: 100,
    height: 100,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  };

  describe('ignoreMutation', () => {
    beforeEach(() => {
      const editorData = editor(
        doc(table({ localId: '' })(tr(tdEmpty, tdEmpty))),
      );
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowNodeView = new TableRow(
        tableRowNode,
        editorView,
        () => 0,
        eventDispatcher,
      );
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('ignores attributes changes to row element', () => {
      const mutationRecord = {
        target: tableRowDom,
        type: 'attributes',
      } as any;
      expect(tableRowNodeView.ignoreMutation(mutationRecord as any)).toBe(true);
    });

    // These insertion mutations occur when using some language inputs in Safari
    // (ie. Pinyin, Hiragana)
    it('does not ignore insertion changes to row element', () => {
      const mutationRecord = {
        target: tableRowDom,
        type: 'childList',
        // The implementation is not opinionated about the type of the addedNodes.
        addedNodes: [''],
      } as any;
      expect(tableRowNodeView.ignoreMutation(mutationRecord as any)).toBe(
        false,
      );
    });

    it('does not ignore selection changes to row element', () => {
      const mutationRecord = {
        target: tableRowDom,
        type: 'selection',
      } as any;
      expect(tableRowNodeView.ignoreMutation(mutationRecord as any)).toBe(
        false,
      );
    });
  });

  describe('sticky headers', () => {
    let rafStub: Stub;
    let originalIntersectionObserver: object;
    let originalResizeObserver: object;
    let offsetHeightSpy: jest.SpyInstance;
    let scrollContainer: HTMLElement;

    let triggerElementResize = (
      element: HTMLElement,
      height: number,
      contentRectSupported: boolean,
    ) => {
      if (offsetHeightSpy) {
        offsetHeightSpy.mockClear();
      }
      offsetHeightSpy = jest
        .spyOn(element, 'offsetHeight', 'get')
        .mockImplementation(() => height);

      const entries = [
        {
          target: element,
          contentRect: contentRectSupported ? { height } : undefined,
        },
      ];
      resizeCallback(entries);
    };
    let triggerElementIntersect = ({
      target,
      isIntersecting,
      boundingClientRect,
      rootBounds,
    }: {
      target: HTMLElement;
      isIntersecting: boolean;
      rootBounds: {
        bottom: number;
        top: number;
        height?: number;
      };
      boundingClientRect: {
        bottom: number;
        top: number;
      };
    }) => {
      const entries = [
        {
          target,
          rootBounds,
          boundingClientRect,
          isIntersecting,
        },
      ];
      intersectCallback(entries);
    };
    let intersectCallback: (entries: any[]) => {};
    let resizeCallback: (entries: any[]) => {};

    beforeAll(() => {
      originalIntersectionObserver = (window as any).IntersectionObserver;
      (window as any).IntersectionObserver = function intersectionObserverMock(
        callback: () => {},
      ) {
        this.disconnect = jest.fn();
        this.observe = jest.fn();
        this.unobserve = jest.fn();
        intersectCallback = callback;
      };

      originalResizeObserver = (window as any).ResizeObserver;
      (window as any).ResizeObserver = function resizeObserverMock(
        callback: () => {},
      ) {
        this.disconnect = jest.fn();
        this.observe = jest.fn();
        this.unobserve = jest.fn();
        resizeCallback = callback;
      };
    });

    afterAll(() => {
      (window as any).IntersectionObserver = originalIntersectionObserver;
      (window as any).ResizeObserver = originalResizeObserver;
    });

    beforeEach(() => {
      rafStub = createStub();
      jest
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation(rafStub.add);

      const editorData = editor(
        doc(table()(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
      );
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];
      scrollContainer = mockScrollPositions(tableRowDom)!;

      tableRowNodeView = new TableRow(
        tableRowNode,
        editorView,
        () => 0,
        eventDispatcher,
      );
      tableRowNodeView.dom = tableRowDom;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    function getTableElements(tableRowDom: HTMLTableRowElement) {
      const tableWrapper = tableRowDom.closest(
        `.${TableCssClassName.NODEVIEW_WRAPPER}`,
      );
      const tableElement = tableRowDom.closest('table');
      const tableParent = tableElement?.parentElement;
      const scrollContainer = tableWrapper?.parentElement;
      return { tableWrapper, tableElement, tableParent, scrollContainer };
    }
    function mockScrollPositions(tableRowDom: HTMLTableRowElement) {
      const { tableWrapper, tableParent, scrollContainer } =
        getTableElements(tableRowDom);
      (findOverflowScrollParent as unknown as jest.SpyInstance).mockReturnValue(
        scrollContainer,
      );
      jest
        .spyOn(scrollContainer as HTMLElement, 'getBoundingClientRect')
        .mockImplementationOnce(() => ({
          ...baseBoundingRect,
          top: -50,
        }));
      jest
        .spyOn(tableParent as HTMLElement, 'getBoundingClientRect')
        .mockImplementationOnce(() => ({
          ...baseBoundingRect,
        }));
      jest
        .spyOn(tableWrapper as HTMLElement, 'getBoundingClientRect')
        .mockImplementationOnce(() => ({
          ...baseBoundingRect,
          top: -100,
        }));
      return scrollContainer;
    }

    function renderTableComponent({
      disableContentDomMock,
    }: {
      disableContentDomMock?: true;
    } = {}) {
      const getNode = () => editorView.state.doc.firstChild;
      return render(
        <TableComponent
          view={editorView}
          eventDispatcher={eventDispatcher}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          getNode={getNode}
          contentDOM={
            disableContentDomMock
              ? jest.fn()
              : (table: HTMLElement | null) => {
                  const node = editorView.dom.getElementsByTagName('table')[0];

                  if (!table?.firstChild) {
                    table?.appendChild(node);
                  }
                }
          }
          getPos={jest.fn()}
        />,
      );
    }

    it('does not update sticky headers on scroll', () => {
      const event = new Event('scroll');
      scrollContainer!.dispatchEvent(event);

      rafStub.flush();

      expect(updateStickyState).not.toHaveBeenCalled();
    });

    it('sentinel elements are rendered inside table component', () => {
      renderTableComponent();
      const sentinelTop = screen.getByTestId('sticky-sentinel-top');
      const sentinelBottom = screen.getByTestId('sticky-sentinel-bottom');

      expect(sentinelTop).toBeTruthy();
      expect(sentinelBottom).toBeTruthy();
    });

    describe('updates sticky header', () => {
      it('does not update sticky header if trigger is sentinel top in confluence preview mode', () => {
        renderTableComponent();
        const sentinelTop = screen.getByTestId('sticky-sentinel-top');

        triggerElementIntersect({
          target: sentinelTop as HTMLElement,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0, height: 0 },
          boundingClientRect: { bottom: 0, top: 0 },
        });

        expect(updateStickyState).not.toHaveBeenCalled();
      });

      it('does not update sticky header if trigger is sentinel bottom in confluence preview mode', () => {
        renderTableComponent();
        const sentinelBottom = screen.getByTestId('sticky-sentinel-bottom');
        triggerElementIntersect({
          target: sentinelBottom as HTMLElement,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0, height: 0 },
          boundingClientRect: { bottom: 0, top: 0 },
        });

        expect(updateStickyState).not.toHaveBeenCalled();
      });

      it('updates sticky header when sentinel is below scroll area', () => {
        renderTableComponent();
        const sentinelTop = screen.getByTestId('sticky-sentinel-top');

        triggerElementIntersect({
          target: sentinelTop,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 56 },
          boundingClientRect: { bottom: 0, top: 0 },
        });

        // sets to sticky when top sentinel is above scrolled container bottom
        expect(updateStickyState).toHaveBeenCalledWith(
          expect.objectContaining({
            sticky: true,
          }),
        );

        (updateStickyState as jest.Mock).mockClear();

        triggerElementIntersect({
          target: sentinelTop,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0 },
          boundingClientRect: { bottom: 100, top: 0 },
        });

        // sets to not sticky when top sentinel is below scrolled container bottom
        expect(updateStickyState).toHaveBeenCalledWith(
          expect.objectContaining({
            sticky: false,
          }),
        );
      });

      it('updates sticky header when sentinel is above scroll area', async () => {
        renderTableComponent();
        const sentinelBottom = screen.getByTestId('sticky-sentinel-bottom');

        triggerElementIntersect({
          target: sentinelBottom,
          isIntersecting: true,
          rootBounds: { bottom: 0, top: 56 },
          boundingClientRect: { bottom: 0, top: -100 },
        });

        // sets to sticky when bottom sentinel is within scroll area
        // and above scroll container top by more than header height
        expect(updateStickyState).toHaveBeenCalledWith(
          expect.objectContaining({
            sticky: true,
          }),
        );
        await new Promise((r) => setTimeout(r, 100));

        (updateStickyState as jest.Mock).mockClear();
        triggerElementIntersect({
          target: sentinelBottom,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0 },
          boundingClientRect: { bottom: 0, top: -100 },
        });

        // sets to not sticky when bottom sentinel is outside scroll area
        // and above scroll container top by more than header height
        expect(updateStickyState).toHaveBeenCalledWith(
          expect.objectContaining({
            sticky: false,
          }),
        );
      });
    });

    it.each([
      ['with contentRect supported', true],
      ['with contentRect not supported', false],
    ])(
      'updates sentinel position when header height changes %s',
      (_, contentRectSupported: boolean) => {
        const { tableWrapper } = getTableElements(tableRowDom);
        // disabled due to editorView dom being cleared by use of contentDom mocks
        renderTableComponent({
          disableContentDomMock: true,
        });
        const sentinelBottom = screen.getByTestId('sticky-sentinel-bottom');
        tableWrapper?.appendChild(sentinelBottom);
        rafStub.flush();

        expect(sentinelBottom.style.bottom).toBe('');

        const newHeight = 10;
        triggerElementResize(tableRowDom, newHeight, contentRectSupported);

        expect(sentinelBottom.style.bottom).toBe(
          `${newHeight + tableScrollbarOffset + stickyRowOffsetTop}px`,
        );
      },
    );

    it('marks sentinels as unobserved when isHeaderRowEnabled is set to false', () => {
      const { tableWrapper } = getTableElements(tableRowDom);
      // disabled due to editorView dom being cleared by use of contentDom mocks
      renderTableComponent({
        disableContentDomMock: true,
      });
      const sentinelBottom = screen.getByTestId('sticky-sentinel-bottom');
      tableWrapper?.appendChild(sentinelBottom);
      rafStub.flush();
      expect(sentinelBottom.dataset.isObserved).toBeDefined();
      eventDispatcher.emit((pluginKey as any).key, {
        isHeaderRowEnabled: false,
      });
      expect(sentinelBottom.dataset.isObserved).toBeUndefined();
    });
  });

  describe('makeRowHeaderNotSticky', () => {
    let makeRowHeaderNotStickySpy: jest.SpyInstance;
    let tableRef: HTMLElement;
    beforeEach(() => {
      const editorData = editor(
        doc(table()(tr(thEmpty, thEmpty), tr(tdEmpty, tdEmpty))),
      );
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];

      tableRowNodeView = new TableRow(
        tableRowNode,
        editorView,
        () => 0,
        eventDispatcher,
      );
      tableRowNodeView.dom = tableRowDom;

      makeRowHeaderNotStickySpy = jest.spyOn(
        tableRowNodeView as any,
        'makeRowHeaderNotSticky',
      );
      tableRef = document.querySelector(
        '.ProseMirror table',
      ) as HTMLTableElement;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should not be called if table is not selected', () => {
      eventDispatcher.emit((pluginKey as any).key, {
        isHeaderRowEnabled: false,
        tableRef: null,
      });
      expect(makeRowHeaderNotStickySpy).not.toHaveBeenCalled();
    });

    it('should not be called if header row is enabled', () => {
      eventDispatcher.emit((pluginKey as any).key, {
        isHeaderRowEnabled: true,
        tableRef,
      });
      expect(makeRowHeaderNotStickySpy).not.toHaveBeenCalled();
    });

    it('should be called if header row is disabled and table is selected', () => {
      eventDispatcher.emit((pluginKey as any).key, {
        isHeaderRowEnabled: false,
        tableRef,
      });
      expect(makeRowHeaderNotStickySpy).toHaveBeenCalled();
    });
  });
});
