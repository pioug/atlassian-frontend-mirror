import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { toHTML, fromHTML } from '../../../../../test-helpers';

const schema = makeSchema();

describe(`${name}/schema taskList node`, () => {
  it('serializes to <div> with proper data-attributes', () => {
    const html = toHTML(
      schema.nodes.taskList.create({ localId: 'cheese' }),
      schema,
    );
    expect(html).toContain('<div');
    expect(html).toContain('data-task-list-local-id="cheese"');
  });

  it('matches <div data-task-list-local-id>', () => {
    const doc = fromHTML(
      '<div data-node-type="actionList" data-task-list-local-id>',
      schema,
    );
    const taskList = doc.firstChild!;
    expect(taskList.type.name).toEqual('taskList');
    expect(taskList.attrs.localId).not.toEqual(undefined);
  });

  it('taskList requires defining to be true', () => {
    expect(schema.nodes.taskList.spec.defining).toBe(true);
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
