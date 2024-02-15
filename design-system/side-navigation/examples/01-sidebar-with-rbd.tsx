/** @jsx jsx */
import { forwardRef, Fragment, Ref, useState } from 'react';

import { jsx } from '@emotion/react';
// Allowing existing usage of non Pragmatic drag and drop solution
// eslint-disable-next-line @atlaskit/design-system/no-unsupported-drag-and-drop-libraries
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
} from 'react-beautiful-dnd';

import ItemIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import RBDIcon from '@atlaskit/icon/glyph/editor/media-wide';
import { CustomItemComponentProps } from '@atlaskit/menu';
import { Box } from '@atlaskit/primitives';

import {
  ButtonItem,
  CustomItem,
  HeadingItem,
  NavigationHeader,
  NestableNavigationContent,
  NestingItem,
  SideNavigation,
} from '../src';

import AppFrame from './common/app-frame';
import SampleHeader from './common/sample-header';

interface RenderDraggableProps {
  ref: Ref<any>;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  draggableProps: DraggableProvided['draggableProps'];
}

interface CustomDraggable {
  key: string;
  renderItem: (props: RenderDraggableProps) => JSX.Element;
}

const ADragDropView = (props: { items: CustomDraggable[] }) => {
  const [draggables, setDraggables] = useState(props.items);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const newDraggables = Array.from(draggables);
    const [removed] = newDraggables.splice(source.index, 1);
    newDraggables.splice(destination.index, 0, removed);

    setDraggables(newDraggables);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable-1">
        {(provided) => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            <Fragment>
              {draggables.map((item, index) => {
                return (
                  <Draggable
                    disableInteractiveElementBlocking={true}
                    key={item.key}
                    draggableId={item.key}
                    index={index}
                  >
                    {(provided) => {
                      return item.renderItem({
                        ref: provided.innerRef,
                        dragHandleProps: provided.dragHandleProps,
                        draggableProps: provided.draggableProps,
                      });
                    }}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Fragment>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const generateDraggableButtonItems = (n: number): CustomDraggable[] => {
  return Array.from(Array(n)).map((_, n) => {
    return {
      key: n.toString(),
      renderItem: (props: RenderDraggableProps) => (
        <ButtonItem
          // disable the dynamic margin behaviour
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          cssFn={() => {
            return {
              '&:first-child:not(style)': {
                marginTop: 0,
              },
              '&:last-child:not(style)': {
                marginBottom: 0,
              },
            };
          }}
          ref={props.ref}
          iconBefore={<ItemIcon label="" />}
          {...props.dragHandleProps}
          {...props.draggableProps}
        >
          Item {n}
        </ButtonItem>
      ),
    };
  });
};

const generateDraggableCustomItems = (n: number): CustomDraggable[] => {
  const CustomComponent = forwardRef<any, CustomItemComponentProps>(
    ({ children, 'data-testid': testId, ...rest }, ref) => {
      return (
        <Box ref={ref} testId={testId} {...rest}>
          {children}
        </Box>
      );
    },
  );

  return Array.from(Array(n)).map((_, n) => {
    return {
      key: n.toString(),
      renderItem: (props: RenderDraggableProps) => (
        <CustomItem
          component={CustomComponent}
          // disable the dynamic margin behaviour
          iconBefore={<ItemIcon label="" />}
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          cssFn={() => ({
            '&:first-child:not(style)': {
              marginTop: 0,
            },
            '&:last-child:not(style)': {
              marginBottom: 0,
            },
          })}
          ref={props.ref}
          {...props.dragHandleProps}
          {...props.draggableProps}
        >
          Item {n}
        </CustomItem>
      ),
    };
  });
};

const generateDraggableCats = (): CustomDraggable[] => {
  const urls = [
    'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/320014/pexels-photo-320014.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/208984/pexels-photo-208984.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    'https://images.pexels.com/photos/2194261/pexels-photo-2194261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  ];

  return urls.map((url) => ({
    key: url,
    renderItem: (props) => (
      <img
        ref={props.ref}
        {...props.dragHandleProps}
        {...props.draggableProps}
        width="100%"
        alt="Cat"
        src={url}
      />
    ),
  }));
};

const RBDExample = () => {
  return (
    <AppFrame>
      <SideNavigation label="project">
        <NavigationHeader>
          <SampleHeader />
        </NavigationHeader>
        <NestableNavigationContent>
          <NestingItem
            id="1"
            iconBefore={<RBDIcon label="" />}
            title="Draggable <ButtonItem/>s"
          >
            <HeadingItem>
              Click and drag the items below to rearrange
            </HeadingItem>
            <ADragDropView
              items={generateDraggableButtonItems(10)}
            ></ADragDropView>
          </NestingItem>
          <NestingItem
            id="2"
            iconBefore={<RBDIcon label="" />}
            title="Draggable <CustomItem/>s"
          >
            <HeadingItem>
              Click and drag the items below to rearrange
            </HeadingItem>
            <ADragDropView items={generateDraggableCustomItems(10)} />
          </NestingItem>
          <NestingItem id="3" iconBefore="🐱" title="Draggable Cats">
            <HeadingItem>
              Click and drag the items below to rearrange
            </HeadingItem>
            <ADragDropView items={generateDraggableCats()} />
          </NestingItem>
        </NestableNavigationContent>
      </SideNavigation>
    </AppFrame>
  );
};

export default RBDExample;
