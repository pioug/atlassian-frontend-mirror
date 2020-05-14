import React from 'react';
import Spinner from '@atlaskit/spinner';
import {
  Parameters,
  ExtensionParams,
} from '@atlaskit/editor-common/extensions';
type Props = {
  node: ExtensionParams<Parameters>;
};
export default ({ node }: Props) => {
  const [isVisible, setVisible] = React.useState(false);
  let timer = React.useRef<NodeJS.Timeout>();
  React.useEffect(() => {
    timer.current = setTimeout(() => setVisible(true), 1000);
    return () => timer.current && clearTimeout(timer.current);
  }, []);
  return !isVisible ? (
    <Spinner />
  ) : (
    <div>
      <p>THIS IS A FAKE VIEW FOR EXTENSIONS</p>
      <table>
        <thead style={{ fontWeight: 'bold' }}>
          <tr>
            {Object.keys(node).map(key => (
              <td key={key}>{key}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(node).map(([key, value]) => {
              return (
                <td key={key}>
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 3)
                    : value}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
