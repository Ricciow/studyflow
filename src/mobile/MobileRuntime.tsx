import { useEffect, type PropsWithChildren } from "react";
import { MobileDeviceProvider, useMobileDevice } from "./Device";
import { KeyboardDock, KeyboardProvider, useKeyboard } from "./Keyboard";
import { PhoneFrame } from "./PhoneFrame";
import { HomeIndicator, StatusBar } from "./components";
import { PresentationProvider, usePresentation } from './Presentation';

export function MobileRuntime({ children }: PropsWithChildren) {
  return (
    <PresentationProvider><MobileDeviceProvider>
      <PhoneFrame>
        <KeyboardProvider>
          <PreviewChrome />
          <MobileAppViewport>{children}</MobileAppViewport>
          <PreviewFooter />
        </KeyboardProvider>
      </PhoneFrame>
    </MobileDeviceProvider></PresentationProvider>
  );
}

function MobileAppViewport({ children }: PropsWithChildren) {
  const { device } = useMobileDevice();
  const keyboard = useKeyboard();
  const { isApp } = usePresentation();

  return (
    <div
      className="mobile-app-viewport"
      data-keyboard-visible={keyboard.visible ? "true" : "false"}
      data-platform={device.platform}
      data-presentation={isApp ? 'app' : 'preview'}
      data-testid="mobile-app-viewport"
    >
      {children}
    </div>
  );
}

function PreviewChrome() {
  const { isApp } = usePresentation();
  return isApp ? null : <><KeyboardPreview/><StatusBar/></>;
}
function PreviewFooter() {
  const { isApp } = usePresentation();
  return isApp ? null : <><HomeIndicator/><KeyboardDock/></>;
}

function KeyboardPreview() {
  const keyboard = useKeyboard();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("keyboard") === "1") {
      keyboard.show();
    }
  }, [keyboard]);

  return null;
}
