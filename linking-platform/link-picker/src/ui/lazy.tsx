import type { MemoExoticComponent } from 'react';

// oxlint-disable-next-line @atlassian/no-restricted-imports
import { lazyForPaint } from 'react-loosely-lazy';

import type { LinkPickerProps } from '../common/types';

import { composeLinkPicker } from './main';

const LazyLinkPickerComponent = lazyForPaint(() =>
	import(
		/* webpackChunkName: "@atlaskit-internal_link-picker" */
		'./link-picker'
	).then(({ LinkPicker }) => ({ default: LinkPicker })),
);

// Must be a default export to be able to support prop docs
// eslint-disable-next-line import/no-default-export
const _default_1: MemoExoticComponent<(props: LinkPickerProps) => JSX.Element> =
	composeLinkPicker(LazyLinkPickerComponent);
export default _default_1;
