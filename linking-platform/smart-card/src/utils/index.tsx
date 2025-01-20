import React from 'react';

import Loadable from 'react-loadable';

import { fg } from '@atlaskit/platform-feature-flags';
import { type ActiveThemeState, themeObjectToString } from '@atlaskit/tokens';

import { IconType, SmartLinkSize } from '../constants';
import extractFileFormatIcon from '../extractors/flexible/icon/extract-file-formatIcon';

export const isSpecialEvent = (evt: React.MouseEvent | React.KeyboardEvent) =>
	evt.isDefaultPrevented() &&
	(isIframe() || isSpecialKey(evt) || isSpecialClick(evt as React.MouseEvent));

export const isIframe = () => window.parent !== parent;

/**
 * Meta key = cmd on mac, windows key on windows
 * Ctrl key on mac by default triggers a right click instead of left click
 * Ctrl key on Windows has the same behaviour of cmd key of mac (open in new tab)
 * Shift key is also a "special" key because the default behavior of Chromium-based browsers is to open the
 * link in a new window; Arc browser has custom logic to show links in its "peek" window when shift is held.
 *
 * `isSpecialKey` on a mouse event on mac with default behaviour should be equivalent to opening in new tab
 * On Windows it will be equivalent to opening a new tab, unless its the Window key that is held
 * in which case typically only a standard clickthrough will occur, this is likely a small portion of events
 */
export const isSpecialKey = (event: React.MouseEvent | React.KeyboardEvent) => {
	return fg('platform-smart-card-shift-key')
		? event.metaKey || event.ctrlKey || event.shiftKey
		: event.metaKey || event.ctrlKey;
};

export const isSpecialClick = (event: React.MouseEvent) => event.button === 1;

export const getIconForFileType = (fileMimeType: string): React.ReactNode | undefined => {
	if (!fileMimeType) {
		return;
	}
	let icon = fg('platform-smart-card-icon-migration')
		? getTypeToIconMap(fileMimeType.toLowerCase())
		: typeToIcon[fileMimeType.toLowerCase()];
	if (!icon) {
		return;
	}

	const [label, importCb] = icon;

	if (!importCb) {
		return;
	}

	const Icon = Loadable({
		loader: () => importCb().then((module) => module.default),
		loading: () => null,
	}) as any; // because we're using dynamic loading here, TS will not be able to infer the type

	return (<Icon label={label} testId="document-file-format-icon" />) as React.ReactNode;
};

export const getLabelForFileType = (fileMimeType: string): React.ReactNode | undefined => {
	let icon = fg('platform-smart-card-icon-migration')
		? getTypeToIconMap(fileMimeType.toLowerCase())
		: typeToIcon[fileMimeType.toLowerCase()];
	if (!icon) {
		return;
	}

	const [label] = icon;

	return label;
};

type IconLabelMap = [string, (() => Promise<any>) | undefined];

