import { N20, N50 } from '@atlaskit/adf-schema';
import { createTag } from '../create-tag';
import { serializeStyle } from '../serialize-style';
import { createClassName } from '../styles/util';
import { NodeSerializerOpts } from '../interfaces';

export const styles = `
.${createClassName('tableHeader')} {
  background-clip: padding-box;
  border: 1px solid ${N50};
  border-right-width: 0;
  border-bottom-width: 0;
  font-weight: bold;
  height: auto;
  min-width: 3em;
  padding: 8px;
  text-align: left;
  vertical-align: top;
}
`;

export default function tableHeader({ attrs, text }: NodeSerializerOpts) {
  const { colspan, rowspan, background } = attrs;
  const style = serializeStyle({
    'background-color': background ? background : N20,
  });

  return createTag(
    'th',
    {
      colspan,
      rowspan,
      style,
      class: createClassName('tableHeader'),
    },
    text,
  );
}
