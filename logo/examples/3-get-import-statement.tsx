import React, { Component, ComponentType } from 'react';
import { AkCodeBlock } from '@atlaskit/code';
import Select, { ValueType } from '@atlaskit/select';
import styled from 'styled-components';
import * as Logos from '../src';
import { Props as ConstantProps } from '../src/constants';

interface Product {
  label: string;
  value: string;
}
type File = Product;

const products: Product[] = [
  { label: 'Atlassian', value: 'Atlassian' },
  { label: 'Bitbucket', value: 'Bitbucket' },
  { label: 'Confluence', value: 'Confluence' },
  { label: 'Hipchat', value: 'Hipchat' },
  { label: 'JiraCore', value: 'JiraCore' },
  { label: 'Jira', value: 'Jira' },
  { label: 'JiraServiceDesk', value: 'JiraServiceDesk' },
  { label: 'JiraSoftware', value: 'JiraSoftware' },
  { label: 'OpsGenie', value: 'OpsGenie' },
  { label: 'StatusPage', value: 'StatusPage' },
  { label: 'Stride', value: 'Stride' },
  { label: 'Trello', value: 'Trello' },
];

const files: File[] = [
  { label: 'Logo', value: 'Logo' },
  { label: 'Icon', value: 'Icon' },
  { label: 'Wordmark', value: 'Wordmark' },
];

const SelectWrapper = styled.div`
  width: 200px;
  display: inline-block;
  padding: 20px;
`;

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

    return (
      <div>
        <p>Select the product and the component you want to fetch from:</p>
        <SelectWrapper>
          <Select
            options={products}
            value={selectedProduct}
            onChange={(product: ValueType<Product>) =>
              this.setState({ selectedProduct: product })
            }
          />
        </SelectWrapper>
        <SelectWrapper>
          <Select
            options={files}
            value={selectedFile}
            onChange={(file: ValueType<File>) =>
              this.setState({ selectedFile: file })
            }
          />
        </SelectWrapper>
        <p>This import statement will render the image below:</p>
        <AkCodeBlock
          language="javascript"
          text={`import ${name} from '@atlaskit/logo/${selectedProduct.value}Logo/${selectedFile.value}'`}
        />
        <OurComponent />
      </div>
    );
  }
}
