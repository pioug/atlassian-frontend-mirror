import { JsonLd } from 'json-ld-types';
import { extractUrlFromIconJsonLd } from '../url';
import { extractType } from '../primitives';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export interface LinkContext {
  name: string;
  icon?: string;
  type?: JsonLd.Primitives.ObjectType[];
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractContext = (
  jsonLd: JsonLd.Data.BaseData,
): LinkContext | undefined => {
  const context = jsonLd.context;
  if (context) {
    if (typeof context === 'string') {
      return { name: context };
    } else if (context['@type'] === 'Link') {
      if (context.name) {
        return { name: context.name };
      }
    } else {
      if (context.name) {
        return {
          name: context.name,
          icon: context.icon && extractUrlFromIconJsonLd(context.icon),
          type: extractType(context),
        };
      }
    }
  }
};
