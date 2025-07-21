import { useEffect, useLayoutEffect } from 'react';

/**
 * A custom hook that uses useLayoutEffect on the client and useEffect on the server.
 * This prevents the SSR warning about useLayoutEffect doing nothing on the server.
 *
 * For most cases where you're just updating refs or doing measurements,
 * this should be safe to use instead of useLayoutEffect.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
