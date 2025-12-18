import React from 'react';

import DocumentFilledIcon from '@atlaskit/icon/core/file';
import { isConfluenceGenerator } from '@atlaskit/link-extractors';

import BlogIcon from '../../../common/ui/icons/blog-icon';
import PresentationIcon from '../../../common/ui/icons/chart-bar-icon';
import FileIcon from '../../../common/ui/icons/file-icon';
import SpreadsheetIcon from '../../../common/ui/icons/list-bullet-icon';
import LiveDocumentIcon from '../../../common/ui/icons/live-document-icon';
import DocumentIcon from '../../../common/ui/icons/page-icon';
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
			return <BlogIcon label={opts.showIconLabel ? opts.title || 'blog' : ''} testId="blog-icon" />;
		case 'schema:DigitalDocument':
			return digitalDocumentToIcon(opts);
		case 'schema:TextDigitalDocument':
			return (
				<DocumentIcon
					label={opts.showIconLabel ? opts.title || 'document' : ''}
					testId="document-icon"
				/>
			);
		case 'schema:PresentationDigitalDocument':
			return (
				<PresentationIcon
					label={opts.showIconLabel ? opts.title || 'presentation' : ''}
					testId="presentation-icon"
				/>
			);
		case 'schema:SpreadsheetDigitalDocument':
			return (
				<SpreadsheetIcon
					label={opts.showIconLabel ? opts.title || 'spreadsheet' : ''}
					testId="spreadsheet-icon"
				/>
			);
		case 'atlassian:Template':
			return (
				<DocumentFilledIcon
					color="currentColor"
					label={opts.showIconLabel ? opts.title || 'template' : ''}
					testId="document-filled-icon"
				/>
			);
		case 'atlassian:UndefinedLink':
			return (
				<DocumentIcon
					label={opts.showIconLabel ? opts.title || 'undefinedLink' : ''}
					testId="document-icon"
				/>
			);
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
		return <FileIcon label={opts.showIconLabel ? opts.title || 'file' : ''} testId="file-icon" />;
	}
};
