## Plan: SuperFokus Lite v1.0.0-beta

TL;DR: Remove site blocker and other system-level features, preserve the five Fokus modes and workflows, update UI branding to "SuperFokus lite", bump the version to `v1.0.0-lite-beta` everywhere, and clean up docs and site-blocker-specific files.

**Steps**
1. Audit all site blocker references in the repo using a text search for "site blocker", "Site Blocker", and related terms.
2. Remove the site blocker UI flow from `index.html`:
   - Remove the menu item and modal entry for `modal-site-blocker`.
   - Remove any host-file/system blocking instructions or descriptions from the About/intro copy.
   - Remove the `Site Blocker` section from the sidebar and related buttons.
3. Remove site blocker renderer code:
   - Remove the import of `./features/site-blocker.js` from `src/renderer/renderer.js`.
   - Delete or isolate `src/renderer/features/site-blocker.js` if it is no longer used.
4. Remove site blocker main process support:
   - Remove any IPC handlers or main process code in `src/main/main.js` that is only for site blocker elevation or host-file modification.
   - Delete or stop using `src/main/fokus-sb-helper.js` if it is exclusively for the site blocker feature.
   - Review `test-proxy.js` and remove or archive it if it is solely a site blocker test helper.
5. Update the UI branding and version:
   - Change the header in `index.html` to display "SuperFokus" prominently and "lite" in smaller text aligned with the bottom of the larger text.
   - Replace all version strings like `v1.0.0 Alpha`, `v1.0.0beta`, or similar with `v1.0.0-lite-beta` across the workspace.
   - Bump `package.json` metadata if needed to include the new version string.
6. Document the lite edition:
   - Remove or update README content that describes `Site Blocker` and other system-level features.
   - Ensure the app description reflects a lightweight edition with core Fokus modes and no system blocking.
7. Optimize and clean-up:
   - Remove unused imports, styles, and scripts introduced by the removed site blocker feature.
   - Validate that the remaining renderer and main process flows still load correctly.
8. Verify the final state:
   - Confirm the UI no longer shows the word "SITE" or Site Blocker anywhere.
   - Confirm the header includes the exact text "lite" as specified.
   - Confirm the app still exposes the five Fokus modes and workflows.

**Relevant files**
- `index.html` — remove site blocker UI, update header/branding, update version displays.
- `src/renderer/renderer.js` — remove site blocker import and related event handling.
- `src/renderer/features/site-blocker.js` — remove or delete if unused.
- `src/main/main.js` — remove site blocker main process/IPCs and helpers.
- `src/main/fokus-sb-helper.js` — remove or decommission if exclusively site blocker.
- `package.json` — update version string and any metadata.
- `README.md` — remove site blocker docs and describe lite edition.
- `test-proxy.js` — review for removal if it is only site blocker support.

**Verification**
1. Search the repo for "site blocker", "Site Blocker", and "SITE" after changes. No visible feature references should remain in the app UI or docs.
2. Search for old version tags and strings; ensure `v1.0.0-lite-beta` is the only new version text.
3. Launch or run the app in development mode and validate that the core Fokus modes and dashboard load without site blocker-related errors.
4. Check `index.html` visually to confirm the header shows "SuperFokus" plus smaller aligned "lite" text.

**Decisions**
- Preserve workflows and the five Fokus mode UI; only remove system-level blocker features.
- Remove site blocker files and references rather than refactoring them into a disabled state.
- Keep the plan focused on the spec: feature removal, branding, version bump, and cleanup.

**Further Considerations**
1. Confirm whether `test-proxy.js` should be deleted or simply excluded from packaging, since it is not a user-facing app file.
2. Confirm whether any build scripts or packaging config reference `fokus-sb-helper.js` or site blocker assets.
3. Review `README.md` for any additional system-level feature language beyond the site blocker.
