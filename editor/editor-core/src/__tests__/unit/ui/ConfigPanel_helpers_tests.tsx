import React from 'react';
import { mount } from 'enzyme';
import CreatableSelect from 'react-select/creatable';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {
  createOption,
  selectOption,
  silenceActErrors,
} from './_ConfigPanel_helpers';

describe('createOption/selectOption', () => {
  // TODO: there are many warnings due to hooks usage and async code,
  //   these should be resolved by the next react update
  silenceActErrors();

  it('work as intended', async () => {
    const OPTIONS = [{ value: 'bar', label: 'Bar' }];

    const spy = jest.fn();
    const wrapper = await mount(
      <CreatableSelect onChange={spy} options={OPTIONS} />,
    );

    const select = wrapper.find('Select');
    expect(await createOption(select, 'foo')).toBe(true);
    expect(await selectOption(select, 'bar')).toBe(true);
    expect(await selectOption(select, 'nope')).toBe(false);
    expect(await selectOption(select, 'foo')).toBe(false);

    expect(spy).toBeCalledTimes(2);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );

    expect(spy).nthCalledWith(
      2,
      expect.objectContaining({ label: 'Bar', value: 'bar' }),
      expect.anything(),
    );
  });

  it('works with no options', async () => {
    const spy = jest.fn();
    const wrapper = await mount(<CreatableSelect onChange={spy} />);

    const select = wrapper.find('Select');
    expect(await createOption(select, 'foo')).toBe(true);
    expect(await selectOption(select, 'bar')).toBe(false);
    expect(await selectOption(select, 'nope')).toBe(false);
    expect(await selectOption(select, 'foo')).toBe(false);

    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );
  });

  it('works with AsyncCreatableSelect', async () => {
    const spy = jest.fn();
    const wrapper = await mount(
      <AsyncCreatableSelect
        onChange={spy}
        isValidNewOption={() => true}
        loadOptions={async () => []}
      />,
    );

    const select = wrapper.find('Select');
    expect(await createOption(select, 'foo')).toBe(true);
    expect(await selectOption(select, 'bar')).toBe(false);
    expect(await selectOption(select, 'nope')).toBe(false);
    expect(await selectOption(select, 'foo')).toBe(false);

    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );
  });
});
