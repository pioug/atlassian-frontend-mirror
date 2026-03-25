/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::335cdc677cad1d4b1fd602ac8f261e85>>
 * @codegenCommand yarn build tokens
 */
export default `
@keyframes SlideInTop {
  0% {
    transform: translateY(8px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes SlideInBottom {
  0% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes SlideInLeft {
  0% {
    transform: translateX(8px);
  }
  100% {
    transform: translateX(0px);
  }
}
@keyframes SlideInRight {
  0% {
    transform: translateX(-8px);
  }
  100% {
    transform: translateX(0px);
  }
}
@keyframes SlideOutTop {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(4px);
  }
}
@keyframes SlideOutBottom {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-4px);
  }
}
@keyframes SlideOutLeft {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(4px);
  }
}
@keyframes SlideOutRight {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-4px);
  }
}
@keyframes ScaleIn80 {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes ScaleIn85 {
  0% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes ScaleIn90 {
  0% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes ScaleIn95 {
  0% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes ScaleOut80 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}
@keyframes ScaleOut85 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.85);
  }
}
@keyframes ScaleOut90 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
@keyframes ScaleOut95 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}
@keyframes FadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes FadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes SlideIn15PercentLeft {
  0% {
    transform: translateX(-15%);
    transform-origin: left;
  }
  100% {
    transform: translateX(0px);
    transform-origin: left;
  }
}
@keyframes SlideOut15PercentLeft {
  0% {
    transform: translateX(0px);
    transform-origin: left;
  }
  100% {
    transform: translateX(-15%);
    transform-origin: left;
  }
}
@keyframes SlideIn50PercentLeft {
  0% {
    transform: translateX(-50%);
    transform-origin: left;
  }
  100% {
    transform: translateX(0px);
    transform-origin: left;
  }
}
@keyframes SlideOut50PercentLeft {
  0% {
    transform: translateX(0px);
    transform-origin: left;
  }
  100% {
    transform: translateX(-50%);
    transform-origin: left;
  }
}
html[data-theme~="motion:motion"], [data-subtree-theme][data-theme~="motion:motion"] {
  --ds-avatar-enter: 150ms cubic-bezier(0.6, 0, 0.8, 0.6) ScaleIn80, 150ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeIn;
  --ds-avatar-exit: 100ms cubic-bezier(0.32, 0, 0.67, 0) ScaleOut80, 100ms cubic-bezier(0.32, 0, 0.67, 0) FadeOut;
  --ds-avatar-hovered: transform 100ms cubic-bezier(0.32, 0, 0.67, 0);
  --ds-content-enter-long: 400ms cubic-bezier(0.4, 0, 0, 1) FadeIn;
  --ds-content-enter-medium: 200ms cubic-bezier(0.4, 0, 0, 1) FadeIn;
  --ds-content-enter-short: 100ms cubic-bezier(0.4, 0, 0, 1) FadeIn;
  --ds-content-exit-long: 200ms cubic-bezier(0.4, 0, 0, 1) FadeOut;
  --ds-content-exit-medium: 100ms cubic-bezier(0.4, 0, 0, 1) FadeOut;
  --ds-content-exit-short: 50ms cubic-bezier(0.4, 0, 0, 1) FadeOut;
  --ds-flag-enter: 250ms cubic-bezier(0, 0.4, 0, 1) SlideIn50PercentLeft, 250ms cubic-bezier(0, 0.4, 0, 1) FadeIn;
  --ds-flag-exit: 200ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOut15PercentLeft, 200ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut;
  --ds-flag-reposition: transform 300ms cubic-bezier(0.4, 0, 0, 1);
  --ds-modal-enter: 200ms cubic-bezier(0.4, 0, 0, 1) ScaleIn95, 200ms cubic-bezier(0.4, 0, 0, 1) FadeIn;
  --ds-modal-exit: 200ms cubic-bezier(0.4, 1, 0.6, 1) ScaleOut95, 200ms cubic-bezier(0.4, 1, 0.6, 1) FadeOut;
  --ds-popup-enter-bottom: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInBottom, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn;
  --ds-popup-enter-left: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInLeft, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn;
  --ds-popup-enter-right: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInRight, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn;
  --ds-popup-enter-top: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInTop, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn;
  --ds-popup-exit-bottom: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutBottom, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut;
  --ds-popup-exit-left: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutLeft, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut;
  --ds-popup-exit-right: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutRight, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut;
  --ds-popup-exit-top: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutTop, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut;
  --ds-spotlight-enter: 250ms cubic-bezier(0.4, 0, 0, 1) ScaleIn95, 250ms cubic-bezier(0.4, 0, 0, 1) FadeIn;
  --ds-spotlight-exit: 200ms cubic-bezier(0.4, 1, 0.6, 1) ScaleOut95, 200ms cubic-bezier(0.4, 1, 0.6, 1) FadeOut;
}
`;
