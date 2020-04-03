import React, { Component, Fragment, ReactNode } from 'react';
import styled from 'styled-components';
import { CheckboxSelect, RadioSelect, ValueType, OptionType } from '../../src';
import PropStatus from './propStatus';

const allOptions = [
  { value: 'removed', label: 'removed' },
  { value: 'unchanged', label: 'unchanged' },
  { value: 'renamed', label: 'renamed' },
  { value: 'changed', label: 'changed' },
];

const packageOptions = [
  { value: 'all', label: 'all' },
  { value: 'single', label: 'single only' },
  { value: 'multi', label: 'multi only' },
];

const filterOptions = [
  { value: 'propName', label: 'propName' },
  { value: 'status', label: 'status' },
];

const Header = styled.td`
  font-weight: bold;
  padding: 4px 8px 4px 0;
  border-bottom: 3px solid #eee;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 30px;
  border-collapse: collapse;
`;

const getDisplayedStatus = (status: string) =>
  status === 'components' || status === 'styles' ? 'removed' : status;

const matchPackageFilter = (packages: string[], packageFilter: string) => {
  switch (packageFilter) {
    case 'single':
      if (packages.includes('single')) {
        return true;
      }
      return false;
    case 'multi':
      if (!packages.includes('single')) {
        return true;
      }
      return false;
    case 'all':
    default:
      return true;
  }
};

interface Prop {
  data: Array<{
    content?: ReactNode;
    label: string;
    key: string;
    status: string;
    packages: string[];
  }>;
}

interface State {
  selectedOptions: string[];
  filterValue: string;
  packageFilter: string;
}

const stringAllOptions: string[] = allOptions.map(
  (opt: { value: string }): string => opt.value,
);

export default class PropChanges extends Component<Prop, State> {
  state = {
    selectedOptions: stringAllOptions,
    filterValue: filterOptions[0].value,
    packageFilter: 'all',
  };

  onFilterChange = (option: ValueType<OptionType>) => {
    this.setState({
      selectedOptions: option!.map((opt: OptionType) => opt.value),
    });
  };

  onPackageChange = (option: any) => {
    this.setState({
      packageFilter: option.value,
    });
  };

  onSortChange = (option: any) => {
    this.setState({ filterValue: option.value });
  };

  render() {
    const { data } = this.props;
    const { selectedOptions, filterValue, packageFilter } = this.state;

    return (
      <Fragment>
        <h4> Filter by Props </h4>
        <CheckboxSelect
          defaultValue={allOptions}
          options={allOptions}
          onChange={this.onFilterChange}
        />
        <h4> Filter by Package</h4>
        <RadioSelect
          defaultValue={packageOptions[0]}
          options={packageOptions}
          onChange={this.onPackageChange}
        />
        <h4> Sort Props </h4>
        <RadioSelect
          defaultValue={filterOptions[0]}
          options={filterOptions}
          onChange={this.onSortChange}
        />
        <Table>
          <thead>
            <tr>
              <Header>Prop</Header>
              <Header>Status</Header>
              <Header>Notes</Header>
            </tr>
          </thead>
          <tbody>
            {data
              .sort((a, b) => {
                if (filterValue === 'propName')
                  return a.key.localeCompare(b.key);
                return getDisplayedStatus(a.status).localeCompare(
                  getDisplayedStatus(b.status),
                );
              })
              .map(entry => {
                const { key, status, content, packages } = entry;
                return selectedOptions.includes(getDisplayedStatus(status)) &&
                  matchPackageFilter(packages, packageFilter) ? (
                  <PropStatus
                    key={key}
                    prop={key}
                    status={status}
                    content={content}
                  />
                ) : null;
              })}
          </tbody>
        </Table>
      </Fragment>
    );
  }
}
