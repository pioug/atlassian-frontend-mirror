// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { jsx } from '@emotion/react';

import { default as FullPageExample } from './5-full-page';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function Example(): jsx.JSX.Element {
	return FullPageExample({ clickToEdit: true });
}
