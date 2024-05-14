# ADF Schema Generator

This package provides a simple DSL (Domain Specific Language) for defining the schema,
that can be transformed into multiple output formats that are required to work with ADF (Atlassian Document Format):

- ADF JSON Schema
- ProseMirror Schema
- Validator Specs

## Usage

### DSL

The package exports several functions that can be used to define the schema:

Nodes and Marks:

- `adfNode` â€“ defines a new ADF node
- `adfMark` â€“ defines a new ADF mark

Groups:

- `adfNodeGroup` â€“ defines a new ADF node group
- `adfMarkGroup` â€“ defines a new ADF mark group

Content Expressions:

- `$or` - Create a content expression that allows any of the specified content items
- `$onePlus` - Create a content expression that allows one or more of the specified content items
- `$zeroPlus` - Create a content expression that allows zero or more of the specified content items
- `$range` â€“ Create a content expression that allows to limit number of children

#### Example

```typescript
import {
  adfNode,
  adfMark,
  adfNodeGroup,
  $or,
  $onePlus,
  $zeroPlus,
} from '@atlaskit/adf-schema-generator';

const blockGroup = adfNodeGroup('block');

const codeMark = adfMark('code').define();

const text = adfNode('text').define({
  marks: [codeMark],
});

const paragraph = adfNode('paragraph')
  .define({
    group: blockGroup,
    content: [$zeroPlus($or(text))],
  })
  .variant('with-attrs', {
    attrs: {
      alignment: {
        type: 'enum',
        values: ['start', 'end', 'center', 'justify'],
        default: 'start',
      },
    },
  });

const doc = adfNode('doc').define({
  root: true,
  content: [$onePlus($or(blockGroup))],
});
```

### Traverse

The schema can be traversed to generate the output formats:

```typescript
import { traverse } from '@atlaskit/adf-schema-generator';

traverse(doc, {
  node: (node, variant, children) => {
    return node.type;
  },
  group: (group, children) => {
    return group.name;
  },
  content: (content, children) => {
    return `(${children.join(' | ')})+`;
  },
});
```

### Transformations

#### ADF JSON Schema

[] TODO

#### ProseMirror Schema

[] TODO

#### Validator Specs

[] TODO
