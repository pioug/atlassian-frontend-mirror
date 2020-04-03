import React from 'react';
import { mount } from 'enzyme';
import { Toolbar } from '../../../ui/Toolbar/Toolbar';
import { ToolbarWithSizeDetector } from '../../../ui/Toolbar/ToolbarWithSizeDetector';
import { act } from 'react-dom/test-utils';

jest.mock('@atlaskit/editor-common', () => {
  let innerSetWidth: Function | undefined;

  return {
    setWidth: (width: number) =>
      typeof innerSetWidth === 'function' ? innerSetWidth(width) : undefined,
    WidthObserver: (props: any) => {
      innerSetWidth = props.setWidth;
      return null;
    },
  };
});
import { ToolbarSize } from '../../../ui/Toolbar/types';

describe('Toolbar', () => {
  it('should render a Toolbar UI Component', () => {
    const component = jest.fn(() => null) as any;
    const toolbar = mount(
      <Toolbar
        items={[component]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        toolbarSize={ToolbarSize.L}
      />,
    );

    expect(component).toBeCalled();
    toolbar.unmount();
  });

  it('should re-render with different toolbar size when toolbar width changes', async () => {
    const { setWidth } = (await import('@atlaskit/editor-common')) as any;

    const component = jest.fn(() => null) as any;

    const toolbar = mount(
      <ToolbarWithSizeDetector
        items={[component]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
      />,
    );

    act(() => setWidth(1000));

    expect(component.mock.calls[0][0]).toMatchObject({
      toolbarSize: ToolbarSize.XXL,
    });

    act(() => setWidth(100));

    // Second call
    expect(component.mock.calls[1][0]).toMatchObject({
      toolbarSize: ToolbarSize.XXXS,
    });

    toolbar.unmount();
  });

  it('should set reduced spacing for toolbar buttons if size is < ToolbarSize.XXL', () => {
    const component = jest.fn(() => null) as any;
    const toolbar = mount(
      <Toolbar
        items={[component]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        toolbarSize={ToolbarSize.XL}
      />,
    );

    // First call
    expect(component.mock.calls[0][0]).toMatchObject({
      isToolbarReducedSpacing: true,
    });

    toolbar.unmount();
  });

  it('should set normal spacing for toolbar buttons if size is >= ToolbarSize.XXL', () => {
    const component = jest.fn(() => null) as any;
    const toolbar = mount(
      <Toolbar
        items={[component]}
        editorView={{} as any}
        eventDispatcher={{} as any}
        providerFactory={{} as any}
        appearance="full-page"
        disabled={false}
        toolbarSize={ToolbarSize.XXL}
      />,
    );

    // First call
    expect(component.mock.calls[0][0]).toMatchObject({
      isToolbarReducedSpacing: false,
    });

    toolbar.unmount();
  });
});
