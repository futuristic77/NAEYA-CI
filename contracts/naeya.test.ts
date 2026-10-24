import { describe, expect, it } from "vitest";
import {
  LEGAL_FORMS,
  LEGAL_FORM_LABELS,
  REQUIRED_DOCUMENTS,
  requiresCapital,
  requiresManager,
  tracksAssociates,
  type LegalForm,
} from "./naeya";

describe("formes juridiques NAEYA", () => {
  it("expose les 11 formes et leurs libellés", () => {
    expect(LEGAL_FORMS).toHaveLength(11);
    for (const forme of LEGAL_FORMS) {
      expect(LEGAL_FORM_LABELS[forme]).toBeTruthy();
      expect(REQUIRED_DOCUMENTS[forme].length).toBeGreaterThan(0);
    }
  });

  it.each<LegalForm>(["SARL", "SARLU", "SA", "SAS", "SASU"])(
    "exige un capital pour %s",
    (forme) => {
      expect(requiresCapital(forme)).toBe(true);
    },
  );

  it.each<LegalForm>([
    "EI",
    "SNC",
    "SCS",
    "SCI_COMMERCIALE",
    "SUCCURSALE",
    "BUREAU_REPRESENTATION",
  ])("n'exige pas de capital pour %s", (forme) => {
    expect(requiresCapital(forme)).toBe(false);
  });

  it.each<LegalForm>([
    "SARL",
    "SARLU",
    "SA",
    "SAS",
    "SASU",
    "SNC",
    "SCS",
    "SCI_COMMERCIALE",
    "SUCCURSALE",
    "BUREAU_REPRESENTATION",
  ])("exige un représentant pour %s", (forme) => {
    expect(requiresManager(forme)).toBe(true);
  });

  it("n'exige ni capital ni représentant pour l'EI", () => {
    expect(requiresCapital("EI")).toBe(false);
    expect(requiresManager("EI")).toBe(false);
    expect(tracksAssociates("EI")).toBe(false);
  });

  it("suit les associés uniquement pour les sociétés concernées", () => {
    expect(tracksAssociates("SARL")).toBe(true);
    expect(tracksAssociates("SCI_COMMERCIALE")).toBe(true);
    expect(tracksAssociates("SUCCURSALE")).toBe(false);
    expect(tracksAssociates("BUREAU_REPRESENTATION")).toBe(false);
  });
});
