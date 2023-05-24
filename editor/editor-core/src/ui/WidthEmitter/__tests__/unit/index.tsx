import React from 'react';

import { render } from '@testing-library/react';

import {
  ContextPanelProvider,
  WidthProvider,
} from '@atlaskit/editor-common/ui';

import WidthEmitter from '../../index';

describe('WidthEmiter', () => {
  describe('when there is no providers', () => {
    it('should not call the dispatch function', () => {
      const editorView = {
        dom: jest.fn(),
        state: {
          tr: jest.fn(),
        },
        dispatch: jest.fn(),
      };

      // @ts-ignore
      render(<WidthEmitter editorView={editorView} />);

      expect(editorView.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('when there is a WidthProvider context provider', () => {
    const fakeContainerWidth = 500;
    let mockOffsetWidth: jest.SpyInstance;
    let tr: any;
    let editorView: any;

    beforeEach(() => {
      mockOffsetWidth = jest
        .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
        .mockImplementation(() => fakeContainerWidth);
      jest.useFakeTimers();

      tr = {
        setMeta: jest.fn(),
      };
      editorView = {
        dom: {
          clientWidth: 200,
        },
        state: {
          tr,
        },
        dispatch: jest.fn(),
      };
    });

    afterEach(() => {
      mockOffsetWidth.mockClear();
    });

    it('should set the meta information in the transaction', () => {
      render(
        <WidthProvider>
          <WidthEmitter editorView={editorView} />
        </WidthProvider>,
      );

      expect(tr.setMeta).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'widthPlugin$' }),
        {
          containerWidth: fakeContainerWidth,
          width: fakeContainerWidth,
          lineLength: editorView.dom.clientWidth,
        },
      );
    });

    it('should call the dispatch function with the transaction', () => {
      render(
        <WidthProvider>
          <WidthEmitter editorView={editorView} />
        </WidthProvider>,
      );

      expect(editorView.dispatch).toHaveBeenCalledWith(tr);
    });
  });

  describe('when there is a ContextPanelProvider context provider', () => {
    const fakeContainerWidth = 500;
    let mockOffsetWidth: jest.SpyInstance;
    let tr: any;
    let editorView: any;
    const contextPanelWidth = 33;
    const defaultContextPanelProviderProps = {
      width: contextPanelWidth,
      broadcastWidth: () => {},
      positionedOverEditor: false,
      broadcastPosition: () => {},
    };

    beforeEach(() => {
      mockOffsetWidth = jest
        .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
        .mockImplementation(() => fakeContainerWidth);
      jest.useFakeTimers();

      tr = {
        setMeta: jest.fn(),
      };
      editorView = {
        dom: {
          clientWidth: 200,
        },
        state: {
          tr,
        },
        dispatch: jest.fn(),
      };
    });

    afterEach(() => {
      mockOffsetWidth.mockClear();
    });

    describe('when there is no WidthProvider', () => {
      it('should not call the dispatch function with the transaction', () => {
        render(
          <ContextPanelProvider value={{ ...defaultContextPanelProviderProps }}>
            <WidthEmitter editorView={editorView} />
          </ContextPanelProvider>,
        );

        expect(editorView.dispatch).not.toHaveBeenCalledWith(tr);
      });
    });

    it('should call the dispatch function with the transaction', () => {
      render(
        <WidthProvider>
          <ContextPanelProvider
            value={{ ...defaultContextPanelProviderProps, width: 0 }}
          >
            <WidthEmitter editorView={editorView} />
          </ContextPanelProvider>
        </WidthProvider>,
      );

      expect(editorView.dispatch).toHaveBeenCalledWith(tr);
    });
  });
});
