/**
 * Gets the Formspree endpoint URL based on the current environment and provided form ID.
 *
 * In development mode (import.meta.env.DEV), it uses PUBLIC_FORMSPREE_FORM_ID_DEV if available,
 * otherwise falls back to PUBLIC_FORMSPREE_FORM_ID.
 * In production mode, it uses PUBLIC_FORMSPREE_FORM_ID.
 *
 * @param formId - Optional form ID to override the environment-based form ID
 * @returns The full Formspree endpoint URL (https://formspree.io/f/{formId})
 * @throws Error if no valid form ID can be resolved
 */
export function getFormspreeEndpoint(formId?: string): string {
  // If a formId is provided, use it directly
  if (formId) {
    return `https://formspree.io/f/${formId}`;
  }

  // Determine which environment variable to use
  let resolvedFormId: string | undefined;

  if (import.meta.env.DEV) {
    // In development, prefer DEV form ID if available, otherwise fall back to main form ID
    resolvedFormId =
      import.meta.env.PUBLIC_FORMSPREE_FORM_ID_DEV ||
      import.meta.env.PUBLIC_FORMSPREE_FORM_ID;
  } else {
    // In production, use the main form ID
    resolvedFormId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID;
  }

  // Throw error if no form ID is available
  if (!resolvedFormId) {
    throw new Error(
      "Formspree form ID is not configured. Please set PUBLIC_FORMSPREE_FORM_ID in your environment variables."
    );
  }

  return `https://formspree.io/f/${resolvedFormId}`;
}
