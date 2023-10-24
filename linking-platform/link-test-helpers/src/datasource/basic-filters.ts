import fetchMock from 'fetch-mock';

import {
  arrows,
  bug,
  handshake,
  hotdog,
  lightning,
  mike,
  nidhin,
  rocket,
  sasha,
} from '../images';

import { FetchMockRequestDetails } from './index';

export const mockBasicFilterData: Record<string, any> = {
  project: [
    {
      label: 'Commitment Register',
      value: 'Commitment Register',
      optionType: 'iconLabel',
      icon: handshake,
    },
    {
      label: 'JSM Map Mission',
      value: 'JSM Map Mission',
      optionType: 'iconLabel',
      icon: rocket,
    },
    {
      label: '(Re)Intro Risk Register',
      value: 'canberra',
      optionType: 'iconLabel',
      icon: hotdog,
    },
  ],
  assignee: [
    {
      label: 'Mike Dao',
      value: 'Mike Dao',
      optionType: 'avatarLabel',
      avatar: mike,
    },
    {
      label: 'Nidhin Joseph',
      value: 'Nidhin Joseph',
      optionType: 'avatarLabel',
      avatar: nidhin,
    },
    {
      label: 'Aleksandr Sasha Motsjonov',
      value: 'Aleksandr Sasha Motsjonov',
      optionType: 'avatarLabel',
      avatar: sasha,
    },
  ],
  issuetype: [
    {
      label: '[CTB]Bug',
      value: '[CTB]Bug',
      optionType: 'iconLabel',
      icon: bug,
    },
    {
      label: '!Disturbed query',
      value: '!Disturbed query',
      optionType: 'iconLabel',
      icon: arrows,
    },
    {
      label: 'Category',
      value: 'Category',
      optionType: 'iconLabel',
      icon: alert,
    },
    {
      label: 'Audit Subtask',
      value: 'Audit Subtask',
      optionType: 'iconLabel',
      icon: lightning,
    },
  ],
  status: [
    {
      label: 'Progress',
      value: 'Progress',
      optionType: 'lozengeLabel',
      appearance: 'inprogress',
    },
    {
      label: 'Done',
      value: 'Done',
      optionType: 'lozengeLabel',
      appearance: 'success',
    },
    {
      label: 'New',
      value: 'New',
      optionType: 'lozengeLabel',
      appearance: 'new',
    },
  ],
};

export const mockBasicFilterAGGFetchRequests = () => {
  fetchMock.post(
    new RegExp(`/gateway/api/graphql`),
    async (_url: string, details: FetchMockRequestDetails) => {
      return new Promise(resolve => {
        const requestBody = JSON.parse(details.body);
        resolve({
          data: mockBasicFilterData[requestBody.variables.jqlTerm] || [],
        });
      });
    },
  );
};
