import { NodeSerializerOpts } from '../interfaces';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';
import { createClassName } from '../styles/util';

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

export default function mediaSingle({ attrs, text }: NodeSerializerOpts) {
  const honorWidth = !['wide', 'full-width'].includes(attrs.layout);
  const style: any = {
    width: honorWidth ? `${attrs.width || 100}%` : '100%',
    'max-width': '100%',
  };

  const layoutClass = `${className}-${attrs.layout}`;
  return createTag(
    'div',
    { style: serializeStyle(style), class: layoutClass },
    text,
  );
}
