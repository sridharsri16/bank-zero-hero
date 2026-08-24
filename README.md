# Bank Zero → Hero — Modular Content Architecture

## The rule
The UI never contains lesson text or question definitions.

## Replace only Learn
Replace files under `content/learn/` and update `content/learn/index.json`.

## Replace only Questions
Replace one file under `content/questions/` and update `content/questions/index.json`.

## Keep user progress
Progress stores question IDs only:
- mastered[]
- revision[]
- attempts{}

If question IDs remain stable, progress survives content upgrades.

## Add a topic
1. Add `content/learn/<subject>/<topic>.json`
2. Add it to `content/learn/index.json`
3. Add `content/questions/<topic>.json`
4. Add it to `content/questions/index.json`

## Important
This starter deliberately does NOT claim thousands of questions. It proves the modular architecture with explicit question objects. The correct next work is content expansion by topic, not template repetition.


## Deploy to Netlify
This is a static site. Publish directory: `.`. No build command is required.
For GitHub deployment, connect the repository and use Publish directory `.`.
For manual deploy, upload the extracted project folder contents, not the ZIP itself.

## V2 content expansion
Added/expanded topic modules should remain data-only under content/learn and content/questions.


## V3 Percentage bank
`content/questions/percentage.json` now contains exactly 90 stored questions: 30 Easy, 30 Medium, 30 Hard. They are explicit JSON records with solutions; the browser does not generate them at runtime.


## V5 consolidated bank
All 14 current topics now contain 90 stored question objects each (30 Easy, 30 Medium, 30 Hard): 1,260 questions total. Percentage is retained from V4; the other 13 banks are expanded. Previous-paper metadata is in content/papers/index.json and rendered by the Papers tab.
