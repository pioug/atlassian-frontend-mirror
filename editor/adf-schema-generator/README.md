# ADF Schema Generator

This package provides a simple DSL (Domain Specific Language) for defining the schema,
that can be transformed into multiple output formats that are required to work with ADF (Atlassian Document Format):

- ADF JSON Schema
- ProseMirror Schema
- Validator Specs

## Usage

### DSL

The package exports several functions that can be used to define the schema:

#### Nodes and Marks:

- `adfNode` – defines a new ADF node
- `adfMark` – defines a new ADF mark

#### Groups:

- `adfNodeGroup` – defines a new ADF node group
- `adfMarkGroup` – defines a new ADF mark group

#### Content Expressions:

- `$or` - Create a content expression that allows any of the specified content items
- `$onePlus` - Create a content expression that allows one or more of the specified content items
- `$zeroPlus` - Create a content expression that allows zero or more of the specified content items
- `$range` – Create a content expression that allows to limit number of children

#### Nodes and Variants:

There is quite often a need to define a slightly different version of the node. E.g.:

- A feature flag to enable/disable certain attributes on a node
- Stricter validation for a specific use case, like allowing certain marks on a top level node,
  and not allowing them on a nested variant of the same node.

Variants enable this use case.

Each variant shallowly overrides the base node spec.
And then can be used via `node.use('variant_name')` method.

Adding new variant to a node definition doesn't, by default, affect the output schemas.
The variant must be explicitly used in the schema definition via `node.use('variant_name')`.

```typescript
const paragraph = adfNode('paragraph')
  .define({
    group: blockGroup,
    content: [$zeroPlus($or(text))],
  })
  // Defines a variant of the node called 'with-attrs'
  .variant('with-attrs', {
    attrs: {
      alignment: {
        type: 'enum',
        values: ['start', 'end', 'center', 'justify'],
        default: 'start',
      },
    },
  });

// paragraphWithAttrs now references a new instance of the ADFNode with the 'with-attrs' variant applied.
const paragraphWithAttrs = paragraph.use('with-attrs');
const name = paragraphWithAttrs.getName(); // paragraph_with-attrs_node (name includes node type and variant name)

// Both base and a variant can be used in the schema definition, even as children of the same node:
const doc = adfNode('doc').define({
  root: true,
  content: [$onePlus($or(paragraph, paragraphWithAttrs))],
  //                                ^ Variant is explicitly used here
});

// This is similar to a union type in TypeScript, where you can have a type that is either one type or another.
```

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

const codeMark = adfMark('code').define();

const text = adfNode('text').define({
  marks: [codeMark],
});

const paragraph = adfNode('paragraph')
  .define({
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

const blockGroup = adfNodeGroup('block', [paragraph]);

const doc = adfNode('doc').define({
  root: true,
  content: [$onePlus($or(blockGroup))],
});
```

### Stage 0

Stage 0 schema is an experimental super-set of the full schema.
It is used to test new features and is not guaranteed to be stable.

There are 2 ways to define a stage 0 node.

#### 1. Using inline `stage0` node spec override:

Inline `stage0` spec is a shallow override of the base node spec.
Which will produce, for the following example, 2 PM node specs: `paragraph` and `paragraphStage0`.

```typescript
const paragraph = adfNode('paragraph').define({
  content: [$zeroPlus($or(text))],
  stage0: {
    attrs: {
      alignment: {
        type: 'enum',
        values: ['start', 'end', 'center', 'justify'],
        default: 'start',
      },
    },
  },
});
```

Using inline stage0 override is a preferred way to modify/extend the node spec
it simplifies future promotion to the full schema.

#### 2. Marking the whole node as stage 0

Marking node as `stage0: true` will only output the stage 0 node spec. It will not appear in full json schema.
Marking the whole node as stage0 is the preferred way to introduce new nodes to ADF schema.

```typescript
const paragraph = adfNode('paragraph').define({
  content: [$zeroPlus($or(text))],
  stage0: true,
});
```

### Traverse

The schema can be traversed to generate the output formats:

Traverse accepts a root node of the ADF DSL tree and a visitor object.
Visitor is a pattern that is commonly used in tree traversal algorithms.
It allows to separate the traversal logic from the actual processing logic.

```typescript
import { traverse } from '@atlaskit/adf-schema-generator';

traverse(doc, {
  node: (node, variant, children) => {
    return node.type;
  },
  group: (group, children) => {
    return group.name;
  },
  $or: (children) => {
    return children.join(' | ');
  },
});
```

### Terminology

- `@DSLCompatibilityException`: This annotation marks special cases made by transformers during DSL conversion that address temporary compatibility issues with specific target schemas. It serves as a tracking mechanism to identify, prioritize, and eliminate these exceptions as the DSL evolves to encompass these special cases.

## Publishing

Version bumps and publishing are managed through the changesets workflow.
