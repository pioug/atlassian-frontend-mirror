import React from 'react';
import { mount } from 'enzyme';
import AsyncSelect from 'react-select/async';
import CreatableSelect from 'react-select/creatable';
import {
  asOption,
  resolveOption,
  silenceActErrors,
} from './_ConfigPanel_helpers';

describe('resolveOption', () => {
  // TODO: there are many warnings due to hooks usage and async code,
  //   these should be resolved by the next react update
  silenceActErrors();

  it('returns false for missing options', async () => {
    const OPTION = asOption('bar');
    const spy = jest.fn();
    const wrapper = await mount(
      <AsyncSelect onChange={spy} loadOptions={async () => [OPTION]} />,
    );

    expect(await resolveOption(wrapper, 'foo')).toBe(false); // missing
    expect(spy).toBeCalledTimes(0);
  });

  it('returns true for existing options', async () => {
    const OPTION = asOption('bar');
    const spy = jest.fn();
    const wrapper = await mount(
      <AsyncSelect onChange={spy} loadOptions={async () => [OPTION]} />,
    );

    expect(await resolveOption(wrapper, 'bar')).toBe(true); // pre-existing
    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining(OPTION),
      expect.anything(),
    );
  });

  it('supports asynchronous loading of options', async () => {
    const OPTION = asOption('bar');
    const spy = jest.fn();
    const wrapper = await mount(
      <AsyncSelect
        onChange={spy}
        loadOptions={async () => {
          await new Promise((resolve) => setTimeout(resolve, 200));
          return [OPTION];
        }}
      />,
    );

    expect(await resolveOption(wrapper, 'foo')).toBe(false); // missing
    expect(await resolveOption(wrapper, 'bar')).toBe(true); // pre-existing
    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining(OPTION),
      expect.anything(),
    );
  });

  it('uses the searchTerm', async () => {
    const OPTION = asOption('bar');
    const spy = jest.fn();
    const wrapper = await mount(
      <AsyncSelect
        onChange={spy}
        loadOptions={async (searchTerm: string) => {
          if (searchTerm === 'bar') {
            return [OPTION];
          }

          return [];
        }}
      />,
    );

    expect(await resolveOption(wrapper, 'foo')).toBe(false); // missing
    expect(await resolveOption(wrapper, 'bar')).toBe(true); // pre-existing
    expect(spy).toBeCalledTimes(1);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining(OPTION),
      expect.anything(),
    );
  });

  it('creates an option with CreatableSelect', async () => {
    const OPTION = asOption('bar');
    const spy = jest.fn();
    const wrapper = await mount(
      <CreatableSelect onChange={spy} options={[OPTION]} />,
    );

    expect(await resolveOption(wrapper, 'foo')).toBe(true); // missing, created
    expect(await resolveOption(wrapper, 'bar')).toBe(true); // pre-existing
    expect(spy).toBeCalledTimes(2);
    expect(spy).nthCalledWith(
      1,
      expect.objectContaining({ label: 'Create "foo"', value: 'foo' }),
      expect.anything(),
    );

    expect(spy).nthCalledWith(
      2,
      expect.objectContaining({ label: 'bar', value: 'bar' }),
      expect.anything(),
    );
  });
});
