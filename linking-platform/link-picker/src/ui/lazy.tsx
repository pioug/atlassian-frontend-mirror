import { lazyForPaint } from 'react-loosely-lazy';

import { composeLinkPicker } from './main';

const LazyLinkPickerComponent = lazyForPaint(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_link-picker" */
		'./link-picker'
	).then(({ LinkPicker }) => ({ default: LinkPicker })),
);

// Must be a default export to be able to support prop docs
// eslint-disable-next-line import/no-default-export
export default composeLinkPicker(LazyLinkPickerComponent);
