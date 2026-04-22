type Player = {
  name: string;
  realm: string;
  region: "eu";
  blizzardUrl: string;
};

type PlayerJson = {
  name: string;
  realm: string;
  region?: "eu";
};

type GemQualityRule = {
  label: string;
  quality: "accepted";
  match: {
    textIncludes?: string;
    regex?: string;
  };
};

type GemQualityJson = {
  rules: GemQualityRule[];
  default: {
    quality: "rejected";
  };
};

type RaiderItem = {
  item_id?: number;
  item_level?: number;
  name?: string;
  bonuses?: number[];
  enchant?: number;
  enchants?: number[];
  enchants_detail?: Array<{ id?: number; name?: string }>;
  gems?: number[];
  gems_detail?: Array<{ id?: number; name?: string }>;
};

type RaiderCharacter = {
  name?: string;
  race?: string;
  class?: string;
  active_spec_name?: string;
  active_spec_role?: string;
  faction?: string;
  thumbnail_url?: string;
  realm?: string;
  gear?: {
    item_level_equipped?: number;
    item_level_total?: number;
    items?: Record<string, RaiderItem>;
  };
  statusCode?: number;
  message?: string;
};

type PlayerRecord = {
  player: Player;
  status: "idle" | "loading" | "loaded" | "error";
  data?: RaiderCharacter;
  error?: string;
};

type SelectedItem = {
  playerName: string;
  slotLabel: string;
  item: RaiderItem;
};

type EquipmentSlot = {
  key: string;
  label: string;
};

type SortKey = "name" | "realm" | "class" | "issueCount";
type SortDirection = "asc" | "desc";
type QuickFilter = "all" | "issues";
type ViewMode = "full" | "issueItems";
type TrackName = "Explorer" | "Adventurer" | "Veteran" | "Champion" | "Hero" | "Myth";
type TrackInfo = {
  track: TrackName;
  rank: number;
  maxRank: number;
  source: "bonus" | "item-level";
};

const appVersion = "20260422-1";

const equipmentSlots: EquipmentSlot[] = [
  { key: "head", label: "Head" },
  { key: "neck", label: "Neck" },
  { key: "shoulder", label: "Shoulder" },
  { key: "back", label: "Back" },
  { key: "chest", label: "Chest" },
  { key: "wrist", label: "Wrist" },
  { key: "hands", label: "Hands" },
  { key: "waist", label: "Waist" },
  { key: "legs", label: "Legs" },
  { key: "feet", label: "Feet" },
  { key: "finger1", label: "Ring 1" },
  { key: "finger2", label: "Ring 2" },
  { key: "trinket1", label: "Trinket 1" },
  { key: "trinket2", label: "Trinket 2" },
  { key: "mainhand", label: "Main Hand" },
  { key: "offhand", label: "Off Hand" },
];

const enchantableSlots = new Set(["mainhand", "offhand", "head", "shoulder", "chest", "legs", "feet", "finger1", "finger2"]);
const gemSlots = new Set(["neck", "finger1", "finger2"]);

const trackByBonusId: Record<number, TrackInfo> = {
  12795: { track: "Hero", rank: 3, maxRank: 6, source: "bonus" },
  12797: { track: "Hero", rank: 5, maxRank: 6, source: "bonus" },
  12798: { track: "Hero", rank: 6, maxRank: 6, source: "bonus" },
  13667: { track: "Myth", rank: 5, maxRank: 6, source: "bonus" },
  12806: { track: "Myth", rank: 6, maxRank: 6, source: "bonus" },
};

