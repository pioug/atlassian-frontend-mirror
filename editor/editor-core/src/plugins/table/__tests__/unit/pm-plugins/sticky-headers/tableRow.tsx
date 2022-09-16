import { EditorView } from 'prosemirror-view';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  table,
  tdEmpty,
  thEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { TableRowNodeView } from '../../../../pm-plugins/sticky-headers';
import tablePlugin from '../../../../../table';
import { pluginKey } from '../../../../pm-plugins/plugin-key';
import { EventDispatcher } from '../../../../../../test-utils';
import createStub, { Stub } from 'raf-stub';
import featureFlagsPlugin from '../../../../../feature-flags-context';
jest.mock('../../../../pm-plugins/sticky-headers/commands', () => ({
  ...jest.requireActual<Object>(
    '../../../../pm-plugins/sticky-headers/commands',
  ),
  updateStickyState: jest.fn(() => jest.fn()),
}));
jest.mock('@atlaskit/editor-common/ui', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common/ui'),
  findOverflowScrollParent: jest.fn(() => jest.fn()),
}));

import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { updateStickyState } from '../../../../pm-plugins/sticky-headers/commands';
import { TableCssClassName } from '../../../../types';
import { mount } from 'enzyme';
import TableComponent from '../../../../nodeviews/TableComponent';
import React from 'react';
import {
  stickyRowOffsetTop,
  tableScrollbarOffset,
} from '../../../../ui/consts';

