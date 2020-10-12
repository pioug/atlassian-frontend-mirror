import React from 'react';
import { exampleOptions } from '../example-helpers';
import { ExampleWrapper } from '../example-helpers/ExampleWrapper';
import UserPicker from '../src';
import { OnChange, Value } from '../src/types';

type ExampleProps = {};
type ExampleInternalProps = {
  onChange: OnChange;
  value: Value;
};

export class ExampleInternal extends React.Component<ExampleInternalProps> {
  render() {
    let { onChange, value } = this.props;
    return (
      <ExampleWrapper>
        {({ options, onInputChange }) => (
          <UserPicker
            fieldId="example"
            options={options}
            onChange={onChange}
            onInputChange={onInputChange}
            isMulti
            value={value}
            defaultValue={[exampleOptions[0], exampleOptions[1]]}
          />
        )}
      </ExampleWrapper>
    );
  }
}

export default class Example extends React.PureComponent<
  ExampleProps,
  { selectedEntities: Value }
> {
  constructor(props: ExampleProps) {
    super(props);
    this.state = {
      selectedEntities: [] as Value,
    };
  }

  handleSelectEntities = (selectedEntities: Value) => {
    this.setState({
      selectedEntities,
    });
  };

  render() {
    let { selectedEntities } = this.state;
    return (
      <ExampleInternal
        onChange={this.handleSelectEntities}
        value={selectedEntities}
      />
    );
  }
}
