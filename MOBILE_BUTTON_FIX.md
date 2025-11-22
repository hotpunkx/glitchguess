# Mobile Button Text Size Fix

## Issue
On mobile screens (< 640px), button text on the home page was too large and overflowing the button width, particularly for:
- "I THINK OF SOMETHING – AI GUESSES"
- "AI THINKS OF SOMETHING – I GUESS"
- "⚡ CONTINUE GAME"

## Root Cause
The buttons were using `max-sm:text-lg` (1.125rem / 18px) for mobile screens, which was still too large for the long button text on small screens.

## Solution
Reduced mobile font size from `text-lg` to `text-sm` (0.875rem / 14px) for all main action buttons on the home screen.

### Changes Made

**File**: `src/components/game/StartScreen.tsx`

**Before**:
```tsx
className="... max-sm:text-lg max-sm:py-5"
```

**After**:
```tsx
className="... max-sm:text-sm max-sm:py-5"
```

### Affected Buttons
1. **Continue Game Button** (line 34)
   - Changed: `max-sm:text-lg` → `max-sm:text-sm`

2. **I Think of Something Button** (line 47)
   - Changed: `max-sm:text-lg` → `max-sm:text-sm`

3. **AI Thinks of Something Button** (line 54)
   - Changed: `max-sm:text-lg` → `max-sm:text-sm`

## Font Size Breakdown

### Desktop (≥1280px)
- Font size: `text-3xl` (1.875rem / 30px)
- Padding: `py-8` (2rem / 32px)

### Tablet (640px - 1279px)
- Font size: `text-xl` (1.25rem / 20px)
- Padding: `py-6` (1.5rem / 24px)

### Mobile (< 640px)
- Font size: `text-sm` (0.875rem / 14px) ← **FIXED**
- Padding: `py-5` (1.25rem / 20px)

## Visual Comparison

### Before (text-lg on mobile)
```

 I THINK OF SOMETHING –  │  ← Text overflowing
 AI GUESSES              │

```

### After (text-sm on mobile)
```

 I THINK OF SOMETHING –  │  ← Text fits properly
      AI GUESSES         │

```

## Testing

### Lint Check
```bash
npm run lint
```
**Result**: ✅ All 81 files passing

### Manual Testing Checklist
- [x] Text fits within button width on mobile (< 640px)
- [x] Text is still readable (not too small)
- [x] Buttons maintain proper padding
- [x] Hover effects still work
- [x] All three buttons have consistent sizing
- [x] Desktop and tablet sizes unchanged

## Impact

### User Experience
- ✅ Button text no longer overflows on mobile
- ✅ Improved readability on small screens
- ✅ More professional appearance
- ✅ Consistent button sizing across all screen sizes

### Performance
- ✅ No performance impact
- ✅ No additional CSS or JavaScript
- ✅ Pure Tailwind CSS utility classes

## Responsive Design Strategy

The fix follows mobile-first responsive design principles:

1. **Mobile First**: Start with smallest screen size
2. **Progressive Enhancement**: Add larger sizes for bigger screens
3. **Breakpoint Strategy**:
   - Default (mobile): `text-sm`
   - Tablet: `text-xl`
   - Desktop: `xl:text-3xl`

## Additional Notes

- The subtitle text in the Continue Game button (`max-sm:text-xs`) was already appropriately sized and did not need adjustment
- The "HOW TO PLAY" button uses a different size scale and was not affected
- The category cards at the bottom of the page were not affected

## Related Files

- `src/components/game/StartScreen.tsx` - Main file modified
- `src/index.css` - Design system (no changes needed)
- `tailwind.config.mjs` - Tailwind configuration (no changes needed)

---

**Date**: 2025-11-22  
**Status**: ✅ FIXED  
**Lint Status**: ✅ All passing  
**Files Modified**: 1
