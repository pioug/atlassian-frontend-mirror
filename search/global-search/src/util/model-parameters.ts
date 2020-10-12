import { ConfluenceModelContext } from '../api/types';

export interface ModelParam {
  '@type': string;
  [value: string]: string | number;
}

const buildCommonModelParameters = (queryVersion: number): ModelParam[] => {
  return [
    {
      '@type': 'queryParams',
      queryVersion,
    },
  ];
};

export const buildJiraModelParams = (
  queryVersion: number,
  currentContainerId?: string,
): ModelParam[] => {
  return [
    ...buildCommonModelParameters(queryVersion),
    ...(currentContainerId
      ? [
          {
            '@type': 'currentProject',
            projectId: currentContainerId,
          },
        ]
      : []),
  ];
};

export const buildConfluenceModelParams = (
  queryVersion: number,
  modelContext: ConfluenceModelContext,
): ModelParam[] => {
  return [
    ...buildCommonModelParameters(queryVersion),
    ...(modelContext.spaceKey
      ? [
          {
            '@type': 'currentSpace',
            spaceKey: modelContext.spaceKey,
          },
        ]
      : []),
  ];
};
