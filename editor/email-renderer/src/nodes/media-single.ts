import type { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';
import { createClassName } from '../styles/util';
import { applyMarks } from '../apply-marks';

const className = createClassName('media-single');
export const styles = `
.${className}-wide {
  width: 100%;
}
.${className}-full-width {
  width: 100%;
}
.${className}-center {
  margin-left: auto;
  margin-right: auto;
}
.${className}-wrap-right {
  float: right;
}
.${className}-wrap-left {
  float: left;
}
.${className}-align-end {
  margin-left: auto;
  margin-right: 0px;
}
.${className}-align-start {
  margin-left: 0px;
  margin-right: auto;
}
`;

export default function mediaSingle({ attrs, marks, text, context }: NodeSerializerOpts) {
	// If not full width or wide
	const honorWidth = !['wide', 'full-width'].includes(attrs.layout);

	// Determine pixel sizing or percent sizing
	const widthType = attrs.widthType || 'percent';
	const width = widthType === 'pixel' ? attrs.width : Math.min(attrs.width, 100);
	const widthUnitType = widthType === 'pixel' ? 'px' : '%';

	// If attrs.width comes in as falsey (when the image is inserted and not resized), fallback to auto
	const computedWidth = attrs.width ? `${width}${widthUnitType}` : 'auto';

	const style: any = {
		width: honorWidth ? computedWidth : '100%',
		'max-width': '100%',
	};

	const layoutClass = `${className}-${attrs.layout}`;
	const mediaSingleTag = createTag(
		'div',
		{ style: serializeStyle(style), class: layoutClass },
		text,
	);
	return applyMarks(marks, mediaSingleTag, context);
}
