/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import InlineEdit from '@atlaskit/inline-edit';
import { B100, N40 } from '@atlaskit/theme/colors';

import PageHeader from '../../src';

const readViewStyles = css({
  display: 'flex',
  maxWidth: '100%',
  padding: '8px 6px',
  fontSize: '24px',
  fontWeight: 500,
  overflow: 'hidden',
});

const editViewStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: '6px 6px',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  border: `2px solid ${N40}`,
  borderRadius: '3px',
  cursor: 'inherit',
  fontSize: '24px',
  fontWeight: 500,
  outline: 'none',
  ':focus': {
    // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
    border: `2px solid ${B100}`,
  },
});

const CustomTitleComponent = () => {
  return (
    <InlineEdit
      readView={() => <div css={readViewStyles}>Editable title</div>}
      editView={(props, ref) => (
        <input css={editViewStyles} {...props} ref={ref} />
      )}
      defaultValue="Editable title"
      onConfirm={() => {}}
    />
  );
};

const PageHeaderCustomTitleExample = () => {
  return (
    <PageHeader disableTitleStyles>
      <CustomTitleComponent />
    </PageHeader>
  );
};

export default PageHeaderCustomTitleExample;
