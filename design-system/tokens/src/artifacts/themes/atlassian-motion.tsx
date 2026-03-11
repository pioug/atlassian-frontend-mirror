/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d9cba7f2a25f65f78c6ad172ff6364ce>>
 * @codegenCommand yarn build tokens
 */
export default `
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
@keyframes RotateIn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(5deg);
  }
}
@keyframes RotateOut {
  0% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
html[data-theme~="motion:motion"], [data-subtree-theme][data-theme~="motion:motion"] {
  --ds-content-enter-long: 400ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn;
  --ds-content-enter-medium: 200ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn;
  --ds-content-enter-short: 100ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn;
  --ds-content-exit-long: 200ms cubic-bezier(0.66, 0, 0.34, 1) FadeOut;
  --ds-content-exit-medium: 100ms cubic-bezier(0.66, 0, 0.34, 1) FadeOut;
  --ds-content-exit-short: 50ms cubic-bezier(0.66, 0, 0.34, 1) FadeOut;
  --ds-dialog-enter: 350ms cubic-bezier(0.66, 0, 0.34, 1) ScaleIn80, 350ms cubic-bezier(0.66, 0, 0.34, 1) FadeIn;
  --ds-dialog-exit: 350ms cubic-bezier(0.66, 0, 0.34, 1) ScaleOut80, 350ms cubic-bezier(0.66, 0, 0.34, 1) FadeOut;
}
`;
