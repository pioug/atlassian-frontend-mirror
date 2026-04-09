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
        name: string;
        'atlassian:state': string;
        summary: string;
        'schema:commentCount': number;
        'atlassian:subscriberCount': number;
        'atlassian:titlePrefix': {
            text: string;
            '@type': string;
        };
        'atlassian:attributedTo': {
            '@type': string;
            name: string;
            icon: string;
        };
        'atlassian:ownedBy': {
            '@type': string;
            name: string;
            icon: string;
        };
        preview: {
            '@type': string;
            href: string;
            'atlassian:supportedPlatforms': string[];
        };
    };
} = {
    meta: {
        auth: [],
        definitionId: 'confluence-object-provider',
        visibility: 'restricted',
        access: 'granted',
        resourceType: 'blog',
        key: 'confluence-object-provider',
        objectId: 'blog-id',
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
        '@type': ['Document', 'schema:BlogPosting'],
        url: 'https://confluence-url/wiki/spaces/space-id/blog/blog-id',
        name: 'Announcing the winners of the Customer Fun Award for ShipIt 53',
        'atlassian:state': 'current',
        summary: 'A few weeks ago, we announced a brand new award for ShipIt - the Customer Fun Award. The goal was to generate ideas to create fun experiences in our new product, Canvas.',
        'schema:commentCount': 7,
        'atlassian:subscriberCount': 17,
        'atlassian:titlePrefix': {
            text: '"1f3c6"',
            '@type': 'atlassian:Emoji',
        },
        'atlassian:attributedTo': {
            '@type': 'Person',
            name: 'Angie Mccarthy',
            icon: 'https://person-url',
        },
        'atlassian:ownedBy': {
            '@type': 'Person',
            name: 'Angie Mccarthy',
            icon: 'https://person-url',
        },
        preview: {
            '@type': 'Link',
            href: 'https://preview-url',
            'atlassian:supportedPlatforms': ['web'],
        },
    },
};
export default _default_1;
