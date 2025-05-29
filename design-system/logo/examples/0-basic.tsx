/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import kebabCase from 'lodash/kebabCase';

import { legacyOnlyLogosAndIcons, newOnlyLogosAndIcons, sharedLogosAndIcons } from './utils/list';

const styles = css({ marginBlockEnd: '2rem' });
const LogoTable = ({ title, logos }: { title: string; logos: typeof legacyOnlyLogosAndIcons }) => (
	<div css={styles}>
		<h3>{title}</h3>
		<table>
			<thead>
				<tr>
					<th>Logo</th>
					<th>Icon</th>
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
							<td>
								<Icon size="small" testId={`${kebabName}-icon`} />
							</td>
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
			<LogoTable title="Legacy-only Logos" logos={legacyOnlyLogosAndIcons} />
			<LogoTable title="Shared Logos (Feature Flagged)" logos={sharedLogosAndIcons} />
			<LogoTable title="New-only Logos" logos={newOnlyLogosAndIcons} />
		</div>
	);
};
