import React from 'react';

import ScrollLock from 'react-scrolllock';

import { sizes } from '@atlaskit/icon';
import {
  Manager,
  Popper,
  PopperChildrenProps,
  Reference,
} from '@atlaskit/popper';
import { gridSize, layers } from '@atlaskit/theme/constants';

interface Props {
  /** A ref to the container that the content should be layered around for height calculation
   * purposes. This must be an ancestor element as component does not attach the layered content around
   * the ref itself. */
  containerRef: HTMLElement | null;
  /**
   * The content to render in the layer.
   */
  content: React.ReactNode;
  /**
   * input value from the menu.
   */
  inputValue: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--popper-container` wrapping element of time-picker
   **/
  testId?: string;
}

/**
 * This component renders layered content with fixed positioning.
 * Scroll is locked outside the layer to prevent the layered content from detaching from the
 * container ref.
 */
export default class FixedLayer extends React.Component<Props> {
  update: () => void = () => {};

  componentDidUpdate(prevProps: any) {
    if (prevProps.inputValue !== this.props.inputValue) {
      this.update();
    }
  }

  render() {
    const { containerRef, content, testId } = this.props;

    // Wait for containerRef callback to cause a re-render
    if (!containerRef) {
      return <div />;
    }
    const containerRect = containerRef.getBoundingClientRect();

    return (
      /* Need to wrap layer in a fixed position div so that it will render its content as fixed
       * We need to set the intial top value to where the container is and zIndex so that it still
       * applies since we're creating a new stacking context. */
      <Manager>
        <ScrollLock />
        <Reference>
          {({ ref }) => (
            <div
              ref={ref}
              data-layer-child
              style={{
                position: 'absolute',
                top: 0,
                height: containerRect.height,
                // Don't block the clear button
                width:
                  containerRect.width -
                  parseInt(sizes.small.slice(0, -2)) -
                  gridSize(),
                background: 'transparent',
              }}
            />
          )}
        </Reference>
        <Popper>
          {({ ref, style, update }: PopperChildrenProps) => {
            this.update = update;

            return (
              <div
                ref={ref as React.Ref<HTMLDivElement>}
                style={{ ...style, zIndex: layers.dialog() }}
                data-testid={testId && `${testId}--popper--container`}
              >
                {content}
              </div>
            );
          }}
        </Popper>
      </Manager>
    );
  }
}
