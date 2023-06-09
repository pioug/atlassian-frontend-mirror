/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import __noop from '@atlaskit/ds-lib/noop';
import InlineEdit from '@atlaskit/inline-edit';
import { B100, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import PageHeader from '../src';

const readViewStyles = css({
  display: 'flex',
  maxWidth: '100%',
  padding: `${token('space.100', '8px')} ${token('space.075', '6px')}`,
  fontSize: '24px',
  fontWeight: 500,
  overflow: 'hidden',
});

const editViewStyles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: `${token('space.075', '6px')} ${token('space.075', '6px')}`,

  border: `2px solid ${N40}`,
  borderRadius: '3px',
  cursor: 'inherit',
  fontSize: '24px',
  fontWeight: 500,
  outline: 'none',
  ':focus': {
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
      onConfirm={__noop}
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
