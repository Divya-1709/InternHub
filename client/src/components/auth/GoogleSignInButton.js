import React, { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      if (window.google?.accounts?.id) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Google script")), { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.body.appendChild(script);
  });

const GoogleSignInButton = ({ onCredential, text = "continue_with", disabled = false }) => {
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const [buttonWidth, setButtonWidth] = useState(0);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!buttonRef.current) {
      return undefined;
    }

    const updateWidth = () => {
      if (!buttonRef.current) {
        return;
      }

      setButtonWidth(Math.max(320, Math.floor(buttonRef.current.getBoundingClientRect().width)));
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => updateWidth());
    resizeObserver.observe(buttonRef.current);
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      if (!clientId || !buttonRef.current || !buttonWidth) {
        return;
      }

      try {
        await loadGoogleScript();
        if (cancelled || !window.google?.accounts?.id) {
          return;
        }

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential?.(response.credential)
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text,
          shape: "pill",
          width: buttonWidth
        });
      } catch (scriptError) {
        setError("Google sign-in is unavailable right now.");
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [buttonWidth, clientId, onCredential, text]);

  if (!clientId) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/80">
        Add `REACT_APP_GOOGLE_CLIENT_ID` to enable Google sign-in.
      </div>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-70" : ""}>
      <div
        ref={buttonRef}
        className="min-h-[44px] w-full overflow-hidden rounded-full [&>div]:!w-full [&_iframe]:!w-full"
      />
      {error ? <p className="mt-2 text-xs text-red-300">{error}</p> : null}
    </div>
  );
};

export default GoogleSignInButton;
