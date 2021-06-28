import React from 'react';
import { mount } from 'enzyme';
import { Toolbar } from '../../../ui/Toolbar/Toolbar';
import { ToolbarWithSizeDetector } from '../../../ui/Toolbar/ToolbarWithSizeDetector';
import { act } from 'react-dom/test-utils';
import {
  ToolbarSize,
  ToolbarUIComponentFactory,
} from '../../../ui/Toolbar/types';
import { WidthObserver } from '@atlaskit/width-detector';
import { asMockFunction } from '@atlaskit/media-test-helpers';

let mockInnerSetWidth: Function | undefined;

let mockElementWidth: number | undefined;

const setWidth = (width: number) =>
  typeof mockInnerSetWidth === 'function'
    ? mockInnerSetWidth(width)
    : undefined;

const setElementWidth = (width?: number) => (mockElementWidth = width);

const getMockedToolbarItem = () =>
  asMockFunction<ToolbarUIComponentFactory>(jest.fn());

type mockWidthObserver = typeof WidthObserver;

jest.mock('@atlaskit/width-detector', () => {
  return {
    WidthObserver: ((props) => {
      mockInnerSetWidth = props.setWidth;
      return null;
    }) as mockWidthObserver,
  };
});

jest.mock('../../../ui/Toolbar/hooks', () => {
  return {
    useElementWidth() {
      return mockElementWidth;
    },
  };
});

describe('Toolbar', () => {
  beforeEach(() => {
    mockElementWidth = undefined;
  });

  it('should render a Toolbar UI Component', () => {
    const toolbarItem = getMockedToolbarItem();
    const toolbar = mount(
      <Toolbar
        items={[toolbarItem]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        toolbarSize={ToolbarSize.L}
        containerElement={null}
      />,
    );

    expect(toolbarItem).toBeCalled();
    toolbar.unmount();
  });

  it('should re-render with different toolbar size when toolbar width changes', async () => {
    setElementWidth(501);

    const toolbarItem = getMockedToolbarItem();
    const toolbar = mount(
      <ToolbarWithSizeDetector
        items={[toolbarItem]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        containerElement={null}
      />,
    );

    expect(toolbarItem).toHaveBeenCalledWith(
      expect.objectContaining({
        toolbarSize: ToolbarSize.M,
      }),
    );

    act(() => setWidth(1000));

    expect(toolbarItem).toHaveBeenCalledWith(
      expect.objectContaining({
        toolbarSize: ToolbarSize.XXL,
      }),
    );

    act(() => setWidth(100));

    expect(toolbarItem).toHaveBeenCalledWith(
      expect.objectContaining({
        toolbarSize: ToolbarSize.XXXS,
      }),
    );

    toolbar.unmount();
  });

  it('should set reduced spacing for toolbar buttons if size is < ToolbarSize.XXL', () => {
    const toolbarItem = getMockedToolbarItem();
    const toolbar = mount(
      <Toolbar
        items={[toolbarItem]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        toolbarSize={ToolbarSize.XL}
        containerElement={null}
      />,
    );

    // First call
    expect(toolbarItem.mock.calls[0][0]).toMatchObject({
      isToolbarReducedSpacing: true,
    });

    toolbar.unmount();
  });

  it('should set normal spacing for toolbar buttons if size is >= ToolbarSize.XXL', () => {
    const toolbarItem = getMockedToolbarItem();
    const toolbar = mount(
      <Toolbar
        items={[toolbarItem]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        toolbarSize={ToolbarSize.XXL}
        containerElement={null}
      />,
    );

    // First call
    expect(toolbarItem.mock.calls[0][0]).toMatchObject({
      isToolbarReducedSpacing: false,
    });

    toolbar.unmount();
  });
});
