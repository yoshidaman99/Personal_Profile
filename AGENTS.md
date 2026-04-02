# Agents

Use the `frontend-design` skill when the user asks to build web components, pages, applications, or any frontend interfaces.

Use the `industrial-brutalist-ui` skill for raw mechanical interfaces with Swiss typographic and military terminal aesthetics.

Use the `minimalist-ui` skill for clean editorial-style interfaces with warm monochrome palettes and flat bento grids.

Use the `high-end-visual-design` skill for agency-level Awwwards-tier interfaces with haptic depth, cinematic motion, and the "Double-Bezel" architecture.

Use the `design-taste-frontend` skill for high-agency frontend engineering with metric-based design variance, motion intensity, and visual density controls.

Use the `stitch-design-taste` skill when generating DESIGN.md files for Google Stitch screen generation.

Use the `redesign-existing-projects` skill when auditing and upgrading existing websites/apps to premium quality.

Use the `full-output-enforcement` skill for any task requiring exhaustive, unabridged output with no placeholder patterns.

## Adding a New Project

When adding a new project to the portfolio, follow these steps **in order**:

### 1. Add project data to `lib/projects.ts`

Add a new object to the `projects` array following the `Project` interface:
- `id`: kebab-case, prefixed with tool name (e.g. `n8n-zoho-missing-field`)
- `title`: Descriptive project name
- `subtitle`: Short tagline
- `image`: Path to `/projects/<id>.webp` — place the actual image in `public/projects/`
- `alt`: Accessible description of the project image
- `description`: 1-2 paragraph overview
- `category`: One of: `Data Ingestion`, `Metadata Enrichment`, `AI Development`, `Backend Automation`, `Data Engineering`, `AI & Data Engineering`, or a new category
- `role`: Jerel's role (e.g. `Automation Engineer`)
- `year`: Project year (e.g. `2025`)
- `tags`: Searchable tags for filtering (used by ProjectsShowcase component AND the chat search engine in `lib/search.ts`)
- `techStack`: Full tech stack list
- `workflowSteps`: Array of `{ step, detail }` objects describing the pipeline
- `benefits`: Array of `{ label, icon?, info? }` — icon must be a valid `BenefitIcon` type
- `impact`: 1-2 sentence impact statement
- `chatPrompt`: The exact phrase that triggers the "Learn more" button in ProjectsShowcase

### 2. Add project image

Place a `.webp` image in `public/projects/` matching the `id` (e.g. `public/projects/n8n-zoho-missing-field.webp`).

### 3. No additional steps needed

The chat search engine (`lib/search.ts`) automatically picks up new projects from `lib/projects.ts` — no embedding step or regeneration required. The search uses weighted keyword matching against project titles, tags, tech stack, descriptions, categories, and other fields in real time.

### 4. Verify

- Start dev server (`npm run dev`)
- Ask the chat about the new project to verify the AI retrieves it
- Check the Projects showcase to verify the card renders correctly
- Run `npx tsc --noEmit` to verify no type errors
- Run `npm test` to verify all tests pass
