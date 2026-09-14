import ExcelSpreadsheetIcon from '@atlaskit/icon-file-type/glyph/excel-spreadsheet/24';
import ExecutableIcon from '@atlaskit/icon-file-type/glyph/executable/24';
import FigmaIcon from '@atlaskit/icon-file-type/glyph/figma/24';
import GifIcon from '@atlaskit/icon-file-type/glyph/gif/24';
import GoogleDocIcon from '@atlaskit/icon-file-type/glyph/google-doc/24';
import GoogleFormIcon from '@atlaskit/icon-file-type/glyph/google-form/24';
import GoogleSheetIcon from '@atlaskit/icon-file-type/glyph/google-sheet/24';
import GoogleSlideIcon from '@atlaskit/icon-file-type/glyph/google-slide/24';
import PdfDocumentIcon from '@atlaskit/icon-file-type/glyph/pdf-document/24';
import PowerpointPresentationIcon from '@atlaskit/icon-file-type/glyph/powerpoint-presentation/24';
import PresentationIcon from '@atlaskit/icon-file-type/glyph/presentation/24';
import SketchIcon from '@atlaskit/icon-file-type/glyph/sketch/24';
import SourceCodeIcon from '@atlaskit/icon-file-type/glyph/source-code/24';
import SpreadsheetIcon from '@atlaskit/icon-file-type/glyph/spreadsheet/24';
import WordDocumentIcon from '@atlaskit/icon-file-type/glyph/word-document/24';

import { isCodeViewerItem } from './isCodeViewerItem';

interface MimeTypesRepresentation {
	label: string;
	mimeTypes: string[];
	icon: any;
}

const mimeTypes: MimeTypesRepresentation[] = [
	{
		label: 'pdf',
		mimeTypes: ['application/pdf'],
		icon: PdfDocumentIcon,
	},
	{
		label: 'google-form',
		mimeTypes: ['application/vnd.google-apps.form'],
		icon: GoogleFormIcon,
	},
	{
		label: 'google-slides',
		mimeTypes: ['application/vnd.google-apps.presentation'],
		icon: GoogleSlideIcon,
	},
	{
		label: 'google-form',
		mimeTypes: ['application/vnd.google-apps.form'],
		icon: GoogleFormIcon,
	},
	{
		label: 'google-sheets',
		mimeTypes: ['application/vnd.google-apps.spreadsheet'],
		icon: GoogleSheetIcon,
	},
	{
		label: 'google-docs',
		mimeTypes: ['application/vnd.google-apps.document', 'application/vnd.google-apps.kix'],
		icon: GoogleDocIcon,
	},
	{
		label: 'microsoft-word',
		mimeTypes: ['application/msword', 'application/vnd.openxmlformats-officedocument.word'],
		icon: WordDocumentIcon,
	},
	{
		label: 'presentation',
		mimeTypes: [
			'application/x-iwork-keynote-sffkey',
			'application/vnd.oasis.opendocument.presentation',
		],
		icon: PresentationIcon,
	},
	{
		label: 'powerpoint-presentation',
		mimeTypes: [
			'application/vnd.openxmlformats-officedocument.presentationml.presentation',
			'application/vnd.ms-powerpoint',
		],
		icon: PowerpointPresentationIcon,
	},
	{
		label: 'giphy',
		mimeTypes: ['image/gif'],
		icon: GifIcon,
	},
	{
		label: 'spreadsheet',
		mimeTypes: ['text/csv'],
		icon: SpreadsheetIcon,
	},
	{
		label: 'excel-spreadsheet',
		mimeTypes: [
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'application/vnd.ms-excel',
			'application/x-iwork-keynote-sffnumbers',
		],
		icon: ExcelSpreadsheetIcon,
	},
];

/*
 * Returns a label and icon
 */
export function getMimeIcon(
	mimeType: string,
	fileName: string,
):
	| MimeTypesRepresentation
	| {
			label: string;
			icon: typeof SourceCodeIcon;
	  }
	| undefined {
	// based on the mimeType, determine the corresponding icon and label
	const iconInfo = mimeTypes.find((file) => file.mimeTypes.indexOf(mimeType) > -1);

	//return the appropriate icon and its label if we have it
	if (iconInfo) {
		return iconInfo;
	}

	if (isCodeViewerItem(fileName, mimeType)) {
		return { label: 'source-code', icon: SourceCodeIcon };
	}

	// we are not able to determine what icon to render based on the mimeType
	// hence we render the icon based on the filename
	if (fileName.match(/.*\.sketch$/)) {
		return { label: 'sketch', icon: SketchIcon };
	}
	if (fileName.match(/.*\.fig$/)) {
		return { label: 'figma', icon: FigmaIcon };
	}
	if (fileName.match(/.*\.exe$/) || fileName.match(/.*\.dmg$/)) {
		return { label: 'executable', icon: ExecutableIcon };
	}

	// cannot find a corresponding mimeType icon.
	return undefined;
}
