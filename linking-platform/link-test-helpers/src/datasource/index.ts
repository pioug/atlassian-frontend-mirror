import fetchMock from 'fetch-mock/cjs/client';
import { defaults } from 'json-ld-types';

import {
  DatasourceDataResponse,
  DatasourceDataResponseItem,
  DatasourceDetailsResponse,
  DatasourceResponseSchemaProperty,
  RichText,
  StatusType,
} from '@atlaskit/linking-types';

import { mockAssetsClientFetchRequests } from './assets';
import {
  mockAutoCompleteData,
  mockJiraData,
  mockSiteData,
  mockSuggestionData,
} from './data';

export {
  mockAutoCompleteData,
  mockJiraData,
  mockSiteData,
  mockSuggestionData,
  mockAssetsClientFetchRequests,
};

fetchMock.config.fallbackToNetwork = true;

type Site = {
  cloudId: string;
  displayName: string;
  url: string;
};

interface FetchMockRequestDetails {
  body: string;
  credentials: string;
  headers: object;
  method: string;
}

interface ResolveBatchRequest
  extends Array<{
    resourceUrl: string;
  }> {}

const columns: DatasourceResponseSchemaProperty[] = [
  {
    key: 'id',
    title: '',
    type: 'string',
  },
  {
    key: 'key',
    title: 'Key',
    type: 'link',
  },
  {
    key: 'type',
    type: 'icon',
    title: 'Type',
  },
  {
    key: 'summary',
    title: 'Summary',
    type: 'link',
  },
  {
    key: 'description',
    title: 'Description',
    type: 'richtext',
  },
  {
    key: 'assignee',
    title: 'Assignee',
    type: 'user',
  },
  {
    key: 'priority',
    title: 'P',
    type: 'icon',
  },
  {
    key: 'labels',
    title: 'Labels',
    type: 'tag',
    isList: true,
  },
  {
    key: 'status',
    title: 'Status for each issue',
    type: 'status',
  },
  {
    key: 'created',
    title: 'Date of Creation for each issue',
    type: 'date',
  },
  {
    key: 'due',
    title: 'Due Date',
    type: 'date',
  },
  ...new Array<DatasourceResponseSchemaProperty>(100)
    .fill({
      key: 'due',
      title: 'Due Date',
      type: 'date',
    })
    .map((prop, i) => ({ ...prop, key: prop.key + i, title: prop.title + i })),
];

