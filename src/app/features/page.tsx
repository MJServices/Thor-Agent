"use client";

import React from "react";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { EnhancedBentoSection } from "@/components/sections/EnhancedBentoSection";
import { PageLayout } from "@/components/layout/PageLayout";

export default function FeaturesPage() {
  return (
    <PageLayout>
      <FeaturesSection />
      <EnhancedBentoSection />
    </PageLayout>
  );
}
