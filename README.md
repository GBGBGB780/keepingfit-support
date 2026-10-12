# Keeping Fit Website

Standalone static website for Keeping Fit. It can be published directly with
GitHub Pages or any static hosting service.

## Preview

```bash
cd keeping-fit-support
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Files

- `index.html`: product landing page
- `support.html`: support and FAQ page
- `privacy.html`: bilingual privacy policy
- `styles.css`: responsive visual design
- `script.js`: navigation, reveal effects, counters, and background animation
- `assets/app-icon.png`: shared iPhone/watchOS app icon

## Publishing with GitHub Pages

1. Create a public repository such as `keeping-fit-support`.
2. Upload everything inside this folder to the repository root.
3. In **Settings → Pages**, deploy from the `main` branch and `/(root)`.
4. Use the resulting `support.html` and `privacy.html` URLs in App Store Connect.

The site intentionally shows “即将上线” until an App Store product URL is
available. Replace the related links and copy after the listing is published.

Support email: `kampui4app@163.com`
