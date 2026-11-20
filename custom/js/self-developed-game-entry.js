(function () {
  "use strict";

  var games = [
    { id: "101", name: "Wild Bounty", type: "slot", art: "bounty" },
    { id: "102", name: "Mahjong Ways", type: "slot", art: "mahjong" },
    { id: "103", name: "Chicken Road", type: "arcade", art: "chicken" },
    { id: "104", name: "Gates of Olympus", type: "slot", art: "olympus" },
    { id: "105", name: "Wild Ape", type: "slot", art: "ape" }
  ];
  var state = { skin: "rs", resources: {}, logs: {}, filters: { search: "", type: "", status: "" } };
  var els = {};
  var draft = null;
  var batch = null;
  var importMode = "batch";
  var activeDialog = null;
  var previousFocus = null;
  var toastTimer = null;
  var objectUrls = [];
  var initialized = false;
  var imagePattern = /\.(png|jpe?g|webp|gif|svg|avif|bmp)$/i;
  var skinCodes = ["cm8", "cm7", "cm2", "cm1", "cm3", "cm4", "cm5", "cm6", "ct", "ct2", "ct3", "ct4", "ct5", "bg", "bg2", "as", "rs"];

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
    });
  }

  function findGame(id) {
    return games.find(function (game) { return game.id === id; });
  }

  function skinResources(skin) {
    if (!state.resources[skin]) {
      state.resources[skin] = {};
      games.forEach(function (game) {
        state.resources[skin][game.id] = { icon: null, bigIcon: null };
      });
    }
    return state.resources[skin];
  }

  function seedResources() {
    var profiles = [
      ["complete", "complete", "partial", "complete", "empty"],
      ["complete", "partial", "complete", "empty", "complete"],
      ["partial", "complete", "empty", "complete", "complete"],
      ["complete", "empty", "complete", "partial", "complete"]
    ];
    skinCodes.forEach(function (skin, skinIndex) {
      var resources = skinResources(skin);
      var profile = profiles[skin === "rs" ? 0 : skinIndex % profiles.length];
      games.forEach(function (game, gameIndex) {
        var status = profile[gameIndex];
        var iconNames = game.id === "102" ? ["game_icon.png", "game_icon.atlas", "game_icon.json"] : ["game_icon_small.png"];
        var bigIconNames = game.id === "101" ? ["game_icon.png", "game_icon.atlas", "game_icon.json"] : ["game_icon_big.png"];
        var hasIcon = status === "complete" || (status === "partial" && gameIndex % 2 === 0);
        var hasBigIcon = status === "complete" || (status === "partial" && !hasIcon);
        resources[game.id] = {
          icon: hasIcon ? { names: iconNames.slice(), preview: "custom/assets/game-entry/" + game.art + ".svg" } : null,
          bigIcon: hasBigIcon ? { names: bigIconNames.slice(), preview: "custom/assets/game-entry/" + game.art + ".svg" } : null
        };
        var latest = status === "complete" ? "更新大图标入口资源：" + bigIconNames.join("、")
          : (hasIcon ? "移除大图标入口资源：" + bigIconNames.join("、") : hasBigIcon ? "移除小图标入口资源：" + iconNames.join("、") : "移除小图标入口资源及大图标入口资源");
        state.logs[skin + ":" + game.id] = [
          { time: "2026-11-20 10:" + String(12 + gameIndex * 7 + skinIndex).padStart(2, "0") + ":00", operator: "资源管理员", action: "编辑入口资源", detail: latest },
          { time: "2026-11-18 09:" + String(10 + gameIndex * 5 + skinIndex).padStart(2, "0") + ":00", operator: "游戏运营01", action: "批量入口资源导入", detail: "小图标入口资源：" + iconNames.join("、") + "；大图标入口资源：" + bigIconNames.join("、") }
        ];
      });
    });
  }

  function resourceStatus(resource) {
    return resource.icon && resource.bigIcon ? "complete" : resource.icon || resource.bigIcon ? "partial" : "empty";
  }

  function filteredGames() {
    var resources = skinResources(state.skin);
    return games.filter(function (game) {
      return (!state.filters.search || (game.id + " " + game.name).toLowerCase().indexOf(state.filters.search) !== -1)
        && (!state.filters.type || game.type === state.filters.type)
        && (!state.filters.status || resourceStatus(resources[game.id]) === state.filters.status);
    });
  }

  function resourceMarkup(resource, isLarge) {
    if (!resource) return '<span class="muted">—</span>';
    return '<div class="resource-cell">'
      + (resource.preview ? '<img class="game-icon' + (isLarge ? ' large-icon' : '') + '" src="' + escapeHtml(resource.preview) + '" alt="' + (isLarge ? '大图标图片' : '小图标图片') + '" />' : '')
      + '<div>'
      + resource.names.map(function (name) { return '<small>' + escapeHtml(name) + '</small>'; }).join("") + '</div></div>';
  }

  function renderGames() {
    var list = filteredGames();
    var resources = skinResources(state.skin);
    els.gameRows.innerHTML = list.length ? list.map(function (game) {
      return '<tr><td><strong>' + escapeHtml(game.name) + '</strong><small>#' + game.id + '</small></td>'
        + '<td>' + resourceMarkup(resources[game.id].icon, false) + '</td><td>' + resourceMarkup(resources[game.id].bigIcon, true) + '</td>'
        + '<td><div class="row-actions"><button class="btn small primary" type="button" data-action="edit" data-game="' + game.id + '">编辑</button>'
        + '<button class="btn small" type="button" data-action="logs" data-game="' + game.id + '">操作记录</button></div></td></tr>';
    }).join("") : '<tr><td colspan="4" class="empty-state">暂无符合条件的游戏，请调整筛选条件</td></tr>';
    els.resultSummary.textContent = "共 " + list.length + " 条 · 当前皮肤：" + state.skin;
  }

  function notify(message) {
    clearTimeout(toastTimer);
    els.entryToast.textContent = message;
    els.entryToast.hidden = false;
    toastTimer = setTimeout(function () { els.entryToast.hidden = true; }, 3200);
  }

  function openDialog(element) {
    if (!activeDialog) previousFocus = document.activeElement;
    else activeDialog.hidden = true;
    activeDialog = element;
    element.hidden = false;
    document.body.classList.add("dialog-open");
    element.querySelector(".dialog-card").focus();
  }

  function closeDialog() {
    if (!activeDialog) return;
    activeDialog.hidden = true;
    activeDialog = null;
    draft = null;
    batch = null;
    document.body.classList.remove("dialog-open");
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }

  function errorMessage(message) {
    els.editError.textContent = message;
    els.editError.hidden = !message;
  }

  function renderDraft() {
    if (!draft) return;
    ["icon", "bigIcon"].forEach(function (slot) {
      els[slot + "Selection"].innerHTML = draft[slot] ? resourceMarkup(draft[slot], slot === "bigIcon") : "未配置";
      els[slot === "icon" ? "removeIcon" : "removeBigIcon"].hidden = !draft[slot];
    });
  }

  function loadDraft(id) {
    var existing = skinResources(state.skin)[id];
    if (!existing) return;
    draft = { id: id, skin: state.skin, icon: existing.icon, bigIcon: existing.bigIcon };
    els.editGame.value = id;
    els.editSkin.textContent = state.skin;
    els.iconInput.value = "";
    els.bigIconInput.value = "";
    errorMessage("");
    renderDraft();
  }

  function openEditor(id) {
    els.editTitle.textContent = "编辑入口资源";
    els.editGame.disabled = true;
    loadDraft(id || (filteredGames()[0] || games[0]).id);
    openDialog(els.editDialog);
  }

  function makeResource(files) {
    var image = files.find(function (file) { return imagePattern.test(file.name); });
    var preview = image ? URL.createObjectURL(image) : "";
    if (preview) objectUrls.push(preview);
    return { names: files.map(function (file) { return file.name; }), preview: preview };
  }

  function addLog(skin, id, action, detail) {
    var key = skin + ":" + id;
    if (!state.logs[key]) state.logs[key] = [];
    var time = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 19).replace("T", " ");
    state.logs[key].unshift({ time: time, operator: "当前管理员", action: action, detail: detail });
  }

  function resourceDescription(slot, before, after) {
    var label = slot === "icon" ? "小图标入口资源" : "大图标入口资源";
    return after ? label + "：" + after.names.join("、") : "移除" + label + "（" + before.names.join("、") + "）";
  }

  function saveDraft(event) {
    event.preventDefault();
    if (!draft) return;
    var existing = skinResources(draft.skin)[draft.id];
    var changed = ["icon", "bigIcon"].filter(function (slot) { return existing[slot] !== draft[slot]; });
    if (!changed.length) { errorMessage("请先选择或调整入口资源。"); return; }
    var detail = changed.map(function (slot) { return resourceDescription(slot, existing[slot], draft[slot]); }).join("；");
    changed.forEach(function (slot) { existing[slot] = draft[slot]; });
    addLog(draft.skin, draft.id, "编辑入口资源", detail);
    closeDialog();
    renderGames();
    notify("入口资源已更新");
  }

  function openLogs(id) {
    var game = findGame(id);
    var logs = state.logs[state.skin + ":" + id] || [];
    els.logContext.textContent = "当前皮肤：" + state.skin + " · #" + id + " · " + game.name;
    els.logRows.innerHTML = logs.length ? logs.map(function (log) {
      return '<tr><td>' + escapeHtml(log.time) + '</td><td>' + escapeHtml(log.operator) + '</td><td>' + escapeHtml(log.action) + '</td><td>' + escapeHtml(log.detail) + '</td></tr>';
    }).join("") : '<tr><td colspan="4" class="empty-state">当前皮肤下暂无该游戏的操作记录</td></tr>';
    openDialog(els.logDialog);
  }

  function normalize(value) {
    return value.toLowerCase().replace(/[\s_\-#]/g, "");
  }

  function matchFolderGame(file) {
    var segments = (file.webkitRelativePath || file.name).split("/");
    var filename = segments.pop();
    // Prefer the nearest game directory; outer directories may be skin or package names.
    for (var i = segments.length - 1; i >= 0; i -= 1) {
      var segment = segments[i];
      var game = games.find(function (item) {
        return normalize(segment) === normalize(item.name)
          || segment === item.id || new RegExp("^#?" + item.id + "(?:[ _-]|$)").test(segment);
      });
      if (game) return game;
    }
    return games.find(function (item) { return new RegExp("^#?" + item.id + "[_-]").test(filename); });
  }

  function fileRole(file, id) {
    var name = file.name.toLowerCase().replace(new RegExp("^#?" + id + "[_-]"), "");
    var folders = (file.webkitRelativePath || "").toLowerCase().split("/").slice(0, -1);
    for (var i = folders.length - 1; i >= 0; i -= 1) {
      if (/^(small|small_icon|game_icon_small)$/.test(folders[i])) return "icon";
      if (/^(big|large|big_icon|large_icon|game_icon_big)$/.test(folders[i])) return "bigIcon";
    }
    if (/^game_icon_small\.[^.]+$/.test(name)) return "icon";
    if (/^game_icon(?:_big)?\.[^.]+$/.test(name)) return "bigIcon";
    return "";
  }

  function matchFolderSkin(file) {
    var folders = (file.webkitRelativePath || "").toLowerCase().split("/").slice(0, -1);
    for (var i = folders.length - 1; i >= 0; i -= 1) {
      if (skinCodes.indexOf(folders[i]) !== -1) return folders[i];
    }
    return "";
  }

  function buildBatch(files, crossSkin) {
    var groups = {};
    var ignored = 0;
    files.forEach(function (file) {
      var game = matchFolderGame(file);
      var skin = crossSkin ? matchFolderSkin(file) : state.skin;
      var role = game ? fileRole(file, game.id) : "";
      if (!skin || !role) { ignored += 1; return; }
      var key = skin + ":" + game.id;
      if (!groups[key]) groups[key] = { skin: skin, game: game, icon: [], bigIcon: [] };
      groups[key][role].push(file);
    });
    var entries = Object.keys(groups).map(function (key) {
      var group = groups[key];
      return { skin: group.skin, game: group.game, iconFiles: group.icon, bigIconFiles: group.bigIcon, error: "" };
    });
    return { folder: files.length ? (files[0].webkitRelativePath || "所选文件夹").split("/")[0] : "", entries: entries, ignored: ignored, total: files.length };
  }

  function showBatch(files) {
    if (!files.length) return;
    batch = buildBatch(files, importMode === "batch");
    var valid = batch.entries.filter(function (entry) { return !entry.error; });
    var skinCount = new Set(valid.map(function (entry) { return entry.skin; })).size;
    els.selectedImportFolder.textContent = batch.folder;
    els.batchSummary.textContent = "共 " + batch.total + " 个文件，"
      + (importMode === "batch" ? "匹配 " + skinCount + " 个皮肤、" + batch.entries.length + " 组游戏资源" : "匹配 " + batch.entries.length + " 个游戏")
      + "，可导入 " + valid.length + " 组；忽略 " + batch.ignored + " 个未匹配文件。";
    els.batchSummary.hidden = false;
    els.batchRows.innerHTML = batch.entries.length ? batch.entries.map(function (entry) {
      return '<tr>' + (importMode === "batch" ? '<td>' + escapeHtml(entry.skin) + '</td>' : '')
        + '<td><strong>' + escapeHtml(entry.game.name) + '</strong><small>#' + entry.game.id + '</small></td><td>'
        + (entry.iconFiles.map(function (file) { return '<small>' + escapeHtml(file.webkitRelativePath || file.name) + '</small>'; }).join("") || '<span class="muted">—</span>')
        + '</td><td>' + (entry.bigIconFiles.map(function (file) { return '<small>' + escapeHtml(file.webkitRelativePath || file.name) + '</small>'; }).join("") || '<span class="muted">—</span>')
        + '</td><td class="' + (entry.error ? 'status-error' : 'status-ready') + '">' + escapeHtml(entry.error || "可导入") + '</td></tr>';
    }).join("") : '<tr><td colspan="' + (importMode === "batch" ? 5 : 4) + '" class="empty-state">'
      + (importMode === "batch" ? '未匹配到入口资源，请检查皮肤、游戏目录及文件命名。' : '未匹配到入口资源，请检查游戏目录及文件命名。') + '</td></tr>';
    els.batchResult.hidden = true;
    els.confirmBatch.disabled = !valid.length;
    els.confirmBatch.hidden = false;
    els.reselectFolder.hidden = false;
    els.batchDialog.querySelector(".dialog-footer [data-close]").textContent = "取消";
  }

  function importBatch() {
    if (!batch) return;
    var count = 0;
    batch.entries.forEach(function (entry) {
      if (entry.error) return;
      var resources = skinResources(entry.skin)[entry.game.id];
      var detail = [];
      if (entry.iconFiles.length) {
        resources.icon = makeResource(entry.iconFiles);
        detail.push("小图标入口资源：" + resources.icon.names.join("、"));
      }
      if (entry.bigIconFiles.length) {
        resources.bigIcon = makeResource(entry.bigIconFiles);
        detail.push("大图标入口资源：" + resources.bigIcon.names.join("、"));
      }
      addLog(entry.skin, entry.game.id, importMode === "single" ? "入口资源导入" : "批量入口资源导入", detail.join("；"));
      count += 1;
    });
    els.confirmBatch.disabled = true;
    els.confirmBatch.hidden = true;
    els.reselectFolder.hidden = true;
    els.batchDialog.querySelector(".dialog-footer [data-close]").textContent = "完成";
    var skinCount = new Set(batch.entries.filter(function (entry) { return !entry.error; }).map(function (entry) { return entry.skin; })).size;
    els.batchResult.textContent = importMode === "batch" ? "已导入 " + skinCount + " 个皮肤、" + count + " 组游戏资源。" : "已导入 " + count + " 个游戏的入口资源。";
    els.batchResult.hidden = false;
    batch = null;
    renderGames();
  }

  function openFolderImport(mode) {
    importMode = mode;
    batch = null;
    els.folderInput.value = "";
    els.batchTitle.textContent = mode === "single" ? "入口资源导入" : "批量入口资源导入";
    els.batchSkinHeader.hidden = mode !== "batch";
    els.selectedImportFolder.textContent = "未选择文件夹";
    els.batchSummary.textContent = "";
    els.batchSummary.hidden = true;
    els.batchRows.innerHTML = '<tr><td colspan="' + (mode === "batch" ? 5 : 4) + '" class="empty-state">请选择文件夹</td></tr>';
    els.batchResult.hidden = true;
    els.confirmBatch.hidden = false;
    els.confirmBatch.disabled = true;
    els.reselectFolder.hidden = false;
    els.batchDialog.querySelector(".dialog-footer [data-close]").textContent = "取消";
    openDialog(els.batchDialog);
  }

  function chooseFolder() {
    els.folderInput.value = "";
    els.folderInput.click();
  }

  function onKeydown(event) {
    if (!activeDialog) return;
    if (event.key === "Escape") { event.preventDefault(); closeDialog(); return; }
    if (event.key !== "Tab") return;
    var focusable = Array.prototype.filter.call(activeDialog.querySelectorAll("button, input, select, [tabindex='0']"), function (element) {
      return !element.disabled && !element.hidden && element.getClientRects().length > 0;
    });
    if (!focusable.length) { event.preventDefault(); return; }
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !focusable.includes(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }

  function init() {
    if (initialized || !document.getElementById("entryPage")) return;
    var ids = ["skinOptions", "filterForm", "gameSearch", "gameTypeFilter", "resourceFilter", "resetFilters", "importEntry", "importFolder", "folderInput", "gameRows", "resultSummary", "editDialog", "editTitle", "editForm", "editGame", "editSkin", "chooseIcon", "removeIcon", "iconInput", "iconSelection", "chooseBigIcon", "removeBigIcon", "bigIconInput", "bigIconSelection", "editError", "batchDialog", "batchTitle", "batchSkinHeader", "selectedImportFolder", "batchSummary", "batchRows", "batchResult", "reselectFolder", "confirmBatch", "logDialog", "logContext", "logRows", "entryToast"];
    ids.forEach(function (id) { els[id] = document.getElementById(id); });
    if (ids.some(function (id) { return !els[id]; })) return;
    initialized = true;
    seedResources();
    renderGames();
    els.skinOptions.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-skin]");
      if (!button || !els.skinOptions.contains(button)) return;
      state.skin = button.dataset.skin;
      els.skinOptions.querySelectorAll("button").forEach(function (option) {
        option.classList.toggle("is-active", option === button);
        option.setAttribute("aria-pressed", option === button ? "true" : "false");
      });
      renderGames();
    });
    els.filterForm.addEventListener("submit", function (event) {
      event.preventDefault();
      state.filters = { search: els.gameSearch.value.trim().toLowerCase().replace(/^#/, ""), type: els.gameTypeFilter.value, status: els.resourceFilter.value };
      renderGames();
    });
    els.resetFilters.addEventListener("click", function () {
      els.filterForm.reset();
      state.filters = { search: "", type: "", status: "" };
      renderGames();
    });
    els.gameRows.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-action]");
      if (!button || !findGame(button.dataset.game)) return;
      if (button.dataset.action === "edit") openEditor(button.dataset.game);
      if (button.dataset.action === "logs") openLogs(button.dataset.game);
    });
    els.importEntry.addEventListener("click", function () { openFolderImport("single"); });
    els.importFolder.addEventListener("click", function () { openFolderImport("batch"); });
    els.reselectFolder.addEventListener("click", chooseFolder);
    els.folderInput.addEventListener("change", function () { showBatch(Array.from(els.folderInput.files)); });
    els.confirmBatch.addEventListener("click", importBatch);
    els.editGame.addEventListener("change", function () { loadDraft(els.editGame.value); });
    els.editForm.addEventListener("submit", saveDraft);
    ["icon", "bigIcon"].forEach(function (slot) {
      els[slot === "icon" ? "chooseIcon" : "chooseBigIcon"].addEventListener("click", function () {
        els[slot + "Input"].value = "";
        els[slot + "Input"].click();
      });
      els[slot + "Input"].addEventListener("change", function () {
        var files = Array.from(els[slot + "Input"].files);
        if (!files.length || !draft) return;
        draft[slot] = makeResource(files);
        errorMessage("");
        renderDraft();
      });
      els[slot === "icon" ? "removeIcon" : "removeBigIcon"].addEventListener("click", function () {
        if (!draft) return;
        draft[slot] = null;
        errorMessage("");
        renderDraft();
      });
    });
    document.querySelectorAll(".modal-layer").forEach(function (layer) {
      layer.addEventListener("click", function (event) {
        if (event.target === layer || event.target.closest("[data-close]")) closeDialog();
      });
    });
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("pagehide", function () {
      // Keep URLs alive while a page is cached for back/forward navigation.
      var used = new Set();
      Object.keys(state.resources).forEach(function (skin) {
        Object.keys(state.resources[skin]).forEach(function (id) {
          ["icon", "bigIcon"].forEach(function (slot) {
            var resource = state.resources[skin][id][slot];
            if (resource) used.add(resource.preview);
          });
        });
      });
      if (draft) [draft.icon, draft.bigIcon].forEach(function (resource) { if (resource) used.add(resource.preview); });
      objectUrls = objectUrls.filter(function (url) {
        if (used.has(url)) return true;
        URL.revokeObjectURL(url);
        return false;
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
