import { JsonLd } from 'json-ld-types';
import { extractUrlFromIconJsonLd } from '../utils';

export interface LinkTaskType {
  id?: string;
  name?: string;
  icon?: string;
}

export const extractTaskType = (
  jsonLd: JsonLd.Data.Task,
): LinkTaskType | undefined => {
  // TODO: Remove once Jira migrate to the correct type.
  const taskType = jsonLd['atlassian:taskType'] || (jsonLd as any).taskType;
  if (taskType) {
    if (typeof taskType === 'string') {
      return { id: taskType };
    } else if (taskType['@type'] === 'Link') {
      return { id: taskType.href };
    } else {
      return {
        id: taskType['@id'],
        name: taskType.name,
        icon: taskType.icon && extractUrlFromIconJsonLd(taskType.icon),
      };
    }
  }
};