describe('TableRowNodeView', () => {
  let tableRowNodeView: TableRowNodeView;
  const fakeGetEditorFeatureFlags = jest.fn(() => ({}));
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder, stickyHeadersOptimization?: boolean) => {
    const featureFlags = { stickyHeadersOptimization };
    fakeGetEditorFeatureFlags.mockReturnValue(featureFlags);
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([tablePlugin])
        .add([featureFlagsPlugin, featureFlags]),
      pluginKey,
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

  describe('stickyHeader', () => {
    beforeEach(() => {
      const editorWithTableSticky = (doc: DocBuilder) =>
        createEditor({
          doc,
          preset: new Preset<LightEditorPlugin>().add([tablePlugin]),
          pluginKey,
        });
      const editorData = editorWithTableSticky(
        doc(table({ localId: '' })(tr(tdEmpty, tdEmpty))),
      );
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];
      tableRowNodeView = new TableRowNodeView(
        tableRowNode,
        editorView,
        jest.fn(),
        eventDispatcher,
        fakeGetEditorFeatureFlags,
      );
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    function createBoundingClientRect(rect: any) {
      return {
        getBoundingClientRect: () => {
          return rect;
        },
      };
    }

    function setupMocks(
      tableRowNodeView: any,
      editorRect: any,
      tableRect: any,
    ) {
      jest.spyOn(tableRowNodeView as any, 'tree', 'get').mockReturnValue({
        wrapper: createBoundingClientRect(tableRect),
      });

      Object.defineProperty(tableRowNodeView, 'editorScrollableElement', {
        get() {
          return createBoundingClientRect(editorRect);
        },
      });
      Object.defineProperty(tableRowNodeView, 'dom', {
        get() {
          return {
            previousElementSibling: false,
            nextElementSibling: true,
            clientHeight: 20,
          };
        },
      });

      Object.defineProperty(tableRowNodeView, 'topPosEditorElement', {
        get() {
          return 50;
        },
      });
    }

    it('should make it sticky if table is taller than viewport', () => {
      const tableRect = { top: 10, bottom: 110, height: 100 };
      const editorRect = { top: 50, bottom: 100, height: 50 };
      setupMocks(tableRowNodeView, editorRect, tableRect);
      const res = tableRowNodeView.shouldHeaderStick(
        tableRowNodeView.tree as any,
      );
      expect(res).toBe(true);
    });

    it('should make it sticky if table is lower than the editor', () => {
      const tableRect = { top: 20, bottom: 120, height: 100 };
      const editorRect = { top: 50, bottom: 100, height: 50 };
      setupMocks(tableRowNodeView, editorRect, tableRect);
      const res = tableRowNodeView.shouldHeaderStick(
        tableRowNodeView.tree as any,
      );
      expect(res).toBe(true);
    });

    it('should make it non-sticky if table is higher than the editor', () => {
      const tableRect = { top: 60, bottom: 70, height: 50 };
      const editorRect = { top: 50, bottom: 150, height: 100 };
      setupMocks(tableRowNodeView, editorRect, tableRect);

      const res = tableRowNodeView.shouldHeaderStick(
        tableRowNodeView.tree as any,
      );
      expect(res).toBe(false);
    });

    it('should make it non-sticky if table out of viewport', () => {
      const tableRect = { top: -50, bottom: 20, height: 70 };
      const editorRect = { top: 50, bottom: 150, height: 100 };
      setupMocks(tableRowNodeView, editorRect, tableRect);

      const res = tableRowNodeView.shouldHeaderStick(
        tableRowNodeView.tree as any,
      );
      expect(res).toBe(false);
    });
  });

  describe('ignoreMutation', () => {
    beforeEach(() => {
      const editorData = editor(
        doc(table({ localId: '' })(tr(tdEmpty, tdEmpty))),
      );
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowNodeView = new TableRowNodeView(
        tableRowNode,
        editorView,
        jest.fn(),
        eventDispatcher,
        fakeGetEditorFeatureFlags,
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

  describe('with stickyHeadersOptimization', () => {
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
        intersectCallback = callback;
      };

      originalResizeObserver = (window as any).ResizeObserver;
      (window as any).ResizeObserver = function resizeObserverMock(
        callback: () => {},
      ) {
        this.disconnect = jest.fn();
        this.observe = jest.fn();
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
        true, // toggle to enable optimization
      );
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];
      scrollContainer = mockScrollPositions(tableRowDom)!;

      tableRowNodeView = new TableRowNodeView(
        tableRowNode,
        editorView,
        jest.fn(),
        eventDispatcher,
        fakeGetEditorFeatureFlags,
      );
      tableRowNodeView.dom = tableRowDom;
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
      const { tableWrapper, tableParent, scrollContainer } = getTableElements(
        tableRowDom,
      );
      ((findOverflowScrollParent as unknown) as jest.SpyInstance).mockReturnValue(
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

    function mountTableComponent({
      disableContentDomMock,
    }: {
      disableContentDomMock?: true;
    } = {}) {
      const getNode = () => editorView.state.doc.firstChild;
      return mount(
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
              : (wrapper: HTMLElement | null) => {
                  const node = editorView.dom.getElementsByTagName('table')[0];

                  if (!wrapper?.firstChild) {
                    wrapper?.appendChild(node);
                  }
                }
          }
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
      const tableComponent = mountTableComponent();
      // rafStub.flush();
      const sentinelWrapperTop = tableComponent.find(
        `.${TableCssClassName.TABLE_STICKY_SENTINEL_TOP}`,
      );
      const sentinelWrapperBottom = tableComponent.find(
        `.${TableCssClassName.TABLE_STICKY_SENTINEL_BOTTOM}`,
      );
      expect(sentinelWrapperTop).toHaveLength(1);
      expect(sentinelWrapperBottom).toHaveLength(1);
    });

    describe('updates sticky header state', () => {
      it('top sentinel does nothing if the rootBounds has height 0', () => {
        const tableComponent = mountTableComponent();
        const sentinelWrapperTop = tableComponent.find(
          `.${TableCssClassName.TABLE_STICKY_SENTINEL_TOP}`,
        );
        const sentinelTop = sentinelWrapperTop.getDOMNode() as HTMLElement;

        triggerElementIntersect({
          target: sentinelTop,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0, height: 0 },
          boundingClientRect: { bottom: 0, top: 0 },
        });

        expect(updateStickyState).not.toHaveBeenCalled();
      });

      it('bottom sentinel does nothing if the rootBounds has height 0', () => {
        const tableComponent = mountTableComponent();
        const sentinelWrapperBottom = tableComponent.find(
          `.${TableCssClassName.TABLE_STICKY_SENTINEL_BOTTOM}`,
        );
        const sentinelBottom = sentinelWrapperBottom.getDOMNode() as HTMLElement;
        triggerElementIntersect({
          target: sentinelBottom,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0, height: 0 },
          boundingClientRect: { bottom: 0, top: 0 },
        });

        expect(updateStickyState).not.toHaveBeenCalled();
      });

      it('when top sentinel leaves scroll area', () => {
        const tableComponent = mountTableComponent();
        const sentinelWrapperTop = tableComponent.find(
          `.${TableCssClassName.TABLE_STICKY_SENTINEL_TOP}`,
        );
        const sentinelTop = sentinelWrapperTop.getDOMNode() as HTMLElement;

        triggerElementIntersect({
          target: sentinelTop,
          isIntersecting: false,
          rootBounds: { bottom: 0, top: 0 },
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

      it('when bottom sentinel enters or leaves scroll area', () => {
        const tableComponent = mountTableComponent();
        const sentinelWrapperBottom = tableComponent.find(
          `.${TableCssClassName.TABLE_STICKY_SENTINEL_BOTTOM}`,
        );
        const sentinelBottom = sentinelWrapperBottom.getDOMNode() as HTMLElement;

        triggerElementIntersect({
          target: sentinelBottom,
          isIntersecting: true,
          rootBounds: { bottom: 0, top: 0 },
          boundingClientRect: { bottom: 0, top: -100 },
        });

        // sets to sticky when bottom sentinel is within scroll area
        // and above scroll container top by more than header height
        expect(updateStickyState).toHaveBeenCalledWith(
          expect.objectContaining({
            sticky: true,
          }),
        );

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
        const tableComponent = mountTableComponent({
          disableContentDomMock: true,
        });
        const sentinelWrapperBottom = tableComponent.find(
          `.${TableCssClassName.TABLE_STICKY_SENTINEL_BOTTOM}`,
        );
        const sentinelBottom = sentinelWrapperBottom.getDOMNode() as HTMLElement;
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
      const tableComponent = mountTableComponent({
        disableContentDomMock: true,
      });
      const sentinelWrapperBottom = tableComponent.find(
        `.${TableCssClassName.TABLE_STICKY_SENTINEL_BOTTOM}`,
      );
      const sentinelBottom = sentinelWrapperBottom.getDOMNode() as HTMLElement;
      tableWrapper?.appendChild(sentinelBottom);
      rafStub.flush();
      expect(sentinelBottom.dataset.isObserved).toBeDefined();
      eventDispatcher.emit((pluginKey as any).key, {
        isHeaderRowEnabled: false,
      });
      expect(sentinelBottom.dataset.isObserved).toBeUndefined();
    });
  });
});
