import React from 'react';

interface SpotlightProps {
	testId?: string;
}

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Spotlight__
 *
 * A spotlight {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */
export const Spotlight = ({ testId }: SpotlightProps) => {
	return <div data-testid={testId}>TODO</div>;
};
