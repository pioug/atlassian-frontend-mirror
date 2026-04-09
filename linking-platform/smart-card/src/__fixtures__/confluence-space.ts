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
        url: string;
        icon: {
            '@type': string;
            url: string;
        };
        name: string;
        'atlassian:state': string;
        summary: string;
        'atlassian:titlePrefix': {
            text: string;
            '@type': string;
        };
    };
} = {
    meta: {
        auth: [],
        definitionId: 'confluence-object-provider',
        visibility: 'restricted',
        access: 'granted',
        resourceType: 'space',
        key: 'confluence-object-provider',
        objectId: 'space-id',
        tenantId: 'confluence-tenant',
    },
    data: {
        '@context': {
            '@vocab': 'https://www.w3.org/ns/activitystreams#',
            atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
            schema: 'http://schema.org/',
        },
        generator: {
            '@type': 'Application',
            '@id': 'https://www.atlassian.com/#Confluence',
            name: 'Confluence',
        },
        '@type': ['Object', 'atlassian:Project'],
        url: 'https://confluence-url/wiki/spaces/space-id',
        icon: {
            '@type': 'Image',
            url: 'https://icon-url',
        },
        name: 'ShipIt',
        'atlassian:state': 'current',
        summary: '',
        'atlassian:titlePrefix': { text: '', '@type': 'atlassian:Emoji' },
    },
};
export default _default_1;
