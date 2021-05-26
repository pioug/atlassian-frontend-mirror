# Editor Slack Transformer

This transformer allows encoding ProseMirror Node to [Slack markdown](https://api.slack.com/reference/surfaces/formatting#basics).

## Usage

```
import  { SlackTransformer } from '@atlaskit/editor-slack-transformer';

const serializer = new SlackTransformer();
// To encode editor content as Slack markdown
serializer.encode(editorContent);
```

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-slack-transformer).
