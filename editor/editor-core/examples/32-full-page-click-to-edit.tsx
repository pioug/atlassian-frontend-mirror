import type { JSX } from 'react';

import { default as FullPageExample } from './5-full-page';

// eslint-disable-next-line jsdoc/require-jsdoc
export default function Example(): JSX.Element {
	return FullPageExample({ clickToEdit: true });
}
