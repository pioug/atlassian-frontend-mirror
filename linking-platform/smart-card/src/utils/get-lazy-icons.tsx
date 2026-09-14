import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { IconType } from '../constants';

const loadPriorityIcons = () =>
	import(
		/* webpackChunkName: "@atlaskit-internal_priority-icons" */ '../common/ui/icons/priority-icons'
	);

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
		// IconTile wrappers (@atlaskit/icon/core/* wrapped in <IconTile> with color)
		[IconType.Document]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_page-icon" */ '../common/ui/icons/page-icon')},
		[IconType.Audio]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_audio-icon" */ '../common/ui/icons/audio-icon')},
		[IconType.Code]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_angle-brackets-icon" */ '../common/ui/icons/angle-brackets-icon')},
		[IconType.File]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_file-icon" */ '../common/ui/icons/file-icon')},
		[IconType.Folder]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_folder-icon" */ '../common/ui/icons/folder-icon')},
		[IconType.Generic]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_file-icon" */ '../common/ui/icons/file-icon')},
		[IconType.Image]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_image-icon" */ '../common/ui/icons/image-icon')},
		[IconType.Presentation]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_chart-bar-icon" */ '../common/ui/icons/chart-bar-icon')},
		[IconType.Spreadsheet]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_list-bullet-icon" */ '../common/ui/icons/list-bullet-icon')},
		[IconType.Video]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_video-icon" */ '../common/ui/icons/video-icon')},

		// @atlaskit/icon/core/* (plain monochrome icons)
		[IconType.Project]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProject" */ '@atlaskit/icon/core/people-group')},
		[IconType.Template]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphTemplate" */ '@atlaskit/icon/core/file')},
		[IconType.Forbidden]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphForbidden" */ '@atlaskit/icon/core/lock-locked')},
		[IconType.Default]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphDefault" */ '@atlaskit/icon/core/link')},
		[IconType.Error]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphDefault" */ '@atlaskit/icon/core/status-error')},

		// @atlaskit/icon/core/* (badge icons)
		[IconType.Attachment]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphAttachment" */ '@atlaskit/icon/core/attachment')},
		[IconType.CheckItem]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphAttachment" */ '@atlaskit/icon/core/task')},
		[IconType.Component]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphComponent" */ '@atlaskit/icon/core/component')},
		[IconType.Comment]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphComment" */ '@atlaskit/icon/core/comment')},
		[IconType.View]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphComment" */ '@atlaskit/icon/core/eye-open')},
		[IconType.React]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphComment" */ '@atlaskit/icon/core/thumbs-up')},
		[IconType.Vote]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphComment" */ '@atlaskit/icon/core/arrow-up')},
		[IconType.PriorityUndefined]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphUndefined" */ '@atlaskit/icon/core/question-circle')},
		[IconType.ProgrammingLanguage]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProgrammingLanguage" */ '@atlaskit/icon/core/angle-brackets')},
		[IconType.Subscriber]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSubscriber" */ '@atlaskit/icon/core/people-group')},
		[IconType.SubTasksProgress]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSubtaskProgress" */ '@atlaskit/icon/core/subtasks')},

		// @atlaskit/icon-file-type/glyph/* (file type icons with 16/24 size variants)
		[IconType.Archive]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphArchive" */ '@atlaskit/icon-file-type/glyph/archive/16'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphArchive" */ '@atlaskit/icon-file-type/glyph/archive/24'),
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

		// Keep blog/live-document out of the lazy map on purpose.
		// These icons should be present in SSR markup so hydration does not cause
		// a visible empty-state-then-pop-in transition in Smart Link consumers.
		[IconType.Branch]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBranch" */ '@atlaskit/object/branch'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBranch" */ '@atlaskit/object/tile/branch').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Commit]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphCommit" */ '@atlaskit/object/commit'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphCommit" */ '@atlaskit/object/tile/commit').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.PullRequest]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphPullRequest" */ '@atlaskit/object/pull-request'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphPullRequest" */ '@atlaskit/object/tile/pull-request').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Repo]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphRepo" */ '@atlaskit/object/code'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphRepo" */ '@atlaskit/object/tile/code').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Bug]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBug" */ '@atlaskit/object/bug'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphBug" */ '@atlaskit/object/tile/bug').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Change]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphChange" */ '@atlaskit/object/changes'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphChange" */ '@atlaskit/object/tile/changes').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Epic]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphEpic" */ '@atlaskit/object/epic'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphEpic" */ '@atlaskit/object/tile/epic').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Incident]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphIncident" */ '@atlaskit/object/incident'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphIncident" */ '@atlaskit/object/tile/incident').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Problem]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProblem" */ '@atlaskit/object/problem'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphProblem" */ '@atlaskit/object/tile/problem').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.ServiceRequest]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphServiceRequest" */ '@atlaskit/object/work-item'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphServiceRequest" */ '@atlaskit/object/tile/work-item').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Story]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphStory" */ '@atlaskit/object/story'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphStory" */ '@atlaskit/object/tile/story').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.SubTask]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSubTask" */ '@atlaskit/object/subtask'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphSubTask" */ '@atlaskit/object/tile/subtask').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		[IconType.Task]: {
			default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphTask" */ '@atlaskit/object/task'),
			large: () => import(/* webpackChunkName: "@atlaskit-internal_glyphTask" */ '@atlaskit/object/tile/task').then((module) => ({ default: (props: any) => <module.default {...props} size="small" /> })),
		},
		// @atlaskit/logo/* (product logos)
		[IconType.Confluence]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphConfluence" */ '@atlaskit/logo/confluence-icon').then(({ ConfluenceIcon }) => ({default: ConfluenceIcon}))},
		[IconType.Jira]: { default: () => import(/* webpackChunkName: "@atlaskit-internal_glyphJira" */ '@atlaskit/logo/jira-icon').then(({ JiraIcon }) => ({default: JiraIcon}))},
		
		// Priority icons stay lazy, but share one chunk to avoid a cold-cache request per icon type.
		[IconType.PriorityBlocker]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityBlockerIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphBlocker" */ '../common/ui/icons/priority-blocker-icon')},
		[IconType.PriorityCritical]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityCriticalIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphCritical" */ '../common/ui/icons/priority-critical-icon')},
		[IconType.PriorityHigh]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityHighIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphHigh" */ '../common/ui/icons/priority-high-icon')},
		[IconType.PriorityHighest]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityHighestIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphHighest" */ '../common/ui/icons/priority-highest-icon')},
		[IconType.PriorityLow]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityLowIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphLow" */ '../common/ui/icons/priority-low-icon')},
		[IconType.PriorityLowest]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityLowestIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphLowest" */ '../common/ui/icons/priority-lowest-icon')},
		[IconType.PriorityMajor]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityMajorIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphMajor" */ '../common/ui/icons/priority-major-icon')},
		[IconType.PriorityMedium]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityMediumIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphMedium" */ '../common/ui/icons/priority-medium-icon')},
		[IconType.PriorityMinor]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityMinorIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphMinor" */ '../common/ui/icons/priority-minor-icon')},
		[IconType.PriorityTrivial]: { default: () => fg('platform_sl_priority_icon') ? loadPriorityIcons().then(({ PriorityTrivialIcon: defaultIcon }) => ({ default: defaultIcon })) : import(/* webpackChunkName: "@atlaskit-internal_glyphTrivial" */ '../common/ui/icons/priority-trivial-icon')},
	};
};
