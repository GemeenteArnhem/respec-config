const ARNHEM_STATUS_LABELS = {
  wv: "Werkversie",
  cv: "Consultatieversie",
  vv: "Versie ter vaststelling",
  def: "Vastgestelde versie",
  basis: "Document",
  eo: "Verouderde versie",
  tg: "Teruggetrokken versie",
};

const ARNHEM_STATUS_TEXT = {
  wv: "Dit is een werkversie die op elk moment kan worden gewijzigd, verwijderd of vervangen door andere documenten.",
  cv: "Dit is een consultatieversie. Reacties kunnen worden ingediend via de aangegeven beheerroute.",
  vv: "Dit is een versie ter vaststelling. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
  def: "Dit is de definitieve versie van dit document. Wijzigingen naar aanleiding van consultaties zijn doorgevoerd.",
  basis: "Dit is een document zonder officiele status.",
  eo: "Dit document is verouderd.",
  tg: "Dit document is teruggetrokken.",
};

const ARNHEM_TYPE_LABELS = {
  st: "Standaard",
  ak: "Architectuurkader",
  api: "API-standaard",
  gs: "Gegevensstandaard",
  ar: "Arnhemrichtlijn",
  wa: "Werkafspraak Arnhem",
  bd: "Beheerdocumentatie",
  bp: "Best practice",
  al: "Algemeen document",
};

const ARNHEM_DEFAULT_LICENSES = {
  "cc-by": {
    name: "Creative Commons Attribution 4.0 International Public License",
    short: "CC-BY",
    url: "https://creativecommons.org/licenses/by/4.0/legalcode",
    image: "https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png",
  },
};

const arnhemOrganisationConfig = {
  nl_organisationName: "Gemeente Arnhem",
  pubDomain: "arnhem",

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
      ...ARNHEM_STATUS_LABELS,
      ...ARNHEM_TYPE_LABELS,
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
      ...ARNHEM_STATUS_TEXT,
    },
    en: {
      sotd: "Status of This Document",
      def: "This is the definitive version of this document. Edits resulting from consultations have been applied.",
      wv: "This is a draft that may be changed, removed or replaced by other documents.",
      cv: "This is a consultation version. Comments may be submitted through the indicated governance route.",
      vv: "This is a version proposed for approval. Edits resulting from consultations have been applied.",
      basis: "This document has no official standing.",
      eo: "This document is outdated.",
      tg: "This document has been rescinded.",
    },
  },

  publishers: [
    {
      name: "Gemeente Arnhem",
      url: "https://www.arnhem.nl",
    },
  ],

  localBiblio: {
    SemVer: {
      title: "Semantic Versioning 2.0.0",
      href: "https://semver.org/",
      authors: ["Tom Preston-Werner"],
      status: "Living Document",
      publisher: "semver.org",
    },
  },

  licenses: ARNHEM_DEFAULT_LICENSES,
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

function normalizeKey(value = "") {
  return String(value).trim().toLowerCase();
}

function formatDutchDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function createEl(doc, tag, options = {}) {
  const el = doc.createElement(tag);

  if (options.className) el.className = options.className;
  if (options.text) el.textContent = options.text;

  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      el.setAttribute(key, value);
    }
  }

  if (options.html) {
    el.innerHTML = options.html;
  }

  return el;
}

function ensureSotdSection(doc) {
  let sotd = doc.querySelector("#sotd");
  if (!sotd) {
    sotd = doc.createElement("section");
    sotd.id = "sotd";
    doc.body.prepend(sotd);
  }
  return sotd;
}

function clearChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function injectSotd(doc, config) {
  const sotd = ensureSotdSection(doc);
  clearChildren(sotd);

  const statusKey = normalizeKey(config.specStatus || "basis");
  const statusHeading =
    config.sotdText?.nl?.sotd ||
    arnhemOrganisationConfig.sotdText.nl.sotd;

  const statusText =
    config.sotdText?.nl?.[statusKey] ||
    arnhemOrganisationConfig.sotdText.nl[statusKey] ||
    arnhemOrganisationConfig.sotdText.nl.basis;

  const h2 = createEl(doc, "h2", { text: statusHeading });
  const p = createEl(doc, "p", { text: statusText });

  sotd.appendChild(h2);
  sotd.appendChild(p);
}

