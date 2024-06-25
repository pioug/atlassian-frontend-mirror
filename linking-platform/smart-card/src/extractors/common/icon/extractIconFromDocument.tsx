import React from 'react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import BlogIcon from '@atlaskit/icon-object/glyph/blog/16';
import FileIcon from '@atlaskit/icon-file-type/glyph/generic/16';
import PresentationIcon from '@atlaskit/icon-file-type/glyph/presentation/16';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import DocumentIcon from '@atlaskit/icon-file-type/glyph/document/16';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

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

	if (getBooleanFF('platform.linking-platform.smart-card.standardise-smart-link-icon-behaviour')) {
		return prioritiseIcon<React.ReactNode>({
			fileFormatIcon: iconFromFileFormat,
			documentTypeIcon: iconFromType,
			urlIcon: opts.icon,
			providerIcon: iconFromProvider,
		});
	}
	// If we encounter a native provider, we privilege the
	// icon generated by its type. Otherwise, we privilege the
	// provider icon, followed by the type & mime type icons.
	if (opts.priority === 'provider') {
		return iconFromProvider || iconFromFileFormat || iconFromType;
	}
	return iconFromFileFormat || iconFromType || opts.icon || iconFromProvider;
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
			return <FileIcon label={opts.title || 'file'} testId="file-icon" />;
		case 'schema:TextDigitalDocument':
			return <DocumentIcon label={opts.title || 'document'} testId="document-icon" />;
		case 'schema:PresentationDigitalDocument':
			return <PresentationIcon label={opts.title || 'presentation'} testId="presentation-icon" />;
		case 'schema:SpreadsheetDigitalDocument':
			return <SpreadsheetIcon label={opts.title || 'spreadsheet'} testId="spreadsheet-icon" />;
		case 'atlassian:Template':
			return <DocumentFilledIcon label={opts.title || 'template'} testId="document-filled-icon" />;
		case 'atlassian:UndefinedLink':
			return <DocumentIcon label={opts.title || 'undefinedLink'} testId="document-icon" />;
	}
};
