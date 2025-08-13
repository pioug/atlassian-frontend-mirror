/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import { cssMap, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { HomeIcon } from '@atlaskit/logo';
import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { TopNav, TopNavStart } from '@atlaskit/navigation-system/layout/top-nav';
import { AppLogo } from '@atlaskit/navigation-system/top-nav-items';
import PageHeader from '@atlaskit/page-header';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const advancedLayoutStyles = cssMap({
	root: {
		display: 'grid',
		height: '100%',
		width: '100%',
		gridTemplateAreas: `
				"header"
				"main"
				"aside"
			`,
		gridTemplateRows: 'auto auto auto',
		gridTemplateColumns: '1fr',
		'@media (min-width: 90rem)': {
			gridTemplateAreas: `
				"header header"
				"main aside"
			`,
			gridTemplateRows: 'auto 1fr',
			gridTemplateColumns: '1fr 400px',
		},
	},
	header: {
		gridArea: 'header',
		borderBlockEndColor: token('color.border'),
		borderBlockEndStyle: 'solid',
		borderBlockEndWidth: token('border.width'),
		paddingInline: token('space.400'),
	},
	main: {
		gridArea: 'main',
		paddingInline: token('space.400'),
		paddingBlock: token('space.400'),
		'@media (min-width: 90rem)': {
			overflow: 'auto',
		},
	},
	aside: {
		gridArea: 'aside',
		paddingInline: token('space.400'),
		paddingBlock: token('space.400'),

		borderColor: token('color.border'),
		borderWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		'@media (min-width: 90rem)': {
			borderBlockStartStyle: 'none',
			borderInlineStartStyle: 'solid',
			overflow: 'auto',
		},
	},
});

function LoremSection() {
	return (
		<div>
			<Heading as="h3" size="small">
				Section
			</Heading>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi nemo quo soluta sapiente
				delectus beatae tenetur, voluptatibus sit temporibus ullam illum aut voluptas dolorum
				inventore ex, dolorem natus impedit? Sequi.
			</p>
			<p>
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minus quae laboriosam tempore sit
				inventore, temporibus atque praesentium sed molestiae adipisci architecto ipsam reiciendis
				unde dicta! Corporis nam repellat nostrum harum?
			</p>
			<p>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. A vero maiores aperiam harum vel
				pariatur nesciunt eius fugit aliquid molestias dolorem voluptates et, exercitationem maxime
				esse molestiae ipsum quibusdam sint.
			</p>
		</div>
	);
}

export const AdvancedLayoutExample = () => (
	<Root>
		<TopNav>
			<TopNavStart>
				<AppLogo href="" icon={HomeIcon} name="Home" label="Home page" />
			</TopNavStart>
		</TopNav>
		<Main>
			<div css={advancedLayoutStyles.root}>
				<div css={advancedLayoutStyles.header}>
					<PageHeader
						breadcrumbs={
							<Breadcrumbs>
								<BreadcrumbsItem text="Projects" />
								<BreadcrumbsItem text="ABC-123" />
							</Breadcrumbs>
						}
					>
						My project
					</PageHeader>
				</div>
				<div css={advancedLayoutStyles.main}>
					<Stack space="space.400">
						<Heading as="h2" size="medium">
							This example showcases how you can compose your own advanced layout inside of the
							`Main` layout area.
						</Heading>
						<LoremSection />
						<LoremSection />
						<LoremSection />
						<LoremSection />
					</Stack>
				</div>
				<aside css={advancedLayoutStyles.aside}>
					<Stack space="space.400">
						<Heading as="h2" size="medium">
							Aside
						</Heading>
						<LoremSection />
						<LoremSection />
						<LoremSection />
						<LoremSection />
					</Stack>
				</aside>
			</div>
		</Main>
	</Root>
);

export default AdvancedLayoutExample;
