# Editor Wikimarkup Transformer

This transformer allows __encoding__ Prosemirror node -> Wikimarkup and __parsing__ Wikimarkup -> Prosemirror node.

Some nodes support roundtripping, where it has capability of transforming to and from each syntax.

## Usage

### Encoding ADF to Wikimarkup

```js
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';

const transformer = new WikiMarkupTransformer(schema);
const wikimarkupString = transformer.encode(pmNode); // A Wikimarkup string representing the Prosemirror node output
```

### Parsing Wikimarkup to ADF

```js
import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';

const transformer = new WikiMarkupTransformer(schema);
const pmNode = transformer.parse(wikiMarkup); // A prosemirror node is output
```

## Development

This project consists of `encoders` and `parsers` in order to tranform between ADF and Wikimarkup.

 * If converting to Wikimarkup, encoders are stored in `src/encoder`
 * If converting from Wikimarkup, parsers are stored in `src/parser`

 In each of these locations, you can find the `nodes` and `marks` for each component.

## Testing

The tests for this project is stored in `src/__tests__`.

## More info

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-wikimarkup-transformer).
