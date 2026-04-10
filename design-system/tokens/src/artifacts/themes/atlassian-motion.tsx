/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e2c90de3fa6bd9d4da20a85c310b97e2>>
 * @codegenCommand yarn build tokens
 */
export default `
@keyframes SlideInTop8px {
  0% {
    transform: translateY(8px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes SlideInBottom8px {
  0% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
}
@keyframes SlideInLeft8px {
  0% {
    transform: translateX(8px);
  }
  100% {
    transform: translateX(0px);
  }
}
@keyframes SlideInRight8px {
  0% {
    transform: translateX(-8px);
  }
  100% {
    transform: translateX(0px);
  }
}
@keyframes SlideOutTop8px {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(4px);
  }
}
@keyframes SlideOutBottom8px {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-4px);
  }
}
@keyframes SlideOutLeft8px {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(4px);
  }
}
@keyframes SlideOutRight8px {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-4px);
  }
}
@keyframes ScaleIn80to100 {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes ScaleIn95to100 {
  0% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes ScaleOut100to80 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}
@keyframes ScaleOut100to95 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}
@keyframes FadeIn0to100 {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes FadeOut100to0 {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
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
html[data-theme~="motion:motion"], [data-subtree-theme][data-theme~="motion:motion"] {
  --ds-avatar-enter: 150ms cubic-bezier(0.4, 1, 0.6, 1) ScaleIn80to100, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100;
  --ds-avatar-exit: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) ScaleOut100to80, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-avatar-hovered: transform 250ms linear(0, 0.021, 0.058, 0.107, 0.164, 0.227, 0.292, 0.359, 0.425, 0.49, 0.552, 0.61, 0.664, 0.714, 0.759, 0.8, 0.837, 0.869, 0.898, 0.922, 0.943, 0.961, 0.976, 0.988, 0.998, 1.006, 1.013, 1.017, 1.02, 1.023, 1.024, 1.024, 1.024, 1.024, 1.023, 1.022, 1.02, 1.019, 1.017, 1.015, 1.014, 1.012, 1.011, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.002, 1.001, 1.001, 1.001, 1, 1, 1, 1, 1, 0.999, 0.999, 0.999, 0.999, 1);
  --ds-blanket-enter: 250ms cubic-bezier(0.4, 0, 0, 1) FadeIn0to100;
  --ds-blanket-exit: 200ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-duration-instant: 0ms;
  --ds-duration-long: 250ms;
  --ds-duration-medium: 200ms;
  --ds-duration-short: 150ms;
  --ds-duration-xlong: 400ms;
  --ds-duration-xshort: 100ms;
  --ds-duration-xxlong: 600ms;
  --ds-duration-xxshort: 50ms;
  --ds-easing-in-practical: cubic-bezier(0.6, 0, 0.8, 0.6);
  --ds-easing-inout-bold: cubic-bezier(0.4, 0, 0, 1);
  --ds-easing-out-practical: cubic-bezier(0.4, 1, 0.6, 1);
  --ds-easing-out-bold: cubic-bezier(0, 0.4, 0, 1);
  --ds-easing-spring: linear(0, 0.021, 0.058, 0.107, 0.164, 0.227, 0.292, 0.359, 0.425, 0.49, 0.552, 0.61, 0.664, 0.714, 0.759, 0.8, 0.837, 0.869, 0.898, 0.922, 0.943, 0.961, 0.976, 0.988, 0.998, 1.006, 1.013, 1.017, 1.02, 1.023, 1.024, 1.024, 1.024, 1.024, 1.023, 1.022, 1.02, 1.019, 1.017, 1.015, 1.014, 1.012, 1.011, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.002, 1.001, 1.001, 1.001, 1, 1, 1, 1, 1, 0.999, 0.999, 0.999, 0.999, 1);
  --ds-flag-enter: 250ms cubic-bezier(0, 0.4, 0, 1) SlideIn50PercentLeft, 250ms cubic-bezier(0, 0.4, 0, 1) FadeIn0to100;
  --ds-flag-exit: 200ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOut15PercentLeft, 200ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-flag-reposition: transform 250ms cubic-bezier(0.4, 0, 0, 1);
  --ds-keyframe-fade-in: FadeIn0to100;
  --ds-keyframe-fade-out: FadeOut100to0;
  --ds-keyframe-scale-in-medium: ScaleIn80to100;
  --ds-keyframe-scale-in-small: ScaleIn95to100;
  --ds-keyframe-scale-out-medium: ScaleOut100to80;
  --ds-keyframe-scale-out-small: ScaleOut100to95;
  --ds-keyframe-slide-in-bottom-short: SlideInBottom8px;
  --ds-keyframe-slide-in-left-half: SlideIn50PercentLeft;
  --ds-keyframe-slide-in-left-short: SlideInLeft8px;
  --ds-keyframe-slide-in-right-short: SlideInRight8px;
  --ds-keyframe-slide-in-top-short: SlideInTop8px;
  --ds-keyframe-slide-out-bottom-short: SlideOutBottom8px;
  --ds-keyframe-slide-out-left-half: SlideOut15PercentLeft;
  --ds-keyframe-slide-out-left-short: SlideOutLeft8px;
  --ds-keyframe-slide-out-right-short: SlideOutRight8px;
  --ds-keyframe-slide-out-top-short: SlideOutTop8px;
  --ds-modal-enter: 250ms cubic-bezier(0.4, 0, 0, 1) ScaleIn95to100;
  --ds-modal-exit: 200ms cubic-bezier(0.6, 0, 0.8, 0.6) ScaleOut100to95;
  --ds-popup-enter-bottom: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInBottom8px, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100;
  --ds-popup-enter-left: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInLeft8px, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100;
  --ds-popup-enter-right: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInRight8px, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100;
  --ds-popup-enter-top: 150ms cubic-bezier(0.4, 1, 0.6, 1) SlideInTop8px, 150ms cubic-bezier(0.4, 1, 0.6, 1) FadeIn0to100;
  --ds-popup-exit-bottom: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutBottom8px, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-popup-exit-left: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutLeft8px, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-popup-exit-right: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutRight8px, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-popup-exit-top: 100ms cubic-bezier(0.6, 0, 0.8, 0.6) SlideOutTop8px, 100ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
  --ds-spotlight-enter: 250ms cubic-bezier(0.4, 0, 0, 1) ScaleIn95to100, 250ms cubic-bezier(0.4, 0, 0, 1) FadeIn0to100;
  --ds-spotlight-exit: 200ms cubic-bezier(0.6, 0, 0.8, 0.6) ScaleOut100to95, 200ms cubic-bezier(0.6, 0, 0.8, 0.6) FadeOut100to0;
}
`;
