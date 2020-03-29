import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@atlaskit/tooltip';
import { withContextFromProps } from '../src';

const ContextTypes = {
  organisation: PropTypes.string,
  package: PropTypes.string,
};

const TooltipWithContext = (props, context) => (
  <Tooltip content={`${context.organisation}/${context.package}`}>
    {props.children}
  </Tooltip>
);
TooltipWithContext.contextTypes = ContextTypes;

const ContextProvider = withContextFromProps(ContextTypes);

export default () => (
  <ContextProvider organisation="@atlaskit" package="layer-manager">
    <p>
      Now that Tooltip, Modal, and Spotlight are rendered in a new sub-tree,
      using portals, they will not receive context (until React 16).
    </p>
    <p>
      To circumvent this we&apos;ve created an interim solution in the
      &ldquo;withContextFromProps&rdquo; higher order component.
    </p>
    <p>
      <TooltipWithContext>
        <button>Package Name</button>
      </TooltipWithContext>
    </p>
  </ContextProvider>
);
