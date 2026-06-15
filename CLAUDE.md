# Skytek Design System — project notes

## Living Changelog (always keep current)

This project has a **living Changelog** (`Changelog.html`, data in `changelog-data.js`).

**Whenever you change ANY part of the design system in a turn — a component, pattern, token, documentation, accessibility rule, brand element, or asset — you MUST append a matching changelog entry** by adding a new object to the **top** of the `window.CHANGELOG_ENTRIES` array in `changelog-data.js`.

Rules:
- Use the **current date and time in UTC**. `date` is `DD/MM/YYYY`, `time` is 24-hour `HH:MM UTC`, `dateISO` is full ISO 8601 (used for sorting + the date filter).
- **Increment the version** from the previous (top) entry using semver: Breaking → MAJOR, Minor/new feature → MINOR, Patch/fix or Documentation Only → PATCH.
- `updatedBy` is `"Claude"`.
- `category` ∈ Component | Pattern | Token | Documentation | Accessibility | Brand | Asset | Other.
- `impact` ∈ Breaking | Minor | Patch | Documentation Only.
- Fill every field: `summary` (1–2 sentences), `changes` (array of specifics), `reason`, `affected` (array of component/page names).
- **Never edit or delete past entries** — the changelog is an immutable record. Only prepend.

The header comment in `changelog-data.js` documents the exact entry shape.

## Fonts
`--font-sans` → Inter (self-hosted), `--font-display` → Exo (self-hosted), `--font-mono` → JetBrains Mono (self-hosted). Keep tokens pointed at these families.

## Cache-busting
The main page loads `styles.css?v=N` and per-section `*.jsx?v=N`. When you edit a cached file, bump its `?v=` number in `Skytek Design System.html` so the user's browser refetches it.