const adfTableSample = {
  data: {
    type: 'adf',
    text: JSON.stringify({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'table',
          attrs: {
            layout: 'full-width',
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'table',
          attrs: {
            layout: 'wide',
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'mediaSingle',
                      attrs: {
                        layout: 'center',
                      },
                      content: [
                        {
                          type: 'media',
                          attrs: {
                            type: 'external',
                            url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'bodiedExtension',
          attrs: {
            extensionType: 'com.atlassian.confluence.macro.core',
            extensionKey: 'bodied-eh',
            parameters: {
              macroParams: {},
              macroMetadata: {
                macroId: {
                  value: 1532948101320,
                },
                placeholder: {
                  '0': {
                    data: {
                      url: '',
                    },
                    type: 'icon',
                  },
                },
              },
            },
            layout: 'wide',
          },
          content: [
            {
              type: 'table',
              attrs: {
                layout: 'full-width',
              },
              content: [
                {
                  type: 'tableRow',
                  content: [
                    {
                      type: 'tableHeader',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'Header content 1',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tableHeader',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'Header content 2',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tableHeader',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'Header content 3',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableRow',
                  content: [
                    {
                      type: 'tableCell',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'This table is inside a bodied extension.',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tableCell',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'Body content 2',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'tableCell',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'Body content 3',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: true,
            layout: 'default',
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 3',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  },
};

const adfSample: { data: RichText } = {
  data: {
    type: 'adf',
    text: JSON.stringify({
      version: 1,
      type: 'doc',
      content: [
        {
          type: 'panel',
          attrs: {
            panelType: 'info',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'normal info panel',
                },
              ],
            },
          ],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'custom',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'custom - missing defaults',
                },
              ],
            },
          ],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'custom',
            panelColor: '#34eb6e',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'custom - only background',
                },
              ],
            },
          ],
        },
      ],
    }),
  },
};

export const defaultInitialVisibleColumnKeys: string[] = [
  // Order of actual columns is in different order is on purpose
  // To demonstrate that this list is a king
  'type',
  'key',
  'summary',
  'assignee',
  'priority',
  'labels',
  'status',
  'created',
  'description',
];

const defaultDetailsResponse: DatasourceDetailsResponse = {
  meta: {
    access: 'granted',
    auth: [],
    definitionId: 'object-resolver-service',
    destinationObjectTypes: ['issue'],
    extensionKey: 'jira-object-provider',
    product: 'jira',
    visibility: 'restricted',
  },
  data: {
    ari: 'ari:cloud:linking-platform:datasource/12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
    id: '12e74246-a3f1-46c1-9fd9-8d952aa9f12f',
    name: 'JQL Datasource',
    description: 'Fetches Issues using JQL',
    parameters: [
      {
        key: 'cloudId',
        type: 'string',
        description: 'Cloud Id',
      },
      {
        key: 'jql',
        type: 'string',
        description: 'JQL query to retrieve list of issues',
      },
    ],
    schema: {
      properties: columns,
      defaultProperties: defaultInitialVisibleColumnKeys,
    },
  },
};

const resolveJqlSuccess = {
  body: {
    meta: defaults.meta.granted,
    data: {
      '@context': {
        '@vocab': 'https://www.w3.org/ns/activitystreams#',
        atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
        schema: 'http://schema.org/',
      },
      generator: {
        '@type': 'Application',
        '@id': 'https://www.atlassian.com/#Jira',
        name: 'Jira',
      },
      '@type': ['Document', 'Object'],
      url: 'https://a4t-moro.jira-dev.com/issues/?jql=created%20%3E%3D%20-30d%20order%20by%20created%20DESC',
      name: '0 Issues',
      summary: "JQL Query: 'created >= -30d order by created DESC'",
    },
    datasources: [
      {
        key: 'datasource-jira-issues',
        parameters: {
          jql: 'created >= -30d order by created DESC',
          cloudId: 'c97a19dd-05c1-4fe4-a742-3ef82dfdf1e7',
        },
        id: 'd8b75300-dfda-4519-b6cd-e49abbd50401',
        ari: 'ari:cloud:linking-platform::datasource/d8b75300-dfda-4519-b6cd-e49abbd50401',
        description: 'For extracting a list of Jira issues using JQL',
        name: 'Jira issues',
      },
    ],
  },
  status: 200,
};

const generateDataResponse = ({
  cloudId = '',
  maxItems = 99,
  numberOfLoads = 0,
  includeSchema,
  initialVisibleColumnKeys,
  isUnauthorized = false,
}: {
  cloudId: string;
  maxItems?: number;
  numberOfLoads?: number;
  includeSchema: boolean;
  isUnauthorized?: boolean;
  initialVisibleColumnKeys: string[];
}): DatasourceDataResponse => {
  const schema = {
    properties: defaultDetailsResponse.data.schema.properties.filter(
      ({ key }) => {
        return initialVisibleColumnKeys.includes(key);
      },
    ),
  };

  return {
    meta: {
      access: isUnauthorized ? 'unauthorized' : 'granted',
      auth: [],
      definitionId: 'object-resolver-service',
      destinationObjectTypes: ['issue'],
      key: 'jira-object-provider',
      product: 'jira',
      visibility: 'restricted',
    },
    data: {
      items: mockJiraData.data
        .slice(0, maxItems)
        .map((item, idx): DatasourceDataResponseItem => {
          return {
            // Fake identifier attribute that is a primitive value.
            // Adding number of pages to make all issueNumbers unique
            id: {
              data: item.issueNumber + numberOfLoads,
            },
            type: {
              data: { source: item.type.source, label: item.type.label },
            },
            key: {
              data: {
                url: item.link,
                text: item.issueNumber + numberOfLoads,
                style: {
                  appearance: 'key',
                },
              },
            },
            description: idx % 2 === 0 ? adfSample : adfTableSample,
            summary: {
              data: { url: item.link, text: `[${cloudId}] ${item.summary}` },
            },
            assignee: {
              data: {
                displayName: item.assignee?.displayName,
                avatarSource: item.assignee?.source,
              },
            },
            priority: {
              data: {
                source: item.priority.source,
                label: item.priority.label,
              },
            },
            status: {
              data: {
                text: item.status.text,
                style: {
                  appearance: item?.status?.status,
                },
              } as StatusType['value'],
            },
            created: {
              data: item.created,
            },
            due: {
              data: item.due,
            },
            ...(item.labels?.length && {
              labels: {
                data: item.labels.map(label => ({ text: label })),
              },
            }),
          };
        }),
      totalCount:
        maxItems === 0 || maxItems === 1 ? maxItems : mockJiraData.totalIssues,
      nextPageCursor:
        numberOfLoads < 4 && maxItems > 1 ? 'c3RhcnRBdD01' : undefined,
      ...(includeSchema && { schema }),
    },
  };
};

let numberOfLoads = 0;

interface MockOptions {
  datasourceId?: string | null;
  shouldMockORSBatch?: boolean;
  initialVisibleColumnKeys?: string[];
  delayedResponse?: boolean; // For playwright VR tests
  availableSitesOverride?: Site[];
}

export const mockDatasourceFetchRequests = ({
  datasourceId,
  shouldMockORSBatch = false,
  initialVisibleColumnKeys = defaultInitialVisibleColumnKeys,
  delayedResponse = true,
  availableSitesOverride,
}: MockOptions = {}) => {
  let datasourceMatcher = '[^/]+';
  if (datasourceId) {
    datasourceMatcher = datasourceId;
  }

  // Playwright VR tests do not like setTimeout
  const setTimeoutConfigured = delayedResponse
    ? setTimeout
    : (cb: Function, _: number) => cb();

  fetchMock.post(
    new RegExp(`object-resolver/datasource/${datasourceMatcher}/fetch/details`),
    async () => {
      return new Promise(resolve =>
        resolve({
          ...defaultDetailsResponse,
          data: {
            ...defaultDetailsResponse.data,
            schema: {
              ...defaultDetailsResponse.data.schema,
              defaultProperties: initialVisibleColumnKeys,
            },
          },
        }),
      );
    },
  );

  // Mock this for the editor's testing examples.
  if (shouldMockORSBatch) {
    // Mock JUST jql=... requests. Kind of related to mocking datasources.
    fetchMock.post(
      new RegExp(`object-resolver/resolve/batch`),
      async (url: string, request: FetchMockRequestDetails) => {
        const requestJson = JSON.parse(request.body) as ResolveBatchRequest;
        if (requestJson.length === 1) {
          const isJqlRequest = new URL(
            requestJson[0].resourceUrl,
          ).search.includes('jql=');
          if (isJqlRequest) {
            return Promise.resolve([resolveJqlSuccess]);
          }
        }
        return fetchMock.realFetch(url, {
          method: 'POST',
          headers: request.headers,
          body: request.body,
        });
      },
    );
  }

  fetchMock.post(
    new RegExp(
      `/gateway/api/object-resolver/datasource/${datasourceMatcher}/fetch/data`,
    ),
    async (url: string, details: FetchMockRequestDetails) => {
      const requestBody = JSON.parse(details.body);
      const {
        parameters: { cloudId },
        includeSchema,
      } = requestBody;
      return new Promise((resolve, reject) => {
        const delay = numberOfLoads * 1000;

        setTimeoutConfigured(() => {
          if (cloudId === '11111') {
            resolve(
              generateDataResponse({
                cloudId,
                maxItems: 1,
                numberOfLoads,
                includeSchema,
                initialVisibleColumnKeys,
              }),
            );
          } else if (cloudId === '22222') {
            resolve(
              generateDataResponse({
                cloudId,
                maxItems: 0,
                numberOfLoads,
                includeSchema,
                initialVisibleColumnKeys,
              }),
            );
          } else if (cloudId === '33333') {
            reject();
          } else if (cloudId === '44444') {
            resolve(
              generateDataResponse({
                cloudId,
                numberOfLoads,
                includeSchema,
                isUnauthorized: true,
                initialVisibleColumnKeys,
              }),
            );
          } else {
            resolve(
              generateDataResponse({
                cloudId,
                numberOfLoads,
                includeSchema,
                initialVisibleColumnKeys,
              }),
            );
          }
          numberOfLoads += 1;
        }, delay);
      });
    },
  );

  fetchMock.post(/api\/available-sites/, async () => {
    return new Promise(resolve => {
      resolve({ sites: availableSitesOverride || mockSiteData });
    });
  });

  fetchMock.get(
    /\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata\/suggestions\?.+/,
    async () => {
      return new Promise(resolve => {
        const delay = 150;
        setTimeoutConfigured(() => {
          resolve(mockSuggestionData);
        }, delay);
      });
    },
  );

  fetchMock.post(
    /\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata/,
    async () => {
      return new Promise(resolve => {
        const delay = 150;
        setTimeoutConfigured(() => {
          resolve(mockAutoCompleteData);
        }, delay);
      });
    },
  );
};

export const forceBaseUrl = (baseUrl: string) => {
  fetchMock.post(/^\//, ((url, init) =>
    fetch(`${baseUrl}${url}`, init)) as typeof fetch);
};