const typeToIcon: { [key: string]: IconLabelMap } = {
	'text/plain': ['Document', () => import('@atlaskit/icon-file-type/glyph/document/16')],
	'application/vnd.oasis.opendocument.text': [
		'Document',
		() => import('@atlaskit/icon-file-type/glyph/document/16'),
	],
	'application/vnd.apple.pages': [
		'Document',
		() => import('@atlaskit/icon-file-type/glyph/document/16'),
	],
	'application/vnd.google-apps.document': [
		'Google Doc',
		() => import('@atlaskit/icon-file-type/glyph/google-doc/16'),
	],
	'application/msword': [
		'Word document',
		() => import('@atlaskit/icon-file-type/glyph/word-document/16'),
	],
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
		'Word document',
		() => import('@atlaskit/icon-file-type/glyph/word-document/16'),
	],
	'application/pdf': [
		'PDF document',
		() => import('@atlaskit/icon-file-type/glyph/pdf-document/16'),
	],
	'application/vnd.oasis.opendocument.spreadsheet': [
		'Spreadsheet',
		() => import('@atlaskit/icon-file-type/glyph/spreadsheet/16'),
	],
	'application/vnd.apple.numbers': [
		'Spreadsheet',
		() => import('@atlaskit/icon-file-type/glyph/spreadsheet/16'),
	],
	'application/vnd.google-apps.spreadsheet': [
		'Google Sheet',
		() => import('@atlaskit/icon-file-type/glyph/google-sheet/16'),
	],
	'application/vnd.ms-excel': [
		'Excel spreadsheet',
		() => import('@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
	],
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
		'Excel spreadsheet',
		() => import('@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
	],
	'application/vnd.oasis.opendocument.presentation': [
		'Presentation',
		() => import('@atlaskit/icon-file-type/glyph/presentation/16'),
	],
	'application/vnd.apple.keynote': [
		'Presentation',
		() => import('@atlaskit/icon-file-type/glyph/presentation/16'),
	],
	'application/vnd.google-apps.presentation': [
		'Google Slide',
		() => import('@atlaskit/icon-file-type/glyph/google-slide/16'),
	],
	'application/vnd.ms-powerpoint': [
		'PowerPoint presentation',
		() => import('@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
	],
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
		'PowerPoint presentation',
		() => import('@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
	],
	'application/vnd.google-apps.form': [
		'Google Form',
		() => import('@atlaskit/icon-file-type/glyph/google-form/16'),
	],
	'image/png': ['Image', () => import('@atlaskit/icon-file-type/glyph/image/16')],
	'image/jpeg': ['Image', () => import('@atlaskit/icon-file-type/glyph/image/16')],
	'image/bmp': ['Image', () => import('@atlaskit/icon-file-type/glyph/image/16')],
	'image/webp': ['Image', () => import('@atlaskit/icon-file-type/glyph/image/16')],
	'image/svg+xml': ['Image', () => import('@atlaskit/icon-file-type/glyph/image/16')],
	'image/gif': ['GIF', () => import('@atlaskit/icon-file-type/glyph/gif/16')],
	'audio/midi': ['Audio', () => import('@atlaskit/icon-file-type/glyph/audio/16')],
	'audio/mpeg': ['Audio', () => import('@atlaskit/icon-file-type/glyph/audio/16')],
	'audio/webm': ['Audio', () => import('@atlaskit/icon-file-type/glyph/audio/16')],
	'audio/ogg': ['Audio', () => import('@atlaskit/icon-file-type/glyph/audio/16')],
	'audio/wav': ['Audio', () => import('@atlaskit/icon-file-type/glyph/audio/16')],
	'video/mp4': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'video/quicktime': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'video/mov': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'video/webm': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'video/ogg': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'video/x-ms-wmv': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'video/x-msvideo': ['Video', () => import('@atlaskit/icon-file-type/glyph/video/16')],
	'application/zip': ['Archive', () => import('@atlaskit/icon-file-type/glyph/archive/16')],
	'application/x-tar': ['Archive', () => import('@atlaskit/icon-file-type/glyph/archive/16')],
	'application/x-gtar': ['Archive', () => import('@atlaskit/icon-file-type/glyph/archive/16')],
	'application/x-7z-compressed': [
		'Archive',
		() => import('@atlaskit/icon-file-type/glyph/archive/16'),
	],
	'application/x-apple-diskimage': [
		'Archive',
		() => import('@atlaskit/icon-file-type/glyph/archive/16'),
	],
	'application/vnd.rar': ['Archive', () => import('@atlaskit/icon-file-type/glyph/archive/16')],
	'application/dmg': ['Executable', () => import('@atlaskit/icon-file-type/glyph/executable/16')],
	'text/css': ['Source Code', () => import('@atlaskit/icon-file-type/glyph/source-code/16')],
	'text/html': ['Source Code', () => import('@atlaskit/icon-file-type/glyph/source-code/16')],
	'application/javascript': [
		'Source Code',
		() => import('@atlaskit/icon-file-type/glyph/source-code/16'),
	],
	'application/octet-stream': [
		'Binary file',
		() => import('@atlaskit/icon-file-type/glyph/generic/16'),
	],
	'application/invision.prototype': [
		'Prototype',
		() => import('@atlaskit/icon-file-type/glyph/generic/16'),
	],

	// TODO: Figure a way to detect those
	'application/sketch': ['Sketch', () => import('@atlaskit/icon-file-type/glyph/sketch/16')],

	folder: ['Folder', () => import('@atlaskit/icon-file-type/glyph/folder/16')],
};

// prettier-ignore
export const getLazyIcons = (): Partial<
	Record<
		IconType,
		{
			default: () => Promise<unknown>;
			large?: () => Promise<unknown>;
		}
	>
> => {
	return {
		[IconType.Document]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_page-icon" */ '../common/ui/icons/page-icon'),
		},
		[IconType.Blog]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBlock" */ '../common/ui/icons/blog-icon'),
		},
		[IconType.Audio]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_audio-icon" */ '../common/ui/icons/audio-icon'),
		},
		[IconType.Code]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_angle-brackets-icon" */ '../common/ui/icons/angle-brackets-icon'),
		},
		[IconType.File]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_file-icon" */ '../common/ui/icons/file-icon'),
		},
		[IconType.Folder]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_folder-icon" */ '../common/ui/icons/folder-icon'),
		},
		[IconType.Generic]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_file-icon" */ '../common/ui/icons/file-icon'),
		},
		[IconType.Image]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_image-icon" */ '../common/ui/icons/image-icon'),
		},
		[IconType.Presentation]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_chart-bar-icon" */ '../common/ui/icons/chart-bar-icon'),
		},
		[IconType.Spreadsheet]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_list-bullet-icon" */ '../common/ui/icons/list-bullet-icon'),
		},
		[IconType.Video]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_video-icon" */ '../common/ui/icons/video-icon'),
		},
		[IconType.Project]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProject" */ '@atlaskit/icon/core/migration/people-group'),
		},
		[IconType.Template]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphTemplate" */ '@atlaskit/icon/core/migration/file--document-filled'),
		},

		[IconType.Forbidden]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphForbidden" */ '@atlaskit/icon/core/migration/lock-locked--lock-filled'),
		},
		[IconType.Default]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphDefault" */ '@atlaskit/icon/core/migration/link'),
		},
		[IconType.Archive]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphArchive" */ '@atlaskit/icon-file-type/glyph/archive/16'),
			large: 	() => import(/* webpackChunkName: "@atlaskit-internal_glyphArchive" */ '@atlaskit/icon-file-type/glyph/archive/24'),
		},
		[IconType.Executable]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphExecutable" */ '@atlaskit/icon-file-type/glyph/executable/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphExecutable" */ '@atlaskit/icon-file-type/glyph/executable/24'),
		},
		[IconType.GIF]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGIF" */ '@atlaskit/icon-file-type/glyph/gif/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGIF" */ '@atlaskit/icon-file-type/glyph/gif/24'),
		},
		[IconType.GoogleDocs]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleDocs" */ '@atlaskit/icon-file-type/glyph/google-doc/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleDocs" */ '@atlaskit/icon-file-type/glyph/google-doc/24'),
		},
		[IconType.GoogleForms]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleForms" */ '@atlaskit/icon-file-type/glyph/google-form/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleForms" */ '@atlaskit/icon-file-type/glyph/google-form/24'),
		},
		[IconType.GoogleSheets]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleSheets" */ '@atlaskit/icon-file-type/glyph/google-sheet/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleSheets" */ '@atlaskit/icon-file-type/glyph/google-sheet/24'),
		},
		[IconType.GoogleSlides]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleSlides" */ '@atlaskit/icon-file-type/glyph/google-slide/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphGoogleSlides" */ '@atlaskit/icon-file-type/glyph/google-slide/24'),
		},
		[IconType.MSExcel]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphMSExcel" */ '@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphMSExcel" */ '@atlaskit/icon-file-type/glyph/excel-spreadsheet/24'),
		},
		[IconType.MSPowerpoint]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphMSPowerpoint" */ '@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphMSPowerpoint" */ '@atlaskit/icon-file-type/glyph/powerpoint-presentation/24'),
		},
		[IconType.MSWord]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphMSWord" */ '@atlaskit/icon-file-type/glyph/word-document/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphMSWord" */ '@atlaskit/icon-file-type/glyph/word-document/24'),
		},
		[IconType.PDF]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphPDF" */ '@atlaskit/icon-file-type/glyph/pdf-document/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphPDF" */ '@atlaskit/icon-file-type/glyph/pdf-document/24'),
		},
		[IconType.Sketch]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSketch" */ '@atlaskit/icon-file-type/glyph/sketch/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSketch" */ '@atlaskit/icon-file-type/glyph/sketch/24'),
		},
		// Bitbucket icons
		[IconType.Branch]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBranch" */ '@atlaskit/icon-object/glyph/branch/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBranch" */ '@atlaskit/icon-object/glyph/branch/24'),
		},
		[IconType.Commit]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphCommit" */ '@atlaskit/icon-object/glyph/commit/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphCommit" */ '@atlaskit/icon-object/glyph/commit/24'),
		},
		[IconType.PullRequest]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphPullRequest" */ '@atlaskit/icon-object/glyph/pull-request/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphPullRequest" */ '@atlaskit/icon-object/glyph/pull-request/24'),
		},
		[IconType.Repo]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphRepo" */ '@atlaskit/icon-object/glyph/code/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphRepo" */ '@atlaskit/icon-object/glyph/code/24'),
		},
		// Jira icons
		[IconType.Bug]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBug" */ '@atlaskit/icon-object/glyph/bug/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBug" */ '@atlaskit/icon-object/glyph/bug/24'),
		},
		[IconType.Change]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphChange" */ '@atlaskit/icon-object/glyph/changes/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphChange" */ '@atlaskit/icon-object/glyph/changes/24'),
		},
		[IconType.Epic]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphEpic" */ '@atlaskit/icon-object/glyph/epic/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphEpic" */ '@atlaskit/icon-object/glyph/epic/24'),
		},
		[IconType.Incident]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphIncident" */ '@atlaskit/icon-object/glyph/incident/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphIncident" */ '@atlaskit/icon-object/glyph/incident/24'),
		},
		[IconType.Problem]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProblem" */ '@atlaskit/icon-object/glyph/problem/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProblem" */ '@atlaskit/icon-object/glyph/problem/24'),
		},
		[IconType.ServiceRequest]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphServiceRequest" */ '@atlaskit/icon-object/glyph/issue/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphServiceRequest" */ '@atlaskit/icon-object/glyph/issue/24'),
		},
		[IconType.Story]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphStory" */ '@atlaskit/icon-object/glyph/story/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphStory" */ '@atlaskit/icon-object/glyph/story/24'),
		},
		[IconType.SubTask]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSubTask" */ '@atlaskit/icon-object/glyph/subtask/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSubTask" */ '@atlaskit/icon-object/glyph/subtask/24'),
		},
		[IconType.Task]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphTask" */ '@atlaskit/icon-object/glyph/task/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphTask" */ '@atlaskit/icon-object/glyph/task/24'),
		},

		// Provider icons
		[IconType.Confluence]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphConfluence" */ '@atlaskit/logo/confluence-icon').then(({ ConfluenceIcon }) => ({default: ConfluenceIcon})),
		},
		[IconType.Jira]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphJira" */ '@atlaskit/logo/jira-icon').then(({ JiraIcon }) => ({default: JiraIcon})),
		},
	};
};

