import { code, md } from '@atlaskit/docs';

export default md`
The \`PerformanceMetrics\` component is designed to track and measure the performance of an entire page experience. It's recommended to use this component at the highest level of your application, typically in your main app component.

## How it Works

Upon mounting, the component initializes (or reuses an existing) global singleton known as \`EditorPerformanceObserver\`. This observer collects significant events, including Event Timing and DOM Mutations, and records them in a \`TimelineClock\`. The \`TimelineClock\` maintains a buffer that periodically flushes, allowing for the calculation of requested performance metrics using a snapshot of the timeline.

### TTVC (Time To Visually Complete)

TTVC is calculated using all DOM modification events that occur from the time your component is mounted until the first idle period in the timeline. If a user event occurs before the first idle time, subsequent events are excluded from TTVC calculation.

⚠️ **Note:** The \`onTTVC\` function will be invoked only once, shortly after the component is mounted.

### User Latency

Events are categorized into the following groups:
- \`mouse-movement\`
- \`mouse-action\`
- \`keyboard\`
- \`form\`
- \`clipboard\`
- \`drag-and-drop\`
- \`page-resize\`
- \`scroll\`
- \`touch\`
- \`other\`

When the \`TimelineClock\` buffer is filled with metrics from these categories, the metrics are calculated and dispatched to the \`onUserLatency\` callback.

⚠️ **Note:** The \`onUserLatency\` function may be called multiple times, depending on the buffer size and the frequency of events.

## Usage

### React Component API

To use the \`PerformanceMetrics\` component, integrate it into your main application component, and provide the necessary callback functions:

${code`
import React from 'react';
import { PerformanceMetrics } from './react-api';


const handleTTVC = ({ ttvc, relativeTTVC }) => {
  console.log('TTVC:', ttvc);
  console.log('Relative TTVC:', relativeTTVC);
};

const handleUserLatency = ({ latency }) => {
  console.log('User Latency:', latency);
};

function App() {
  return (
    <div>
      <PerformanceMetrics onTTVC={handleTTVC} onUserLatency={handleUserLatency} />
      {/* Your application code */}
    </div>
  );
}

export default App;
`}
`;
