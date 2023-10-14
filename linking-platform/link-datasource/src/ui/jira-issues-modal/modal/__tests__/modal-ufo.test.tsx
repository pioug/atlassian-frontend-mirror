import { ConcurrentExperience } from '@atlaskit/ufo';

import {
  getDefaultHookState,
  getEmptyHookState,
  getErrorHookState,
  setup,
} from './_utils';

const mockUfoStart = jest.fn();
const mockUfoSuccess = jest.fn();
const mockUfoFailure = jest.fn();
const mockUfoAddMetadata = jest.fn();

const mockColumnPickerRenderUfoFailure = jest.fn();

jest.mock('@atlaskit/ufo', () => ({
  __esModule: true,
  ...jest.requireActual<Object>('@atlaskit/ufo'),
  ConcurrentExperience: (
    experienceId: string,
  ): Partial<ConcurrentExperience> => ({
    experienceId: experienceId,
    getInstance: jest.fn().mockImplementation(() => {
      if (experienceId === 'datasource-rendered') {
        return {
          start: mockUfoStart,
          success: mockUfoSuccess,
          failure: mockUfoFailure,
          addMetadata: mockUfoAddMetadata,
        };
      }
      if (experienceId === 'column-picker-rendered') {
        return {
          failure: mockColumnPickerRenderUfoFailure,
        };
      }
      return {
        // there are other experiences outside this tests scope that reference atlaskit/ufo
        start: jest.fn(),
        success: jest.fn(),
        failure: jest.fn(),
        addMetadata: jest.fn(),
      };
    }),
  }),
}));

describe('UFO metrics: JiraIssuesConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start ufo experience when JiraIssuesConfigModal status is loading', async () => {
    await setup({
      hookState: { ...getDefaultHookState(), status: 'loading' },
    });

    expect(mockUfoStart).toHaveBeenCalledTimes(1);
  });

  it('should start ufo experience and set extensionKey metadata when JiraIssuesConfigModal status is loading', async () => {
    await setup({
      hookState: { ...getDefaultHookState(), status: 'loading' },
    });

    expect(mockUfoStart).toHaveBeenCalledTimes(1);

    expect(mockUfoAddMetadata).toHaveBeenCalledTimes(1);
    expect(mockUfoAddMetadata).toHaveBeenCalledWith({
      extensionKey: 'jira-object-provider',
    });
  });

  it('should mark as a successful experience when JiraIssuesConfigModal results are resolved', async () => {
    await setup();

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a successful when JiraIssuesConfigModal data request returns unauthorized response', async () => {
    await setup({
      hookState: { ...getErrorHookState(), status: 'unauthorized' },
    });

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a successful experience when JiraIssuesConfigModal results are empty', async () => {
    await setup({
      hookState: { ...getEmptyHookState(), status: 'resolved' },
    });

    expect(mockUfoSuccess).toHaveBeenCalledTimes(1);

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a successful experience when JiraIssuesConfigModal result has only one item', async () => {
    await setup({
      hookState: {
        ...getDefaultHookState(),
        responseItems: [
          {
            key: {
              data: {
                url: 'www.atlassian.com',
              },
            },
          },
        ],
      },
    });

    expect(mockUfoSuccess).toHaveBeenCalled();

    expect(mockUfoFailure).not.toHaveBeenCalled();
  });

  it('should mark as a failed experience when JiraIssuesConfigModal request fails', async () => {
    await setup({ hookState: { ...getErrorHookState() } });

    expect(mockUfoFailure).toHaveBeenCalledTimes(1);

    expect(mockUfoSuccess).not.toHaveBeenCalled();
  });

  describe('ColumnPickerRendered', async () => {
    it('should not mark as a failed experience when status is OK', async () => {
      await setup();

      expect(mockColumnPickerRenderUfoFailure).not.toHaveBeenCalled();
    });

    it('should mark as a failed experience when status is rejected', async () => {
      await setup({ hookState: { ...getErrorHookState() } });

      expect(mockColumnPickerRenderUfoFailure).toHaveBeenCalledTimes(1);
    });
  });
});
