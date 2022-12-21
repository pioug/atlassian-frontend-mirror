# Editor palette

When adding support for themed content to tooling which interacts with
adf content -- the decision was made to treat existing hex codes as a
unique id, and link them to design tokens which have theme specific
versions.

By providing a design token, this enables ADF content to be rendered in new themes such as dark mode.

## Usage

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/editor/editor-palette).

### APIs

### Installation

```sh
yarn add @atlaskit/editor-palette
```

#### hexToBackgroundPaletteColor

This takes an adf hex color and returns a matching background palette color.

```ts
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';

const cssValue = hexToBackgroundPaletteColor('#FFFFFF');
//     ^? const cssValue: 'var(--ds-surface, #FFFFFF)'
<div style={{backgroundColor: cssValue}} />
```

The names of tokens can change over time, and the values of tokens will differ between themes.
The exact output of this function is an implementation detail and should only be used when rendering
content to the user, on a client with a matching major version of `@atlaskit/tokens`.
- **DO NOT**: store the output of these functions in any user-generated content or back-end.
- **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color


#### hexToTextPaletteColor

This takes an adf hex color and returns a matching text palette color.

```ts
import { hexToEditorTextPaletteColor } from '@atlaskit/editor-palette';

const cssValue = hexToEditorTextPaletteColor('#0747A6');
//     ^? const cssValue: 'var(--ds-text-accent-blue, #0747A6)'
<span style={{textColor: cssValue}} />
```

The names of tokens can change over time, and the values of tokens will differ between themes.
The exact output of this function is an implementation detail and should only be used when rendering
content to the user, on a client with a matching major version of `@atlaskit/tokens`.
- **DO NOT**: store the output of these functions in any user-generated content or back-end.
- **DO**: store the ADF hex color, and use these utilities at render time to display the themed version of the color
