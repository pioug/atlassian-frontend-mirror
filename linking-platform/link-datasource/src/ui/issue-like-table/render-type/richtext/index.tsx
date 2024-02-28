/** @jsx jsx */
import { useMemo } from 'react';

import { css, jsx } from '@emotion/react';

import { DocNode } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { RichText } from '@atlaskit/linking-types';

const rootStyles = css({
  position: 'relative',
  display: 'block',
});

export const parseRichText = (value: RichText): string | null => {
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
};

const RichTextType = ({ value }: { value: RichText }) => {
  const adfPlainText = useMemo(() => {
    return parseRichText(value);
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
