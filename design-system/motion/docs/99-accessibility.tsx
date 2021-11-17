import { code, md } from '@atlaskit/docs';

export default md`
  ## Prefers Reduced Motion

  Atlaskit Motion comes with reduced motion support out of the box.
  Want to check them yourself in your own app? _Too easy._

  [Unsure what reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) is?
  It enables users to essentially tell websites "hey, I don't actually want animation tbh".
  However it's up to us - the developers - to ensure they get their wish.

  ### \`isReducedMotion()\`

  Useful when performing motion **at runtime** and **outside the context of a React render**.

  <br />

  ${code`
import { isReducedMotion } from '@atlaskit/motion';

const onClick = () => {
  if (!isReducedMotion()) {
    // do the motion
  }
}
  `}

  ### \`useIsReducedMotion()\`

  Useful when performing motion **at runtime** and **in the context of a React render**.

  Using a hook is preferable to calling \`isReducedMotion()\` here, as the hook can re-render
  your component if the user's motion preference changes at runtime. This means they don't need
  to refresh the page for their change to take effect.

  <br />

  ${code`
import { useIsReducedMotion } from '@atlaskit/motion';

const FancyChart = (props) => {
  const isReducedMotion = useIsReducedMotion();
  return <ThirdPartyChartingLibrary data={props.data} animate={!isReducedMotion} />;
}
  `}

  ### \`prefersReducedMotion()\`

  Useful when performing motion with **just CSS**.

  <br />

  ${code`
import { prefersReducedMotion } from '@atlaskit/motion';

// @emotion/core css prop
<div
  css={{
    animationName: 'slide-in',
    ...prefersReducedMotion()
  }}
/>

// styled-components template literal
styled.divˋ
  animation-name: slide-in;
  ＄{prefersReducedMotion()};
ˋ;

// styled-components object
styled.div({
  animationName: 'slide-in',
  ...prefersReducedMotion()
});
  `}
`;
