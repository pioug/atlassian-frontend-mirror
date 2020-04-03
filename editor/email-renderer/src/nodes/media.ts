import {
  NodeSerializerOpts,
  MediaMetaDataContextItem,
  MediaType,
} from '../interfaces';
import { createTag } from '../create-tag';
import { N30 } from '@atlaskit/adf-schema';
import {
  createClassName,
  MEDIA_PREVIEW_IMAGE_WIDTH,
  MEDIA_PREVIEW_IMAGE_HEIGHT,
} from '../styles/util';
import { createContentId, IconString } from '../static';

const className = createClassName('media');
const ICON_DIMENSION = 14;

export default function media(node: NodeSerializerOpts) {
  const { context, attrs } = node;

  // Without metadata, we render a generic lozenge
  if (
    !context ||
    !context.hydration ||
    !context.hydration.mediaMetaData ||
    !context.hydration.mediaMetaData[attrs.id]
  ) {
    return renderLozenge();
  }

  const metadata = context.hydration.mediaMetaData[attrs.id];
  switch (metadata.mediaType) {
    case 'image':
      return renderImage(node, metadata);
    case 'video':
    case 'doc':
      return renderPreview(node, metadata);
    case 'audio':
    case 'unknown':
    default:
      return renderLozenge(metadata);
  }
}

const imageStyles = `
.${className}-wrapper {
  margin: 12px;
  text-align: center;
}
.${className}-img {
  max-width: 100%;
}
`;

const renderImage = (
  { attrs }: NodeSerializerOpts,
  metadata?: MediaMetaDataContextItem,
) => {
  let src;
  if (attrs.id) {
    // ID is defined, render image using CID:
    src = `cid:${attrs.id}`;
  } else if (attrs.url) {
    // url defined, user direct link image
    src = attrs.url;
  }
  if (src) {
    const img = createTag('img', {
      class: `${className}-img`,
      src,
    });
    return createTag('div', { class: `${className}-wrapper` }, img);
  }
  // no id or url found, fall back to lozenge
  return renderLozenge(metadata);
};

const lozengeStyles = `
.${className}-lozenge-wrapper {
  margin: 8px 0;
}
.${className}-lozenge-icon {
  vertical-align: baseline;
}
.${className}-lozenge {
  line-height: 14px;
  display: inline-block;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
.${className}-lozenge-text {
  overflow: hidden;
  display: inline-block;
}
`;

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
    'div',
    { class: `${className}-lozenge` },
    iconTag + textTag,
  );
  return createTag('div', { class: `${className}-lozenge-wrapper` }, lozenge);
};

const previewStyles = `
.${className}-preview-img-wrapper {
  width: ${MEDIA_PREVIEW_IMAGE_WIDTH}px;
}
.${className}-preview-img {
  width: ${MEDIA_PREVIEW_IMAGE_WIDTH}px;
  height: ${MEDIA_PREVIEW_IMAGE_HEIGHT}px;
  background-color: ${N30};
  display: block;
  object-fit: contain;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
}
.${className}-preview-wrapper {
  margin: 8px 0px;
  padding: 0;
  display: table;
}
.${className}-preview-desc {
  margin-top: 3px;
  line-height: 14px;
  display: block;
}
.${className}-preview-text {
  text-overflow: ellipsis;
  width: ${MEDIA_PREVIEW_IMAGE_WIDTH - ICON_DIMENSION - 4}px;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
}
.${className}-preview-wrapper .diff-image-container {
  display: inline-block;
  padding: 4px;
}
.${className}-preview-desc .diff-image-container {
  display: inline-block;
  padding: 0 4px;
}
`;

const renderPreview = (
  node: NodeSerializerOpts,
  metadata: MediaMetaDataContextItem,
) => {
  const previewImg = createTag('img', {
    class: `${className}-preview-img`,
    src: `cid:${node.attrs.id}`,
  });

  const iconType = getIconFromMediaType(metadata.mediaType);
  const icon = createTag('img', {
    class: `${className}-lozenge-icon`,
    src: createContentId(iconType as IconString),
    width: `${ICON_DIMENSION}`,
    height: `${ICON_DIMENSION}`,
  });
  const iconTag = createTag(
    'span',
    { class: `${className}-preview-img-wrapper` },
    icon,
  );
  const textTag = createTag(
    'span',
    { class: `${className}-preview-text` },
    metadata.name || 'Attached file',
  );
  const description = createTag(
    'div',
    { class: `${className}-preview-desc` },
    iconTag + textTag,
  );

  return createTag(
    'div',
    { class: `${className}-preview-wrapper` },
    previewImg + description,
  );
};

const getIconFromMediaType = (mediaType: MediaType) => {
  switch (mediaType) {
    case 'archive':
      return 'archiveAttachment';
    case 'audio':
      return 'audioAttachment';
    case 'doc':
      return 'documentAttachment';
    case 'video':
      return 'videoAttachment';
    default:
      return 'genericAttachment';
  }
};

export const styles = `
${imageStyles}
${lozengeStyles}
${previewStyles}
`;
