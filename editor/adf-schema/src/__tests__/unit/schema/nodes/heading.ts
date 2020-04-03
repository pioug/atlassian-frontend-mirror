import { name } from '../../../../version.json';
import { createSchema } from '../../../../schema/create-schema';
import { fromHTML, toHTML } from '../../../../../test-helpers';
import {
  strong,
  doc as editorDoc,
  h1,
  a as link,
  em,
} from '@atlaskit/editor-test-helpers';

const schema = makeSchema();

describe(`${name}/schema heading node`, () => {
  it('serializes to <h4>', () => {
    const html = toHTML(schema.nodes.heading.create({ level: 4 }), schema);
    expect(html).toContain('<h4>');
  });

  it('matches <h3>', () => {
    const doc = fromHTML('<h3>', schema);
    const h3 = doc.firstChild!;
    expect(h3.type.name).toEqual('heading');
  });

  it('can have inline strong', () => {
    const doc = fromHTML('<h1><b>hello</b></h1>', schema);
    expect(doc).toEqualDocument(editorDoc(h1(strong('hello'))));
  });

  it('can have inline italic', () => {
    const doc = fromHTML('<h1><em>hello</em></h1>', schema);
    expect(doc).toEqualDocument(editorDoc(h1(em('hello'))));
  });

  it('can have inline links', () => {
    const doc = fromHTML(
      '<h1><a href="http://www.atlassian.com" rel="nofollow" title="@abodera" class="mention mention-me">hello</a></h1>',
      schema,
    );
    expect(doc).toEqualDocument(
      editorDoc(h1(link({ href: 'http://www.atlassian.com' })('hello'))),
    );
  });
});

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'text', 'heading'],
    marks: ['strong', 'em', 'link'],
  });
}
