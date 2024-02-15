import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import noop from 'lodash/noop';

import { SelectableAutocompleteOption } from '../types';

import AutocompleteOption from './index';

const testOption: SelectableAutocompleteOption = {
  id: 'dc3404f8-af7b-44e3-b582-eb74d0989d80',
  name: 'Vanilla cheesecake',
  value: '"Vanilla cheesecake"',
  replacePosition: [0, 0],
  context: null,
  matchedText: '',
  type: 'value',
};

const deprecatedTestOption: SelectableAutocompleteOption = {
  id: 'dc3404f8-af7b-44e3-b582-eb74d0989d80',
  name: 'Deprecated vanilla cheesecake',
  value: '"Deprecated vanilla cheesecake"',
  isDeprecated: true,
  deprecatedSearcherKey: 'com.pyxis.greenhopper.jira:gh-epic-link-searcher',
  replacePosition: [0, 0],
  context: null,
  matchedText: '',
  type: 'value',
};

describe('basic behavior', () => {
  it('renders the option', () => {
    const { queryByText, getByTestId } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={testOption}
      />,
    );
    expect(queryByText(testOption.name)).toBeInTheDocument();
    const option = getByTestId('jql-editor-autocomplete-option');
    expect(getComputedStyle(option).backgroundColor).toBe('');
  });

  it('renders a deprecated option if it is deprecated', () => {
    const { queryByText, getByTestId } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={deprecatedTestOption}
      />,
    );
    expect(queryByText(deprecatedTestOption.name)).toBeInTheDocument();
    const option = getByTestId('jql-editor-autocomplete-option');
    expect(getComputedStyle(option).backgroundColor).toBe('');
  });
});

describe('interactions', () => {
  it('calls onClick callback', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={onClick}
        onMouseMove={noop}
        option={testOption}
      />,
    );
    fireEvent.click(getByText(testOption.name));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onMouseMove callback', () => {
    const onMouseMove = jest.fn();
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={onMouseMove}
        option={testOption}
      />,
    );
    fireEvent.mouseMove(getByText(testOption.name));
    expect(onMouseMove).toHaveBeenCalledTimes(1);
  });
  it('does not call onClick callback if option is deprecated', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={onClick}
        onMouseMove={noop}
        option={deprecatedTestOption}
      />,
    );
    fireEvent.click(getByText(deprecatedTestOption.name));
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('it does not call onMouseMove callback if option is deprecated', () => {
    const onMouseMove = jest.fn();
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={onMouseMove}
        option={deprecatedTestOption}
      />,
    );
    fireEvent.mouseMove(getByText(deprecatedTestOption.name));
    expect(onMouseMove).toHaveBeenCalledTimes(0);
  });
});

describe('highlighting', () => {
  it('highlights matching part of the user query', () => {
    const matchingOption = { ...testOption, matchedText: 'vani' };
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={matchingOption}
      />,
    );
    const highlighted = getByText('Vani');
    const plain = getByText('lla cheesecake');
    expect(getComputedStyle(highlighted).fontWeight).toBe('bold');
    expect(getComputedStyle(plain).fontWeight).not.toBe('bold');
  });

  it('ignores case and accents while matching', () => {
    const matchingOption = { ...testOption, matchedText: 'ChéeseCake' };
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={matchingOption}
      />,
    );
    const plain = getByText('Vanilla');
    const highlighted = getByText('cheesecake');
    expect(getComputedStyle(plain).fontWeight).not.toBe('bold');
    expect(getComputedStyle(highlighted).fontWeight).toBe('bold');
  });

  it('ignores opening quotes while matching', () => {
    const matchingOption = { ...testOption, matchedText: '"vanilla' };
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={matchingOption}
      />,
    );
    const highlighted = getByText('Vanilla');
    const plain = getByText('cheesecake');
    expect(getComputedStyle(highlighted).fontWeight).toBe('bold');
    expect(getComputedStyle(plain).fontWeight).not.toBe('bold');
  });

  it('ignores surrounding quotes while matching', () => {
    const matchingOption = { ...testOption, matchedText: '"vanilla"' };
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={matchingOption}
      />,
    );
    const highlighted = getByText('Vanilla');
    const plain = getByText('cheesecake');
    expect(getComputedStyle(highlighted).fontWeight).toBe('bold');
    expect(getComputedStyle(plain).fontWeight).not.toBe('bold');
  });

  it('does not highlight text when query is empty', () => {
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={testOption}
      />,
    );
    const option = getByText(testOption.name);
    expect(getComputedStyle(option).fontWeight).not.toBe('bold');
  });

  it('does not highlight text when there is no match', () => {
    const nonMatchingOption = { ...testOption, matchedText: 'choco' };
    const { getByText } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={nonMatchingOption}
      />,
    );
    const option = getByText(nonMatchingOption.name);
    expect(getComputedStyle(option).fontWeight).not.toBe('bold');
  });
});

describe('field type', () => {
  it('renders field type when provided', () => {
    const optionWithType = { ...testOption, fieldType: 'Potato' };
    const { queryByText, queryByTestId } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={optionWithType}
      />,
    );
    expect(queryByText(optionWithType.fieldType)).toBeInTheDocument();
    expect(queryByTestId('jql-editor-field-type-icon')).toBeNull();
  });

  it('renders field type and icon when supported', () => {
    const optionWithType = { ...testOption, fieldType: 'Dropdown' };
    const { queryByText, queryByTestId } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={optionWithType}
      />,
    );
    expect(queryByText(optionWithType.fieldType)).toBeInTheDocument();
    expect(queryByTestId('jql-editor-field-type-icon')).toBeInTheDocument();
  });
});

describe('deprecated icon', () => {
  it('does not renders deprecated icon when field is not deprecated', () => {
    const { queryByTestId } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={testOption}
      />,
    );
    expect(queryByTestId('jql-editor-deprecated-icon')).toBeNull();
  });

  it('renders deprecated icon when field is deprecated', () => {
    const { queryByTestId } = render(
      <AutocompleteOption
        isSelected={false}
        onClick={noop}
        onMouseMove={noop}
        option={deprecatedTestOption}
      />,
    );
    expect(queryByTestId('jql-editor-deprecated-icon')).toBeInTheDocument();
  });
});
