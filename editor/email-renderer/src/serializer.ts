import { type Fragment } from '@atlaskit/editor-prosemirror/model';

export interface Serializer<T> {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	serializeFragment(fragment: Fragment, props?: any, target?: any, key?: string): T | null;
}

export type MediaImageBase64 = {
	contentId: string;
	contentType: string;
	data: string;
};

export interface SerializeFragmentWithAttachmentsResult {
	result: string | null;
	embeddedImages: MediaImageBase64[];
}

export interface SerializerWithImages<T> extends Serializer<T> {
	serializeFragmentWithImages(
		fragment: Fragment,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		props?: any,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		target?: any,
		key?: string,
	): SerializeFragmentWithAttachmentsResult | null;
}