const trackByItemLevel: Record<number, TrackInfo[]> = {
  220: [{ track: "Adventurer", rank: 1, maxRank: 6, source: "item-level" }],
  224: [{ track: "Adventurer", rank: 2, maxRank: 6, source: "item-level" }],
  227: [{ track: "Adventurer", rank: 3, maxRank: 6, source: "item-level" }],
  230: [{ track: "Adventurer", rank: 4, maxRank: 6, source: "item-level" }],
  233: [
    { track: "Adventurer", rank: 5, maxRank: 6, source: "item-level" },
    { track: "Veteran", rank: 1, maxRank: 6, source: "item-level" },
  ],
  237: [
    { track: "Adventurer", rank: 6, maxRank: 6, source: "item-level" },
    { track: "Veteran", rank: 2, maxRank: 6, source: "item-level" },
  ],
  240: [{ track: "Veteran", rank: 3, maxRank: 6, source: "item-level" }],
  243: [{ track: "Veteran", rank: 4, maxRank: 6, source: "item-level" }],
  246: [
    { track: "Veteran", rank: 5, maxRank: 6, source: "item-level" },
    { track: "Champion", rank: 1, maxRank: 6, source: "item-level" },
  ],
  250: [
    { track: "Veteran", rank: 6, maxRank: 6, source: "item-level" },
    { track: "Champion", rank: 2, maxRank: 6, source: "item-level" },
  ],
  253: [{ track: "Champion", rank: 3, maxRank: 6, source: "item-level" }],
  256: [{ track: "Champion", rank: 4, maxRank: 6, source: "item-level" }],
  259: [
    { track: "Champion", rank: 5, maxRank: 6, source: "item-level" },
    { track: "Hero", rank: 1, maxRank: 6, source: "item-level" },
  ],
  263: [
    { track: "Champion", rank: 6, maxRank: 6, source: "item-level" },
    { track: "Hero", rank: 2, maxRank: 6, source: "item-level" },
  ],
  266: [{ track: "Hero", rank: 3, maxRank: 6, source: "item-level" }],
  269: [{ track: "Hero", rank: 4, maxRank: 6, source: "item-level" }],
  272: [
    { track: "Hero", rank: 5, maxRank: 6, source: "item-level" },
    { track: "Myth", rank: 1, maxRank: 6, source: "item-level" },
  ],
  276: [
    { track: "Hero", rank: 6, maxRank: 6, source: "item-level" },
    { track: "Myth", rank: 2, maxRank: 6, source: "item-level" },
  ],
  279: [{ track: "Myth", rank: 3, maxRank: 6, source: "item-level" }],
  282: [{ track: "Myth", rank: 4, maxRank: 6, source: "item-level" }],
  285: [{ track: "Myth", rank: 5, maxRank: 6, source: "item-level" }],
  289: [{ track: "Myth", rank: 6, maxRank: 6, source: "item-level" }],
};

const enchantQualityById: Record<number, number> = {
  7936: 1,
  7937: 2,
  8162: 1,
  8163: 2,
  7938: 1,
  7939: 2,
  8018: 1,
  8019: 2,
  7962: 1,
  7963: 2,
  7992: 1,
  7993: 2,
  7956: 1,
  7957: 2,
  8012: 1,
  8013: 2,
  7984: 1,
  7985: 2,
  7986: 1,
  7987: 2,
  7988: 1,
  7989: 2,
  7990: 1,
  7991: 2,
  7960: 1,
  7961: 2,
  8016: 1,
  8017: 2,
  7958: 1,
  7959: 2,
  8014: 1,
  8015: 2,
  7964: 1,
  7965: 2,
  7966: 1,
  7967: 2,
  7996: 1,
  7997: 2,
  7994: 1,
  7995: 2,
  8024: 1,
  8025: 2,
  8026: 1,
  8027: 2,
  8020: 1,
  8021: 2,
  8022: 1,
  8023: 2,
  7968: 1,
  7969: 2,
  7972: 1,
  7973: 2,
  8000: 1,
  8001: 2,
  7970: 1,
  7971: 2,
  7998: 1,
  7999: 2,
  8030: 1,
  8031: 2,
  8028: 1,
  8029: 2,
  8038: 1,
  8039: 2,
  8040: 1,
  8041: 2,
  7982: 1,
  7983: 2,
  8036: 1,
  8037: 2,
  7980: 1,
  7981: 2,
  7978: 1,
  7979: 2,
  8008: 1,
  8009: 2,
  8006: 1,
  8007: 2,
  8010: 1,
  8011: 2,
  8158: 1,
  8159: 2,
  7934: 1,
  7935: 2,
  8160: 1,
  8161: 2,
};

