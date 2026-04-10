"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::148f2f6a72e79c38e027eeed3b58d3ac>>
 * @codegenCommand yarn build tokens
 */

var tokens = [{
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 150,
    "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
    "keyframes": ["ScaleIn80to100", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration150",
      "curve": "EasePracticalOut",
      "keyframes": ["ScaleIn80to100", "FadeIn0to100"]
    }
  },
  "name": "motion.avatar.enter",
  "path": ["motion", "avatar", "enter"],
  "cleanName": "motion.avatar.enter"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 100,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["ScaleOut100to80", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration100",
      "curve": "EasePracticalIn",
      "keyframes": ["ScaleOut100to80", "FadeOut100to0"]
    }
  },
  "name": "motion.avatar.exit",
  "path": ["motion", "avatar", "exit"],
  "cleanName": "motion.avatar.exit"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 250,
    "curve": "linear(0, 0.021, 0.058, 0.107, 0.164, 0.227, 0.292, 0.359, 0.425, 0.49, 0.552, 0.61, 0.664, 0.714, 0.759, 0.8, 0.837, 0.869, 0.898, 0.922, 0.943, 0.961, 0.976, 0.988, 0.998, 1.006, 1.013, 1.017, 1.02, 1.023, 1.024, 1.024, 1.024, 1.024, 1.023, 1.022, 1.02, 1.019, 1.017, 1.015, 1.014, 1.012, 1.011, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.002, 1.001, 1.001, 1.001, 1, 1, 1, 1, 1, 0.999, 0.999, 0.999, 0.999, 1)",
    "properties": ["transform"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration250",
      "curve": "EaseSpring",
      "properties": ["Transform"]
    }
  },
  "name": "motion.avatar.hovered",
  "path": ["motion", "avatar", "hovered"],
  "cleanName": "motion.avatar.hovered"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": {
    "duration": 250,
    "curve": "cubic-bezier(0.4, 0, 0, 1)",
    "keyframes": ["FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": {
      "duration": "Duration250",
      "curve": "EaseBoldInOut",
      "keyframes": ["FadeIn0to100"]
    }
  },
  "name": "motion.blanket.enter",
  "path": ["motion", "blanket", "enter"],
  "cleanName": "motion.blanket.enter"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": {
    "duration": 200,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": {
      "duration": "Duration200",
      "curve": "EasePracticalIn",
      "keyframes": ["FadeOut100to0"]
    }
  },
  "name": "motion.blanket.exit",
  "path": ["motion", "blanket", "exit"],
  "cleanName": "motion.blanket.exit"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "0ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration000"
  },
  "name": "motion.duration.instant",
  "path": ["motion", "duration", "instant"],
  "cleanName": "motion.duration.instant"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "250ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration250"
  },
  "name": "motion.duration.long",
  "path": ["motion", "duration", "long"],
  "cleanName": "motion.duration.long"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "200ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration200"
  },
  "name": "motion.duration.medium",
  "path": ["motion", "duration", "medium"],
  "cleanName": "motion.duration.medium"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "150ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration150"
  },
  "name": "motion.duration.short",
  "path": ["motion", "duration", "short"],
  "cleanName": "motion.duration.short"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "400ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration400"
  },
  "name": "motion.duration.xlong",
  "path": ["motion", "duration", "xlong"],
  "cleanName": "motion.duration.xlong"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "100ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration100"
  },
  "name": "motion.duration.xshort",
  "path": ["motion", "duration", "xshort"],
  "cleanName": "motion.duration.xshort"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "600ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration600"
  },
  "name": "motion.duration.xxlong",
  "path": ["motion", "duration", "xxlong"],
  "cleanName": "motion.duration.xxlong"
}, {
  "attributes": {
    "group": "motionDuration",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "50ms",
  "filePath": "schema/themes/atlassian-motion/motion-duration.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionDuration",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "Duration050"
  },
  "name": "motion.duration.xxshort",
  "path": ["motion", "duration", "xxshort"],
  "cleanName": "motion.duration.xxshort"
}, {
  "attributes": {
    "group": "motionEasing",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "cubic-bezier(0.6, 0, 0.8, 0.6)",
  "filePath": "schema/themes/atlassian-motion/motion-easing.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionEasing",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "EasePracticalIn"
  },
  "name": "motion.easing.in.practical",
  "path": ["motion", "easing", "in", "practical"],
  "cleanName": "motion.easing.in.practical"
}, {
  "attributes": {
    "group": "motionEasing",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "cubic-bezier(0.4, 0, 0, 1)",
  "filePath": "schema/themes/atlassian-motion/motion-easing.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionEasing",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "EaseBoldInOut"
  },
  "name": "motion.easing.inout.bold",
  "path": ["motion", "easing", "inout", "bold"],
  "cleanName": "motion.easing.inout.bold"
}, {
  "attributes": {
    "group": "motionEasing",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "cubic-bezier(0.4, 1, 0.6, 1)",
  "filePath": "schema/themes/atlassian-motion/motion-easing.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionEasing",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "EasePracticalOut"
  },
  "name": "motion.easing.out.practical",
  "path": ["motion", "easing", "out", "practical"],
  "cleanName": "motion.easing.out.practical"
}, {
  "attributes": {
    "group": "motionEasing",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "cubic-bezier(0, 0.4, 0, 1)",
  "filePath": "schema/themes/atlassian-motion/motion-easing.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionEasing",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "EaseBoldOut"
  },
  "name": "motion.easing.out.bold",
  "path": ["motion", "easing", "out", "bold"],
  "cleanName": "motion.easing.out.bold"
}, {
  "attributes": {
    "group": "motionEasing",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "linear(0, 0.021, 0.058, 0.107, 0.164, 0.227, 0.292, 0.359, 0.425, 0.49, 0.552, 0.61, 0.664, 0.714, 0.759, 0.8, 0.837, 0.869, 0.898, 0.922, 0.943, 0.961, 0.976, 0.988, 0.998, 1.006, 1.013, 1.017, 1.02, 1.023, 1.024, 1.024, 1.024, 1.024, 1.023, 1.022, 1.02, 1.019, 1.017, 1.015, 1.014, 1.012, 1.011, 1.009, 1.008, 1.007, 1.006, 1.005, 1.004, 1.003, 1.002, 1.002, 1.001, 1.001, 1.001, 1, 1, 1, 1, 1, 0.999, 0.999, 0.999, 0.999, 1)",
  "filePath": "schema/themes/atlassian-motion/motion-easing.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionEasing",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "EaseSpring"
  },
  "name": "motion.easing.spring",
  "path": ["motion", "easing", "spring"],
  "cleanName": "motion.easing.spring"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 250,
    "curve": "cubic-bezier(0, 0.4, 0, 1)",
    "keyframes": ["SlideIn50PercentLeft", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration250",
      "curve": "EaseBoldOut",
      "keyframes": ["SlideIn50PercentLeft", "FadeIn0to100"]
    }
  },
  "name": "motion.flag.enter",
  "path": ["motion", "flag", "enter"],
  "cleanName": "motion.flag.enter"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 200,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["SlideOut15PercentLeft", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration200",
      "curve": "EasePracticalIn",
      "keyframes": ["SlideOut15PercentLeft", "FadeOut100to0"]
    }
  },
  "name": "motion.flag.exit",
  "path": ["motion", "flag", "exit"],
  "cleanName": "motion.flag.exit"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 250,
    "curve": "cubic-bezier(0.4, 0, 0, 1)",
    "properties": ["transform"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration250",
      "curve": "EaseBoldInOut",
      "properties": ["Transform"]
    }
  },
  "name": "motion.flag.reposition",
  "path": ["motion", "flag", "reposition"],
  "cleanName": "motion.flag.reposition"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "FadeIn0to100",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "FadeIn0to100"
  },
  "name": "motion.keyframe.fade.in",
  "path": ["motion", "keyframe", "fade", "in"],
  "cleanName": "motion.keyframe.fade.in"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "FadeOut100to0",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "FadeOut100to0"
  },
  "name": "motion.keyframe.fade.out",
  "path": ["motion", "keyframe", "fade", "out"],
  "cleanName": "motion.keyframe.fade.out"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "ScaleIn80to100",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "ScaleIn80to100"
  },
  "name": "motion.keyframe.scale.in.medium",
  "path": ["motion", "keyframe", "scale", "in", "medium"],
  "cleanName": "motion.keyframe.scale.in.medium"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "ScaleIn95to100",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "ScaleIn95to100"
  },
  "name": "motion.keyframe.scale.in.small",
  "path": ["motion", "keyframe", "scale", "in", "small"],
  "cleanName": "motion.keyframe.scale.in.small"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "ScaleOut100to80",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "ScaleOut100to80"
  },
  "name": "motion.keyframe.scale.out.medium",
  "path": ["motion", "keyframe", "scale", "out", "medium"],
  "cleanName": "motion.keyframe.scale.out.medium"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "ScaleOut100to95",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "ScaleOut100to95"
  },
  "name": "motion.keyframe.scale.out.small",
  "path": ["motion", "keyframe", "scale", "out", "small"],
  "cleanName": "motion.keyframe.scale.out.small"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideInBottom8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideInBottom8px"
  },
  "name": "motion.keyframe.slide.in.bottom.short",
  "path": ["motion", "keyframe", "slide", "in", "bottom", "short"],
  "cleanName": "motion.keyframe.slide.in.bottom.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideIn50PercentLeft",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideIn50PercentLeft"
  },
  "name": "motion.keyframe.slide.in.left.half",
  "path": ["motion", "keyframe", "slide", "in", "left", "half"],
  "cleanName": "motion.keyframe.slide.in.left.half"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideInLeft8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideInLeft8px"
  },
  "name": "motion.keyframe.slide.in.left.short",
  "path": ["motion", "keyframe", "slide", "in", "left", "short"],
  "cleanName": "motion.keyframe.slide.in.left.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideInRight8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideInRight8px"
  },
  "name": "motion.keyframe.slide.in.right.short",
  "path": ["motion", "keyframe", "slide", "in", "right", "short"],
  "cleanName": "motion.keyframe.slide.in.right.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideInTop8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideInTop8px"
  },
  "name": "motion.keyframe.slide.in.top.short",
  "path": ["motion", "keyframe", "slide", "in", "top", "short"],
  "cleanName": "motion.keyframe.slide.in.top.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideOutBottom8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideOutBottom8px"
  },
  "name": "motion.keyframe.slide.out.bottom.short",
  "path": ["motion", "keyframe", "slide", "out", "bottom", "short"],
  "cleanName": "motion.keyframe.slide.out.bottom.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideOut15PercentLeft",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideOut15PercentLeft"
  },
  "name": "motion.keyframe.slide.out.left.half",
  "path": ["motion", "keyframe", "slide", "out", "left", "half"],
  "cleanName": "motion.keyframe.slide.out.left.half"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideOutLeft8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideOutLeft8px"
  },
  "name": "motion.keyframe.slide.out.left.short",
  "path": ["motion", "keyframe", "slide", "out", "left", "short"],
  "cleanName": "motion.keyframe.slide.out.left.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideOutRight8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideOutRight8px"
  },
  "name": "motion.keyframe.slide.out.right.short",
  "path": ["motion", "keyframe", "slide", "out", "right", "short"],
  "cleanName": "motion.keyframe.slide.out.right.short"
}, {
  "attributes": {
    "group": "motionKeyframe",
    "state": "experimental",
    "introduced": "11.5.0",
    "description": ""
  },
  "value": "SlideOutTop8px",
  "filePath": "schema/themes/atlassian-motion/motion-keyframe.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motionKeyframe",
      "state": "experimental",
      "introduced": "11.5.0",
      "description": ""
    },
    "value": "SlideOutTop8px"
  },
  "name": "motion.keyframe.slide.out.top.short",
  "path": ["motion", "keyframe", "slide", "out", "top", "short"],
  "cleanName": "motion.keyframe.slide.out.top.short"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 250,
    "curve": "cubic-bezier(0.4, 0, 0, 1)",
    "keyframes": ["ScaleIn95to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration250",
      "curve": "EaseBoldInOut",
      "keyframes": ["ScaleIn95to100"]
    }
  },
  "name": "motion.modal.enter",
  "path": ["motion", "modal", "enter"],
  "cleanName": "motion.modal.enter"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 200,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["ScaleOut100to95"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration200",
      "curve": "EasePracticalIn",
      "keyframes": ["ScaleOut100to95"]
    }
  },
  "name": "motion.modal.exit",
  "path": ["motion", "modal", "exit"],
  "cleanName": "motion.modal.exit"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 150,
    "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
    "keyframes": ["SlideInBottom8px", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration150",
      "curve": "EasePracticalOut",
      "keyframes": ["SlideInBottom8px", "FadeIn0to100"]
    }
  },
  "name": "motion.popup.enter.bottom",
  "path": ["motion", "popup", "enter", "bottom"],
  "cleanName": "motion.popup.enter.bottom"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 150,
    "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
    "keyframes": ["SlideInLeft8px", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration150",
      "curve": "EasePracticalOut",
      "keyframes": ["SlideInLeft8px", "FadeIn0to100"]
    }
  },
  "name": "motion.popup.enter.left",
  "path": ["motion", "popup", "enter", "left"],
  "cleanName": "motion.popup.enter.left"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 150,
    "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
    "keyframes": ["SlideInRight8px", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration150",
      "curve": "EasePracticalOut",
      "keyframes": ["SlideInRight8px", "FadeIn0to100"]
    }
  },
  "name": "motion.popup.enter.right",
  "path": ["motion", "popup", "enter", "right"],
  "cleanName": "motion.popup.enter.right"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 150,
    "curve": "cubic-bezier(0.4, 1, 0.6, 1)",
    "keyframes": ["SlideInTop8px", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration150",
      "curve": "EasePracticalOut",
      "keyframes": ["SlideInTop8px", "FadeIn0to100"]
    }
  },
  "name": "motion.popup.enter.top",
  "path": ["motion", "popup", "enter", "top"],
  "cleanName": "motion.popup.enter.top"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 100,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["SlideOutBottom8px", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration100",
      "curve": "EasePracticalIn",
      "keyframes": ["SlideOutBottom8px", "FadeOut100to0"]
    }
  },
  "name": "motion.popup.exit.bottom",
  "path": ["motion", "popup", "exit", "bottom"],
  "cleanName": "motion.popup.exit.bottom"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 100,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["SlideOutLeft8px", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration100",
      "curve": "EasePracticalIn",
      "keyframes": ["SlideOutLeft8px", "FadeOut100to0"]
    }
  },
  "name": "motion.popup.exit.left",
  "path": ["motion", "popup", "exit", "left"],
  "cleanName": "motion.popup.exit.left"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 100,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["SlideOutRight8px", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration100",
      "curve": "EasePracticalIn",
      "keyframes": ["SlideOutRight8px", "FadeOut100to0"]
    }
  },
  "name": "motion.popup.exit.right",
  "path": ["motion", "popup", "exit", "right"],
  "cleanName": "motion.popup.exit.right"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 100,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["SlideOutTop8px", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration100",
      "curve": "EasePracticalIn",
      "keyframes": ["SlideOutTop8px", "FadeOut100to0"]
    }
  },
  "name": "motion.popup.exit.top",
  "path": ["motion", "popup", "exit", "top"],
  "cleanName": "motion.popup.exit.top"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 250,
    "curve": "cubic-bezier(0.4, 0, 0, 1)",
    "keyframes": ["ScaleIn95to100", "FadeIn0to100"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration250",
      "curve": "EaseBoldInOut",
      "keyframes": ["ScaleIn95to100", "FadeIn0to100"]
    }
  },
  "name": "motion.spotlight.enter",
  "path": ["motion", "spotlight", "enter"],
  "cleanName": "motion.spotlight.enter"
}, {
  "attributes": {
    "group": "motion",
    "state": "experimental",
    "introduced": "11.2.0",
    "description": ""
  },
  "value": {
    "duration": 200,
    "curve": "cubic-bezier(0.6, 0, 0.8, 0.6)",
    "keyframes": ["ScaleOut100to95", "FadeOut100to0"]
  },
  "filePath": "schema/themes/atlassian-motion/motion.tsx",
  "isSource": true,
  "original": {
    "attributes": {
      "group": "motion",
      "state": "experimental",
      "introduced": "11.2.0",
      "description": ""
    },
    "value": {
      "duration": "Duration200",
      "curve": "EasePracticalIn",
      "keyframes": ["ScaleOut100to95", "FadeOut100to0"]
    }
  },
  "name": "motion.spotlight.exit",
  "path": ["motion", "spotlight", "exit"],
  "cleanName": "motion.spotlight.exit"
}];
var _default = exports.default = tokens;