import React, { useEffect, useState, useRef } from 'react';
import Spinner from '@atlaskit/spinner';
import {
  Parameters,
  ExtensionParams,
} from '@atlaskit/editor-common/extensions';
import styled from 'styled-components';

// WARNING: this is >=1000ms to enforce extension reloads are difficult to miss visually
const DELAY_VISIBILITY_MS = 1000;
const Rdiv = styled.div`
  text-align: right;
`;

export default ({ node }: { node: ExtensionParams<Parameters> }) => {
  const [isVisible, setVisible] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timer.current = setTimeout(() => setVisible(true), DELAY_VISIBILITY_MS);
    return () => timer.current && clearTimeout(timer.current);
  }, []);

  if (!isVisible) {
    return <Spinner />;
  }

  return (
    <div>
      <Rdiv>
        <small>(this is a mock extension, full width)</small>
      </Rdiv>
      {Object.entries(node).map(([key, value]) => {
        return (
          <div key={key}>
            <b>{key}: </b>
            {typeof value === 'object' && value ? (
              <pre>{JSON.stringify(value, null, 3)}</pre>
            ) : (
              <code>{value}</code>
            )}
          </div>
        );
      })}
    </div>
  );
};
