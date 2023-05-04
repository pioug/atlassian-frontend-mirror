jest.autoMockOff();

import { createTransformer } from '@atlaskit/codemod-utils';

import { updateImports } from '../../migrations/update-imports';

const transformer = createTransformer([updateImports]);

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

const transform = { default: transformer, parser: 'tsx' };
const transformOptions = { printOptions: { quote: 'single' } };

describe('update imports', () => {
  defineInlineTest(
    transform,
    transformOptions,
    `
    import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
    `,
    `
    import { DragDropContext, Draggable, Droppable } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';
    `,
    'should correctly handle basic usage',
  );

  defineInlineTest(
    transform,
    transformOptions,
    `
    import type { DraggableProps, DroppableProps } from 'react-beautiful-dnd';

    import { DragDropContext, Draggable, Droppable } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';
    `,
    `
    import type { DraggableProps, DroppableProps } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';

    import { DragDropContext, Draggable, Droppable } from '@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration';
    `,
    'should not merge declarations',
  );
});
