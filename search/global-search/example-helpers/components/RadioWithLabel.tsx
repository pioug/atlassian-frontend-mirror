import React from 'react';
import styled from 'styled-components';

const Radio = styled.input`
  margin-left: 16px;
  margin-right: 8px;
`;

export const RADIO_GROUP_WIDTH = 200;

export const RadioGroup = styled.div`
  position: relative;
  padding: 4px;
  width: ${RADIO_GROUP_WIDTH - 8}px;
`;

export const RadioWithLabel = ({
  children,
  value,
  checked,
  onChange,
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const radioId = `id_${value}`;
  return (
    <div>
      <Radio
        type="radio"
        id={radioId}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={radioId}>{children}</label>
    </div>
  );
};
