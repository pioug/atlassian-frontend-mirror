import { JsonLd } from 'json-ld-types';
import { LinkLozenge } from './types';
import { extractState } from './extractState';
import { extractTag } from './extractTag';
import { extractTaskStatus } from './extractTaskStatus';
import { extractType } from '../primitives/extractType';
import { extractTaskType } from './extractTaskType';

const DOC_TYPES = [
  'schema:BlogPosting',
  'schema:TextDigitalDocument',
  'schema:DigitalDocument',
  'schema:PresentationDigitalDocument',
  'schema:SpreadsheetDigitalDocument',
];

export const extractLozenge = (
  jsonLd: JsonLd.Data.BaseData,
): LinkLozenge | undefined => {
  const type = extractType(jsonLd);
  if (type) {
    if (type.includes('atlassian:SourceCodePullRequest')) {
      return extractState(jsonLd as JsonLd.Data.SourceCodePullRequest);
    } else if (type.includes('atlassian:Task')) {
      const jsonLdTask = jsonLd as JsonLd.Data.Task;
      const lozengeFromTag = extractTag(jsonLdTask);
      const lozengeFromStatus = extractTaskStatus(jsonLdTask);
      const lozengeFromTaskType = extractLozengeFromTaskType(jsonLdTask);
      return lozengeFromTag || lozengeFromStatus || lozengeFromTaskType;
    } else if (type.some((types) => DOC_TYPES.includes(types))) {
      const jsonLdDocument = jsonLd as JsonLd.Data.Document;
      const lozengeFromState = extractState(jsonLdDocument);
      return lozengeFromState;
    } else if (type.includes('atlassian:Project')) {
      const jsonLdProject = jsonLd as JsonLd.Data.Project;
      const lozengeFromState = extractState(jsonLdProject);
      return lozengeFromState;
    } else if (type.includes('atlassian:UndefinedLink')) {
      return { text: 'UNDEFINED', appearance: 'inprogress' };
    }
  }
};

const extractLozengeFromTaskType = (
  jsonLdTask: JsonLd.Data.Task,
): LinkLozenge | undefined => {
  const taskType = extractTaskType(jsonLdTask);
  if (taskType && taskType.name) {
    return { text: taskType.name, appearance: 'success' };
  }
};
