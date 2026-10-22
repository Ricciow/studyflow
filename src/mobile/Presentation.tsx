import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";

// Include phone landscape while keeping the desktop device preview available.
const appQuery =
  "(max-width: 767px), (max-width: 1023px) and (max-height: 600px)";
function subscribeMode(listener: () => void) {
  const media = window.matchMedia(appQuery);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function subscribeViewport(listener: () => void) {
  window.addEventListener("resize", listener);
  window.visualViewport?.addEventListener("resize", listener);
  return () => {
    window.removeEventListener("resize", listener);
    window.visualViewport?.removeEventListener("resize", listener);
  };
}
const PresentationContext = createContext({
  isApp: false,
  viewportHeight: 852,
});
export function PresentationProvider({ children }: PropsWithChildren) {
  const isApp = useSyncExternalStore(
    subscribeMode,
    () => window.matchMedia(appQuery).matches,
    () => false,
  );
  const viewportHeight = useSyncExternalStore(
    subscribeViewport,
    () => Math.round(window.visualViewport?.height ?? window.innerHeight),
    () => 852,
  );
  const value = useMemo(
    () => ({ isApp, viewportHeight }),
    [isApp, viewportHeight],
  );
  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}
export function usePresentation() {
  return useContext(PresentationContext);
}
