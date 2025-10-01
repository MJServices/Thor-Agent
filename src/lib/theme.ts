// Thor Agent Theme Configuration
// Golden/Purple Glass Morphism Design System

export const theme = {
  colors: {
    primary: {
      gold: "#ffd700",
      goldLight: "#ffed4e",
      goldDark: "#b8860b",
      purple: "#7c3aed",
      purpleLight: "#a855f7",
      purpleDark: "#581c87",
    },
    background: {
      primary: "rgba(45, 27, 78, 0.4)",
      secondary: "rgba(45, 27, 78, 0.2)",
      subtle: "rgba(45, 27, 78, 0.1)",
    },
    glass: {
      strong: "rgba(45, 27, 78, 0.4)",
      medium: "rgba(45, 27, 78, 0.25)",
      light: "rgba(45, 27, 78, 0.15)",
      subtle: "rgba(45, 27, 78, 0.1)",
    },
    border: {
      gold: "rgba(255, 215, 0, 0.2)",
      goldLight: "rgba(255, 215, 0, 0.1)",
      goldSubtle: "rgba(255, 215, 0, 0.05)",
    },
    text: {
      primary: "#ffd700",
      secondary: "rgba(255, 215, 0, 0.8)",
      muted: "rgba(255, 215, 0, 0.6)",
      white: "#ffffff",
      whiteSecondary: "rgba(255, 255, 255, 0.8)",
    },
  },

  gradients: {
    primary: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
    secondary:
      "linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #fff59d 50%, #ffd700 75%, #b8860b 100%)",
    background:
      "linear-gradient(135deg, #0a0118 0%, #1a0b2e 25%, #2d1b4e 50%, #1a0b2e 75%, #0a0118 100%)",
    glass:
      "linear-gradient(135deg, rgba(45, 27, 78, 0.4) 0%, rgba(45, 27, 78, 0.2) 100%)",
    button: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
    buttonHover:
      "linear-gradient(135deg, #ffed4e 0%, #fff59d 50%, #ffed4e 100%)",
    card: "linear-gradient(135deg, rgba(124, 58, 237, 0.4) 0%, rgba(45, 27, 78, 0.2) 100%)",
  },

  shadows: {
    golden: {
      light: "0 0 20px rgba(255, 215, 0, 0.3)",
      medium:
        "0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)",
      strong:
        "0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)",
    },
    purple: {
      light: "0 0 20px rgba(124, 58, 237, 0.3)",
      medium:
        "0 0 30px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.2)",
      strong:
        "0 0 40px rgba(124, 58, 237, 0.6), 0 0 80px rgba(124, 58, 237, 0.3)",
    },
    mixed: "0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(124, 58, 237, 0.2)",
    glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },

  blur: {
    light: "blur(15px)",
    medium: "blur(20px)",
    strong: "blur(25px)",
    intense: "blur(30px)",
  },

  animations: {
    duration: {
      fast: "0.2s",
      normal: "0.3s",
      slow: "0.5s",
      slower: "0.8s",
    },
    easing: {
      default: "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      smooth: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
  },

  spacing: {
    section: "6rem", // py-24
    sectionMobile: "4rem", // py-16
    container: "2rem", // px-8
    containerMobile: "1.5rem", // px-6
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Utility functions for theme usage
export const getGlassStyle = (
  variant: "subtle" | "light" | "medium" | "strong" = "medium"
) => ({
  background: theme.colors.glass[variant],
  backdropFilter: theme.blur.medium,
  border: `1px solid ${theme.colors.border.goldLight}`,
  boxShadow: theme.shadows.glass,
});

export const getGlowStyle = (
  color: "golden" | "purple" | "mixed" = "golden",
  intensity: "light" | "medium" | "strong" = "medium"
) => {
  if (color === "mixed") return { boxShadow: theme.shadows.mixed };
  return { boxShadow: theme.shadows[color][intensity] };
};

export const getGradientText = (
  variant: "primary" | "secondary" = "primary"
) => ({
  background: theme.gradients[variant],
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline-block",
  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))",
});

// Component-specific theme presets
export const componentThemes = {
  card: {
    background: theme.gradients.glass,
    backdropFilter: theme.blur.medium,
    border: `1px solid ${theme.colors.border.goldLight}`,
    boxShadow: theme.shadows.golden.light,
    borderRadius: "1rem",
    transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
  },

  button: {
    primary: {
      background: theme.gradients.button,
      color: theme.colors.primary.purpleDark,
      fontWeight: "700",
      boxShadow: theme.shadows.golden.medium,
      transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
    },

    secondary: {
      background: "transparent",
      border: `2px solid ${theme.colors.border.gold}`,
      color: theme.colors.text.primary,
      backdropFilter: theme.blur.light,
      transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
    },
  },

  section: {
    padding: `${theme.spacing.section} ${theme.spacing.container}`,
    position: "relative" as const,
  },
};

export type ThemeColors = typeof theme.colors;
export type ThemeGradients = typeof theme.gradients;
export type ThemeShadows = typeof theme.shadows;
