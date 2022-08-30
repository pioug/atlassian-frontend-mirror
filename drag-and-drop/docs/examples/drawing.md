# Drawing

This example demonstrates using the drag and drop API to draw lines.

Each shape is a draggable element, as well as a drop target. By dragging from a shape to its matching shape, lines are drawn to connect them.

There are two kinds of lines drawn:

1. An 'active' line that follows the cursor as you drag from a shape.
2. Lines which connect two shapes that have been joined using drag and drop.

Both types of line are drawn using SVG `<line>` elements, which uses coordinates for the endpoints.

## Active line

The active line is shown on drag start and hidden on drag end. One end is anchored to the shape being dragged from, and the other end is anchored to the cursor location.

Endpoints coordinates are calculated in the `onDrag` callback of each shape. The position of the shape is obtained from `source.element.getBoundingClientRect()`, whereas the position of the cursor is obtained from `location.current.input`.

## Connection lines

Connection lines are shown after dropping a shape on its matching counterpart. Each end is anchored to one of the shapes.

Endpoint coordinates are calculated in the `onDrop` callback of a monitor. They are derived from the `DOMRect` of both the drag source and the topmost drop target.

## Updating the SVG

The SVG drawing is modified imperatively using a ref constructed with the `useImperativeHandle` hook.
