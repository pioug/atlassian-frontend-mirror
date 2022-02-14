import { JsonLd } from 'json-ld-types';

import extractProviderIcon from '../extract-provider-icon';
import { CONFLUENCE_GENERATOR_ID, JIRA_GENERATOR_ID } from '../../../constants';
import { IconType } from '../../../../constants';

describe('extractProviderIcon', () => {
  describe.each([
    ['Confluence', CONFLUENCE_GENERATOR_ID, IconType.Confluence, 'Confluence'],
    ['Jira', JIRA_GENERATOR_ID, IconType.Jira, 'Jira'],
  ])('%s icon', (_, provider, expectedIconType, expectedLabel) => {
    it(`returns ${expectedIconType} with default label`, () => {
      const [iconType, label] =
        extractProviderIcon(provider, 'https://some-url.com') || [];

      expect(iconType).toEqual(expectedIconType);
      expect(label).toEqual(expectedLabel);
    });

    it(`returns ${expectedIconType} with custom label`, () => {
      const customLabel = 'custom-label';
      const [iconType, label] =
        extractProviderIcon(provider, 'https://some-url.com', customLabel) ||
        [];

      expect(iconType).toEqual(expectedIconType);
      expect(label).toEqual(customLabel);
    });
  });

  describe('URL', () => {
    const expectedUrl = 'https://some-url.com';
    const jsonldLinkModel: JsonLd.Primitives.Link = {
      '@type': 'Link',
      href: expectedUrl,
    };
    const jsonldImage: JsonLd.Primitives.Image = {
      '@type': 'Image',
      url: expectedUrl,
    };
    const jsonldImageLinkModel: JsonLd.Primitives.Image = {
      '@type': 'Image',
      url: jsonldLinkModel,
    };

    it.each([
      ['JsonLd.Primitives.Link (string)', expectedUrl],
      ['JsonLd.Primitives.Link (LinkModel)', jsonldLinkModel],
      ['JsonLd.Primitives.Image (string)', jsonldImage],
      ['JsonLd.Primitives.Image (LinkModel)', jsonldImageLinkModel],
    ])('returns icon url from %s', (_, jsonld) => {
      const [iconType, label, url] =
        extractProviderIcon(undefined, jsonld) || [];

      expect(iconType).toBeUndefined();
      expect(label).toBeUndefined();
      expect(url).toEqual(expectedUrl);
    });

    it('returns icon url with custom label', () => {
      const customLabel = 'custom-label';

      const [iconType, label, url] =
        extractProviderIcon(undefined, expectedUrl, customLabel) || [];

      expect(iconType).toBeUndefined();
      expect(label).toEqual(customLabel);
      expect(url).toEqual(expectedUrl);
    });

    it('returns undefined if JSON-LD data is not provided', () => {
      const iconDescriptor = extractProviderIcon();

      expect(iconDescriptor).toBeUndefined();
    });

    it('returns undefined if JSON-LD data does not have url', () => {
      const iconDescriptor = extractProviderIcon(undefined, {
        ...jsonldImage,
        url: undefined,
      });

      expect(iconDescriptor).toBeUndefined();
    });
  });
});
