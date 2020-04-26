import { JsonLd } from 'json-ld-types';
import { LinkLozenge } from './types';
import { extractState } from './extractState';
import { extractTag } from './extractTag';
import { extractTaskStatus } from './extractTaskStatus';
import { extractType } from '../primitives/extractType';
import { extractTaskType } from './extractTaskType';

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
