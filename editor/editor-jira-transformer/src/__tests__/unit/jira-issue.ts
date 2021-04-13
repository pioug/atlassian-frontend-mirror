import { doc, p, a } from '@atlaskit/editor-test-helpers/doc-builder';
import { createJIRASchema } from '@atlaskit/adf-schema';
import { parseWithSchema, encode } from './_test-helpers';

const schema = createJIRASchema({ allowLinks: true });

describe('JIRATransformer', () => {
  describe('JIRA issue keys', () => {
    it('parses HTML', () => {
      const actual = parseWithSchema(
        `<span class="jira-issue-macro" data-jira-key="ED-1">
          <a href="https://product-fabric.atlassian.net/browse/ED-1" class="jira-issue-macro-key issue-link">
            <img class="icon" src="./epic.svg" />
                ED-1
            </a>
            <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-current jira-macro-single-issue-export-pdf">
              In Progress
            </span>
        </span>`,
        schema,
      );

      const node = doc(
        p(
          a({
            href: 'https://product-fabric.atlassian.net/browse/ED-1',
          })('ED-1'),
        ),
      );
      expect(actual).toEqualDocument(node);
    });

    it('parses HTML for done issue', () => {
      const actual = parseWithSchema(
        `<span class="jira-issue-macro resolved" data-jira-key="ED-1">
          <a href="https://product-fabric.atlassian.net/browse/ED-1" class="jira-issue-macro-key issue-link">
            <img class="icon" src="./epic.svg" />
                ED-1
            </a>
            <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-current jira-macro-single-issue-export-pdf">
              In Progress
            </span>
        </span>`,
        schema,
      );

      const node = doc(
        p(
          a({
            href: 'https://product-fabric.atlassian.net/browse/ED-1',
          })('ED-1'),
        ),
      );
      expect(actual).toEqualDocument(node);
    });

    it('encodes HTML', () => {
      const node = doc(
        p(
          a({
            href: 'https://product-fabric.atlassian.net/browse/ED-1',
          })('ED-1'),
        ),
      );
      const encoded = encode(node, schema);
      expect(encoded).toEqual(
        '<p><a class="external-link" rel="nofollow" href="https://product-fabric.atlassian.net/browse/ED-1">ED-1</a></p>',
      );
    });
  });
});
