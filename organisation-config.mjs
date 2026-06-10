import {
  loadRespecWithConfiguration as loadLogiusRespecWithConfiguration,
} from "https://logius-standaarden.github.io/publicatie/respec/organisation-config.mjs";

const arnhemOrganisationConfig = {
  nl_organisationName: "Gemeente Arnhem",

  logos: [
    {
      src: "https://gemeentearnhem.github.io/respec-config/style/logos/arnhem-logo.png",
      alt: "Gemeente Arnhem",
      id: "Arnhem",
      height: 40,
      width: 140,
      url: "https://www.arnhem.nl",
    },
  ],

  useLogo: true,
  useLabel: true,

  labelColor: {
    def: "#12636B",
    wv: "#12636B",
    cv: "#12636B",
    vv: "#12636B",
    basis: "#12636B",
    eo: "#12636B",
    tg: "#12636B",
  },

  localizationStrings: {
    nl: {
      wv: "Werkversie",
      cv: "Consultatieversie",
      vv: "Versie ter vaststelling",
      def: "Vastgestelde versie",
      basis: "Document",
      eo: "Verouderde versie",
      tg: "Teruggetrokken versie",

      st: "Standaard",
      ak: "Architectuurkader",
      api: "API-standaard",
      gs: "Gegevensstandaard",
      ar: "Arnhemrichtlijn",
      wa: "Werkafspraak Arnhem",
      bd: "Beheerdocumentatie",
      bp: "Best practice",
      al: "Algemeen document",
    },
    en: {
      wv: "Draft",
      cv: "Consultation version",
      vv: "Proposed version",
      def: "Definitive version",
      basis: "Document",
      eo: "Outdated version",
      tg: "Rescinded version",

      st: "Standard",
      ak: "Architecture framework",
      api: "API standard",
      gs: "Data standard",
      ar: "Arnhem guideline",
      wa: "Arnhem working agreement",
      bd: "Governance documentation",
      bp: "Best practice",
      al: "General document",
    },
  },

  sotdText: {
    nl: {
      sotd: "Status van dit document",
      def: "Dit is de definitieve versie van dit document. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
      wv: "Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten.",
      cv: "Dit is een consultatieversie. Reacties kunnen worden ingediend via de aangegeven beheerroute.",
      vv: "Dit is een versie ter vaststelling. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
      basis: "Dit is een document zonder officiele status.",
    },
    en: {
      sotd: "Status of This Document",
      def: "This is the definitive version of this document. Edits resulting from consultations have been applied.",
      wv: "This is a draft that may be changed, removed or replaced by other documents.",
      cv: "This is a consultation version. Comments may be submitted through the indicated governance route.",
      vv: "This is a version proposed for approval. Edits resulting from consultations have been applied.",
      basis: "This document has no official standing.",
    },
  },
};

function mergeDeep(base = {}, override = {}) {
  const result = { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = result[key];
    const overrideValue = override[key];

    const bothObjects =
      baseValue &&
      overrideValue &&
      typeof baseValue === "object" &&
      typeof overrideValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue);

    result[key] = bothObjects
      ? mergeDeep(baseValue, overrideValue)
      : overrideValue;
  }

  return result;
}

export function loadRespecWithConfiguration(documentConfig = {}) {
  const mergedConfig = mergeDeep(arnhemOrganisationConfig, documentConfig);

  if (!mergedConfig.publishers) {
    mergedConfig.publishers = [
      {
        name: "Gemeente Arnhem",
        url: "https://www.arnhem.nl",
      },
    ];
  }

  return loadLogiusRespecWithConfiguration(mergedConfig);
}

export { arnhemOrganisationConfig };