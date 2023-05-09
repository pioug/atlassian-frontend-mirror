# Table

This example uses drag and drop to allow reordering the rows and columns of a table.

## Rows

Each row is rendered using the `DraggableTableRow` component, which sets the row up to be both draggable and a drop target. This is also where the edge detection logic sits.

The actual reordering logic sits inside a monitor at the top level.

## Columns

Column reordering uses the column headings as drag handles (and as the preview images). Using the whole column as a drag preview required a lot of hacky code and didn't feel much better.

Similarly to rows, each column heading is rendered using the `DraggableTableHeaderCell` component.
