const _default_1: {
    data: {
        '@context': {
            '@vocab': string;
            atlassian: string;
            schema: string;
        };
        '@type': string[];
        generator: {
            '@id': string;
            '@type': string;
            name: string;
        };
        icon: undefined;
        name: string;
        summary: string;
        'atlassian:titlePrefix': {
            '@type': string;
            text: string;
        };
        url: string;
    };
    meta: {
        access: string;
        auth: never[];
        definitionId: string;
        objectId: string;
        resourceType: string;
        tenantId: string;
        visibility: string;
    };
} = {
    data: {
        '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
        },
        '@type': ['Document', 'atlassian:Template'],
        generator: {
            '@id': 'https://www.atlassian.com/#Confluence',
            '@type': 'Application',
            name: 'Confluence',
        },
        icon: undefined,
        name: 'templateName_4815162342',
        summary: 'Description for templateName_4815162342',
        'atlassian:titlePrefix': {
            '@type': 'atlassian:Emoji',
            text: '',
        },
        url: 'https://confluence-url/wiki/spaces/space-id/pages/page-id',
    },
    meta: {
        access: 'granted',
        auth: [],
        definitionId: 'confluence-object-provider',
        objectId: 'template-id',
        resourceType: 'template',
        tenantId: 'confluence-tenant',
        visibility: 'restricted',
    },
};
export default _default_1;
