/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * To change the format of this file, modify `createDeprecatedIconDocs` in icon-build-process/src/create-deprecated-icon-docs.tsx.
 *
 * @codegen <<SignedSource::8236f283e88f1b5269e1bb00e04aff39>>
 * @codegenCommand yarn build:icon-glyphs
 */
const deprecatedIcons: Record<string, { message: string; unfixable?: boolean }> = {
	'@atlaskit/icon/utility/drag-handle': {
		message:
			'The icon "drag-handle" is deprecated in favour of "drag-handle-vertical" from “@atlaskit/icon/utility”',
	},
	'@atlaskit/icon/utility/migration/drag-handle--drag-handler': {
		message:
			'The icon "drag-handle--drag-handler" is deprecated, Please refer to the changelog for guidance on how to migrate. https://atlassian.design/components/icon/changelog',
		unfixable: true,
	},
};

export default deprecatedIcons;
