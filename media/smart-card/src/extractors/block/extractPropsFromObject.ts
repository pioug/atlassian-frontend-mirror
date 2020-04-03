import { BlockCardResolvedViewProps, PreviewAction } from '@atlaskit/media-ui';

export function extractPropsFromObject(json: any): BlockCardResolvedViewProps {
  if (!json) {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props: Partial<BlockCardResolvedViewProps> = {
    title: typeof json.name === 'string' ? json.name : '',
    description: typeof json.summary === 'string' ? json.summary : '',
  };

  if (json.url) {
    props.link = String(json.url);
  }

  if (json.generator && (json.generator.name || json.generator.icon)) {
    const icon =
      json.generator.icon && json.generator.icon.url
        ? json.generator.icon.url
        : json.generator.icon;
    props.context = {
      text: json.generator.name,
      icon,
    };
    props.icon = {
      url: icon,
    };
  }

  if (!props.actions) {
    props.actions = [];
  }

  // TODO: define this in an RFC.
  if (json.preview) {
    props.actions.push(PreviewAction({ src: json.preview }));
  }

  if (json.image && json.image.url) {
    props.thumbnail = json.image.url;
  }

  return props as BlockCardResolvedViewProps;
}