const getTypeToIconMap = (fileFormat: string): IconLabelMap | null => {
	const iconDescriptor = extractFileFormatIcon(fileFormat);
	if (!iconDescriptor?.icon || !iconDescriptor.label) {
		return null;
	}

	const lazyIcons = getLazyIcons();

	return [iconDescriptor.label, lazyIcons[iconDescriptor.icon]?.default];
};

export const getIframeSandboxAttribute = (isTrusted: boolean) => {
	if (isTrusted) {
		return undefined;
	}

	const sandboxPermissions =
		'allow-downloads allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts';

	return sandboxPermissions;
};

export const handleOnClick = (handler: Function) => (e: React.BaseSyntheticEvent) => {
	e.preventDefault();
	e.stopPropagation();
	handler();
};

export const isIntersectionObserverSupported = () => typeof IntersectionObserver !== 'undefined';

export const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const importWithRetry = async <T,>(
	importFn: () => Promise<T>,
	retries = 2,
	interval = 500,
): Promise<T> => {
	try {
		return await importFn();
	} catch (error) {
		if ((error as Error).name === 'ChunkLoadError' && retries > 0) {
			await sleep(interval);
			return importWithRetry(importFn, retries - 1, interval);
		} else {
			throw error;
		}
	}
};

export const downloadUrl = async (url?: string) => {
	if (!url) {
		return;
	}

	const isIE11 = !!(window as any).MSInputMethodContext && !!(document as any).documentMode;
	const isSafari = /^((?!chrome|android).)*safari/i.test((navigator as Navigator).userAgent);

	const iframeName = 'media-download-iframe';
	const link = document.createElement('a');
	let iframe = document.getElementById(iframeName) as HTMLIFrameElement;
	if (!iframe) {
		iframe = document.createElement('iframe');
		iframe.style.display = 'none';
		iframe.id = iframeName;
		iframe.name = iframeName;
		document.body.appendChild(iframe);
	}
	link.href = url;
	link.download = url;
	link.target = isIE11 || isSafari ? '_blank' : iframeName;

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

export const openUrl = async (url?: string) => {
	if (!url) {
		return;
	}
	window.open(url, '_blank', 'noopener=yes');
};

/**
 * Append a theme to the URL if it exists
 * @param previewUrl
 * @param themeState
 */
export const getPreviewUrlWithTheme = (
	previewUrl: string,
	themeState: Partial<ActiveThemeState>,
): string => {
	try {
		const url = new URL(previewUrl);
		url.searchParams.append('themeState', themeObjectToString(themeState));
		return url.href;
	} catch {
		return previewUrl;
	}
};

export const isIconSizeLarge = (size?: SmartLinkSize) =>
	size && [SmartLinkSize.Large, SmartLinkSize.XLarge].includes(size);