function injectArnhemHeadline(doc, config) {
  const head = doc.querySelector(".head");
  if (!head) return;

  const existing = doc.querySelector(".arnhem-meta-line");
  if (existing) existing.remove();

  const statusKey = normalizeKey(config.specStatus || "basis");
  const typeKey = normalizeKey(config.specType || "st");

  const orgName =
    config.nl_organisationName ||
    arnhemOrganisationConfig.nl_organisationName;

  const typeLabel =
    config.localizationStrings?.nl?.[typeKey] ||
    arnhemOrganisationConfig.localizationStrings.nl[typeKey] ||
    String(config.specType || "Document");

  const statusLabel =
    config.localizationStrings?.nl?.[statusKey] ||
    arnhemOrganisationConfig.localizationStrings.nl[statusKey] ||
    String(config.specStatus || "");

  const line = createEl(doc, "p", {
    className: "arnhem-meta-line",
    text: `${orgName} ${typeLabel} ${statusLabel}`.trim(),
  });

  const title = head.querySelector("h1");
  if (title && title.parentNode) {
    title.insertAdjacentElement("afterend", line);
  } else {
    head.prepend(line);
  }
}

function injectArnhemSideLabel(doc, config) {
  const existing = doc.querySelector(".arnhem-side-label");
  if (existing) existing.remove();

  if (config.useLabel === false) return;

  const statusKey = normalizeKey(config.specStatus || "basis");
  const typeKey = normalizeKey(config.specType || "st");

  const typeLabel =
    config.localizationStrings?.nl?.[typeKey] ||
    arnhemOrganisationConfig.localizationStrings.nl[typeKey] ||
    String(config.specType || "Document");

  const statusLabel =
    config.localizationStrings?.nl?.[statusKey] ||
    arnhemOrganisationConfig.localizationStrings.nl[statusKey] ||
    String(config.specStatus || "");

  const labelColor =
    config.labelColor?.[statusKey] ||
    arnhemOrganisationConfig.labelColor[statusKey] ||
    "#12636B";

  const aside = createEl(doc, "aside", {
    className: "arnhem-side-label",
    text: `${typeLabel} ${statusLabel}`.trim(),
  });

  aside.setAttribute(
    "style",
    [
      "position: fixed",
      "left: 0",
      "top: 140px",
      "z-index: 10",
      "writing-mode: vertical-rl",
      "transform: rotate(180deg)",
      "padding: 10px 8px",
      "background: " + labelColor,
      "color: white",
      "font-family: Arial, sans-serif",
      "font-size: 12px",
      "line-height: 1.2",
      "border-radius: 0 4px 4px 0",
      "box-shadow: 0 1px 4px rgba(0,0,0,0.15)",
    ].join(";")
  );

  doc.body.appendChild(aside);
}

function buildOtherLinks(config) {
  const otherLinks = [];

  if (config.github) {
    otherLinks.push({
      key: "Doe mee",
      data: [
        {
          value: "GitHub",
          href: config.github,
        },
      ],
    });
  }

  return otherLinks;
}

function pruneFalseOptions(config) {
  const out = { ...config };

  if (out.github === false) delete out.github;
  if (out.license === false) delete out.license;
  if (out.alternateFormats === false) delete out.alternateFormats;

  return out;
}

function buildRespecConfig(merged) {
  const config = pruneFalseOptions(merged);

  const respecConfig = {
    title: config.title,
    shortName: config.shortName,
    publishDate: config.publishDate,
    pubDomain: config.pubDomain,
    publishers: config.publishers || [],
    editors: config.editors || [],
    authors: config.authors || [],
    logos: config.useLogo === false ? [] : (config.logos || []),
    otherLinks: buildOtherLinks(config),
    postProcess: [
      ...(Array.isArray(config.postProcess) ? config.postProcess : []),
      async (_config, doc, _utils) => {
        injectSotd(doc, config);
        injectArnhemHeadline(doc, config);
        injectArnhemSideLabel(doc, config);
      },
    ],
  };

  if (config.latestVersion) {
    respecConfig.latestVersion = config.latestVersion;
  }

  if (Array.isArray(config.prevVersion) && config.prevVersion.length) {
    respecConfig.prevVersion = config.prevVersion;
  }

  if (config.github) {
    respecConfig.github = config.github;
  }

  if (config.license) {
    respecConfig.license = config.license;
    respecConfig.licenses = config.licenses || ARNHEM_DEFAULT_LICENSES;
  }

  if (Array.isArray(config.alternateFormats) && config.alternateFormats.length) {
    respecConfig.alternateFormats = config.alternateFormats;
  }

  if (config.localBiblio) {
    respecConfig.localBiblio = config.localBiblio;
  }

  if (config.lint !== undefined) {
    respecConfig.lint = config.lint;
  }

  return respecConfig;
}

export function loadRespecWithConfiguration(documentConfig = {}) {
  const merged = mergeDeep(arnhemOrganisationConfig, documentConfig);

  if (!merged.publishers) {
    merged.publishers = arnhemOrganisationConfig.publishers;
  }

  if (!merged.pubDomain) {
    merged.pubDomain = "arnhem";
  }

  const respecConfig = buildRespecConfig(merged);

  globalThis.respecConfig = respecConfig;
  return respecConfig;
}

export { arnhemOrganisationConfig, formatDutchDate };
