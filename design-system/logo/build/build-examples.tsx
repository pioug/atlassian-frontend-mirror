import path from 'path';

import fs from 'fs-extra';

import format from '@af/formatting/sync';

import {
	AGENT_LOGO_DOCS_ORDER,
	APP_LOGO_DOCS_ORDER,
	logoDocsSchema,
	PROGRAM_LOGO_DOCS_ORDER,
	SHARED_LOGOS,
} from '../src/logo-config';

const RELATIVE_GENERATED_EXAMPLES_DIR = '../examples/constellation/generated';
const GENERATED_EXAMPLES_DIR = path.join(__dirname, RELATIVE_GENERATED_EXAMPLES_DIR);
const DOCS_DIR = path.join(__dirname, '../constellation/index');
const LOGOS_ORDER = [...PROGRAM_LOGO_DOCS_ORDER, ...APP_LOGO_DOCS_ORDER, ...AGENT_LOGO_DOCS_ORDER];

const logoSpecialDescriptions: Record<string, string> = {
	loom: '`Loom` can be displayed in either blue, or Loom Blurple.',
	align: '`Align` replaces the deprecated `Jira Align` logo components.',
	analytics: '`Analytics` replaces the deprecated `Atlassian Analytics` logo components.',
	admin:
		'`Admin` replaces the deprecated `Atlassian Administration` and `Atlassian Admin` logo components.',
};

// In case a logo needs a custom implementation, add it to this list and it won't be regenerated
const MANUAL_EXAMPLES = ['loom', 'loom-blurple'];
const MANUAL_EXAMPLE_FILES = MANUAL_EXAMPLES.map((name) => `logo-${name}.tsx`);

// Template for individual logo examples
const generateLogoExampleTemplate = (
	name: string,
	shouldUseNewLogoDesign: boolean,
	skipLogo: boolean = false,
) => `
import React from 'react';


import { ${name}Icon${skipLogo ? '' : `, ${name}Logo`} } from '@atlaskit/logo';

import LogoTable from '../utils/logo-table';

export default (): React.JSX.Element =>
		<LogoTable
			${skipLogo ? '' : `logo={<${name}Logo appearance="brand" ${shouldUseNewLogoDesign ? 'shouldUseNewLogoDesign' : ''} />}`}
			icon={<${name}Icon appearance="brand" ${shouldUseNewLogoDesign ? 'shouldUseNewLogoDesign' : ''} />}
		/>
`;

/**
 * Process a logo name to a consistent format, e.g. `jira-service-management` -> `JiraServiceManagement`
 *
 * @param name - The name of the logo
 * @returns The processed name
 */
const processLogoName = (name: string) => {
	// First split by any non-alphanumeric characters and remove empty strings
	const words = name.split(/[^a-zA-Z0-9]+/).filter(Boolean);
	// Capitalize each word and join them
	return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
};

/**
 * Generate examples for all logos, and places them in the generated examples directory
 */
const generateLogoExamples = () => {
	// Ensure directories exist and are empty
	if (!fs.existsSync(GENERATED_EXAMPLES_DIR)) {
		fs.mkdirSync(GENERATED_EXAMPLES_DIR, { recursive: true });
		fs.readdirSync(GENERATED_EXAMPLES_DIR).forEach((file) => {
			if (!['README.md', ...MANUAL_EXAMPLE_FILES].includes(file)) {
				fs.removeSync(path.join(GENERATED_EXAMPLES_DIR, file));
			}
		});
	}

	// Generate examples for all logos
	LOGOS_ORDER.forEach((name) => {
		if (MANUAL_EXAMPLES.includes(name)) {
			return;
		}
		const componentName = processLogoName(name);
		const fileName = `logo-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.tsx`;
		const content = generateLogoExampleTemplate(
			componentName,
			SHARED_LOGOS.find((logo) => logo.name === name)?.type === 'migration',
			logoDocsSchema.find((logo) => logo.name === name)?.skipLogo,
		);
		fs.ensureFileSync(path.join(GENERATED_EXAMPLES_DIR, fileName));
		fs.writeFileSync(path.join(GENERATED_EXAMPLES_DIR, fileName), format(content, 'tsx'));
	});
};

/**
 * Generates the atlassian.design `examples` page, in the order provided by the logo config
 */
