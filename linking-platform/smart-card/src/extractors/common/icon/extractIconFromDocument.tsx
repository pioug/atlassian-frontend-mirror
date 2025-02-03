import React from 'react';

import DocumentIcon from '@atlaskit/icon-file-type/glyph/document/16';
import FileIcon from '@atlaskit/icon-file-type/glyph/generic/16';
import PresentationIcon from '@atlaskit/icon-file-type/glyph/presentation/16';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import LiveDocumentIcon from '@atlaskit/icon-lab/core/page-live-doc';
import BlogIcon from '@atlaskit/icon-object/glyph/blog/16';
import DocumentFilledIcon from '@atlaskit/icon/core/migration/page--document-filled';
import { isConfluenceGenerator } from '@atlaskit/link-extractors';

import { getIconForFileType } from '../../../utils';

import { type IconOpts } from './extractIcon';
import { prioritiseIcon } from './prioritiseIcon';

export type DocumentType =
	| 'Document'
	| 'schema:BlogPosting'
	| 'schema:DigitalDocument'
	| 'schema:TextDigitalDocument'
	| 'schema:PresentationDigitalDocument'
	| 'schema:SpreadsheetDigitalDocument'
	| 'atlassian:Template'
	| 'atlassian:UndefinedLink';

/**
 * Extracts an icon for a document pbject
 *
 * @param type - The type of the document.
 * @param opts - The options for extracting the icon.
 * @returns The React node representing the extracted icon, or `undefined` if no icon is found.
 */
export const extractIconFromDocument = (
	type: DocumentType,
	opts: IconOpts,
): React.ReactNode | undefined => {
	const iconFromType = documentTypeToIcon(type, opts);
	const iconFromFileFormat = documentFileFormatToIcon(opts);
	const iconFromProvider = opts.provider && opts.provider.icon;

	return prioritiseIcon<React.ReactNode>({
		fileFormatIcon: iconFromFileFormat,
		documentTypeIcon: iconFromType,
		urlIcon: opts.icon,
		providerIcon: iconFromProvider,
	});
};
const documentFileFormatToIcon = (opts: IconOpts): React.ReactNode | undefined => {
	if (opts.fileFormat) {
		return getIconForFileType(opts.fileFormat);
	}
};
const documentTypeToIcon = (type: DocumentType, opts: IconOpts): React.ReactNode | undefined => {
	switch (type) {
		case 'schema:BlogPosting':
			return <BlogIcon label={opts.title || 'blog'} testId="blog-icon" />;
		case 'schema:DigitalDocument':
			return digitalDocumentToIcon(opts);
		case 'schema:TextDigitalDocument':
			return <DocumentIcon label={opts.title || 'document'} testId="document-icon" />;
		case 'schema:PresentationDigitalDocument':
			return <PresentationIcon label={opts.title || 'presentation'} testId="presentation-icon" />;
		case 'schema:SpreadsheetDigitalDocument':
			return <SpreadsheetIcon label={opts.title || 'spreadsheet'} testId="spreadsheet-icon" />;
		case 'atlassian:Template':
			return (
				<DocumentFilledIcon
					color="currentColor"
					label={opts.title || 'template'}
					testId="document-filled-icon"
				/>
			);
		case 'atlassian:UndefinedLink':
			return <DocumentIcon label={opts.title || 'undefinedLink'} testId="document-icon" />;
	}
};

/**
 * Enables providers to represent `schema:DigitalDocument` in a manner which
 * aligns with their customers when representing provider-specific types, which
 * do not apply across multiple providers.
 * @example Confluence digital documents represent 'live documents', specific to Confluence.
 * @remark This mechanism will be superseded by backend-driven icon URLs as part
 * of go/j/MODES-5864. Do not add more!
 */
const digitalDocumentToIcon = (opts: IconOpts): React.ReactNode => {
	if (opts.provider?.id && isConfluenceGenerator(opts.provider.id)) {
		return <LiveDocumentIcon label="live-doc" testId="live-doc-icon" />;
	} else {
		return <FileIcon label={opts.title || 'file'} testId="file-icon" />;
	}
};
