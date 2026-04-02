# Fix: Avatar and Chatbox/Textarea Not Visible — Scaling Issues

## Problem Summary
On smaller/shorter viewports, the avatar and chat input area are not visible. Three root causes:

1. **Overflow clipping**: `.content-wrapper` has `overflow: hidden` while `.content-wrapper--centered` uses `justify-content: center`. When content exceeds viewport height, both top (avatar) and bottom (chat input) get clipped equally.
2. **No viewport-height breakpoints**: Only `max-width` breakpoints exist — no accommodation for short screens (landscape phones, small laptops).
3. **Fixed avatar sizes**: Hard-coded `200px`/`150px` don't scale fluidly across viewport sizes.

---

## File 1: `app/globals.css` — 7 edits

### Edit 1: `.content-wrapper` — Add `min-height: 0`
**Line 181-188**

```css
/* BEFORE */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 0;
  overflow: hidden;
}

/* AFTER */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem 0;
  overflow: hidden;
  min-height: 0;
}
```

**Why**: `min-height: 0` allows the flex child to shrink below its content size, preventing the content from forcing the container to expand beyond the viewport.

---

### Edit 2: `.content-wrapper--centered` — Override overflow, adjust padding
**Line 190-194**

```css
/* BEFORE */
.content-wrapper--centered {
  justify-content: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
}

/* AFTER */
.content-wrapper--centered {
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  overflow-y: auto;
  min-height: 0;
}
```

**Why**: `overflow-y: auto` allows the page to scroll when content overflows the viewport (instead of clipping). `padding: 1rem` top/bottom ensures content has breathing room when scrolling. `min-height: 0` works with the parent flex container.

---

### Edit 3: `.content-wrapper--centered .chat-input-container` — Fix bottom padding
**Line 196-198**

```css
/* BEFORE */
.content-wrapper--centered .chat-input-container {
  padding: 0.75rem 0 0;
}

/* AFTER */
.content-wrapper--centered .chat-input-container {
  padding: 0.75rem 0 1rem;
}
```

**Why**: The original `0` bottom padding meant the quick-nav buttons could be flush against the viewport edge when scrolling. Adding `1rem` bottom padding ensures they're always visible with breathing room.

---

### Edit 4: `.avatar-frame--image` — Fluid sizing with `clamp()`
**Line 272-277**

```css
/* BEFORE */
.avatar-frame--image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

/* AFTER */
.avatar-frame--image {
  width: clamp(120px, 25vw, 200px);
  height: clamp(120px, 25vw, 200px);
  border-radius: 50%;
  overflow: hidden;
}
```

**Why**: `clamp(120px, 25vw, 200px)` smoothly scales the avatar from 120px on small screens up to 200px on larger ones, with fluid scaling in between. At 375px viewport → 120px, at 640px → 160px, at 800px+ → 200px.

---

### Edit 5: Mobile `.avatar-frame--image` override — Fluid sizing
**Line 782-785** (inside `@media (max-width: 640px)`)

```css
/* BEFORE */
.avatar-frame--image {
    width: 150px;
    height: 150px;
  }

/* AFTER */
.avatar-frame--image {
    width: clamp(100px, 38vw, 160px);
    height: clamp(100px, 38vw, 160px);
  }
```

**Why**: On mobile viewports, the avatar scales fluidly from 100px on the smallest phones (320px) up to 160px at the 640px breakpoint. `38vw` at 320px = ~122px, at 420px = ~160px.

---

### Edit 6: Add `@media (max-height: 700px)` breakpoint
**Insert AFTER the closing `}` of `@media (max-width: 380px)` block (after line 873)**

```css
@media (max-height: 700px) {
  .content-wrapper--centered {
    gap: 0.75rem;
  }

  .avatar-glow {
    width: 130px;
    height: 130px;
  }

  .greeting-title {
    font-size: 1.35rem;
  }

  .greeting-subtitle {
    font-size: 0.85rem;
  }

  .greeting {
    margin-top: 0.5rem;
  }

  .chips-container {
    margin-top: 0.75rem;
  }
}
```

**Why**: On viewports shorter than 700px (landscape phones, short laptops), this reduces gaps and font sizes so all content fits without scrolling.

---

### Edit 7: Add `@media (max-height: 550px)` breakpoint
**Insert immediately after the new max-height: 700px block**

