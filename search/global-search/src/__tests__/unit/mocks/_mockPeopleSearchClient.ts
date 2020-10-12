import { PeopleSearchClient } from '../../../api/PeopleSearchClient';
export const noResultsPeopleSearchClient: PeopleSearchClient = {
  getRecentPeople() {
    return Promise.resolve([]);
  },
};

export const errorPeopleSearchClient: PeopleSearchClient = {
  getRecentPeople() {
    return Promise.reject('error');
  },
};

export const mockPeopleSearchClient = ({
  recentPeople,
}: any): PeopleSearchClient => ({
  getRecentPeople() {
    return Promise.resolve(recentPeople);
  },
});