const enchantQualityByKey: Record<string, number> = {
  "arcanoweave_spellthread": 2,
  "blood_knights_armor_kit": 2,
  "bright_linen_spellthread": 2,
  "enchant_boots__farstriders_hunt": 2,
  "enchant_boots__lynxs_dexterity": 2,
  "enchant_boots__shaladrassils_roots": 2,
  "enchant_chest__mark_of_nalorakk": 2,
  "enchant_chest__mark_of_the_magister": 2,
  "enchant_chest__mark_of_the_rootwarden": 2,
  "enchant_chest__mark_of_the_worldsoul": 2,
  "enchant_helm__blessing_of_speed": 2,
  "enchant_helm__empowered_blessing_of_speed": 2,
  "enchant_helm__empowered_hex_of_leeching": 2,
  "enchant_helm__empowered_rune_of_avoidance": 2,
  "enchant_helm__hex_of_leeching": 2,
  "enchant_helm__rune_of_avoidance": 2,
  "enchant_ring__amani_mastery": 2,
  "enchant_ring__eyes_of_the_eagle": 2,
  "enchant_ring__natures_fury": 2,
  "enchant_ring__natures_wrath": 2,
  "enchant_ring__silvermoons_alacrity": 2,
  "enchant_ring__silvermoons_tenacity": 2,
  "enchant_ring__thalassian_haste": 2,
  "enchant_ring__thalassian_versatility": 2,
  "enchant_ring__zuljins_mastery": 2,
  "enchant_shoulders__akilzons_swiftness": 2,
  "enchant_shoulders__amirdrassils_grace": 2,
  "enchant_shoulders__flight_of_the_eagle": 2,
  "enchant_shoulders__natures_grace": 2,
  "enchant_shoulders__silvermoons_mending": 2,
  "enchant_shoulders__thalassian_recovery": 2,
  "enchant_weapon__acuity_of_the_rendorei": 2,
  "enchant_weapon__arcane_mastery": 2,
  "enchant_weapon__berserkers_rage": 2,
  "enchant_weapon__flames_of_the_sindorei": 2,
  "enchant_weapon__janalais_precision": 2,
  "enchant_weapon__strength_of_halazzi": 2,
  "enchant_weapon__worldsoul_aegis": 2,
  "enchant_weapon__worldsoul_cradle": 2,
  "enchant_weapon__worldsoul_tenacity": 2,
  "forest_hunters_armor_kit": 2,
  "sunfire_silk_spellthread": 2,
  "thalassian_scout_armor_kit": 2,
};

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("Application root was not found.");
}

const state = {
  records: [] as PlayerRecord[],
  gemRules: [] as GemQualityRule[],
  search: "",
  realm: "all",
  quickFilter: "all" as QuickFilter,
  viewMode: "full" as ViewMode,
  sortKey: "issueCount" as SortKey,
  sortDirection: "desc" as SortDirection,
  selectedItem: undefined as SelectedItem | undefined,
};

const formatRealm = (realm: string) =>
  realm
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getPlayers = () => state.records.map((record) => record.player);

const getRealmOptions = () =>
  Array.from(new Set(getPlayers().map((player) => player.realm))).sort((a, b) =>
    formatRealm(a).localeCompare(formatRealm(b)),
  );

const isIssueFocused = () => state.viewMode === "issueItems" || state.quickFilter === "issues";

