import { defaultSchema } from '@atlaskit/adf-schema';
import WikiMarkupTransformer from '../../../index';

import {
  doc,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('ADF => WikiMarkup - Task', () => {
  const transformer = new WikiMarkupTransformer();

  test('should convert basic task list', () => {
    const node = doc(
      taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49464' })(
        taskItem({
          localId: '0e87110e-aa58-411a-964b-883942b118cc',
          state: 'DONE',
        })('first'),
        taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
          taskItem({
            localId: '0e87110e-aa58-411a-964b-883942b118aa',
            state: 'TODO',
          })('second'),
          taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
            taskItem({
              localId: '0e87110e-aa58-411a-964b-883942b118aa',
              state: 'TODO',
            })('third'),
          ),
        ),
        taskItem({
          localId: '0e87110e-aa58-411a-964b-883942b118bb',
          state: 'DONE',
        })('task 2 completed'),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });

  test('should convert complex nested task list', () => {
    const node = doc(
      taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49464' })(
        taskItem({
          localId: '0e87110e-aa58-411a-964b-883942b118cc',
          state: 'DONE',
        })('completed'),
        taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
          taskItem({
            localId: '0e87110e-aa58-411a-964b-883942b118aa',
            state: 'TODO',
          })('incompleted'),
          taskItem({
            localId: '0e87110e-aa58-411a-964b-883942b118bb',
            state: 'DONE',
          })('task 2 completed'),
          taskList({ localId: '16e05a75-f66c-4f26-bd52-7e6cb7b49444' })(
            taskItem({
              localId: '0e87110e-aa58-411a-964b-883942b118aa',
              state: 'TODO',
            })('incompleted'),
            taskItem({
              localId: '0e87110e-aa58-411a-964b-883942b118bb',
              state: 'DONE',
            })('task 2 completed'),
          ),
        ),
        taskItem({
          localId: '0e87110e-aa58-411a-964b-883942b118bb',
          state: 'DONE',
        })('task 2 completed'),
      ),
    )(defaultSchema);
    expect(transformer.encode(node)).toMatchSnapshot();
  });
});
