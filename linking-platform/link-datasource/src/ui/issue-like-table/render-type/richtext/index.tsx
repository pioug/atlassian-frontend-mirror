/** @jsx jsx */
import { useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { DocNode } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { RichText } from '@atlaskit/linking-types';

const rootStyles = css({
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  position: 'relative',
  display: 'block',
});

const RichTextType = ({ value }: { value: RichText }) => {
  const adfPlainText = useMemo(() => {
    try {
      if (value.type === 'adf') {
        const adf = JSON.parse(value.text) as DocNode;
        return PMNode.fromJSON(defaultSchema, {
          ...adf,
          content: [...adf.content.slice(0, 2)],
        }).textContent;
      }
      return null;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('error parsing adf', e);
      return null;
    }
  }, [value]);

  if (adfPlainText) {
    return (
      <div css={rootStyles} data-testid="richtext-plaintext">
        {adfPlainText}
      </div>
    );
  } else {
    return <span data-testid="richtext-unsupported" />;
  }
};

export default RichTextType;
