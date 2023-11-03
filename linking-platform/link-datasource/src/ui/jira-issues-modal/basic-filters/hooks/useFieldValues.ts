import { useState } from 'react';

import { request } from '@atlaskit/linking-common';

import { BasicFilterFieldType, SelectOption } from '../types';

interface FieldValuesProps {
  filterType: BasicFilterFieldType;
}

export interface FieldValuesState {
  filterOptions: SelectOption[];
  fetchFilterOptions: () => void;
  totalCount: number;
  status: 'empty' | 'loading' | 'resolved' | 'error';
}

// TODO: https://product-fabric.atlassian.net/browse/EDM-8118
export const useFieldValues = ({
  filterType,
}: FieldValuesProps): FieldValuesState => {
  const [filterOptions, setFilterOptions] = useState<SelectOption[]>([]);
  const [totalCount] = useState<number>(100);
  const [status, setStatus] = useState<FieldValuesState['status']>('empty');

  const fetchFilterOptions = async () => {
    try {
      setStatus('loading');
      const { data } = await request<{ data: SelectOption[] }>(
        'post',
        '/gateway/api/graphql',
        {
          operationName: 'fieldValues',
          variables: {
            jqlTerm: filterType,
          },
        },
        {
          'Content-Type': 'application/json',
          'X-ExperimentalApi': 'JiraJqlBuilder',
        },
      );

      if (data) {
        setFilterOptions(data);
        setStatus('resolved');
      }
    } catch (error) {
      setStatus('error');
      return setFilterOptions([]);
    }
  };

  return {
    filterOptions,
    fetchFilterOptions,
    totalCount,
    status,
  };
};
