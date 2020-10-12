import {
  buildJiraModelParams,
  buildConfluenceModelParams,
} from '../../model-parameters';

describe('model-parameters', () => {
  describe('jira', () => {
    it('works without container Id', () => {
      const params = buildJiraModelParams(1);
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
      ]);
    });

    it('works with project id', () => {
      const params = buildJiraModelParams(1, 'containerId');
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
        {
          '@type': 'currentProject',
          projectId: 'containerId',
        },
      ]);
    });
  });

  describe('confluence', () => {
    it('works with space key & query version', () => {
      const params = buildConfluenceModelParams(1, {
        spaceKey: 'spaceKey',
      });
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
        {
          '@type': 'currentSpace',
          spaceKey: 'spaceKey',
        },
      ]);
    });

    it('works with out space key', () => {
      const params = buildConfluenceModelParams(1, {});
      expect(params).toEqual([
        {
          '@type': 'queryParams',
          queryVersion: 1,
        },
      ]);
    });
  });
});
