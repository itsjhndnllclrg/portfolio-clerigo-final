# Make this portfolio yours

## Folder map

```
index.html            all text and links
styles.css            styling (no edits needed for images)
script.js             behavior (no edits needed)
images/
  logo/
    logo.png          24x24 nav mark (shown small; export at 96x96 or larger, square)
    school-logo.png   64x64 school mark (export 192x192, square, transparent PNG is best)
  profile/
    profile.webp      square portrait (site uses .webp; originals kept as .png/.jpg)
  projects/
    project-website.jpg         1280x720  (Featured project 1)
    figma-preview.jpg           390x844   (Figma / design project)
    project-sims.jpg            1280x720  (Student Information Management System)
    project-library-logger.jpg  1280x720  (Library Visitor Logging System)
  progress/
    before.jpg        800x600  earliest assignment screenshot
    after.jpg         800x600  latest assignment screenshot
    coming-soon.jpg   1280x720 shown on the "Planned" timeline entry
assignments/
  01-intro/index.html     your Assignment 01 page (currently a stub)
  02-flexbox/index.html   your Assignment 02 page (currently a stub)
files/
  resume.pdf              your resume (currently a stub)
```

## Replacing an image

Save your image with the **same file name and type** in the same folder (overwrite it).
Nothing in the code changes. If you use a different file name or type (e.g. `.png`),
update the `src` in `index.html` and, for best results, keep the same aspect ratio.
Remember to update the `alt` text so it describes your real image.

The images included now are generated placeholders, not photographs, so there are no
licensing concerns, and you can delete them once you have your own.

## Text and links to edit in index.html (search for `TODO`)

| What | Where to search |
| --- | --- |
| Tagline under the hero | `Optional tagline` |
| GPA / honors | `3.x GPA` |
| Extra course row | `+ Add course` |
| Three-sentence bio | `three-sentence bio` |
| Fourth skill group | `Add skill group` |
| Project titles, descriptions, tags | `[Project Title]`, `[App Name]` |
| GitHub repo and live demo links | `github.com/username/repo-name`, `example.com/demo` |
| Figma prototype links | `figma.com/proto/PLACEHOLDER` (appears twice) |
| Extra project card | `+ Add project` |
| Assignment entries, dates, status | `Course assignments timeline` |
| Growth reflection | `[Reflection:` |
| Email, LinkedIn, GitHub, location, phone | `Contact` section; email appears in several places |
| Page title and meta description | top of `<head>` |
| Footer name | bottom of `index.html` |

If you remove the Phone row or a card, delete the whole `<div class="row">` or `<article>` block.
