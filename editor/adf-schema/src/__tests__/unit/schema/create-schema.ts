import { name } from '../../../version.json';
import { code as codeBase, createSchema, sanitizeNodes } from '../../..';
import { sanitizeNodeSpecContent } from '../../../schema/create-schema';
const filterGroupDecMark = (marks: Array<string>) =>
  marks.filter((mark) => mark[0] !== '_' || mark[1] !== '_');

describe(`${name}/schema createSchema helper`, () => {
  it('should add only defined marks and nodes to the schema', () => {
    const nodesConfig = ['doc', 'paragraph', 'text'];
    const marksConfig = ['em', 'strong', 'strike'];
    const schema = createSchema({ nodes: nodesConfig, marks: marksConfig });
    const nodes = Object.keys(schema.nodes);
    const marks = filterGroupDecMark(Object.keys(schema.marks));
    expect(nodes).toEqual(['doc', 'paragraph', 'text']);
    expect(marks).toEqual(['em', 'strong', 'strike']);
  });

  it('should preserv order for marks and nodes in the schema', () => {
    const nodesConfig = ['text', 'doc', 'paragraph'];
    const marksConfig = ['strong', 'strike', 'em'];
    const schema = createSchema({ nodes: nodesConfig, marks: marksConfig });
    const nodes = Object.keys(schema.nodes);
    const marks = filterGroupDecMark(Object.keys(schema.marks));
    expect(nodes).toEqual(['doc', 'paragraph', 'text']);
    expect(marks).toEqual(['em', 'strong', 'strike']);
  });

  it('should allow custom node spec for built-in node type', () => {
    const listItem = {
      content: 'paragraph block*',
      parseDOM: [{ tag: 'div' }],
    };
    const nodesConfig = ['doc', 'paragraph', 'text'];
    const schema = createSchema({
      nodes: nodesConfig,
      customNodeSpecs: { listItem },
    });
    const nodes = Object.keys(schema.nodes);
    expect(nodes).toEqual(['doc', 'paragraph', 'text', 'listItem']);
    expect(schema.nodes.listItem.spec).toEqual(listItem);
  });

  it('should allow custom node spec', () => {
    const jiraIssue = {
      content: 'paragraph block*',
      parseDOM: [{ tag: 'div' }],
    };
    const nodesConfig = ['doc', 'paragraph', 'text'];
    const schema = createSchema({
      nodes: nodesConfig,
      customNodeSpecs: { jiraIssue },
    });
    const nodes = Object.keys(schema.nodes);
    expect(nodes).toEqual(['doc', 'paragraph', 'text', 'jiraIssue']);
  });

  it('should allow custom mark spec for built-in mark type', () => {
    const code = { ...codeBase, excludes: 'em' };
    const nodesConfig = ['doc', 'paragraph', 'text'];
    const marksConfig = ['em'];
    const schema = createSchema({
      nodes: nodesConfig,
      marks: marksConfig,
      customMarkSpecs: { code },
    });
    const marks = filterGroupDecMark(Object.keys(schema.marks));
    expect(marks).toEqual(['em', 'code']);
    expect(schema.marks.code.spec).toEqual(code);
  });

  it('should allow custom mark spec', () => {
    const monospace = { ...codeBase, excludes: 'em' };
    const nodesConfig = ['doc', 'paragraph', 'text'];
    const marksConfig = ['em'];
    const schema = createSchema({
      nodes: nodesConfig,
      marks: marksConfig,
      customMarkSpecs: { monospace },
    });
    const marks = filterGroupDecMark(Object.keys(schema.marks));
    expect(marks).toEqual(['em', 'monospace']);
    expect(schema.marks.monospace.spec).toEqual(monospace);
  });

  it('should allow only custom mark spec', () => {
    const code = { ...codeBase, excludes: '' };
    const nodesConfig = ['doc', 'paragraph', 'text'];
    const schema = createSchema({
      nodes: nodesConfig,
      customMarkSpecs: { code },
    });
    expect(schema.marks.code.spec).toEqual(code);
  });

  describe('fixNodeContentSchema', () => {
    it('excludes unsupported nodes in node content', () => {
      const nodes = {
        node1: {
          content: 'node1 | nodeDoesNotExist | node2 | anotherNodeDoesNotExist',
        },
        node2: {
          content: 'node2',
        },
      };
      const sanitizedNodes = sanitizeNodes(nodes, {});

      expect(sanitizedNodes).toEqual({
        node1: {
          content: 'node1 | node2',
        },
        node2: {
          content: 'node2',
        },
      });
    });

    it('excludes unsupported nodes in node content - 2', () => {
      const nodes = {
        node1: {
          content:
            '(node1 | nodeDoesNotExist | anotherNodeDoesNotExist | node2)*',
        },
        node2: {
          content: 'node2',
        },
      };
      const sanitizedNodes = sanitizeNodes(nodes, {});

      expect(sanitizedNodes).toEqual({
        node1: {
          content: '(node1 | node2)*',
        },
        node2: {
          content: 'node2',
        },
      });
    });

    it('does not generate invalid content', () => {
      const nodes = {
        node1: {
          content: 'nodeDoesNotExist | anotherNodeDoesNotExist',
        },
        node2: {
          content: 'node2 | nodeDoesNotExist',
        },
      };
      const sanitizedNodes = sanitizeNodes(nodes, {});

      expect(sanitizedNodes).toEqual({
        node1: {
          content: '',
        },
        node2: {
          content: 'node2',
        },
      });
    });

    it('should remove unsupported block from content', () => {
      const nodes = {
        node1: {
          content: '(node2 | unsupportedBlock){2,3} unsupportedBlock*',
        },
        node2: { content: 'node2' },
      };
      const content = '(node2 | unsupportedBlock){2,3} unsupportedBlock*';
      expect(sanitizeNodeSpecContent(nodes, content)).toEqual('(node2 ){2,3}');
    });

    it('modifies node immutably', () => {
      const nodeSpec = {
        content: 'nodeDoesNotExist',
      };
      const nodes = {
        node: nodeSpec,
      };
      const sanitizedNodes = sanitizeNodes(nodes, {});

      expect(sanitizedNodes).toEqual({
        node: {
          content: '',
        },
      });

      expect(nodeSpec).toEqual({
        content: 'nodeDoesNotExist',
      });
    });

    it('recognizes node from group', () => {
      const nodes = {
        node1: {
          content: 'inline+',
          group: 'block',
        },
        node2: {
          group: 'inline',
        },
      };
      const sanitizedNodes = sanitizeNodes(nodes, {});

      expect(sanitizedNodes).toEqual({
        node1: {
          content: 'inline+',
          group: 'block',
        },
        node2: {
          group: 'inline',
        },
      });
    });
  });
});
