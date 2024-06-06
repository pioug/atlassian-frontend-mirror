import type { ExtensionParams } from '@atlaskit/editor-common/extensions';

export interface PlaceholderComponentProps {
	createPromise: Function;
	extension: ExtensionParams<any>;
	renderFallback: Function;
}
