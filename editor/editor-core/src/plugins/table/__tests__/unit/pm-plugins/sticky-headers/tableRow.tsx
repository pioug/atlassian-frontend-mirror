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
import { pluginKey } from '../../../../pm-plugins/plugin-factory';
import { EventDispatcher } from '../../../../../../test-utils';
import createStub, { Stub } from 'raf-stub';
import featureFlagsPlugin from '../../../../../feature-flags-context';
jest.mock('../../../../pm-plugins/sticky-headers/commands', () => ({
  ...jest.requireActual<Object>(
    '../../../../pm-plugins/sticky-headers/commands',
  ),
  updateStickyState: jest.fn(() => jest.fn()),
}));
jest.mock('@atlaskit/editor-common', () => ({
  ...jest.requireActual<Object>('@atlaskit/editor-common'),
  findOverflowScrollParent: jest.fn(() => jest.fn()),
}));

import { findOverflowScrollParent } from '@atlaskit/editor-common';
import { updateStickyState } from '../../../../pm-plugins/sticky-headers/commands';
import { TableCssClassName } from '../../../../types';
import { mount } from 'enzyme';
import TableComponent from '../../../../nodeviews/TableComponent';
import React from 'react';
import { ForwardRef } from '../../../../../../nodeviews';
import {
  stickyRowOffsetTop,
  tableScrollbarOffset,
} from '../../../../ui/consts';

describe('TableRowNodeView', () => {
  let tableRowNodeView: TableRowNodeView;
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder, stickyHeadersOptimization?: boolean) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([tablePlugin])
        .add([featureFlagsPlugin, { stickyHeadersOptimization }]),
      pluginKey,
    });
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
      const editorData = editor(doc(table()(tr(tdEmpty, tdEmpty))));
      editorView = editorData.editorView;
      eventDispatcher = editorData.eventDispatcher;
      tableRowNode = editorView.state.doc.firstChild!.firstChild!;
      tableRowNodeView = new TableRowNodeView(
        tableRowNode,
        editorView,
        jest.fn(),
        eventDispatcher,
      );
      tableRowDom = editorView.dom.getElementsByTagName('tr')[0];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it.each<[string, string, boolean]>([
      ['disallows observing mutations on row element', 'attributes', true],
      ['allows mutations for row element selection', 'selection', false],
    ])('%s', (_, mutationType, expected) => {
      const mutationRecord = {
        type: mutationType,
        target: tableRowDom,
      } as any;
      expect(tableRowNodeView.ignoreMutation(mutationRecord as any)).toBe(
        expected,
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

    function mountTableComponent(forwardRef?: ForwardRef) {
      const getNode = () => editorView.state.doc.firstChild;
      return mount(
        <TableComponent
          view={editorView}
          eventDispatcher={eventDispatcher}
          // @ts-ignore
          containerWidth={{}}
          // @ts-ignore
          getNode={getNode}
          contentDOM={forwardRef || jest.fn()}
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
        const tableComponent = mountTableComponent();
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
      const tableComponent = mountTableComponent();
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
