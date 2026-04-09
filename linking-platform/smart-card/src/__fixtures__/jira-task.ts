import { SmartLinkActionType } from '@atlaskit/linking-types';

const _default_1: {
    meta: {
        auth: never[];
        definitionId: string;
        visibility: string;
        access: string;
        resourceType: string;
        key: string;
        objectId: string;
        tenantId: string;
    };
    data: {
        '@context': {
            '@vocab': string;
            atlassian: string;
            schema: string;
        };
        generator: {
            '@type': string;
            '@id': string;
            name: string;
        };
        '@type': string[];
        name: string;
        'schema:dateCreated': string;
        updated: string;
        'schema:commentCount': number;
        'atlassian:subscriberCount': number;
        tag: {
            '@type': string;
            name: string;
            appearance: string;
        };
        taskType: {
            '@type': string[];
            '@id': string;
            name: string;
            icon: {
                '@type': string;
                url: string;
            };
        };
        icon: {
            '@type': string;
            url: string;
        };
        attributedTo: {
            '@type': string;
            name: string;
        };
        url: string;
        'atlassian:priority': {
            '@type': string;
            name: string;
            icon: {
                '@type': string;
                url: string;
            };
        };
        'atlassian:serverAction': {
            '@type': string;
            name: string;
            dataRetrievalAction: {
                '@type': string;
                name: SmartLinkActionType;
            };
            dataUpdateAction: {
                '@type': string;
                name: SmartLinkActionType;
            };
            refField: string;
            resourceIdentifiers: {
                issueKey: string;
                hostname: string;
            };
        }[];
    };
} = {
    meta: {
        auth: [],
        definitionId: 'jira-object-provider',
        visibility: 'restricted',
        access: 'granted',
        resourceType: 'issue',
        key: 'jira-object-provider',
        objectId: 'task-id',
        tenantId: 'jira-tenant',
    },
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
        '@type': ['atlassian:Task', 'Object'],
        name: 'Flexible UI Task',
        'schema:dateCreated': '2021-10-19T11:35:10.027+1100',
        updated: '2021-12-16T10:47:20.054+1100',
        'schema:commentCount': 1,
        'atlassian:subscriberCount': 2,
        tag: {
            '@type': 'Object',
            name: '(Awaiting) Deployment',
            appearance: 'success',
        },
        taskType: {
            '@type': ['Object', 'atlassian:TaskType'],
            '@id': 'https://www.atlassian.com/#JiraCustomTaskType',
            name: 'Task',
            icon: {
                '@type': 'Image',
                url: 'https://icon-url',
            },
        },
        icon: {
            '@type': 'Image',
            url: 'https://icon-url',
        },
        attributedTo: { '@type': 'Person', name: 'Fluffy Fluffington' },
        url: 'https://jira-url/browse/id',
        'atlassian:priority': {
            '@type': 'Object',
            name: 'Major',
            icon: {
                '@type': 'Image',
                url: 'https://priority-icon-url',
            },
        },
        'atlassian:serverAction': [
            {
                '@type': 'UpdateAction',
                name: 'UpdateAction',
                dataRetrievalAction: {
                    '@type': 'ReadAction',
                    name: SmartLinkActionType.GetStatusTransitionsAction,
                },
                dataUpdateAction: {
                    '@type': 'UpdateAction',
                    name: SmartLinkActionType.StatusUpdateAction,
                },
                refField: 'tag',
                resourceIdentifiers: {
                    issueKey: 'some-id',
                    hostname: 'some-hostname',
                },
            },
        ],
    },
};
export default _default_1;
