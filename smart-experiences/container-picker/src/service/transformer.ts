import { ContainerOption } from '../types';

enum ContainerType {
  JIRA_PROJECT = 'jiraProject',
  CONFLUENCE_SPACE = 'confluenceSpace',
}

interface Attributes {
  type: string;
  avatar: {
    urls: {
      [key: string]: string;
    };
  };
}

interface ProjectAttributes extends Attributes {
  projectType: string;
}

/**
 * Marker interface.
 */
interface Result {}

interface Option {
  label: string;
  value: any;
}

interface ProjectResult extends Result {
  id: string;
  name: string;
  url: string;
  attributes: ProjectAttributes;
}

interface SpaceResult extends Result {
  baseUrl: string;
  container: {
    title: string;
    displayUrl: string;
  };
  space: {
    key: string;
    icon: { path: string };
  };
  entityType: string;
  friendlyLastModified: string;
  lastModified: string;
  score: number;
  title: string;
  url: string;
  excerpt: string;
}

interface Scope<T extends Result> {
  id: string;
  abTest?: {
    abTestId: string;
    controlId: string;
    experimentId: string;
  };
  results: [T];
}
interface SearchResponse<T extends Result> {
  scopes: [Scope<T>];
}

const transformProject = (project: ProjectResult): ContainerOption => ({
  label: project.name,
  value: {
    id: project.id,
    name: project.name,
    url: project.url,
    iconUrl: project.attributes.avatar.urls['24x24'],
    type: ContainerType.JIRA_PROJECT,
  },
});

const transformSpace = (spaceResult: SpaceResult): ContainerOption => ({
  label: spaceResult.title,
  value: {
    id: spaceResult.space.key,
    name: spaceResult.title,
    url: spaceResult.url,
    iconUrl: `${spaceResult.baseUrl}${spaceResult.space.icon.path}`,
    type: ContainerType.CONFLUENCE_SPACE,
  },
});

const getResponseTransformer = <T extends Result>(
  scopeId: string,
  resultTransformer: (_: T) => Option,
): ((_: SearchResponse<T>) => Option[]) => {
  return (searchResponse) =>
    searchResponse.scopes
      .filter((scope) => scope.id === scopeId)
      .map((scope) => scope.results)
      .reduce((acc, current) => [...acc, ...current], [] as T[])
      .map(resultTransformer);
};

const identity = (_: any) => _;

export const getSearchTransformer = (scopeId: string) => {
  if (scopeId === 'jira.project') {
    return getResponseTransformer(scopeId, transformProject);
  }

  if (scopeId === 'confluence.space') {
    return getResponseTransformer(scopeId, transformSpace);
  }

  return identity;
};

interface CollaborationGraphContainer {
  entityType: 'CONTAINER';
  containerType: ContainerType;
  id: string;
  containerDetails?: {
    id: string;
    key: string;
    name: string;
    url: string;
    iconUrl: string;
  };
  score: number;
}

interface CollaborationGraphResponse {
  collaborationGraphEntities: [CollaborationGraphContainer];
}

export const transformCollaborationGraphResponse = (
  response: CollaborationGraphResponse,
): ContainerOption[] => {
  return (response.collaborationGraphEntities || [])
    .filter((container) => container && container.containerDetails)
    .map((container) => ({
      label: container.containerDetails!.name,
      value: {
        id: container.id,
        name: container.containerDetails!.name,
        type: container.containerType,
        url: container.containerDetails!.url,
        iconUrl: container.containerDetails!.iconUrl,
        analyticsAttributes: {
          key: container.containerDetails!.key,
        },
      },
    }));
};
