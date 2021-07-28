/** @jsx jsx */
import { Component, ComponentType } from 'react';

import { css, jsx } from '@emotion/core';

import CodeBlock from '@atlaskit/code/block';
import Select, { ValueType } from '@atlaskit/select';

import * as Logos from '../src';
import type { Props as ConstantProps } from '../src/constants';

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
  { label: 'Halp', value: 'Halp' },
  { label: 'Jira', value: 'Jira' },
  { label: 'JiraServiceManagement', value: 'JiraServiceManagement' },
  { label: 'JiraSoftware', value: 'JiraSoftware' },
  { label: 'JiraWorkManagement', value: 'JiraWorkManagement' },
  { label: 'Opsgenie', value: 'Opsgenie' },
  { label: 'StatusPage', value: 'StatusPage' },
  { label: 'Trello', value: 'Trello' },
];

const files: File[] = [
  { label: 'Logo', value: 'Logo' },
  { label: 'Icon', value: 'Icon' },
  { label: 'Wordmark', value: 'Wordmark' },
];

const selectWrapperStyles = css({
  display: 'inline-block',
  width: '200px',
  padding: '20px',
});

const SelectWrapper = ({ ...rest }) => {
  return <div css={selectWrapperStyles} {...rest} />;
};

export default class GetPath extends Component<any, any> {
  state = {
    selectedProduct: products[0],
    selectedFile: files[0],
  };

  render() {
    const { selectedFile, selectedProduct } = this.state;

    const name = selectedProduct.value + selectedFile.value;
    const OurComponent = (Logos as {
      [key: string]: ComponentType<ConstantProps>;
    })[name];

    // There is no icon or wordmark file available for property logos
    const fileOptions: File[] = selectedProduct.isProperty
      ? files.filter((file) => file.value === 'Logo')
      : files;

    const productOptions: Product[] =
      selectedFile.value !== 'Logo'
        ? products.filter((product) => !product.isProperty)
        : products;

    return (
      <div>
        <p>Select the product and the component you want to fetch from:</p>
        <SelectWrapper>
          <Select
            options={productOptions}
            value={selectedProduct}
            onChange={(product: ValueType<Product>) =>
              this.setState({ selectedProduct: product })
            }
          />
        </SelectWrapper>
        <SelectWrapper>
          <Select
            options={fileOptions}
            value={selectedFile}
            onChange={(file: ValueType<File>) =>
              this.setState({ selectedFile: file })
            }
          />
        </SelectWrapper>
        <p>This import statement will render the image below:</p>
        <CodeBlock
          language="javascript"
          text={`import { ${name} } from '@atlaskit/logo'`}
        />
        <OurComponent />
      </div>
    );
  }
}