const generateDocumentation = () => {
	const docContent = `---
order: 0
---

import LogoIcon from '../../examples/constellation/logo-icon';
import LogoXxsmall from '../../examples/constellation/logo-xxsmall';
import LogoXsmall from '../../examples/constellation/logo-xsmall';
import LogoSmall from '../../examples/constellation/logo-small';
import LogoMedium from '../../examples/constellation/logo-medium';
import LogoLarge from '../../examples/constellation/logo-large';
import LogoXlarge from '../../examples/constellation/logo-xlarge';
import LogoBrand from '../../examples/constellation/logo-brand';
import LogoInverse from '../../examples/constellation/logo-inverse';
import LogoNeutral from '../../examples/constellation/logo-neutral';
import LogoDefault from '../../examples/constellation/logo-default';
${LOGOS_ORDER.map((logo) => {
	const fileName = logo.toLowerCase().replace(/[^a-z0-9]/g, '-');
	const componentName = processLogoName(logo);
	return `import Logo${componentName} from '../${RELATIVE_GENERATED_EXAMPLES_DIR}/logo-${fileName}';`;
}).join('\n')}

import { Code } from '@atlaskit/code';
import SectionMessage from '@atlaskit/section-message';

<SectionMessage appearance="discovery">
	We are in the process of rolling out updated Logo designs to apps behind a feature flag. <br/>
	To display the new designs early, set the <Code>shouldUseNewLogoDesign</Code> prop to <Code>true</Code>.
</SectionMessage>

## Types

### Icon

An icon is an image or symbol that represents a brand or app. It generally does not contain the
name of the brand or app.

<Example Component={LogoIcon} packageName="@atlaskit/logo" />

### Lockup

A lockup is the combination of wordmark (the brand or app name) and its icon, generally referred
altogether as a logo.

<Example Component={LogoBrand} packageName="@atlaskit/logo" />

## Appearance

By default, the lockup and icon inherit their colors from the parent element, however, this can lead
to incorrect color combinations. Moving forward, all usages of \`@atlaskit/logo\` should use the
\`appearance\` prop to choose between three brand-approved appearances: brand, neutral, and inverse.

### Brand

Brand app logos are used in situations that demand a bold brand presence against a neutral
background.

<Example Component={LogoBrand} packageName="@atlaskit/logo" backgroundColor="white" />

### Neutral

Neutral app logos can be used when the hierarchy calls for the logo to recede, but should always
be evaluated for adequate contrast.

<Example Component={LogoNeutral} packageName="@atlaskit/logo" backgroundColor="neutral" />

### Inverse

Inverse app logos should be used to contrast against bold backgrounds.

<Example Component={LogoInverse} packageName="@atlaskit/logo" backgroundColor="blue" />

## Size

### Xxsmall
The \`xxsmall\` size (16px) is the smallest available size.

<Example Component={LogoXxsmall} packageName="@atlaskit/logo" />

### Xsmall

The \`xsmall\` size (20px) can be used in compact UI elements.

<Example Component={LogoXsmall} packageName="@atlaskit/logo" />

### Small

The \`small\` size (24px) can be used in areas with minimal space or that contain many logos in close
proximity. For example, the icon component, the marketing footer, or the emoji picker.

<Example Component={LogoSmall} packageName="@atlaskit/logo" />

### Medium

The \`medium\` size (32px) is the default size.

<Example Component={LogoMedium} packageName="@atlaskit/logo" />

### Large

The \`large\` size (40px) can be used for prominent placements.

<Example Component={LogoLarge} packageName="@atlaskit/logo" />

### Xlarge

The \`xlarge\` size (48px) is rarely used. It may be used for a hero piece. For example, Statuspage's
login.

<Example Component={LogoXlarge} packageName="@atlaskit/logo" />

## Company / Program logos

${[...PROGRAM_LOGO_DOCS_ORDER]
	.map(
		(name) => `
### ${name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')}

<Example Component={Logo${processLogoName(name)}} packageName="@atlaskit/logo" />`,
	)
	.join('\n')}

## App (Product) logos

${[...APP_LOGO_DOCS_ORDER]
	.map(
		(name) => `
### ${name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')}
${logoSpecialDescriptions[name] ? `\n${logoSpecialDescriptions[name]}\n` : ''}
<Example Component={Logo${processLogoName(name)}} packageName="@atlaskit/logo" />`,
	)
	.join('\n')}
`;

	fs.ensureFileSync(path.join(DOCS_DIR, 'examples.mdx'));
	fs.writeFileSync(path.join(DOCS_DIR, 'examples.mdx'), docContent);
};

// Run the generators
generateLogoExamples();
generateDocumentation();
