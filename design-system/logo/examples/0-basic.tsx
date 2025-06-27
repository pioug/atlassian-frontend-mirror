/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import kebabCase from 'lodash/kebabCase';

import { css, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';

import {
	deprecatedLogos,
	legacyOnlyLogosAndIcons,
	migrationLogosAndIcons,
	newOnlyLogosAndIcons,
} from './utils/list';

const pageStyles = css({
	padding: 'var(--ds-space-200)',
	marginBlockEnd: 'var(--ds-space-300)',
});

const nameColumnStyles = css({
	width: '210px',
});

const LogoTable = ({
	title,
	logos,
	showFeatureFlaggedLogos,
}: {
	title: string;
	logos: typeof migrationLogosAndIcons;
	showFeatureFlaggedLogos?: boolean;
}) => (
	<div css={pageStyles}>
		<Heading size="medium">{title}</Heading>
		<table>
			<thead>
				<tr>
					<th css={nameColumnStyles}>Name</th>
					<th>Logo</th>
					{showFeatureFlaggedLogos && (
						<th>
							Logo <br />
							(new design)
						</th>
					)}
					<th>Icon</th>
					{showFeatureFlaggedLogos && (
						<th>
							Icon <br />
							(new design)
						</th>
					)}
				</tr>
			</thead>
			<tbody>
				{logos.map(({ name, logo: Logo, icon: Icon }) => {
					const kebabName = kebabCase(name);

					return (
						<tr key={name}>
							<td>{name}</td>
							<td>
								<Logo testId={`${kebabName}-logo`} />
							</td>
							{showFeatureFlaggedLogos && (
								<td>
									<Logo testId={`${kebabName}-logo`} shouldUseNewLogoDesign />
								</td>
							)}
							<td>
								<Icon size="medium" testId={`${kebabName}-icon`} />
							</td>
							{showFeatureFlaggedLogos && (
								<td>
									<Icon size="medium" testId={`${kebabName}-icon`} shouldUseNewLogoDesign />
								</td>
							)}
						</tr>
					);
				})}
			</tbody>
		</table>
	</div>
);

export default () => {
	return (
		<div>
			<LogoTable title="Program Logos" logos={legacyOnlyLogosAndIcons} />
			<LogoTable
				title="App Logos (new designs enabled via feature flag / shouldUseNewLogoDesign)"
				logos={migrationLogosAndIcons}
				showFeatureFlaggedLogos
			/>
			<LogoTable title="App Logos (new designs only)" logos={newOnlyLogosAndIcons} />
			<LogoTable title="Deprecated Logos" logos={deprecatedLogos} />
		</div>
	);
};
