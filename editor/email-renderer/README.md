# Email renderer

This package provides renderer that is capable of rendering email-friendly HTML from ADF documents.

## Usage

Use as follows:

```javascript
import { defaultSchema } from '@atlaskit/adf-schema';
import { EmailSerializer } from '@atlaskit/email-renderer/main';

const document = ... // Your ADF JSON document

const serializer = EmailSerializer.fromSchema(defaultSchema);
const node = defaultSchema.nodeFromJSON(document);
const result = serializer.serializeFragment(node.content);
```

## Development

Project consists of different `serializers` in order to render ADF into html

ADF `nodes` serializers are stored in `src/nodes`
ADF `marks` serializers are stored in `src/marks`

HTML rendering occurs via traversal of the ADF and calling the serializer corresponding to each visited ADF Node, as well as applying any `marks` that exist on a node.

### Adding new embedded images / icons

Static icon modules are checked in under `src/static/icons` and their SVG sources live in `src/static/svg`.

When adding or updating an embedded image, update the generated icon module(s) in `src/static/icons` to match the corresponding SVG asset.
