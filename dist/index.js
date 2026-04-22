"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const raiderFields = [
    "gear",
    "guild",
    "raid_progression",
    "mythic_plus_scores_by_season:current",
    "mythic_plus_best_runs",
    "mythic_plus_highest_level_runs",
    "mythic_plus_weekly_highest_level_runs",
    "mythic_plus_recent_runs",
].join(",");
const players = [
    ["Ilovercraft", "drakthul"],
    ["Tredaxx", "tarren-mill"],
    ["Hejvus", "drakthul"],
    ["Shoustal", "drakthul"],
    ["Tribonian", "drakthul"],
    ["Ondreiko", "drakthul"],
    ["Tarii", "burning-blade"],
    ["Kriiyak", "drakthul"],
    ["Brebaall", "drakthul"],
    ["Alexejr", "drakthul"],
    ["Perze", "drakthul"],
    ["Varmiie", "drakthul"],
    ["Klarissak", "drakthul"],
    ["Zewlmonk", "drakthul"],
    ["Meropegaunt", "drakthul"],
    ["Chuckbullis", "drakthul"],
    ["Slydrak", "drakthul"],
    ["Stingeris", "drakthul"],
    ["Ralayth", "drakthul"],
    ["Speedygt", "drakthul"],
    ["Kolegyne", "argent-dawn"],
    ["Lilliwen", "drakthul"],
    ["Sytry", "drakthul"],
    ["Lokiti", "drakthul"],
].map(([name, realm]) => ({
    name,
    realm,
    region: "eu",
    blizzardUrl: `https://worldofwarcraft.blizzard.com/en-gb/character/${realm}/${name}`,
}));
const app = document.querySelector("#app");
if (!app) {
    throw new Error("Application root was not found.");
}
const state = {
    records: players.map((player) => ({ player, status: "idle" })),
    search: "",
    realm: "all",
    sortKey: "name",
    sortDirection: "asc",
};
const formatRealm = (realm) => realm
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
const realmOptions = Array.from(new Set(players.map((player) => player.realm))).sort((a, b) => formatRealm(a).localeCompare(formatRealm(b)));
const escapeHtml = (value) => String(value !== null && value !== void 0 ? value : "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
const formatNumber = (value, digits = 0) => typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "n/a";
const formatDate = (value) => {
    if (!value) {
        return "n/a";
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "n/a"
        : date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
};
const getInitials = (name) => name.slice(0, 2).toUpperCase();
const getCharacterName = (record) => { var _a, _b; return (_b = (_a = record.data) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : record.player.name; };
const getCharacterRealm = (record) => { var _a, _b; return (_b = (_a = record.data) === null || _a === void 0 ? void 0 : _a.realm) !== null && _b !== void 0 ? _b : formatRealm(record.player.realm); };
const getBestScore = (record) => { var _a, _b, _c, _d, _e; return (_e = (_d = (_c = (_b = (_a = record.data) === null || _a === void 0 ? void 0 : _a.mythic_plus_scores_by_season) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.scores) === null || _d === void 0 ? void 0 : _d.all) !== null && _e !== void 0 ? _e : 0; };
const getBestRun = (runs) => runs === null || runs === void 0 ? void 0 : runs.reduce((best, run) => {
    var _a, _b;
    if (!best) {
        return run;
    }
    return ((_a = run.mythic_level) !== null && _a !== void 0 ? _a : 0) > ((_b = best.mythic_level) !== null && _b !== void 0 ? _b : 0) ? run : best;
}, undefined);
const getItems = (record) => {
    var _a, _b;
    const items = (_b = (_a = record.data) === null || _a === void 0 ? void 0 : _a.gear) === null || _b === void 0 ? void 0 : _b.items;
    return items ? Object.keys(items).map((slot) => ({ slot, item: items[slot] })) : [];
};
const getGearStats = (record) => {
    const items = getItems(record);
    const enchantCount = items.filter(({ item }) => { var _a, _b, _c, _d; return ((_d = (_b = (_a = item.enchants_detail) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : (_c = item.enchants) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0; }).length;
    const gemCount = items.reduce((total, { item }) => { var _a, _b, _c, _d; return total + ((_d = (_b = (_a = item.gems_detail) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : (_c = item.gems) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0); }, 0);
    return {
        itemCount: items.length,
        enchantCount,
        gemCount,
    };
};
const getRaidSummary = (record) => {
    var _a;
    const progression = (_a = record.data) === null || _a === void 0 ? void 0 : _a.raid_progression;
    if (!progression) {
        return "n/a";
    }
    return Object.keys(progression)
        .map((tier) => progression[tier].summary)
        .filter(Boolean)
        .join(", ");
};
const getStatusLabel = (record) => {
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
const getSortValue = (record) => {
    var _a, _b, _c, _d, _e;
    switch (state.sortKey) {
        case "realm":
            return getCharacterRealm(record);
        case "class":
            return (_b = (_a = record.data) === null || _a === void 0 ? void 0 : _a.class) !== null && _b !== void 0 ? _b : "";
        case "itemLevel":
            return (_e = (_d = (_c = record.data) === null || _c === void 0 ? void 0 : _c.gear) === null || _d === void 0 ? void 0 : _d.item_level_equipped) !== null && _e !== void 0 ? _e : -1;
        case "score":
            return getBestScore(record);
        case "status":
            return getStatusLabel(record);
        case "name":
        default:
            return getCharacterName(record);
    }
};
const getFilteredRecords = () => {
    const query = state.search.trim().toLowerCase();
    return [...state.records]
        .filter((record) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const searchable = [
            record.player.name,
            formatRealm(record.player.realm),
            (_a = record.data) === null || _a === void 0 ? void 0 : _a.name,
            (_b = record.data) === null || _b === void 0 ? void 0 : _b.realm,
            (_c = record.data) === null || _c === void 0 ? void 0 : _c.race,
            (_d = record.data) === null || _d === void 0 ? void 0 : _d.class,
            (_e = record.data) === null || _e === void 0 ? void 0 : _e.active_spec_name,
            (_f = record.data) === null || _f === void 0 ? void 0 : _f.active_spec_role,
            (_g = record.data) === null || _g === void 0 ? void 0 : _g.faction,
            (_j = (_h = record.data) === null || _h === void 0 ? void 0 : _h.guild) === null || _j === void 0 ? void 0 : _j.name,
            getStatusLabel(record),
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
        const matchesSearch = searchable.includes(query);
        const matchesRealm = state.realm === "all" || record.player.realm === state.realm;
        return matchesSearch && matchesRealm;
    })
        .sort((a, b) => {
        const valueA = getSortValue(a);
        const valueB = getSortValue(b);
        const result = typeof valueA === "number" && typeof valueB === "number"
            ? valueA - valueB
            : String(valueA).localeCompare(String(valueB));
        return state.sortDirection === "asc" ? result : -result;
    });
};
const getRaiderUrl = (player) => {
    const search = new URLSearchParams({
        region: player.region,
        realm: player.realm,
        name: player.name,
        fields: raiderFields,
    });
    return `https://raider.io/api/v1/characters/profile?${search.toString()}`;
};
const renderGearList = (record) => {
    const items = getItems(record);
    if (!items.length) {
        return "No gear data";
    }
    return `
    <details class="gear-details">
      <summary>${items.length} equipped slots</summary>
      <ol>
        ${items
        .map(({ slot, item }) => {
        var _a, _b, _c;
        const enchants = (_a = item.enchants_detail) === null || _a === void 0 ? void 0 : _a.map((enchant) => enchant.name).filter(Boolean).join(", ");
        const gems = (_b = item.gems_detail) === null || _b === void 0 ? void 0 : _b.map((gem) => gem.name).filter(Boolean).join(", ");
        return `
              <li>
                <strong>${escapeHtml(slot)}</strong>: ${escapeHtml((_c = item.name) !== null && _c !== void 0 ? _c : "Unknown item")} (${formatNumber(item.item_level)})
                <span>${escapeHtml(enchants ? `Enchant: ${enchants}` : "No enchant")}</span>
                <span>${escapeHtml(gems ? `Gems: ${gems}` : "No gems")}</span>
              </li>
            `;
    })
        .join("")}
      </ol>
    </details>
  `;
};
const renderRun = (label, run) => {
    var _a, _b, _c;
    if (!run) {
        return `<span>${label}: n/a</span>`;
    }
    const name = (_b = (_a = run.short_name) !== null && _a !== void 0 ? _a : run.dungeon) !== null && _b !== void 0 ? _b : "Dungeon";
    const text = `${label}: +${(_c = run.mythic_level) !== null && _c !== void 0 ? _c : "?"} ${name} (${formatNumber(run.score, 1)})`;
    return run.url
        ? `<a href="${escapeHtml(run.url)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>`
        : `<span>${escapeHtml(text)}</span>`;
};
const renderDataCell = (record) => {
    if (record.status === "loading" || record.status === "idle") {
        return `<span class="muted">Waiting for Raider.IO</span>`;
    }
    if (record.status === "error") {
        return `<span class="error-text">${escapeHtml(record.error)}</span>`;
    }
    return `
    <details class="json-details">
      <summary>Raw JSON</summary>
      <pre>${escapeHtml(JSON.stringify(record.data, null, 2))}</pre>
    </details>
  `;
};
const renderRecordRow = (record) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    const characterName = getCharacterName(record);
    const gearStats = getGearStats(record);
    const bestRun = getBestRun((_b = (_a = record.data) === null || _a === void 0 ? void 0 : _a.mythic_plus_highest_level_runs) !== null && _b !== void 0 ? _b : (_c = record.data) === null || _c === void 0 ? void 0 : _c.mythic_plus_best_runs);
    const weeklyRun = getBestRun((_d = record.data) === null || _d === void 0 ? void 0 : _d.mythic_plus_weekly_highest_level_runs);
    const recentRun = (_f = (_e = record.data) === null || _e === void 0 ? void 0 : _e.mythic_plus_recent_runs) === null || _f === void 0 ? void 0 : _f[0];
    const thumbnail = (_g = record.data) === null || _g === void 0 ? void 0 : _g.thumbnail_url;
    const profileUrl = (_j = (_h = record.data) === null || _h === void 0 ? void 0 : _h.profile_url) !== null && _j !== void 0 ? _j : `https://raider.io/characters/eu/${record.player.realm}/${record.player.name}`;
    return `
    <tr>
      <td>
        <div class="player-cell">
          ${thumbnail
        ? `<img class="avatar avatar--image" src="${escapeHtml(thumbnail)}" alt="" />`
        : `<span class="avatar" aria-hidden="true">${escapeHtml(getInitials(characterName))}</span>`}
          <div>
            <strong>${escapeHtml(characterName)}</strong>
            <span>${escapeHtml([(_k = record.data) === null || _k === void 0 ? void 0 : _k.active_spec_name, (_l = record.data) === null || _l === void 0 ? void 0 : _l.class].filter(Boolean).join(" ") || "No class data")}</span>
          </div>
        </div>
      </td>
      <td>
        <strong>${escapeHtml(getCharacterRealm(record))}</strong>
        <span>${escapeHtml(((_o = (_m = record.data) === null || _m === void 0 ? void 0 : _m.guild) === null || _o === void 0 ? void 0 : _o.name) ? `Guild: ${record.data.guild.name}` : "No guild data")}</span>
      </td>
      <td>
        <span class="status-pill status-pill--${record.status}">${getStatusLabel(record)}</span>
        <span>${escapeHtml((_r = (_p = record.error) !== null && _p !== void 0 ? _p : (_q = record.data) === null || _q === void 0 ? void 0 : _q.faction) !== null && _r !== void 0 ? _r : "Pending")}</span>
      </td>
      <td>
        <strong>${formatNumber((_t = (_s = record.data) === null || _s === void 0 ? void 0 : _s.gear) === null || _t === void 0 ? void 0 : _t.item_level_equipped, 1)}</strong>
        <span>Total: ${formatNumber((_v = (_u = record.data) === null || _u === void 0 ? void 0 : _u.gear) === null || _v === void 0 ? void 0 : _v.item_level_total, 1)}</span>
        <span>${gearStats.itemCount} items, ${gearStats.enchantCount} enchanted, ${gearStats.gemCount} gems</span>
        ${renderGearList(record)}
      </td>
      <td>
        <strong>${formatNumber(getBestScore(record), 1)}</strong>
        ${renderRun("Best", bestRun)}
        ${renderRun("Weekly", weeklyRun)}
        ${renderRun("Recent", recentRun)}
      </td>
      <td>
        <strong>${escapeHtml(getRaidSummary(record))}</strong>
        <span>Achievements: ${formatNumber((_w = record.data) === null || _w === void 0 ? void 0 : _w.achievement_points)}</span>
      </td>
      <td>
        <span>${formatDate((_x = record.data) === null || _x === void 0 ? void 0 : _x.last_crawled_at)}</span>
        <span>Gear: ${formatDate((_z = (_y = record.data) === null || _y === void 0 ? void 0 : _y.gear) === null || _z === void 0 ? void 0 : _z.updated_at)}</span>
      </td>
      <td class="links-cell">
        <a class="profile-link" href="${escapeHtml(profileUrl)}" target="_blank" rel="noreferrer">Raider.IO</a>
        <a class="profile-link" href="${escapeHtml(record.player.blizzardUrl)}" target="_blank" rel="noreferrer">Blizzard</a>
      </td>
      <td>${renderDataCell(record)}</td>
    </tr>
  `;
};
const render = () => {
    const filteredRecords = getFilteredRecords();
    const loadedCount = state.records.filter((record) => record.status === "loaded").length;
    const loadingCount = state.records.filter((record) => record.status === "loading").length;
    const errorCount = state.records.filter((record) => record.status === "error").length;
    const realmCounts = players.reduce((counts, player) => {
        var _a;
        counts[player.realm] = ((_a = counts[player.realm]) !== null && _a !== void 0 ? _a : 0) + 1;
        return counts;
    }, {});
    app.innerHTML = `
    <main class="app-shell">
      <section class="masthead" aria-labelledby="page-title">
        <div class="masthead__art" aria-hidden="true">
          <div class="crest">W</div>
        </div>
        <div class="masthead__content">
          <p class="eyebrow">World of Warcraft roster</p>
          <h1 id="page-title">Player Audit</h1>
          <p class="summary">Loading Raider.IO character, gear, raid, and Mythic+ data for ${players.length} listed EU characters on page load.</p>
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
        <label class="field">
          <span>Search</span>
          <input id="search" type="search" value="${escapeHtml(state.search)}" placeholder="Name, realm, class, guild" autocomplete="off" />
        </label>
        <label class="field">
          <span>Realm</span>
          <select id="realm">
            <option value="all"${state.realm === "all" ? " selected" : ""}>All realms</option>
            ${realmOptions
        .map((realm) => `<option value="${escapeHtml(realm)}"${state.realm === realm ? " selected" : ""}>${escapeHtml(formatRealm(realm))} (${realmCounts[realm]})</option>`)
        .join("")}
          </select>
        </label>
      </section>

      <section class="table-panel" aria-labelledby="table-title">
        <div class="table-header">
          <div>
            <h2 id="table-title">Characters</h2>
            <p>${filteredRecords.length} ${filteredRecords.length === 1 ? "result" : "results"} · ${loadingCount} loading</p>
          </div>
          <button class="refresh-button" id="refresh" type="button">Refresh</button>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                ${renderSortableHeader("name", "Player")}
                ${renderSortableHeader("realm", "Realm")}
                ${renderSortableHeader("status", "Status")}
                ${renderSortableHeader("itemLevel", "Gear")}
                ${renderSortableHeader("score", "Mythic+")}
                <th>Raid</th>
                <th>Updated</th>
                <th>Profiles</th>
                <th>All Data</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.length
        ? filteredRecords.map(renderRecordRow).join("")
        : `<tr><td class="empty-state" colspan="9">No characters match the current filters.</td></tr>`}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `;
    bindEvents();
};
const renderSortableHeader = (sortKey, label) => `
  <th>
    <button class="sort-button" type="button" data-sort="${sortKey}" aria-label="Sort by ${escapeHtml(label)}">
      ${escapeHtml(label)} ${state.sortKey === sortKey ? (state.sortDirection === "asc" ? "↑" : "↓") : ""}
    </button>
  </th>
`;
const bindEvents = () => {
    var _a, _b, _c;
    (_a = document.querySelector("#search")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", (event) => {
        state.search = event.currentTarget.value;
        render();
        const searchInput = document.querySelector("#search");
        const cursorPosition = state.search.length;
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.focus();
        searchInput === null || searchInput === void 0 ? void 0 : searchInput.setSelectionRange(cursorPosition, cursorPosition);
    });
    (_b = document.querySelector("#realm")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (event) => {
        state.realm = event.currentTarget.value;
        render();
    });
    (_c = document.querySelector("#refresh")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        loadRaiderData();
    });
    document.querySelectorAll("[data-sort]").forEach((button) => {
        button.addEventListener("click", () => {
            const nextSortKey = button.dataset.sort;
            if (state.sortKey === nextSortKey) {
                state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
            }
            else {
                state.sortKey = nextSortKey;
                state.sortDirection = nextSortKey === "itemLevel" || nextSortKey === "score" ? "desc" : "asc";
            }
            render();
        });
    });
};
const fetchCharacter = (record) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const response = yield fetch(getRaiderUrl(record.player));
    const data = (yield response.json());
    if (!response.ok || data.statusCode) {
        throw new Error((_a = data.message) !== null && _a !== void 0 ? _a : `Raider.IO returned HTTP ${response.status}`);
    }
    record.data = data;
    record.status = "loaded";
    record.error = undefined;
});
const loadRaiderData = () => __awaiter(void 0, void 0, void 0, function* () {
    state.records.forEach((record) => {
        record.status = "loading";
        record.error = undefined;
    });
    render();
    const queue = [...state.records];
    const workerCount = 4;
    yield Promise.all(Array.from({ length: workerCount }, () => __awaiter(void 0, void 0, void 0, function* () {
        while (queue.length) {
            const record = queue.shift();
            if (!record) {
                return;
            }
            try {
                yield fetchCharacter(record);
            }
            catch (error) {
                record.status = "error";
                record.error = error instanceof Error ? error.message : "Unknown Raider.IO error";
            }
            render();
        }
    })));
});
render();
loadRaiderData();
