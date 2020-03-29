import React from 'react';
import { layers } from '@atlaskit/theme/constants';
import ScrollLock from 'react-scrolllock';
import { Popper, Manager, Reference } from '@atlaskit/popper';

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
}

/* eslint-disable react/no-unused-prop-types */
interface PopperProps {
  ref: React.Ref<HTMLElement>;
  style: any;
  placement: {};
  scheduleUpdate: () => void;
}

/**
 * This component renders layered content with fixed positioning.
 * Scroll is locked outside the layer to prevent the layered content from detaching from the
 * container ref.
 */
export default class FixedLayer extends React.Component<Props> {
  scheduleUpdate: () => void = () => {};

  componentDidUpdate(prevProps: any) {
    if (prevProps.inputValue !== this.props.inputValue) {
      this.scheduleUpdate();
    }
  }

  render() {
    const { containerRef, content } = this.props;

    // Wait for containerRef callback to cause a re-render
    if (!containerRef) return <div />;
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
                width: containerRect.width,
                background: 'transparent',
              }}
            />
          )}
        </Reference>
        <Popper>
          {({ ref, style, placement, scheduleUpdate }: PopperProps) => {
            this.scheduleUpdate = scheduleUpdate;

            return (
              // @ts-ignore: need to add `placement` onto div for popper
              <div
                ref={ref as React.Ref<HTMLDivElement>}
                placement={placement}
                style={{ ...style, zIndex: layers.dialog() }}
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
