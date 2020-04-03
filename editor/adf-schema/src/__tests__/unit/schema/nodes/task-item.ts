import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema taskItem node`, () => {
  it('serializes to <div> with proper data-attributes', () => {
    const html = toHTML(schema.nodes.taskItem.create(), schema);
    expect(html).toContain('<div');
    expect(html).toContain('data-task-local-id');
    expect(html).toContain('data-task-state');
  });

  it('matches <div data-task-local-id>', () => {
    const doc = fromHTML('<div data-task-local-id>', schema);
    const taskItem = doc.firstChild!.firstChild!;
    expect(taskItem.type.name).toEqual('taskItem');
  });

  it('taskItem requires defining to be true', () => {
    expect(schema.nodes.taskItem.spec.defining).toBe(true);
  });
});

function makeSchema() {
  return createSchema({
    nodes: [
      'doc',
      'paragraph',
      'text',
      'taskList',
      'taskItem',
      'orderedList',
      'bulletList',
      'listItem',
    ],
  });
}
