import React, { type ComponentPropsWithoutRef } from 'react';

import DocumentIconOld from '@atlaskit/icon-file-type/glyph/document/16';
import FileIconOld from '@atlaskit/icon-file-type/glyph/generic/16';
import PresentationIconOld from '@atlaskit/icon-file-type/glyph/presentation/16';
import SpreadsheetIconOld from '@atlaskit/icon-file-type/glyph/spreadsheet/16';
import LiveDocumentIcon from '@atlaskit/icon-lab/core/page-live-doc';
import BlogIconOld from '@atlaskit/icon-object/glyph/blog/16';
import DocumentFilledIconNew from '@atlaskit/icon/core/migration/file--document-filled';
import DocumentFilledIconOld from '@atlaskit/icon/core/migration/page--document-filled';
import { isConfluenceGenerator } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import BlogIconNew from '../../../common/ui/icons/blog-icon';
import PresentationIconNew from '../../../common/ui/icons/chart-bar-icon';
import FileIconNew from '../../../common/ui/icons/file-icon';
import SpreadsheetIconNew from '../../../common/ui/icons/list-bullet-icon';
import DocumentIconNew from '../../../common/ui/icons/page-icon';
import { getIconForFileType } from '../../../utils';

import { type IconOpts } from './extractIcon';
import { prioritiseIcon } from './prioritiseIcon';

// TODO Delete this and rename BlogIconNew to BlogIcon when cleaning platform-smart-card-icon-migration
const BlogIcon = (props: { label: string; testId: string }) => {
	if (fg('platform-smart-card-icon-migration')) {
		return <BlogIconNew {...props} />;
	}

	return <BlogIconOld {...props} />;
};

// TODO Delete this and rename FileIconNew to FileIcon when cleaning platform-smart-card-icon-migration
const FileIcon = (props: { label: string; testId: string }) => {
	if (fg('platform-smart-card-icon-migration')) {
		return <FileIconNew {...props} />;
	}

	return <FileIconOld {...props} />;
};

// TODO Delete this and rename DocumentIconNew to DocumentIcon when cleaning platform-smart-card-icon-migration
const DocumentIcon = (props: { label: string; testId: string }) => {
	if (fg('platform-smart-card-icon-migration')) {
		return <DocumentIconNew {...props} />;
	}

	return <DocumentIconOld {...props} />;
};

// TODO Delete this and rename PresentationIconNew to PresentationIcon when cleaning platform-smart-card-icon-migration
const PresentationIcon = (props: { label: string; testId: string }) => {
	if (fg('platform-smart-card-icon-migration')) {
		return <PresentationIconNew {...props} />;
	}

	return <PresentationIconOld {...props} />;
};

// TODO Delete this and rename SpreadsheetIconNew to SpreadsheetIcon when cleaning platform-smart-card-icon-migration
const SpreadsheetIcon = (props: { label: string; testId: string }) => {
	if (fg('platform-smart-card-icon-migration')) {
		return <SpreadsheetIconNew {...props} />;
	}

	return <SpreadsheetIconOld {...props} />;
};

// TODO Delete this and rename DocumentFilledIconNew to DocumentFilledIcon when cleaning platform-smart-card-icon-migration
const DocumentFilledIcon = (props: {
	label: string;
	testId: string;
	color?: ComponentPropsWithoutRef<typeof DocumentFilledIconNew>['color'];
}) => {
	if (fg('platform-smart-card-icon-migration')) {
		return <DocumentFilledIconNew {...props} />;
	}

	return <DocumentFilledIconOld {...props} />;
};

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
