import { MentionNameStatus } from '../../../../src';
import { DefaultMentionNameResolver } from '../../../../src/default-mention-name-resolver/default-mention-name-resolver';
import { graphqlQuery } from '../../../../src/default-mention-name-resolver/graphqlUtils';

jest.mock('../../../../src/default-mention-name-resolver/graphqlUtils');
const graphqlQueryMock = graphqlQuery as jest.Mock;

const mockUser = { id: 'aaid-1234', name: 'User name' };

describe('DefaultMentionNameResolver', () => {
  beforeEach(() => {
    graphqlQueryMock.mockReset();
  });

  it('resolves a mention by user id', async () => {
    const resolver = new DefaultMentionNameResolver();
    graphqlQueryMock.mockResolvedValue({
      users: [{ accountId: mockUser.id, name: mockUser.name }],
    });
    await expect(resolver.lookupName(mockUser.id)).resolves.toEqual({
      id: mockUser.id,
      name: mockUser.name,
      status: MentionNameStatus.OK,
    });
  });

  it('returns the name from the cache if present', async () => {
    const resolver = new DefaultMentionNameResolver();
    resolver.cacheName(mockUser.id, mockUser.name);
    await expect(resolver.lookupName(mockUser.id)).resolves.toEqual({
      id: mockUser.id,
      name: mockUser.name,
      status: MentionNameStatus.OK,
    });
    expect(graphqlQueryMock).not.toHaveBeenCalled();
  });

  it('returns unknown if the API does not resolve the user a mention by user id', async () => {
    const resolver = new DefaultMentionNameResolver();
    graphqlQueryMock.mockResolvedValue({ users: [] });
    await expect(resolver.lookupName(mockUser.id)).resolves.toEqual({
      id: mockUser.id,
      status: MentionNameStatus.UNKNOWN,
    });
  });

  it('returns unknown if the API call throws an error', async () => {
    const resolver = new DefaultMentionNameResolver();
    graphqlQueryMock.mockImplementation(() => {
      throw new Error();
    });
    await expect(resolver.lookupName(mockUser.id)).resolves.toEqual({
      id: mockUser.id,
      status: MentionNameStatus.UNKNOWN,
    });
  });
});
