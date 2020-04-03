import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { genericExtractPropsFromJSONLD } from '..';
import { extractPropsFromObject } from './extractPropsFromObject';
import { extractPropsFromDocument } from './extractPropsFromDocument';
import { extractPropsFromSpreadsheet } from './extractPropsFromSpreadsheet';
import { extractPropsFromTask } from './extractPropsFromTask';
import { extractPropsFromPresentation } from './extractPropsFromPresentation';
import { extractPropsFromTextDocument } from './extractPropsFromTextDocument';
import { extractPropsFromProject } from './extractPropsFromProject';
import { extractPropsFromSourceCodeCommit } from './extractPropsFromSourceCodeCommit';
import { extractPropsFromSourceCodeRepository } from './extractPropsFromSourceCodeRepository';
import { extractPropsFromSourceCodeReference } from './extractPropsFromSourceCodeReference';
import { extractPropsFromDigitalDocument } from './extractPropsFromDigitalDocument';
import { extractPropsFromBlogPost } from './extractPropsFromBlogPost';
import { extractPropsFromTemplate } from './extractPropsFromTemplate';
import { extractPropsFromSourceCodePullRequest } from './extractPropsFromSourceCodePullRequest';

const extractorPrioritiesByType = {
  Object: 0,
  Document: 5,
  'schema:TextDigitalDocument': 10,
  'schema:DigitalDocument': 10,
  'schema:BlogPosting': 10,
  'schema:SpreadsheetDigitalDocument': 10,
  'schema:PresentationDigitalDocument': 10,
  Spreadsheet: 10,
  'atlassian:Task': 10,
  'atlassian:Project': 10,
  'atlassian:Template': 10,
  'atlassian:SourceCodeCommit': 10,
  'atlassian:SourceCodeRepository': 10,
  'atlassian:SourceCodePullRequest': 10,
  'atlassian:SourceCodeReference': 10,
};

const extractorFunctionsByType = {
  Object: extractPropsFromObject,
  Document: extractPropsFromDocument,
  'schema:TextDigitalDocument': extractPropsFromDigitalDocument,
  'schema:DigitalDocument': extractPropsFromTextDocument,
  'schema:BlogPosting': extractPropsFromBlogPost,
  'schema:SpreadsheetDigitalDocument': extractPropsFromSpreadsheet,
  'schema:PresentationDigitalDocument': extractPropsFromPresentation,
  Spreadsheet: extractPropsFromSpreadsheet,
  'atlassian:Task': extractPropsFromTask,
  'atlassian:Project': extractPropsFromProject,
  'atlassian:Template': extractPropsFromTemplate,
  'atlassian:SourceCodeCommit': extractPropsFromSourceCodeCommit,
  'atlassian:SourceCodeRepository': extractPropsFromSourceCodeRepository,
  'atlassian:SourceCodePullRequest': extractPropsFromSourceCodePullRequest,
  'atlassian:SourceCodeReference': extractPropsFromSourceCodeReference,
};

export function extractBlockPropsFromJSONLD(
  json: any,
): BlockCardResolvedViewProps {
  return genericExtractPropsFromJSONLD({
    extractorPrioritiesByType: extractorPrioritiesByType,
    extractorFunctionsByType: extractorFunctionsByType,
    defaultExtractorFunction: extractPropsFromObject,
    json,
  });
}
