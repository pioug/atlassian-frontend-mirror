/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import PageHeader from '@atlaskit/page-header';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	selectContainer: {
		flex: '0 0 200px',
		marginInlineStart: token('space.100'),
	},

	flexBox: {
		flex: '0 0 200px',
	},
});

const breadcrumbs = (
	<Breadcrumbs onExpand={__noop}>
		<BreadcrumbsItem text="Teams" key="Teams" />
		<BreadcrumbsItem text="Design System Team" key="Design System Team" />
	</Breadcrumbs>
);
const actionsContent = (
	<ButtonGroup label="Content actions">
		<Button appearance="primary">Edit page</Button>
		<Button>Share</Button>
		<Button>...</Button>
	</ButtonGroup>
);
const barContent = (
	<Inline>
		<Box xcss={styles.flexBox}>
			<TextField isCompact placeholder="Filter" aria-label="Filter" />
		</Box>
		<Box xcss={styles.selectContainer}>
			<Select spacing="compact" placeholder="Choose an option" aria-label="Choose an option" />
		</Box>
	</Inline>
);

const PageHeaderComplexExample = () => {
	return (
		<PageHeader breadcrumbs={breadcrumbs} actions={actionsContent} bottomBar={barContent}>
			Introducing the Design System Team
		</PageHeader>
	);
};

export default PageHeaderComplexExample;
