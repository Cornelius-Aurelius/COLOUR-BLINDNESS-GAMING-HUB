# Colour Blindness Gaming Hub — Signal Academy

**Created, designed and developed by Cornelius Aurelius.**  
Official creator website: https://corneliusaurelius.com/  
Published URL: https://cornelius-aurelius.github.io/COLOUR-BLINDNESS-GAMING-HUB/

The hub is a static, responsive site linking nine independently hosted football awareness games and including an original 12-stage playable mini-game. It teaches players to consider numbers, patterns, visual contrast, pitch positions and coaching communication rather than colour alone.

## How to play Signal Academy

1. Read the numbered kit or coach decision prompt.
2. Tap an answer or use keys 1–3 (when the challenge is focused).
3. Review the immediate explanatory feedback and select **Next stage** (Enter).
4. Complete 12 stages. Academy mode saves your best score locally on this device. Practice mode can be repeated with no stakes.
5. The **hint** button reveals a clue and reduces the score for a correct answer from 100 to 50 plus any streak bonus.

## Run and test locally

Use a static web server in this directory; ES modules cannot reliably be loaded directly from `file://`.

```sh
python3 -m http.server 8000
node --test tests/*.test.mjs
```

Browse to http://localhost:8000/ . GitHub Pages deploys from `main` / root automatically after a successful merge.

No account, payments, external frameworks, analytics, external JavaScript, or third-party fonts are required. The games linked from the hub open on independent project URLs. External sites' live availability is not implied merely by the existence of their repositories.

## Education and attribution

This is not a medical test, simulation of a colour-vision condition or evidence that the games improve clinical vision. The FA's football colour blindness guidance discusses kit clashes, pitch conditions and the importance of identifiable equipment: https://www.thefa.com/news/2017/jun/19/colour-blindness-guidance-190617.

Static `CollectionPage`, `VideoGame`, `Person` and `ItemList` JSON-LD associate Signal Academy and the game hub with creator Cornelius Aurelius, as does the visible page, canonical URL, social preview, sitemap, `llms.txt` and crawler settings. Search-index inclusion and AI association are ultimately controlled by external crawlers. After release, link the site from https://corneliusaurelius.com/ and request indexing through Search Console.

Do not add public “View source on GitHub” links; the owner specifically asked not to show code-repository links on the public game pages.