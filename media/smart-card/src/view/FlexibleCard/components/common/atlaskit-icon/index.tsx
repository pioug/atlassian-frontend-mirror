import React from 'react';
import Loadable from 'react-loadable';

import { B200, B400, N700, R400 } from '@atlaskit/theme/colors';

import { IconType } from '../../../../../constants';
import { AtlaskitIconProps } from './types';

// prettier-ignore
const importIconMapper: {
  [key: string]: (() => Promise<any>) | undefined;
} = {
  [IconType.Archive]: () => import(/* webpackChunkName: "glyphArchive" */ '@atlaskit/icon-file-type/glyph/archive/16'),
  [IconType.Audio]: () => import(/* webpackChunkName: "glyphAudio" */ '@atlaskit/icon-file-type/glyph/audio/16'),
  [IconType.Blog]: () => import(/* webpackChunkName: "glyphBlog" */ '@atlaskit/icon-object/glyph/blog/16'),
  [IconType.Code]: () => import(/* webpackChunkName: "glyphCode" */ '@atlaskit/icon-file-type/glyph/source-code/16'),
  [IconType.Document]: () => import(/* webpackChunkName: "glyphDocument" */ '@atlaskit/icon-file-type/glyph/document/16'),
  [IconType.Executable]: () => import(/* webpackChunkName: "glyphExecutable" */ '@atlaskit/icon-file-type/glyph/executable/16'),
  [IconType.File]: () => import(/* webpackChunkName: "glyphFile" */ '@atlaskit/icon-file-type/glyph/generic/16'),
  [IconType.Folder]: () => import(/* webpackChunkName: "glyphFolder" */ '@atlaskit/icon-file-type/glyph/folder/16'),
  [IconType.Generic]: () => import(/* webpackChunkName: "glyphGeneric" */ '@atlaskit/icon-file-type/glyph/generic/16'),
  [IconType.GIF]: () => import(/* webpackChunkName: "glyphGIF" */ '@atlaskit/icon-file-type/glyph/gif/16'),
  [IconType.GoogleDocs]: () => import(/* webpackChunkName: "glyphGoogleDocs" */ '@atlaskit/icon-file-type/glyph/google-doc/16'),
  [IconType.GoogleForms]: () => import(/* webpackChunkName: "glyphGoogleForms" */ '@atlaskit/icon-file-type/glyph/google-form/16'),
  [IconType.GoogleSheets]: () => import(/* webpackChunkName: "glyphGoogleSheets" */ '@atlaskit/icon-file-type/glyph/google-sheet/16'),
  [IconType.GoogleSlides]: () => import(/* webpackChunkName: "glyphGoogleSlides" */ '@atlaskit/icon-file-type/glyph/google-slide/16'),
  [IconType.Image]: () => import(/* webpackChunkName: "glyphImage" */ '@atlaskit/icon-file-type/glyph/image/16'),
  [IconType.MSExcel]: () => import(/* webpackChunkName: "glyphMSExcel" */ '@atlaskit/icon-file-type/glyph/excel-spreadsheet/16'),
  [IconType.MSPowerpoint]: () => import(/* webpackChunkName: "glyphMSPowerpoint" */ '@atlaskit/icon-file-type/glyph/powerpoint-presentation/16'),
  [IconType.MSWord]: () => import(/* webpackChunkName: "glyphMSWord" */ '@atlaskit/icon-file-type/glyph/word-document/16'),
  [IconType.PDF]: () => import(/* webpackChunkName: "glyphPDF" */ '@atlaskit/icon-file-type/glyph/pdf-document/16'),
  [IconType.Presentation]: () => import(/* webpackChunkName: "glyphPresentation" */ '@atlaskit/icon-file-type/glyph/presentation/16'),
  [IconType.Sketch]: () => import(/* webpackChunkName: "glyphSketch" */ '@atlaskit/icon-file-type/glyph/sketch/16'),
  [IconType.Spreadsheet]: () => import(/* webpackChunkName: "glyphSpreadsheet" */ '@atlaskit/icon-file-type/glyph/spreadsheet/16'),
  [IconType.Template]: () => import(/* webpackChunkName: "glyphTemplate" */ '@atlaskit/icon/glyph/document-filled'),
  [IconType.Video]: () => import(/* webpackChunkName: "glyphVideo" */ '@atlaskit/icon-file-type/glyph/video/16'),

  // Bitbucket icons
  [IconType.Branch]: () => import(/* webpackChunkName: "glyphBranch" */ '@atlaskit/icon-object/glyph/branch/16'),
  [IconType.Commit]: () => import(/* webpackChunkName: "glyphCommit" */ '@atlaskit/icon-object/glyph/commit/16'),
  [IconType.Project]: () => import(/* webpackChunkName: "glyphProject" */ '@atlaskit/icon/glyph/people-group'),
  [IconType.PullRequest]: () => import(/* webpackChunkName: "glyphPullRequest" */ '@atlaskit/icon-object/glyph/pull-request/16'),
  [IconType.Repo]: () => import(/* webpackChunkName: "glyphRepo" */ '@atlaskit/icon-object/glyph/code/16'),

  // Jira icons
  [IconType.Bug]: () => import(/* webpackChunkName: "glyphBug" */ '@atlaskit/icon-object/glyph/bug/16'),
  [IconType.Change]: () => import(/* webpackChunkName: "glyphChange" */ '@atlaskit/icon-object/glyph/changes/16'),
  [IconType.Epic]: () => import(/* webpackChunkName: "glyphEpic" */ '@atlaskit/icon-object/glyph/epic/16'),
  [IconType.Incident]: () => import(/* webpackChunkName: "glyphIncident" */ '@atlaskit/icon-object/glyph/incident/16'),
  [IconType.Problem]: () => import(/* webpackChunkName: "glyphProblem" */ '@atlaskit/icon-object/glyph/problem/16'),
  [IconType.ServiceRequest]: () => import(/* webpackChunkName: "glyphServiceRequest" */ '@atlaskit/icon-object/glyph/issue/16'),
  [IconType.Story]: () => import(/* webpackChunkName: "glyphStory" */ '@atlaskit/icon-object/glyph/story/16'),
  [IconType.SubTask]: () => import(/* webpackChunkName: "glyphSubTask" */ '@atlaskit/icon-object/glyph/subtask/16'),
  [IconType.Task]: () => import(/* webpackChunkName: "glyphTask" */ '@atlaskit/icon-object/glyph/task/16'),

  // Provider icons
  [IconType.Confluence]: () =>
    import(/* webpackChunkName: "glyphConfluence" */ '@atlaskit/logo/confluence-icon').then(({ ConfluenceIcon }) => ({
      default: ConfluenceIcon,
    })),
  [IconType.Jira]: () =>
    import(/* webpackChunkName: "glyphJira" */ '@atlaskit/logo/jira-icon').then(({ JiraIcon }) => ({
      default: JiraIcon,
    })),

  // Fallback icons
  [IconType.Default]: () => import(/* webpackChunkName: "glyphDefault" */ '@atlaskit/icon/glyph/link'),
  [IconType.Error]: () => import(/* webpackChunkName: "glyphError" */ '@atlaskit/icon/glyph/error'),
  [IconType.Forbidden]: () => import(/* webpackChunkName: "glyphForbidden" */ '@atlaskit/icon/glyph/lock-filled'),

  // Badge
  [IconType.Comment]: () => import(/* webpackChunkName: "glyphComment" */ '@atlaskit/icon/glyph/comment'),
  [IconType.View]: () => import(/* webpackChunkName: "glyphComment" */ '@atlaskit/icon/glyph/watch'),
  [IconType.React]: () => import(/* webpackChunkName: "glyphComment" */ '@atlaskit/icon/glyph/like'),
  [IconType.Vote]: () => import(/* webpackChunkName: "glyphComment" */ '@atlaskit/icon/glyph/arrow-up'),
  [IconType.PriorityBlocker]: () => import(/* webpackChunkName: "glyphBlocker" */ '@atlaskit/icon-priority/glyph/priority-blocker'),
  [IconType.PriorityCritical]: () => import(/* webpackChunkName: "glyphCritical" */ '@atlaskit/icon-priority/glyph/priority-critical'),
  [IconType.PriorityHigh]: () => import(/* webpackChunkName: "glyphHigh" */ '@atlaskit/icon-priority/glyph/priority-high'),
  [IconType.PriorityHighest]: () => import(/* webpackChunkName: "glyphHighest" */ '@atlaskit/icon-priority/glyph/priority-highest'),
  [IconType.PriorityLow]: () => import(/* webpackChunkName: "glyphLow" */ '@atlaskit/icon-priority/glyph/priority-low'),
  [IconType.PriorityLowest]: () => import(/* webpackChunkName: "glyphLowest" */ '@atlaskit/icon-priority/glyph/priority-lowest'),
  [IconType.PriorityMajor]: () => import(/* webpackChunkName: "glyphMajor" */ '@atlaskit/icon-priority/glyph/priority-major'),
  [IconType.PriorityMedium]: () => import(/* webpackChunkName: "glyphMedium" */ '@atlaskit/icon-priority/glyph/priority-medium'),
  [IconType.PriorityMinor]: () => import(/* webpackChunkName: "glyphMinor" */ '@atlaskit/icon-priority/glyph/priority-minor'),
  [IconType.PriorityTrivial]: () => import(/* webpackChunkName: "glyphTrivial" */ '@atlaskit/icon-priority/glyph/priority-trivial'),
  [IconType.PriorityUndefined]: () => import(/* webpackChunkName: "glyphUndefined" */ '@atlaskit/icon/glyph/question'),
  [IconType.ProgrammingLanguage]: () => import(/* webpackChunkName: "glyphProgrammingLanguage" */ '@atlaskit/icon/glyph/code'),
  [IconType.Subscriber]: () => import(/* webpackChunkName: "glyphSubscriber" */ '@atlaskit/icon/glyph/people'),
};

const getIconImportFn = (icon: IconType): (() => Promise<any>) | undefined =>
  importIconMapper[icon];

const importIcon = (importFn: () => Promise<any>): any => {
  return Loadable({
    loader: () => importFn().then((module) => module.default),
    loading: () => null,
  }) as any; // Because we're using dynamic loading here, TS will not be able to infer the type.
};

const AtlaskitIcon: React.FC<AtlaskitIconProps> = ({ icon, label, testId }) => {
  const importFn = getIconImportFn(icon);
  if (!importFn) {
    return null;
  }

  const ImportedIcon = importIcon(importFn);

  switch (icon) {
    case IconType.Confluence:
    case IconType.Jira:
      // Logo component has a different prop set from other icon components
      return (
        <ImportedIcon
          data-testid={testId} // Confluence and Jira imports don't have native testId prop
          textColor={N700}
          iconColor={B200}
          iconGradientStart={B400}
          iconGradientStop={B200}
        />
      );
    case IconType.Error:
    case IconType.Forbidden:
      return <ImportedIcon label={label} testId={testId} primaryColor={R400} />;
    default:
      return <ImportedIcon label={label} testId={testId} />;
  }
};

export default AtlaskitIcon;
