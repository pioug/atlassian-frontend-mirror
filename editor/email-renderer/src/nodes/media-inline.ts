import { MediaMetaDataContextItem, NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName } from '../styles/util';
import { getIconFromMediaType } from '../media-util';
import { createContentId, IconString } from '../static';
import { N30 } from '@atlaskit/adf-schema';

const className = createClassName('mediaInline');

const ICON_DIMENSION = 14;

export const styles = `
.${className}-lozenge-wrapper {
  margin: 8px 0;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  padding: 0px 0.3em 0.3em  0.3em;
  line-height: 24px;
  background-color: ${N30};
}
.${className}-lozenge-icon {
  vertical-align: middle;
}
.${className}-lozenge {
  line-height: 24px;
  display: inline-block;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
.${className}-lozenge-text {
  overflow: hidden;
  display: inline-block;
  margin-left: 4px;
  vertical-align: middle;
}
`;

export default function mediaInline(node: NodeSerializerOpts) {
  const { context, attrs } = node;

  // Without metadata, we render a generic lozenge
  if (!context?.hydration?.mediaMetaData?.[attrs.id]) {
    return renderLozenge();
  }

  const metadata = context?.hydration?.mediaMetaData?.[attrs.id];
  return renderLozenge(metadata);
}

const renderLozenge = (metadata?: MediaMetaDataContextItem) => {
  let iconType;
  let text;
  if (metadata) {
    text = metadata.name || 'Attached file';
    iconType = getIconFromMediaType(metadata.mediaType);
  } else {
    iconType = 'genericAttachment';
    text = 'Attached file';
  }
  const icon = createTag('img', {
    class: `${className}-lozenge-icon`,
    src: createContentId(iconType as IconString),
    width: `${ICON_DIMENSION}`,
    height: `${ICON_DIMENSION}`,
  });

  const iconTag = createTag('span', {}, icon);
  const textTag = createTag(
    'span',
    { class: `${className}-lozenge-text` },
    text,
  );
  const lozenge = createTag(
    'span',
    { class: `${className}-lozenge` },
    iconTag + textTag,
  );
  return createTag('span', { class: `${className}-lozenge-wrapper` }, lozenge);
};
