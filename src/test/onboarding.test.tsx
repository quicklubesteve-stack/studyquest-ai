import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { AppProvider } from "@/lib/store/useAppStore";

describe("Onboarding Wizard Component", () => {
  it("renders Step 1 with education stages and navigates through steps", () => {
    const handleComplete = vi.fn();

    render(
      <AppProvider>
        <OnboardingWizard onComplete={handleComplete} />
      </AppProvider>
    );

    // Verify Step 1 is rendered
    expect(screen.getByText(/What is your education stage\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Early Explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/Junior Adventurer/i)).toBeInTheDocument();
    expect(screen.getByText(/Scholar/i)).toBeInTheDocument();

    // Select Scholar (High School)
    fireEvent.click(screen.getByText(/Scholar/i));

    // Click Next Step
    const nextBtn = screen.getByText(/Next Step/i);
    fireEvent.click(nextBtn);

    // Verify Step 2 is rendered
    expect(screen.getByText(/What subjects do you want to explore\?/i)).toBeInTheDocument();
  });

  it("contains all 5 required learning preference choices on Step 5", async () => {
    const handleComplete = vi.fn();

    render(
      <AppProvider>
        <OnboardingWizard onComplete={handleComplete} />
      </AppProvider>
    );

    // Select Adult (no consent barrier)
    fireEvent.click(screen.getByText(/Lifelong Learner/i));

    // Advance to Step 5
    for (let i = 1; i < 5; i++) {
      fireEvent.click(screen.getByText(/Next Step/i));
    }

    // Check all 5 learning style variants are visible
    expect(screen.getByText(/What is your preferred way to learn\?/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^Visual$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Audio & Discussion/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Reading & Writing/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Hands-on & Interactive/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Mixed \(Balanced Combination\)/i })).toBeInTheDocument();
  });
});
