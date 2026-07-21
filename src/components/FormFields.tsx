'use client';

import React, { useEffect, useState } from "react";
import Steps from "./Steps";
import SiteInfoStep from "./SiteInfoStep";
import ContentLinksStep from "./ContentLinksStep";
import ExportStep from "./ExportStep";
import VersionTabs from "./VersionTabs";
import AiVersionStep from "./AiVersionStep";
import AiContextProvider from "@/app/store/AiContext";
import { useFormFields } from "@/app/store/FormFieldContext";
import ManualExport from "./ManualExport";


export default function FormFields() {
  const { state } = useFormFields()!;
  const { step, mode, siteInfoInput } = state;
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("is_bot") === "true") {
        setIsBlocked(true);
      }
    }
  }, []);

  useEffect(() => {
    if (siteInfoInput && siteInfoInput.trim().length > 0 && siteInfoInput !== "kdjfdk") {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("is_bot", "true");
        setIsBlocked(true);
      }
    }
  }, [siteInfoInput]);

  if (isBlocked) {
    return (
      <div className="bg-red-dim border border-[rgba(248,113,113,0.2)] rounded-2xl p-8 text-center my-6">
        <div className="text-4xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-red-custom mb-2">Access Denied</h2>
        <p className="font-mono text-[13px] text-muted-custom">
          Suspicious bot activity detected. Access to this generator has been permanently blocked.
        </p>
      </div>
    );
  }

  return (
    <AiContextProvider>
      {/* Version tabs: AI / Manual */}
      <VersionTabs />

      {mode === "ai" ? (
        <AiVersionStep />
      ) : (
        <>
          {/* Steps Indicator */}
          <div className="flex items-center justify-center mb-9">
            <Steps />
          </div>

          {/* ══ PANEL 1: Site Info ══ */}
          {step === 1 && (
            <SiteInfoStep />
          )}

          {/* ══ PANEL 2: Content Links ══ */}
          {step === 2 && (
            <ContentLinksStep />
          )}

          {/* ══ PANEL 3: Export Output ══ */}
          {step === 3 && (
            <ManualExport />
          )}
        </>
      )}
    </AiContextProvider>
  )
}