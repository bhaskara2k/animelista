/**
 * Triggers subtle haptic feedback (vibration) on mobile devices / PWA.
 */
export const triggerHapticFeedback = (duration: number = 40): void => {
  if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(duration);
    } catch (e) {
      // Ignore vibration errors on unsupported platforms
    }
  }
};
