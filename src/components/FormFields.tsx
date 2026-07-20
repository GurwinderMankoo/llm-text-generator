'use client';

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
const { step, mode } = state;

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