import evaluateInner from './utils/evaluate-inner';

export default evaluateInner`
  /* global rule that sets the default fill that will cascade into 2 colour icons */
  .ak-icon {
    fill: white;
    height: 24px;
    width: 24px;
  }
  .ak-icon__size-small {
    height: 16px;
    width: 16px;
  }
  .ak-icon__size-medium {
    height: 24px;
    width: 24px;
    max-width: 24px;
  }
  .ak-icon__size-large {
    height: 32px;
    width: 32px;
    max-width: 32px;
  }
  .ak-icon__size-xlarge {
    height: 48px;
    width: 48px;
    max-width: 48px;
  }
`;
