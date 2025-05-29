import path from 'path';

import fs from 'fs-extra';

import format from '@af/formatting/sync';
import { createSignedArtifact } from '@atlassian/codegen';

import { LEGACY_ONLY_LOGOS, NEW_ONLY_LOGOS, SHARED_LOGOS } from '../src/logo-config';

const EXAMPLES_DIR = path.join(__dirname, '../examples/constellation');
const DOCS_DIR = path.join(__dirname, '../constellation/index');

// Helper function to process logo names consistently
const processLogoName = (name: string) => {
	// First split by any non-alphanumeric characters and remove empty strings
	const words = name.split(/[^a-zA-Z0-9]+/).filter(Boolean);
	// Capitalize each word and join them
	return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
};

// Template for individual logo examples
const generateLogoExampleTemplate = (name: string) => `
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { ${name}Icon, ${name}Logo } from '@atlaskit/logo';

const tableStyle = css({
	width: '415px',
});

const Logo${name} = () => {
	return (
		<div>
			<table>
				<thead>
					<tr>
						<th>Logo</th>
						${'<th>Icon</th>'}
					</tr>
				</thead>
				<tbody>
					<tr>
						<td css={tableStyle}>
							<${name}Logo appearance="brand" />
						</td>
						${`<td><${name}Icon appearance="brand" /></td>`}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Logo${name};
`;

// Generate examples for all logos
const generateLogoExamples = () => {
	// Ensure directories exist
	if (!fs.existsSync(EXAMPLES_DIR)) {
		fs.mkdirSync(EXAMPLES_DIR, { recursive: true });
	}

	// Generate examples for all logos
	[...LEGACY_ONLY_LOGOS, ...SHARED_LOGOS, ...NEW_ONLY_LOGOS].forEach((name) => {
		const componentName = processLogoName(name);
		const fileName = `logo-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.tsx`;
		const content = generateLogoExampleTemplate(componentName);
		fs.ensureFileSync(path.join(EXAMPLES_DIR, fileName));
		fs.writeFileSync(
			path.join(EXAMPLES_DIR, fileName),
			format(
				createSignedArtifact(content, 'yarn workspace @atlaskit/logo generate:examples'),
				'tsx',
			),
		);
	});
};

// Generate the documentation
const generateDocumentation = () => {
	const docContent = `
---
order: 0
---

import LogoIcon from '../../examples/constellation/logo-icon';
import LogoSmall from '../../examples/constellation/logo-small';
import LogoMedium from '../../examples/constellation/logo-medium';
import LogoLarge from '../../examples/constellation/logo-large';
import LogoBrand from '../../examples/constellation/logo-brand';
import LogoInverse from '../../examples/constellation/logo-inverse';
import LogoNeutral from '../../examples/constellation/logo-neutral';
import LogoDefault from '../../examples/constellation/logo-default';
${[...LEGACY_ONLY_LOGOS, ...SHARED_LOGOS, ...NEW_ONLY_LOGOS]
	.map((logo) => {
		const fileName = logo.toLowerCase().replace(/[^a-z0-9]/g, '-');
		const componentName = processLogoName(logo);
		return `import Logo${componentName} from '../../examples/constellation/logo-${fileName}';`;
	})
	.join('\n')}

## Types

### Icon

An icon is an image or symbol that represents a brand or product. It generally does not contain the
name of the brand or product.

<Example Component={LogoIcon} packageName="@atlaskit/logo" />

### Lockup

A lockup is the combination of wordmark (the brand or product name) and its icon, generally referred
altogether as a logo.

<Example Component={LogoBrand} packageName="@atlaskit/logo" />

## Appearance

By default, the lockup and icon inherit their colors from the parent element, however, this can lead
to incorrect color combinations. Moving forward, all usages of \`@atlaskit/logo\` should use the
\`appearance\` prop to choose between three brand-approved appearances: brand, neutral, and inverse.

### Brand

Brand product logos are used in situations that demand a bold brand presence against a neutral
background.

<Example Component={LogoBrand} packageName="@atlaskit/logo" backgroundColor="white" />

### Neutral

Neutral product logos can be used when the hierarchy calls for the logo to recede, but should always
be evaluated for adequate contrast.

<Example Component={LogoNeutral} packageName="@atlaskit/logo" backgroundColor="neutral" />

### Inverse

Inverse product logos should be used to contrast against bold backgrounds.

<Example Component={LogoInverse} packageName="@atlaskit/logo" backgroundColor="blue" />

## Size

### Small

Use the \`small\` logo in areas with minimal space or that contain many logos in close proximity. For
example, the icon component, the marketing footer, or the emoji picker.

<Example Component={LogoSmall} packageName="@atlaskit/logo" />

### Medium

The \`medium\` size (32px) is the default size.

<Example Component={LogoMedium} packageName="@atlaskit/logo" />

### Large

The \`large\` size (56px) is rarely used. It may be used for a hero piece. For example, Statuspage's
login.

<Example Component={LogoLarge} packageName="@atlaskit/logo" />

## Product logos

${[...LEGACY_ONLY_LOGOS, ...SHARED_LOGOS]
	.sort((a, b) => {
		if (a === 'atlassian') {
			return -1;
		}
		if (b === 'atlassian') {
			return 1;
		}
		return a.localeCompare(b);
	})
	.map(
		(name) => `
### ${name
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')}

<Example Component={Logo${processLogoName(name)}} packageName="@atlaskit/logo" />`,
	)
	.join('\n')}

${NEW_ONLY_LOGOS.map(
	(name) => `### ${name
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')}

<Example Component={Logo${processLogoName(name)}} packageName="@atlaskit/logo" />`,
).join('\n')}

`;

	fs.ensureFileSync(path.join(DOCS_DIR, 'examples.mdx'));
	fs.writeFileSync(path.join(DOCS_DIR, 'examples.mdx'), docContent);
};

// Run the generators
generateLogoExamples();
generateDocumentation();
