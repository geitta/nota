import type { ComponentProps } from "react";
import type { SignIn } from "@clerk/clerk-react";

// Deriving the type from SignIn's own props (rather than importing
// `Appearance` from an internal @clerk/shared path) avoids breaking across
// Clerk versions — the internal export path for this type has moved before.
type ClerkAppearance = NonNullable<ComponentProps<typeof SignIn>["appearance"]>;

/**
 * Maps Nota's palette onto Clerk's appearance API.
 *
 * Important: Clerk's own components set colors via inline styles derived
 * from `variables`, which beat a plain Tailwind class in specificity. The
 * `!` prefix on each Tailwind utility below generates `!important` in the
 * compiled CSS, which is what actually wins against Clerk's inline styles —
 * relying on `variables` alone left the primary button a blended, muted
 * color instead of solid espresso.
 */
export const clerkAppearance: ClerkAppearance = {
  variables: {
    colorPrimary: "#4B2E2B", // espresso
    colorBackground: "#FFF8F0", // cream
    colorText: "#000000",
    colorTextSecondary: "#4B2E2B",
    colorInputBackground: "#FFF8F0", // cream
    colorInputText: "#000000",
    fontFamily: '"Poppins", sans-serif',
    borderRadius: "12px",
  },
  elements: {
    rootBox: "w-[580px] max-w-full",
    card: "!bg-cream !shadow-none !border-0 !rounded-card",
    headerTitle: "!font-display !font-medium !text-3xl !text-black",
    headerSubtitle: "hidden",
    formFieldLabel: "!font-display !text-black",
    formFieldInput: "!bg-cream !border !border-black/[0.15] !rounded-[12px]",
    formButtonPrimary:
      "!bg-espresso !text-white !normal-case !text-lg !font-display !font-semibold !shadow-none !rounded-pill hover:!opacity-90",
    footerActionLink: "!text-black !underline !font-medium",
    footer: "!bg-transparent",
    dividerLine: "!bg-black/20",
    dividerText: "!text-black/60",
    socialButtonsBlockButton: "!rounded-[12px] !border-black/[0.15]",
    identityPreviewEditButton: "!text-espresso",
  },
};