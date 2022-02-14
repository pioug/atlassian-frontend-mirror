import { JsonLd } from 'json-ld-types';

import extractJsonldDataIcon from '../extract-jsonld-data-icon';
import { IconType } from '../../../../constants';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../../constants';
import extractDocumentTypeIcon from '../extract-document-type-icon';

const itIf = (condition: boolean) => (condition ? it : it.skip);
const isDocument = (type: string) => type === 'Document';

describe('extractJsonldDataIcon', () => {
  const baseData: JsonLd.Data.BaseData = {
    '@type': 'Object',
    '@context': {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
      schema: 'http://schema.org/',
    },
    url: 'https://some-url.com',
  };

  it.each([
    ['Document', undefined, undefined],
    ['schema:BlogPosting', IconType.Blog, 'Blog'],
    ['schema:DigitalDocument', IconType.File, 'File'],
    ['schema:TextDigitalDocument', IconType.Document, 'Document'],
    [
      'schema:PresentationDigitalDocument',
      IconType.Presentation,
      'Presentation',
    ],
    ['schema:SpreadsheetDigitalDocument', IconType.Spreadsheet, 'Spreadsheet'],
    ['atlassian:Template', IconType.Template, 'Template'],
    ['atlassian:UndefinedLink', IconType.Document, 'Undefined link'],
    ['atlassian:Task', IconType.Task, 'Task'],
    ['atlassian:Project', IconType.Project, 'Project'],
    ['atlassian:SourceCodeCommit', IconType.Commit, 'Commit'],
    ['atlassian:SourceCodePullRequest', IconType.PullRequest, 'Pull request'],
    ['atlassian:SourceCodeReference', IconType.Branch, 'Reference'],
    ['atlassian:SourceCodeRepository', IconType.Repo, 'Repository'],
    ['unknown-type', undefined, undefined],
  ])(
    'returns icon descriptor for type %s',
    (type, expectedIconType, expectedLabel) => {
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        '@type': type as JsonLd.Primitives.ObjectType,
      };
      const [iconType, label] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBe(expectedIconType);
      expect(label).toBe(expectedLabel);
    },
  );

  describe('priority', () => {
    it('returns icon for singular type', () => {
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        '@type': 'schema:BlogPosting',
      };
      const [iconType] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBe(IconType.Blog);
    });

    it('returns highest priority icon from array of types', () => {
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        '@type': ['Document', 'schema:BlogPosting'],
      };
      const [iconType] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBe(IconType.Blog);
    });

    it('returns highest priority icon based on priority', () => {
      const expectUrl = 'https://some-icon-url.com';
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        '@type': ['Document', 'schema:BlogPosting'],
        generator: {
          '@type': 'Object',
          url: 'https://some-url.com',
          name: 'name',
          icon: expectUrl,
          image: 'https://some-image-url.com',
        },
      };
      const [iconType, , url] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBeUndefined();
      expect(url).toBe(expectUrl);
    });
  });

  describe.each([
    ['Document'],
    ['schema:BlogPosting'],
    ['schema:DigitalDocument'],
    ['schema:TextDigitalDocument'],
    ['schema:PresentationDigitalDocument'],
    ['schema:SpreadsheetDigitalDocument'],
    ['atlassian:Template'],
    ['atlassian:UndefinedLink'],
  ])('when type is %s', (type: string) => {
    const baseTypeData = {
      ...baseData,
      '@type': type,
    };

    describe.each([
      ['Confluence', CONFLUENCE_GENERATOR_ID, IconType.Confluence],
      ['Jira', JIRA_GENERATOR_ID, IconType.Jira],
    ])('provider is %s', (_, provider, providerIcon) => {
      it('returns file format icon - file format icon is defined', () => {
        const data = {
          ...baseTypeData,
          generator: { '@type': 'Object', '@id': provider },
          'schema:fileFormat': 'image/png',
        } as JsonLd.Data.BaseData;
        const [iconType] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBe(IconType.Image);
      });

      itIf(!isDocument(type))(
        'returns document icon - document icon is defined',
        () => {
          const data = {
            ...baseTypeData,
            generator: { '@type': 'Object', '@id': provider },
            'schema:fileFormat': undefined,
          } as JsonLd.Data.BaseData;
          const [iconType] = extractJsonldDataIcon(data) || [];
          const [documentIconType] = extractDocumentTypeIcon(type) || [];

          expect(iconType).toBe(documentIconType);
        },
      );

      itIf(isDocument(type))(
        'returns provider icon - default fallback icon',
        () => {
          const data = {
            ...baseTypeData,
            generator: { '@type': 'Object', '@id': provider },
            'schema:fileFormat': undefined,
          } as JsonLd.Data.BaseData;
          const [iconType] = extractJsonldDataIcon(data) || [];

          expect(iconType).toBe(providerIcon);
        },
      );
    });

    describe('provider is not native', () => {
      const providerIconUrl = 'https://some-provider-icon-url.com';

      it('returns provider icon - provider icon defined', () => {
        const data = {
          ...baseData,
          '@type': type,
          generator: {
            '@type': 'Object',
            '@id': 'some-provider',
            icon: providerIconUrl,
          },
          'schema:fileFormat': 'image/png',
        } as JsonLd.Data.BaseData;

        const [iconType, , url] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBeUndefined();
        expect(url).toBe(providerIconUrl);
      });

      it('returns file format icon - file format icon defined', () => {
        const data = {
          ...baseData,
          '@type': type,
          generator: {
            '@type': 'Object',
            '@id': 'some-provider',
            icon: undefined,
          },
          'schema:fileFormat': 'image/png',
        } as JsonLd.Data.BaseData;

        const [iconType] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBe(IconType.Image);
      });

      it('returns document icon - default fallback icon', () => {
        const data = {
          ...baseData,
          '@type': type,
          generator: {
            '@type': 'Object',
            '@id': 'some-provider',
            icon: undefined,
          },
          'schema:fileFormat': undefined,
        } as JsonLd.Data.BaseData;

        const [iconType] = extractJsonldDataIcon(data) || [];
        const [documentIconType] = extractDocumentTypeIcon(type) || [];

        expect(iconType).toBe(documentIconType);
      });
    });
  });

  describe('when type is atlassian:Task and provider is Jira', () => {
    it('returns icon for Task - using default', () => {
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        '@type': 'atlassian:Task',
      };
      const [iconType] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBe(IconType.Task);
    });

    describe('JiraCustomTaskType', () => {
      const iconUrl = 'https://some-icon-url.com';
      const taskIconUrl = 'https://some-task-icon-url.com';
      const generator = {
        '@type': 'Object',
        '@id': JIRA_GENERATOR_ID,
      };
      const task = {
        '@type': ['Object', 'atlassian:TaskType'],
        '@id': `https://www.atlassian.com/#JiraCustomTaskType`,
        name: 'some-task-name',
        icon: taskIconUrl,
      };
      const taskBaseData = {
        ...baseData,
        '@type': 'atlassian:Task',
        generator,
        icon: iconUrl,
        'atlassian:taskType': task,
      };

      it('returns task icon url - task type icon defined', () => {
        const data = { ...taskBaseData, icon: undefined } as JsonLd.Data.Task;

        const [iconType, , url] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBeUndefined();
        expect(url).toBe(taskIconUrl);
      });

      it('returns icon url - top-level icon defined', () => {
        const iconUrl = 'https://some-icon-url.com';
        const data = {
          ...taskBaseData,
          'atlassian:taskType': {
            ...task,
            icon: undefined,
          },
        } as JsonLd.Data.Task;

        const [iconType, , url] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBeUndefined();
        expect(url).toBe(iconUrl);
      });

      it('returns provider icon - provider icon defined', () => {
        const data = {
          ...taskBaseData,
          icon: undefined,
          'atlassian:taskType': {
            ...task,
            icon: undefined,
          },
        } as JsonLd.Data.Task;

        const [iconType, , url] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBe(IconType.Jira);
        expect(url).toBeUndefined();
      });

      it('returns task icon - default fallback icon', () => {
        const data = {
          ...taskBaseData,
          generator: undefined,
          icon: undefined,
          'atlassian:taskType': {
            ...task,
            icon: undefined,
          },
        } as JsonLd.Data.Task;

        const [iconType, , url] = extractJsonldDataIcon(data) || [];

        expect(iconType).toBe(IconType.Task);
        expect(url).toBeUndefined();
      });
    });
  });

  describe('when type is atlassian:Project', () => {
    it('returns icon for Project - with top level icon', () => {
      const expectUrl = 'https://some-icon-url.com';
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        icon: expectUrl,
        '@type': 'atlassian:Project',
      };
      const [iconType, , url] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBeUndefined();
      expect(url).toBe(expectUrl);
    });

    it('returns icon for Project - no top level icon', () => {
      const data: JsonLd.Data.BaseData = {
        ...baseData,
        '@type': 'atlassian:Project',
      };
      const [iconType, , url] = extractJsonldDataIcon(data) || [];

      expect(iconType).toBe(IconType.Project);
      expect(url).toBeUndefined();
    });
  });
});
