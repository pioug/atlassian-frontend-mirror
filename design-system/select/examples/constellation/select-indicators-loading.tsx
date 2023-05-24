import React from 'react';
import { Label } from '@atlaskit/form';
import Spinner from '@atlaskit/spinner';
import Tooltip from '@atlaskit/tooltip';
import { cities } from '../common/data';
import { AsyncSelect } from '../../src';
import { OptionType, LoadingIndicatorProps } from '../../src/types';

const LoadingIndicator = (props: LoadingIndicatorProps<OptionType>) => {
  return (
    <Tooltip content={'Custom Loader'}>
      <Spinner {...props} />
    </Tooltip>
  );
};

const filterCities = (inputValue: string) =>
  cities.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

const promiseOptions = (inputValue: string) =>
  new Promise<OptionType[]>((resolve) => {
    setTimeout(() => {
      resolve(filterCities(inputValue));
    }, 1000);
  });

export default () => {
  return (
    <>
      <Label htmlFor="indicators-loading">What city do you live in?</Label>
      <AsyncSelect
        inputId="indicators-loading"
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        components={{ LoadingIndicator }}
      />
    </>
  );
};
