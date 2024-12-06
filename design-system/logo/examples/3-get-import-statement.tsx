/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component, type ComponentType } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import CodeBlock from '@atlaskit/code/block';
import { Fieldset, Label } from '@atlaskit/form';
import * as Logos from '@atlaskit/logo';
import type { LogoProps as ConstantProps } from '@atlaskit/logo';
import { Grid } from '@atlaskit/primitives';
import Select, { type ValueType } from '@atlaskit/select';

interface Product {
	label: string;
	value: string;
	isProperty?: boolean;
}
type File = Product;

const products: Product[] = [
	{ label: 'Atlassian', value: 'Atlassian' },
	{ label: 'AtlassianStart', value: 'AtlassianStart', isProperty: true },
	{ label: 'Bitbucket', value: 'Bitbucket' },
	{ label: 'Compass', value: 'Compass' },
	{ label: 'Confluence', value: 'Confluence' },
	{ label: 'Focus', value: 'Focus' },
	{ label: 'Halp', value: 'Halp' },
	{ label: 'Jira', value: 'Jira' },
	{ label: 'JiraServiceManagement', value: 'JiraServiceManagement' },
	{ label: 'JiraSoftware', value: 'JiraSoftware' },
	{ label: 'JiraWorkManagement', value: 'JiraWorkManagement' },
	{ label: 'Opsgenie', value: 'Opsgenie' },
	{ label: 'StatusPage', value: 'StatusPage' },
	{ label: 'Trello', value: 'Trello' },
	{ label: 'Atlas', value: 'Atlas' },
	{ label: 'AtlassianMarketplace', value: 'AtlassianMarketplace' },
	{ label: 'Rovo', value: 'Rovo' },
	{ label: 'Guard', value: 'Guard' },
	{ label: 'AtlassianAdmin', value: 'AtlassianAdmin' },
	{ label: 'AtlassianAdministration', value: 'AtlassianAdministration' },
	{ label: 'AtlassianAccess', value: 'AtlassianAccess' },
	{ label: 'Loom', value: 'Loom' },
	{ label: 'LoomAttribution', value: 'LoomAttribution' },
];

const files: File[] = [
	{ label: 'Logo', value: 'Logo' },
	{ label: 'Icon', value: 'Icon' },
];
export default class GetPath extends Component<any, any> {
	state = {
		selectedProduct: products[0],
		selectedFile: files[0],
	};

	render() {
		const { selectedFile, selectedProduct } = this.state;

		const name = selectedProduct.value + selectedFile.value;
		const OurComponent = (
			Logos as {
				[key: string]: ComponentType<ConstantProps>;
			}
		)[name];

		// There is no icon or wordmark file available for property logos
		const fileOptions: File[] = selectedProduct.isProperty
			? files.filter((file) => file.value === 'Logo')
			: files;

		const productOptions: Product[] =
			selectedFile.value !== 'Logo' ? products.filter((product) => !product.isProperty) : products;

		return (
			<div>
				<Fieldset legend="Select the product and the component you want to fetch from">
					<Grid templateColumns="1fr 1fr" gap="space.200">
						<div>
							<Label htmlFor="product">Product</Label>
							<Select
								inputId="product"
								options={productOptions}
								value={selectedProduct}
								onChange={(product: ValueType<Product>) =>
									this.setState({ selectedProduct: product })
								}
							/>
						</div>
						<div>
							<Label htmlFor="logo">Logo</Label>
							<Select
								inputId="logo"
								options={fileOptions}
								value={selectedFile}
								onChange={(file: ValueType<File>) => this.setState({ selectedFile: file })}
							/>
						</div>
					</Grid>
					<p>Use the following import statement to render the logo</p>
					<CodeBlock language="javascript" text={`import { ${name} } from '@atlaskit/logo'`} />
					<OurComponent />
				</Fieldset>
			</div>
		);
	}
}
