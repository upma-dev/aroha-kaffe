"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setShowLoader(false), 1100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      {showLoader ? (
        <div className="loaderRoot" aria-label="Loading">
          <div className="loaderCard">
            <div className="loaderBrand">Aroha Kaffe</div>
            <div className="loaderSub">Find serenity in every sip</div>
            <div className="loaderBar" />
          </div>
        </div>
      ) : null}

      <div className="shell" style={{ visibility: showLoader ? "hidden" : "visible" }}>
        <iframe title="Aroha Kaffe" src="/site" />
      </div>
    </>
  );
}