```css
@media (max-height: 550px) {
  .content-wrapper--centered {
    gap: 0.4rem;
    padding: 0.5rem 1rem;
  }

  .avatar-glow {
    width: 90px;
    height: 90px;
  }

  .greeting-title {
    font-size: 1.1rem;
  }

  .greeting-subtitle {
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }

  .greeting {
    margin-top: 0.25rem;
  }

  .chips-container {
    margin-top: 0.5rem;
  }

  .chip {
    font-size: 0.68rem;
    padding: 0.3rem 0.6rem;
  }

  .chat-input-container {
    padding: 0.5rem 1rem 0.75rem;
  }

  .quick-nav {
    margin-top: 12px;
    gap: 4px;
  }

  .quick-nav-btn {
    font-size: 0.7rem;
    padding: 0.35rem 0.6rem;
  }

  .quick-nav-btn svg {
    width: 13px;
    height: 13px;
  }
}
```

**Why**: For very short viewports (e.g., landscape phone at ~400-550px height), aggressively reduces all spacing and sizes to fit content without scrolling.

---

## File 2: `components/Avatar.tsx` — 1 edit

### Edit 8: Cap canvas buffer to prevent oversized rendering

**Replace the `drawDefault` function and the image drawing in `update` (lines 56-63 and 98-106)**

Replace the entire `canvasRef` callback body (lines 40-117) with:

```tsx
const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
    if (!node) return;
    const ctx = node.getContext("2d");
    if (!ctx) return;

    let frame = DEFAULT_FRAME;
    let raf = 0;
    const mousePos = { x: 0.5, y: 0.5 };
    const MAX_SIZE = 512;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX / window.innerWidth;
      mousePos.y = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const drawImage = (img: HTMLImageElement) => {
      if (!img.complete || img.naturalWidth === 0) return;
      const scale = Math.min(MAX_SIZE / img.naturalWidth, MAX_SIZE / img.naturalHeight, 1);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      if (node.width !== w || node.height !== h) {
        node.width = w;
        node.height = h;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
    };

    const img = imagesMap.get(DEFAULT_FRAME);
    if (img) drawImage(img);

    const update = () => {
      if (!imagesLoaded) {
        const defaultImg = imagesMap.get(DEFAULT_FRAME);
        if (defaultImg) drawImage(defaultImg);
        raf = requestAnimationFrame(update);
        return;
      }

      let clamped: number;

      if (stateRef.current === "thinking") {
        clamped = 183;
        frame = clamped;
      } else {
        const x = mousePos.x;
        let targetFrame: number;
        if (x <= 0.46) {
          targetFrame = Math.round(109 - (x / 0.46) * 63);
        } else if (x <= 0.5) {
          targetFrame = Math.round(46 - ((x - 0.46) / 0.04) * 25);
        } else if (x <= 0.559) {
          targetFrame = Math.round(21 + ((x - 0.5) / 0.059) * 129);
        } else {
          targetFrame = Math.round(150 + ((x - 0.559) / 0.441) * 42);
        }

        const diff = targetFrame - frame;
        const lerped = Math.round(frame + diff * 0.12);
        clamped = Math.max(1, Math.min(TOTAL_FRAMES, lerped));
        frame = clamped;
      }

      const currentImg = imagesMap.get(clamped);
      if (currentImg) drawImage(currentImg);

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);
```

**Why**: The original code set the canvas buffer to `img.naturalWidth × img.naturalHeight` which could be very large (e.g., 1024x1024+). This wastes GPU memory and can cause rendering issues on low-end devices. Capping at 512x512 is plenty for a 200x200 display size while keeping smooth rendering on 2x retina screens.

---

## Verification Steps

After implementing all edits:

1. Run `npm run build` to verify no errors
2. Test at these viewport sizes:
   - **Desktop**: 1920x1080, 1366x768
   - **Tablet**: 768x1024, 1024x768 (landscape)
   - **Mobile portrait**: 375x667, 390x844, 320x568
   - **Mobile landscape**: 667x375, 844x390
   - **Very small**: 320x480

3. Verify in each viewport:
   - Avatar is visible and properly sized
   - Greeting text is readable
   - Suggestion chips are visible (when no messages)
   - Chat input textarea is visible and functional
   - Quick nav buttons are visible and clickable
   - No horizontal scrollbar
   - Content doesn't overflow/clipping (scrollbar appears when needed on short viewports)

4. Test with messages:
   - Avatar scales down when messages appear
   - Messages area scrolls properly
   - Chat input stays at bottom and is always accessible
   - "New chat" button is visible
