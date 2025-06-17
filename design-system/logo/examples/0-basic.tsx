/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import kebabCase from 'lodash/kebabCase';

import { legacyOnlyLogosAndIcons, newOnlyLogosAndIcons, sharedLogosAndIcons } from './utils/list';

const styles = css({ marginBlockEnd: '2rem' });
const LogoTable = ({
	title,
	logos,
	showFeatureFlaggedLogos,
}: {
	title: string;
	logos: typeof sharedLogosAndIcons;
	showFeatureFlaggedLogos?: boolean;
}) => (
	<div css={styles}>
		<h3>{title}</h3>
		<table>
			<thead>
				<tr>
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

const deprecatedLogos = ['Jira Work Management', 'Jira Software'];

export default () => {
	return (
		<div>
			<LogoTable
				title="Program Logos"
				logos={legacyOnlyLogosAndIcons.filter((logo) => !deprecatedLogos.includes(logo.name))}
			/>
			<LogoTable
				title="App Logos (new designs enabled via feature flag / shouldUseNewLogoDesign)"
				logos={sharedLogosAndIcons}
				showFeatureFlaggedLogos
			/>
			<LogoTable title="App Logos (new designs only)" logos={newOnlyLogosAndIcons} />
			<LogoTable
				title="Deprecated Logos"
				logos={legacyOnlyLogosAndIcons.filter((logo) => deprecatedLogos.includes(logo.name))}
			/>
		</div>
	);
};
