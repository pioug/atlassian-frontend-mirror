import React from 'react';

export interface ExampleProps {
  /**
   * Title of the example
   */
  title: React.ReactNode | React.ReactElement;
  /**
   * Body of the example (usually a React component)
   */
  body: React.ReactNode | React.ReactElement;
}

/**
 * A custom Example wrapper component to render different examples in the same page and minimize the amount of code needed to render these.
 * @returns JSX.Element
 */
export const Example: React.FC<ExampleProps> = ({ title, body }) => {
  return (
    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
      <p>
        <strong> {title}</strong>
      </p>
      {body}
    </div>
  );
};
