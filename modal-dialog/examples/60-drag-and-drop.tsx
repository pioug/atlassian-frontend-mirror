/* eslint-disable react/no-multi-comp */
import React from 'react';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import {
  Draggable,
  DragDropContext,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import Modal, { ModalTransition } from '../src';
import { DroppableProvided } from 'react-beautiful-dnd';

const noop = () => {};

const gridUnit = 4;

interface CardProps {
  isActive?: boolean;
  isDraggable?: boolean;
  isDragging?: boolean;
  isHovering?: boolean;
  ref: (ref: HTMLElement | null) => any;
}

const Card = styled.div<CardProps>`
  user-select: none;
  background: ${colors.Y75};
  border-radius: 3px;
  cursor: ${({ isDragging }) => (isDragging ? 'grabbing' : 'pointer')};
  display: flex;
  position: relative;
  height: ${gridUnit * 5}px;
  padding: ${gridUnit * 2}px ${gridUnit}px;
  border-bottom: 1px solid ${colors.R200};
  ${({ isDraggable }) => !isDraggable} ${({ isHovering }) =>
  isHovering &&
  `
        background: ${colors.R75};
        text-decoration: none;
    `} ${({ isActive }) =>
  isActive &&
  `
        background: ${colors.G300};
    `} &:focus {
    border-bottom-color: transparent;
    z-index: 1;
  }
`;

const isMiddleClick = (event: React.MouseEvent) => event.button === 1;

interface Item {
  id: string;
  message: string;
}

interface ItemLineCardProps {
  item: Item;
  index: number;
  isReorderEnabled: boolean;
  children: (
    isHovering: boolean,
    isActive: boolean,
    isFocused: boolean,
    item: Item,
  ) => React.ReactNode;
  onClick: (item: Item, e?: any) => void;
}

interface ItemLineCardState {
  isHovering: boolean;
  isActive: boolean;
  isFocused: boolean;
}

class ItemLineCard extends React.Component<
  ItemLineCardProps,
  ItemLineCardState
> {
  static defaultProps = {
    isReorderEnabled: true,
    onClick: noop,
  };

  state = {
    isHovering: false,
    isActive: false,
    isFocused: false,
  };

  eventHandlers = {
    onBlur: () => this.setState({ isFocused: false }),
    onClick: (event: React.MouseEvent) => {
      // Middle clicks are handled in onMouseDown
      // for cross browser support.
      if (!isMiddleClick(event)) {
        this.propagateClick(event);
      }
    },
    onFocus: () => this.setState({ isFocused: true }),
    onMouseEnter: () => this.setState({ isHovering: true }),
    onMouseLeave: () => this.setState({ isHovering: false, isActive: false }),
    onMouseDown: (event: React.MouseEvent) => {
      if (isMiddleClick(event)) {
        this.propagateClick(event);
      }
      this.setState({ isActive: true });
    },
    onMouseUp: () => this.setState({ isActive: false }),
  };

  propagateClick = (event: React.MouseEvent) => {
    event.persist();
    this.props.onClick(this.props.item, event);
  };

  renderCard = (cardProps: CardProps) => {
    const { isHovering, isFocused } = this.state;
    const isActive = !!cardProps.isDragging || this.state.isActive;
    return (
      <Card {...cardProps} {...this.state} isActive={isActive}>
        {this.props.children(isHovering, isActive, isFocused, this.props.item)}
      </Card>
    );
  };

  renderDraggableCard() {
    return (
      <Draggable draggableId={this.props.item.id} index={this.props.index}>
        {(provided, snapshot) => (
          <div>
            {this.renderCard({
              ref: provided.innerRef,
              isDraggable: true,
              isDragging: snapshot.isDragging,
              ...provided.draggableProps,
              ...provided.dragHandleProps,
              ...this.eventHandlers,
            })}
          </div>
        )}
      </Draggable>
    );
  }

  render() {
    return this.renderDraggableCard();
  }
}

interface ItemLineCardGroupProps {
  groupId: string;
  items: Item[];
  isReorderEnabled?: boolean;
  children: (
    isHovering: boolean,
    isActive: boolean,
    isFocused: boolean,
    item: Item,
  ) => React.ReactNode;
  onOrderChange: (
    items: Item[],
    target: Item,
    sourceIndex: number,
    destIndex: number,
  ) => void;
  onClick: () => void;
}

class ItemLineCardGroup extends React.Component<ItemLineCardGroupProps> {
  static defaultProps = {
    onOrderChange: noop,
    onClick: noop,
  };

  onDragEnd = (result: DropResult) => {
    const { source } = result;
    const { destination } = result;

    if (!destination || source.droppableId !== destination.droppableId) {
      return;
    }

    const items = [...this.props.items];
    const target = items.find(item => item.id === result.draggableId);

    if (!target) {
      return;
    }

    // Move the dropped item into the correct spot
    items.splice(source.index, 1);
    items.splice(destination.index, 0, target);

    this.props.onOrderChange(items, target, source.index, destination.index);
  };

  renderList(props: { isDraggingOver: boolean; provided: DroppableProvided }) {
    const { provided } = props;
    return (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {this.props.items.map((item, index) => (
          <ItemLineCard
            key={item.id}
            item={item}
            index={index}
            onClick={this.props.onClick}
          >
            {this.props.children}
          </ItemLineCard>
        ))}
        {provided.placeholder}
      </div>
    );
  }

  renderDraggableCards() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={this.props.groupId}>
          {(provided, snapshot) =>
            this.renderList({
              isDraggingOver: snapshot.isDraggingOver,
              provided,
            })
          }
        </Droppable>
      </DragDropContext>
    );
  }

  render() {
    return this.renderDraggableCards();
  }
}

const items = [...new Array(5).keys()].map(item => ({
  id: `id-${item}`,
  message: `Line item card ${item}: `,
}));

interface WrapperState {
  items: Item[];
}

class Wrapper extends React.Component<any, WrapperState> {
  state = {
    items: [...items],
  };

  render() {
    return (
      <ItemLineCardGroup
        groupId="test-group"
        items={this.state.items}
        onOrderChange={updated => {
          this.setState({ items: [...updated] });
        }}
        isReorderEnabled
        onClick={() => console.log('on click')}
      >
        {(isHovering, isActive, isFocused, item) => (
          <div>
            <span>{item.message}</span>
            <span>
              isHovering=
              {isHovering.toString()}
            </span>
            <span>
              , isActive=
              {isActive.toString()}
            </span>
            <span>
              , isFocused=
              {isFocused.toString()}
            </span>
          </div>
        )}
      </ItemLineCardGroup>
    );
  }
}

interface State {
  isOpen: boolean;
}
export default class extends React.PureComponent<{}, State> {
  state: State = { isOpen: false };

  open = () => this.setState({ isOpen: true });

  close = () => this.setState({ isOpen: false });

  secondaryAction = ({ currentTarget }: React.MouseEvent<HTMLElement>) =>
    console.log(currentTarget.innerText);

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <Button onClick={this.open}>Open Modal</Button>
        <p>
          We remove the transform css rule used for animating transitions after
          the enter animation occurs to work around an issue in
          react-beautiful-dnd where ancestor elements with a transform property
          cause dragging position issues. See AK-4328.
        </p>
        <ModalTransition>
          {isOpen && (
            <Modal onClose={this.close}>
              <Wrapper />
            </Modal>
          )}
        </ModalTransition>
      </div>
    );
  }
}
