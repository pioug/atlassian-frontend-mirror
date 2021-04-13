import React, { RefObject } from 'react';
import { shallow } from 'enzyme';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { Resizable } from 're-resizable';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import Resizer, { ResizableNumberSize, ResizerProps } from '../../index';

describe('<Resizer />', () => {
  const setup = (props: Partial<ResizerProps> = {}) => {
    const createEditor = createEditorFactory();
    const { editorView } = createEditor({ doc: doc(p()) });
    const updateSize = jest.fn();
    const delta: ResizableNumberSize = {
      width: 10,
      height: 10,
    };
    const resizer = shallow(
      <Resizer
        enable={{ left: true, right: true }}
        calcNewSize={jest
          .fn()
          .mockReturnValue({ layout: 'wrap-left', width: 100 })}
        snapPoints={[]}
        highlights={jest.fn().mockReturnValue([])}
        updateSize={updateSize}
        displayGrid={jest.fn()}
        getPos={jest.fn()}
        view={editorView}
        lineLength={1}
        gridSize={1}
        containerWidth={1}
        layout={'center'}
        width={1}
        {...props}
      >
        <div></div>
      </Resizer>,
    );
    const resizable: RefObject<any> = {
      current: {
        state: {
          original: { width: 1 },
        },
        updateSize: jest.fn(),
        setState: jest.fn(),
      },
    };
    (resizer.instance() as Resizer).resizable = resizable;
    const resizableComponent = resizer.find(Resizable);
    return {
      resizer,
      delta,
      updateSize,
      resizableComponent,
    };
  };

  it('should handle empty snapPoints', () => {
    const { resizableComponent, delta, updateSize } = setup();

    resizableComponent
      .simulate('resizeStart', { preventDefault: jest.fn() })
      .simulate('resize', undefined, undefined, undefined, delta);

    expect(updateSize).toBeCalledWith(100, 'wrap-left');
  });

  it('should define handleWrapperStyle when ratio is given', () => {
    const { resizableComponent } = setup({
      ratio: '55',
    });
    const resizableProps = resizableComponent.props();
    expect(resizableProps.handleWrapperStyle).toBeDefined();
    expect(resizableProps.handleWrapperStyle).toEqual(
      expect.objectContaining({
        paddingBottom: '55%',
      }),
    );
  });

  it('should not define handleWrapperStyle when ratio is not given', () => {
    const { resizableComponent } = setup({
      ratio: undefined,
    });
    const resizableProps = resizableComponent.props();
    expect(resizableProps.handleWrapperStyle).not.toBeDefined();
  });
});
