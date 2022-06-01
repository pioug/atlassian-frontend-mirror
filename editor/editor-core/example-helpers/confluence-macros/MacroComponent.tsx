/** @jsx jsx */
import { useEffect, useState, useRef } from 'react';
import Spinner from '@atlaskit/spinner';
import {
  Parameters,
  ExtensionParams,
} from '@atlaskit/editor-common/extensions';
import { css, jsx } from '@emotion/react';

// WARNING: this is >=1000ms to enforce extension reloads are difficult to miss visually
const DELAY_VISIBILITY_MS = 1000;
const rdiv = css`
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
      <div css={rdiv}>
        <small>(this is a mock extension, full width)</small>
      </div>
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