const enforceIssueSort = () => {
  if (isIssueFocused()) {
    state.sortKey = "issueCount";
    state.sortDirection = "desc";
  }
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatNumber = (value: unknown, digits = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "n/a";

const normalizeItemName = (name: string) => name.toLowerCase().replace(/\s+/g, " ").trim();

const normalizeEnchantKey = (name: string) =>
  normalizeItemName(name)
    .replace(/'/g, "")
    .replace(/-/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const formatQuality = (quality?: number) => (quality ? `Q${quality}` : "");

const getItemKey = (playerName: string, slotKey: string) => `${playerName}::${slotKey}`;

const normalizePlayer = (player: PlayerJson): Player => {
  const name = player.name.trim();
  const realm = player.realm.trim().toLowerCase();
  const region = player.region ?? "eu";

  return {
    name,
    realm,
    region,
    blizzardUrl: `https://worldofwarcraft.blizzard.com/en-gb/character/${realm}/${name}`,
  };
};

const loadPlayers = async () => {
  const response = await fetch(`data/players.json?v=${appVersion}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load data/players.json: HTTP ${response.status}`);
  }

  const players = (await response.json()) as PlayerJson[];

  state.records = players.map((player) => ({
    player: normalizePlayer(player),
    status: "idle",
  }));
};

const loadGemQualityRules = async () => {
  const response = await fetch(`data/gem-quality.json?v=${appVersion}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Could not load data/gem-quality.json: HTTP ${response.status}`);
  }

  const data = (await response.json()) as GemQualityJson;
  state.gemRules = data.rules;
};

const getSelectedItemByKey = (key: string) => {
  const [playerName, slotKey] = key.split("::");
  const record = state.records.find((candidate) => candidate.player.name === playerName);
  const slot = equipmentSlots.find((candidate) => candidate.key === slotKey);
  const item = slot ? record?.data?.gear?.items?.[slot.key] : undefined;

  return record && slot && item
    ? {
        playerName: getCharacterName(record),
        slotLabel: slot.label,
        item,
      }
    : undefined;
};

const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

const getCharacterName = (record: PlayerRecord) => record.data?.name ?? record.player.name;

const getCharacterRealm = (record: PlayerRecord) => record.data?.realm ?? formatRealm(record.player.realm);

const getStatusLabel = (record: PlayerRecord) => {
  if (record.status === "loaded") {
    return "Loaded";
  }

  if (record.status === "loading") {
    return "Loading";
  }

  if (record.status === "error") {
    return "Error";
  }

  return "Queued";
};

const isDeathKnight = (record: PlayerRecord) => record.data?.class?.toLowerCase() === "death knight";

const isWeaponSlot = (slot: EquipmentSlot) => slot.key === "mainhand" || slot.key === "offhand";

const canCheckEnchant = (record: PlayerRecord, slot: EquipmentSlot) =>
  enchantableSlots.has(slot.key) && slot.key !== "offhand" && !(isDeathKnight(record) && isWeaponSlot(slot));

const itemHasIssue = (record: PlayerRecord, slot: EquipmentSlot, item?: RaiderItem) => {
  if (!item) {
    return false;
  }

  const tags = getItemTags(item);
  const hasEnchantIssue = canCheckEnchant(record, slot) && (!tags.enchantText || !tags.enchantQuality || tags.enchantQuality < 2);
  const hasGemIssue = gemSlots.has(slot.key) && (!tags.gemText || !tags.isAcceptedGem);

  return hasEnchantIssue || hasGemIssue;
};

const recordHasIssue = (record: PlayerRecord) => {
  if (record.status === "error") {
    return true;
  }

  return equipmentSlots.some((slot) => itemHasIssue(record, slot, record.data?.gear?.items?.[slot.key]));
};

const getIssueSlots = (record: PlayerRecord) =>
  equipmentSlots.filter((slot) => itemHasIssue(record, slot, record.data?.gear?.items?.[slot.key]));

const getIssueCount = (record: PlayerRecord) => (record.status === "error" ? 1 : getIssueSlots(record).length);

const getSortValue = (record: PlayerRecord) => {
  switch (state.sortKey) {
    case "issueCount":
      return getIssueCount(record);
    case "realm":
      return getCharacterRealm(record);
    case "class":
      return record.data?.class ?? "";
    case "name":
    default:
      return getCharacterName(record);
  }
};

const getFilteredRecords = () => {
  enforceIssueSort();
  const query = state.search.trim().toLowerCase();

  return [...state.records]
    .filter((record) => {
      const itemNames = equipmentSlots
        .map((slot) => record.data?.gear?.items?.[slot.key]?.name)
        .filter(Boolean)
        .join(" ");
      const searchable = [
        record.player.name,
        formatRealm(record.player.realm),
        record.data?.name,
        record.data?.realm,
        record.data?.race,
        record.data?.class,
        record.data?.active_spec_name,
        record.data?.active_spec_role,
        record.data?.faction,
        itemNames,
        record.error,
        getStatusLabel(record),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchable.includes(query);
      const matchesRealm = state.realm === "all" || record.player.realm === state.realm;
      const matchesQuickFilter = state.quickFilter === "all" || recordHasIssue(record);

      return matchesSearch && matchesRealm && matchesQuickFilter;
    })
    .sort((a, b) => {
      const valueA = getSortValue(a);
      const valueB = getSortValue(b);
      const result =
        typeof valueA === "number" && typeof valueB === "number"
          ? valueA - valueB
          : String(valueA).localeCompare(String(valueB));

      return state.sortDirection === "asc" ? result : -result;
    });
};

const getRaiderUrl = (player: Player) => {
  const search = new URLSearchParams({
    region: player.region,
    realm: player.realm,
    name: player.name,
    fields: "gear",
  });

  return `https://raider.io/api/v1/characters/profile?${search.toString()}`;
};

const getTrackInfo = (item: RaiderItem) => {
  const bonusTrack = item.bonuses?.map((bonusId) => trackByBonusId[bonusId]).find(Boolean);

  if (bonusTrack) {
    return bonusTrack;
  }

  const levelTracks = typeof item.item_level === "number" ? trackByItemLevel[item.item_level] : undefined;

  if (!levelTracks?.length) {
    return undefined;
  }

  return levelTracks.length === 1 ? levelTracks[0] : undefined;
};

const getAmbiguousTrackText = (item: RaiderItem) => {
  const levelTracks = typeof item.item_level === "number" ? trackByItemLevel[item.item_level] : undefined;

  if (!levelTracks || levelTracks.length < 2) {
    return "";
  }

  return levelTracks.map((track) => `${track.track} ${track.rank}/${track.maxRank}`).join(" or ");
};

const formatTrack = (track?: TrackInfo) =>
  track ? `${track.track} ${track.rank}/${track.maxRank}${track.source === "item-level" ? "*" : ""}` : "";

const getEnchantIds = (item: RaiderItem) => [
  ...(typeof item.enchant === "number" ? [item.enchant] : []),
  ...(item.enchants ?? []),
  ...(item.enchants_detail?.map((enchant) => enchant.id).filter((id): id is number => typeof id === "number") ?? []),
];

const getEnchantQuality = (item: RaiderItem) => {
  const qualityById = getEnchantIds(item)
    .map((enchantId) => enchantQualityById[enchantId])
    .find(Boolean);
  const qualityByName = item.enchants_detail
    ?.map((enchant) => (enchant.name ? enchantQualityByKey[normalizeEnchantKey(enchant.name)] : undefined))
    .find(Boolean);

  return qualityById ?? qualityByName;
};

const isAcceptedGem = (gemText: string) => {
  const normalized = gemText.toLowerCase();

  return state.gemRules.some((rule) => {
    const textMatches = rule.match.textIncludes
      ? normalized.includes(rule.match.textIncludes.toLowerCase())
      : false;
    const regexMatches = rule.match.regex ? new RegExp(rule.match.regex, "i").test(gemText) : false;

    return textMatches || regexMatches;
  });
};

const getItemTags = (item: RaiderItem) => {
  const enchantNames = item.enchants_detail?.map((enchant) => enchant.name).filter(Boolean) ?? [];
  const gemNames = item.gems_detail?.map((gem) => gem.name).filter(Boolean) ?? [];
  const fallbackEnchantCount = enchantNames.length ? 0 : (item.enchants?.length ?? 0);
  const fallbackGemCount = gemNames.length ? 0 : (item.gems?.length ?? 0);
  const enchantQuality = getEnchantQuality(item);
  const gemText =
    gemNames.join(", ") ||
    (fallbackGemCount > 0 ? `${fallbackGemCount} gem${fallbackGemCount === 1 ? "" : "s"}` : "");

  return {
    enchantText:
      enchantNames.join(", ") ||
      (fallbackEnchantCount > 0 ? `${fallbackEnchantCount} enchant${fallbackEnchantCount === 1 ? "" : "s"}` : ""),
    enchantQuality,
    gemText,
    isAcceptedGem: isAcceptedGem(gemText),
  };
};

const renderSlotCell = (record: PlayerRecord, slot: EquipmentSlot) => {
  const item = record.data?.gear?.items?.[slot.key];

  if (record.status === "loading" || record.status === "idle") {
    return `<td class="slot-cell"><span class="muted">Loading</span></td>`;
  }

  if (record.status === "error") {
    return `<td class="slot-cell"><span class="error-text">${escapeHtml(record.error)}</span></td>`;
  }

  if (!item) {
    return `<td class="slot-cell"><span class="muted">Empty</span></td>`;
  }

  const tags = getItemTags(item);
  const canHaveEnchant = canCheckEnchant(record, slot);
  const canHaveGem = gemSlots.has(slot.key);
  const track = getTrackInfo(item);
  const trackText = formatTrack(track) || getAmbiguousTrackText(item);

  return `
    <td class="slot-cell">
      <button class="item-button" type="button" data-item-key="${escapeHtml(getItemKey(record.player.name, slot.key))}">
        <strong class="${track ? `item-name item-name--${track.track.toLowerCase()}` : "item-name"}">${escapeHtml(item.name ?? "Unknown item")}</strong>
      </button>
      <span class="item-level">ilvl ${formatNumber(item.item_level)}</span>
      <div class="item-tags">
        ${
          trackText
            ? `<span class="track-badge ${track ? `track-badge--${track.track.toLowerCase()}` : ""}" title="${track?.source === "item-level" ? "Inferred from item level" : "Mapped from bonus ID"}">${escapeHtml(trackText)}</span>`
            : `<span class="track-badge track-badge--unknown">Track unknown</span>`
        }
        ${
          canHaveEnchant
            ? `<span class="tag ${tags.enchantText && tags.enchantQuality && tags.enchantQuality >= 2 ? "tag--enchant" : "tag--missing"}">${escapeHtml(tags.enchantText ? `${tags.enchantText}${tags.enchantQuality ? ` (${formatQuality(tags.enchantQuality)})` : " (quality ?)"}` : "No enchant")}</span>`
            : ""
        }
        ${canHaveGem ? `<span class="tag ${tags.gemText && tags.isAcceptedGem ? "tag--gem" : "tag--missing"}">${escapeHtml(tags.gemText || "No gem")}</span>` : ""}
      </div>
    </td>
  `;
};

const renderItemModal = () => {
  const selectedItem = state.selectedItem;

  if (!selectedItem) {
    return "";
  }

  return `
    <div class="modal-backdrop" data-close-modal>
      <section class="item-modal" role="dialog" aria-modal="true" aria-labelledby="item-modal-title">
        <div class="item-modal__header">
          <div>
            <p>${escapeHtml(selectedItem.playerName)} · ${escapeHtml(selectedItem.slotLabel)}</p>
            <h2 id="item-modal-title">${escapeHtml(selectedItem.item.name ?? "Raw item data")}</h2>
          </div>
          <button class="modal-close" type="button" aria-label="Close item JSON" data-close-modal>×</button>
        </div>
        <pre>${escapeHtml(JSON.stringify(selectedItem.item, null, 2))}</pre>
      </section>
    </div>
  `;
};

const renderRecordRow = (record: PlayerRecord) => {
  const characterName = getCharacterName(record);
  const thumbnail = record.data?.thumbnail_url;

  return `
    <tr>
      <td class="sticky-cell sticky-cell--player">
        <div class="player-cell">
          ${
            thumbnail
              ? `<img class="avatar avatar--image" src="${escapeHtml(thumbnail)}" alt="" />`
              : `<span class="avatar" aria-hidden="true">${escapeHtml(getInitials(characterName))}</span>`
          }
          <div>
            <a class="armory-link" href="${escapeHtml(record.player.blizzardUrl)}" target="_blank" rel="noreferrer">${escapeHtml(characterName)}</a>
            <span>${escapeHtml([record.data?.active_spec_name, record.data?.class].filter(Boolean).join(" ") || getStatusLabel(record))}</span>
            <span>${escapeHtml([getCharacterRealm(record), record.data?.faction].filter(Boolean).join(" · "))}</span>
          </div>
        </div>
      </td>
      <td>
        <strong>${getIssueCount(record)}</strong>
      </td>
      ${equipmentSlots.map((slot) => renderSlotCell(record, slot)).join("")}
    </tr>
  `;
};

const renderIssueRow = (record: PlayerRecord, slot: EquipmentSlot) => {
  const characterName = getCharacterName(record);

  return `
    <tr>
      <td>
        <div class="player-cell">
          ${
            record.data?.thumbnail_url
              ? `<img class="avatar avatar--image" src="${escapeHtml(record.data.thumbnail_url)}" alt="" />`
              : `<span class="avatar" aria-hidden="true">${escapeHtml(getInitials(characterName))}</span>`
          }
          <div>
            <a class="armory-link" href="${escapeHtml(record.player.blizzardUrl)}" target="_blank" rel="noreferrer">${escapeHtml(characterName)}</a>
            <span>${escapeHtml([record.data?.active_spec_name, record.data?.class].filter(Boolean).join(" ") || getStatusLabel(record))}</span>
            <span>${escapeHtml([getCharacterRealm(record), record.data?.faction].filter(Boolean).join(" · "))}</span>
          </div>
        </div>
      </td>
      <td><strong>${getIssueCount(record)}</strong></td>
      <td><strong>${escapeHtml(slot.label)}</strong></td>
      ${renderSlotCell(record, slot)}
    </tr>
  `;
};

const renderFullTable = (filteredRecords: PlayerRecord[]) => `
  <div class="table-scroll">
    <table class="gear-table">
      <thead>
        <tr>
          ${renderSortableHeader("name", "Player", "sticky-cell sticky-cell--player")}
          ${renderSortableHeader("issueCount", "Issues")}
          ${equipmentSlots.map((slot) => `<th>${escapeHtml(slot.label)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${
          filteredRecords.length
            ? filteredRecords.map(renderRecordRow).join("")
            : `<tr><td class="empty-state" colspan="${equipmentSlots.length + 2}">No characters match the current filters.</td></tr>`
        }
      </tbody>
    </table>
  </div>
`;

const renderIssueItemsTable = (filteredRecords: PlayerRecord[]) => {
  const issueRows = filteredRecords.reduce<string[]>((rows, record) => {
    rows.push(...getIssueSlots(record).map((slot) => renderIssueRow(record, slot)));
    return rows;
  }, []);

  return `
    <div class="table-scroll">
      <table class="issue-table">
        <thead>
          <tr>
            ${renderSortableHeader("name", "Player")}
            ${renderSortableHeader("issueCount", "Issues")}
            <th>Slot</th>
            <th>Issue item</th>
          </tr>
        </thead>
        <tbody>
          ${
            issueRows.length
              ? issueRows.join("")
              : `<tr><td class="empty-state" colspan="4">No issue items match the current filters.</td></tr>`
          }
        </tbody>
      </table>
    </div>
  `;
};

const render = () => {
  const filteredRecords = getFilteredRecords();
  const visibleRecords = state.viewMode === "issueItems" ? filteredRecords.filter(recordHasIssue) : filteredRecords;
  const players = getPlayers();
  const realmOptions = getRealmOptions();
  const loadedCount = state.records.filter((record) => record.status === "loaded").length;
  const loadingCount = state.records.filter((record) => record.status === "loading").length;
  const errorCount = state.records.filter((record) => record.status === "error").length;
  const realmCounts = players.reduce<Record<string, number>>((counts, player) => {
    counts[player.realm] = (counts[player.realm] ?? 0) + 1;
    return counts;
  }, {});

  app.innerHTML = `
    <main class="app-shell app-shell--wide">
      <section class="masthead" aria-labelledby="page-title">
        <div class="masthead__art" aria-hidden="true">
          <div class="crest">W</div>
        </div>
        <div class="masthead__content">
          <p class="eyebrow">World of Warcraft roster</p>
          <h1 id="page-title">Ondreikovo gear audit</h1>
          <p class="summary">Loading Raider.IO gear data for ${players.length} listed EU characters and comparing locally mapped tracks, enchant ranks, and gems by equipment slot.</p>
        </div>
        <dl class="stats" aria-label="Roster summary">
          <div>
            <dt>Total</dt>
            <dd>${players.length}</dd>
          </div>
          <div>
            <dt>Loaded</dt>
            <dd>${loadedCount}</dd>
          </div>
          <div>
            <dt>Errors</dt>
            <dd>${errorCount}</dd>
          </div>
        </dl>
      </section>

      <section class="toolbar" aria-label="Table filters">
        <div class="view-modes" aria-label="Views">
          <button class="view-mode ${state.viewMode === "full" ? "view-mode--active" : ""}" type="button" data-view-mode="full">Full audit</button>
          <button class="view-mode ${state.viewMode === "issueItems" ? "view-mode--active" : ""}" type="button" data-view-mode="issueItems">Issue items</button>
        </div>
        <div class="quick-filters" aria-label="Quick filters">
          <button class="quick-filter ${state.quickFilter === "all" ? "quick-filter--active" : ""}" type="button" data-quick-filter="all">All</button>
          <button class="quick-filter quick-filter--issues ${state.quickFilter === "issues" ? "quick-filter--active" : ""}" type="button" data-quick-filter="issues">Show issues</button>
        </div>
        <label class="field">
          <span>Search</span>
          <input id="search" type="search" value="${escapeHtml(state.search)}" placeholder="Name, realm, class, item" autocomplete="off" />
        </label>
        <label class="field">
          <span>Realm</span>
          <select id="realm">
            <option value="all"${state.realm === "all" ? " selected" : ""}>All realms</option>
            ${realmOptions
              .map(
                (realm) =>
                  `<option value="${escapeHtml(realm)}"${state.realm === realm ? " selected" : ""}>${escapeHtml(formatRealm(realm))} (${realmCounts[realm]})</option>`,
              )
              .join("")}
          </select>
        </label>
      </section>

      <section class="table-panel" aria-labelledby="table-title">
        <div class="table-header">
          <div>
            <h2 id="table-title">Equipment Slots</h2>
            <p>${visibleRecords.length} ${visibleRecords.length === 1 ? "result" : "results"} · ${loadingCount} loading</p>
          </div>
          <button class="refresh-button" id="refresh" type="button">Refresh</button>
        </div>
        ${state.viewMode === "issueItems" ? renderIssueItemsTable(visibleRecords) : renderFullTable(visibleRecords)}
      </section>
      ${renderItemModal()}
    </main>
  `;

  bindEvents();
};

const renderSortableHeader = (sortKey: SortKey, label: string, className = "") => `
  <th${className ? ` class="${className}"` : ""}>
    <button class="sort-button" type="button" data-sort="${sortKey}" aria-label="Sort by ${escapeHtml(label)}">
      ${escapeHtml(label)} ${state.sortKey === sortKey ? (state.sortDirection === "asc" ? "↑" : "↓") : ""}
    </button>
  </th>
`;

const bindEvents = () => {
  document.querySelector<HTMLInputElement>("#search")?.addEventListener("input", (event) => {
    state.search = (event.currentTarget as HTMLInputElement).value;
    render();
    const searchInput = document.querySelector<HTMLInputElement>("#search");
    const cursorPosition = state.search.length;
    searchInput?.focus();
    searchInput?.setSelectionRange(cursorPosition, cursorPosition);
  });

  document.querySelector<HTMLSelectElement>("#realm")?.addEventListener("change", (event) => {
    state.realm = (event.currentTarget as HTMLSelectElement).value;
    render();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-quick-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.quickFilter = button.dataset.quickFilter as QuickFilter;
      enforceIssueSort();
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-view-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.viewMode = button.dataset.viewMode as ViewMode;
      enforceIssueSort();
      render();
    });
  });

  document.querySelector<HTMLButtonElement>("#refresh")?.addEventListener("click", () => {
    loadRaiderData();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-item-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemKey = button.dataset.itemKey;
      state.selectedItem = itemKey ? getSelectedItemByKey(itemKey) : undefined;
      render();
    });
  });

  document.querySelectorAll<HTMLElement>("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (event.target !== element && element.classList.contains("modal-backdrop")) {
        return;
      }

      state.selectedItem = undefined;
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isIssueFocused()) {
        enforceIssueSort();
        render();
        return;
      }

      const nextSortKey = button.dataset.sort as SortKey;

      if (state.sortKey === nextSortKey) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortKey = nextSortKey;
        state.sortDirection = nextSortKey === "issueCount" ? "desc" : "asc";
      }

      render();
    });
  });
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.selectedItem) {
    state.selectedItem = undefined;
    render();
  }
});

const fetchCharacter = async (record: PlayerRecord) => {
  const response = await fetch(getRaiderUrl(record.player));
  const data = (await response.json()) as RaiderCharacter;

  if (!response.ok || data.statusCode) {
    throw new Error(data.message ?? `Raider.IO returned HTTP ${response.status}`);
  }

  record.data = data;
  record.status = "loaded";
  record.error = undefined;
};

const loadRaiderData = async () => {
  state.records.forEach((record) => {
    record.status = "loading";
    record.error = undefined;
  });
  render();

  const queue = [...state.records];
  const workerCount = 4;

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (queue.length) {
        const record = queue.shift();

        if (!record) {
          return;
        }

        try {
          await fetchCharacter(record);
        } catch (error) {
          record.status = "error";
          record.error = error instanceof Error ? error.message : "Unknown Raider.IO error";
        }

        render();
      }
    }),
  );
};

const start = async () => {
  try {
    await Promise.all([loadPlayers(), loadGemQualityRules()]);
    render();
    loadRaiderData();
  } catch (error) {
    app.innerHTML = `
      <main class="app-shell">
        <section class="table-panel">
          <div class="table-header">
            <div>
              <h2>Could not load players</h2>
              <p>${escapeHtml(error instanceof Error ? error.message : "Unknown player JSON error")}</p>
            </div>
          </div>
        </section>
      </main>
    `;
  }
};

start();
