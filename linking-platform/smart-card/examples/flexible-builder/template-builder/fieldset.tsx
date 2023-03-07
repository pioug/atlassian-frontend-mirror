/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import Button from '@atlaskit/button';
import ChevronIcon from './chevron-icon';

const containerStyles = css`
  margin-top: 0.5rem;
  padding: 0.1rem 0;
`;
const headerStyles = css`
  display: flex;
  align-items: center;
  cursor: pointer;

  h6 {
    flex: 2 0 auto;
  }
`;
const Fieldset: FC<{
  legend?: string;
  defaultOpen?: boolean;
}> = ({ children, defaultOpen = true, legend }) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const handleOnClick = useCallback(() => setOpen(!open), [open]);

  return (
    <div css={containerStyles}>
      <div css={headerStyles} onClick={handleOnClick}>
        <h6>{legend}</h6>
        <Button iconBefore={<ChevronIcon open={open} />} spacing="compact" />
      </div>
      {open && children}
    </div>
  );
};

export default Fieldset;
