import type { MediaMetaDataContextItem, NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { createClassName, getInlineImageSizeFromParentNode } from '../styles/util';
import { getIconFromMediaType } from '../media-util';
import { createContentId } from '../static';
import type { IconString } from '../static';
import { N30 } from '@atlaskit/adf-schema';
import { applyMarks } from '../apply-marks';

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
.${className}-inline-image-wrapper {
  display: inline-flex;
  overflow: hidden;
  max-width: 100%;
  align-items: center;
  background-color: ${N30};
}
`;

export default function mediaInline(node: NodeSerializerOpts) {
	const { context, attrs } = node;
	const metadata = context?.hydration?.mediaMetaData?.[attrs.id];

	if (attrs.type === 'image') {
		return renderInlineImage(node, metadata);
	}

	return renderLozenge(metadata);
}

/**
 *
 * @param node The mediaInline node with type 'image'
 * @param metadata Hydrated metadata that describes the file, it is only used to pass through to renderLozenge if file id cannot be found.
 * @returns html string that renders inline image
 */
const renderInlineImage = (node: NodeSerializerOpts, metadata?: MediaMetaDataContextItem) => {
	const { width, height, id, alt } = node.attrs;

	if (!id) {
		return renderLozenge(metadata);
	}

	const { size, shift } = getInlineImageSizeFromParentNode(node);

	const aspectRatio = width && height ? width / height : undefined;
	const calculatedWidth = !width || !aspectRatio ? size : Math.round(aspectRatio * size);

	const image = createTag('img', {
		src: `cid:${id}`,
		width: calculatedWidth,
		height: size,
		...(alt && { alt }),
	});
	const inlineImageWrapper = createTag(
		'span',
		{
			class: `${className}-inline-image-wrapper`,
			style: `height: ${size}px; width: ${calculatedWidth}px; transform: translateY(${shift}px);`,
		},
		image,
	);

	return applyMarks(node.marks, inlineImageWrapper);
};

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
	const textTag = createTag('span', { class: `${className}-lozenge-text` }, text);
	const lozenge = createTag('span', { class: `${className}-lozenge` }, iconTag + textTag);
	return createTag('span', { class: `${className}-lozenge-wrapper` }, lozenge);
};
