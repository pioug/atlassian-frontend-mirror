# Link Picker @atlaskit/link-picker

> ⚠️ Currently under active development, use at your own risk ⚠️

The standalone link picker component allows users to insert relevant links without having to leave their current context. 

### Usage

```
import { LinkPicker } from '@atlaskit/link-picker';

const onSubmit = (href, title, displayText, inputMethod) => {...}

<LinkPicker onSubmit={onSubmit} />

```

### Props

```
{
  onSubmit?: (
    href: string,
    title: string | undefined,
    displayText: string | undefined,
    inputMethod: LinkInputType,
  ) => void;
  plugins?: [LinkPickerPlugin];
  displayUrl?: string;
}
```
