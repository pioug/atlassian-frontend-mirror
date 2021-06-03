/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import styledRootElement from '../styled/Item';
import {
  Before,
  After,
  Content,
  ContentWrapper,
  Description,
} from '../styled/ItemParts';

export default class Item extends Component {
  static defaultProps = {
    autoFocus: false,
    description: '',
    isCompact: false,
    isDisabled: false,
    isHidden: false,
    role: 'button',
    shouldAllowMultiline: false,
  };

  constructor(props) {
    super(props);

    // The type of element rendered at the root of render() can vary based on the `href`
    // and `linkComponent` props provided. We generate this component here to avoid re-
    // generating the component inside render(). This is for performance reasons, and also
    // allows us to avoid generating a new `ref` for the root element each render().
    this.rootComponent = styledRootElement({
      href: this.href(),
      linkComponent: props.linkComponent,
    });
  }

  componentDidMount() {
    if (this.ref && this.props.autoFocus) {
      this.ref.focus();
    }
  }

  setRef = (ref) => {
    this.ref = ref;
  };

  href = () => (this.props.isDisabled ? null : this.props.href);

  render() {
    const {
      onClick,
      onKeyDown,
      isCompact,
      isDisabled,
      isDragging,
      isHidden,
      isSelected,
      onMouseEnter,
      onMouseLeave,
      role,
      dnd,
      ...otherProps
    } = this.props;

    const { rootComponent: Root } = this;
    const dragHandleProps = (dnd && dnd.dragHandleProps) || null;

    const patchedEventHandlers = {
      onClick: (event) => {
        // rbd will use event.preventDefault() to block clicks that are used
        // as a part of the drag and drop lifecycle.
        if (event.defaultPrevented) {
          return;
        }

        if (!isDisabled && onClick) {
          onClick(event);
        }
      },
      onMouseDown: (event) => {
        // rbd 11.x support
        if (dragHandleProps && dragHandleProps.onMouseDown) {
          dragHandleProps.onMouseDown(event);
        }
        // We want to prevent the item from getting focus when clicked
        event.preventDefault();
      },
      onKeyDown: (event) => {
        // swallowing keyboard events on the element while dragging
        // rbd should already be doing this - but we are being really clear here
        if (isDragging) {
          return;
        }

        // rbd 11.x support
        if (dragHandleProps && dragHandleProps.onKeyDown) {
          dragHandleProps.onKeyDown(event);
        }

        // if default is prevented - do not fire other handlers
        // this can happen if the event is used for drag and drop by rbd
        if (event.defaultPrevented) {
          return;
        }

        // swallowing event if disabled
        if (isDisabled) {
          return;
        }

        if (!onKeyDown) {
          return;
        }

        onKeyDown(event);
      },
    };

    const patchedInnerRef = (ref) => {
      this.setRef(ref);

      // give rbd the inner ref too
      if (dnd && dnd.innerRef) {
        dnd.innerRef(ref);
      }
    };

    return (
      <Root
        aria-disabled={isDisabled}
        href={this.href()}
        isCompact={isCompact}
        isDisabled={isDisabled}
        isDragging={isDragging}
        isHidden={isHidden}
        isSelected={isSelected}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={role}
        tabIndex={isDisabled || isHidden || this.props.href ? null : 0}
        target={this.props.target}
        title={this.props.title}
        innerRef={patchedInnerRef}
        {...(dnd && dnd.draggableProps)}
        {...dragHandleProps}
        {...patchedEventHandlers}
        {...otherProps}
      >
        {!!this.props.elemBefore && (
          <Before isCompact={isCompact}>{this.props.elemBefore}</Before>
        )}
        <ContentWrapper>
          <Content allowMultiline={this.props.shouldAllowMultiline}>
            {this.props.children}
          </Content>
          {!!this.props.description && (
            <Description
              isCompact={this.props.isCompact}
              isDisabled={this.props.isDisabled}
            >
              {this.props.description}
            </Description>
          )}
        </ContentWrapper>
        {!!this.props.elemAfter && (
          <After isCompact={isCompact}>{this.props.elemAfter}</After>
        )}
      </Root>
    );
  }
}
