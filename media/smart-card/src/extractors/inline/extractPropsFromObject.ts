import { InlineCardResolvedViewProps } from '@atlaskit/media-ui';

export function extractInlineViewPropsFromObject(
  json: any,
): InlineCardResolvedViewProps {
  if (!json || typeof json !== 'object') {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props: InlineCardResolvedViewProps = {
    title: typeof json.name === 'string' ? json.name : '',
  };

  if (json.generator && json.generator.icon) {
    props.icon =
      json.generator.icon && json.generator.icon.url
        ? json.generator.icon.url
        : json.generator.icon;
  }

  if (json.url) {
    props.link = String(json.url);
  }

  return props;
}
