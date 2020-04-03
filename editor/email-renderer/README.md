# Email renderer

This package provides renderer that is capable of rendering email-friendly HTML from ADF documents.

## Usage

Use as follows:

```javascript
import { defaultSchema } from '@atlaskit/adf-schema';
import { EmailSerializer } from '@atlaskit/email-renderer';

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

This will generate static image modules that can be used to easily embed inside of email as part of a ADF node serializer, etc.

Currently uses a custom build process, which like this: `SVG -> PNG -> Base64 -> TypeScript Module`

- Add the source image to `src/static/svg` folder and to generator config `src/static/image-sources.ts`
- run `bolt run build:images`
