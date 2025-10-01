/*
Unlike its sister icon info files, this one is manually curated
*/

import {
	AtlassianIcon,
	BitbucketIcon,
	ConfluenceIcon,
	JiraSoftwareIcon,
	JiraIcon,
	StatuspageIcon,
} from '@atlaskit/logo';

type IconInfo = {
    componentName: string;
    isNamedImport: boolean;
    component: any;
    keywords: string[];
    package: string;
};

const LogoIcons: {
    AtlassianIcon: IconInfo;
    BitbucketIcon: IconInfo;
    ConfluenceIcon: IconInfo;
    JiraSoftwareIcon: IconInfo;
    JiraIcon: IconInfo;
    StatuspageIcon: IconInfo;
} = {
    AtlassianIcon: {
        componentName: 'AtlassianIcon',
        isNamedImport: true,
        component: AtlassianIcon,
        keywords: ['product', 'app', 'logo', 'atlassian'],
        package: '@atlaskit/logo',
    },
    BitbucketIcon: {
        componentName: 'BitbucketIcon',
        isNamedImport: true,
        component: BitbucketIcon,
        keywords: ['product', 'app', 'logo', 'bitbucket'],
        package: '@atlaskit/logo',
    },
    ConfluenceIcon: {
        componentName: 'ConfluenceIcon',
        isNamedImport: true,
        component: ConfluenceIcon,
        keywords: ['product', 'app', 'logo', 'confluence'],
        package: '@atlaskit/logo',
    },
    JiraSoftwareIcon: {
        componentName: 'JiraSoftwareIcon',
        isNamedImport: true,
        component: JiraSoftwareIcon,
        keywords: ['product', 'app', 'logo', 'jira', 'software'],
        package: '@atlaskit/logo',
    },
    JiraIcon: {
        componentName: 'JiraIcon',
        isNamedImport: true,
        component: JiraIcon,
        keywords: ['product', 'app', 'logo', 'jira'],
        package: '@atlaskit/logo',
    },
    StatuspageIcon: {
        componentName: 'StatuspageIcon',
        isNamedImport: true,
        component: StatuspageIcon,
        keywords: ['product', 'app', 'logo', 'statuspage'],
        package: '@atlaskit/logo',
    },
};
export default LogoIcons;
