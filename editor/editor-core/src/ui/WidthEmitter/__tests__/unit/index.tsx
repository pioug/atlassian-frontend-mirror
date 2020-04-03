import { mount } from 'enzyme';
import React from 'react';
import { WidthProvider } from '@atlaskit/editor-common';
import WidthEmitter from '../../index';
import { pluginKey as widthPluginKey } from '../../../../plugins/width';
import { ContextPanelProvider } from '../../../ContextPanel/context';

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
      mount(<WidthEmitter editorView={editorView} />);

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
      mount(
        <WidthProvider>
          <WidthEmitter editorView={editorView} />
        </WidthProvider>,
      );

      expect(tr.setMeta).toHaveBeenCalledWith(widthPluginKey, {
        width: fakeContainerWidth,
        lineLength: editorView.dom.clientWidth,
      });
    });

    it('should call the dispatch function with the transaction', () => {
      mount(
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
        const contextPanelWidth = 33;
        const broadcastWidth = () => {};
        mount(
          <ContextPanelProvider
            value={{ width: contextPanelWidth, broadcastWidth }}
          >
            <WidthEmitter editorView={editorView} />
          </ContextPanelProvider>,
        );

        expect(editorView.dispatch).not.toHaveBeenCalledWith(tr);
      });
    });

    it('should set the meta information in the transaction', () => {
      const contextPanelWidth = 33;
      mount(
        <WidthProvider>
          <ContextPanelProvider
            value={{ width: contextPanelWidth, broadcastWidth: () => {} }}
          >
            <WidthEmitter editorView={editorView} />
          </ContextPanelProvider>
        </WidthProvider>,
      );

      expect(tr.setMeta).toHaveBeenCalledWith(widthPluginKey, {
        width: fakeContainerWidth - contextPanelWidth,
        lineLength: editorView.dom.clientWidth,
      });
    });

    it('should call the dispatch function with the transaction', () => {
      mount(
        <WidthProvider>
          <ContextPanelProvider value={{ width: 0, broadcastWidth: () => {} }}>
            <WidthEmitter editorView={editorView} />
          </ContextPanelProvider>
        </WidthProvider>,
      );

      expect(editorView.dispatch).toHaveBeenCalledWith(tr);
    });
  });
});
