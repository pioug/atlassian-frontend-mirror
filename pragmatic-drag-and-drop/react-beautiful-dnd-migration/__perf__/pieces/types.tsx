import type { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export type RbdApi = {
	DragDropContext: typeof DragDropContext;
	Draggable: typeof Draggable;
	Droppable: typeof Droppable;
};
