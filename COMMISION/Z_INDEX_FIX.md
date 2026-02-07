# Z-Index Stacking Context Fix

## Problem
The heading (h2) with `z-index: 200` was appearing **behind** the grid-item-2 images instead of **over** them, even though it had a much higher z-index value.

## Root Cause: Stacking Context

### What is a Stacking Context?
When an element has both `position: relative/absolute/fixed` AND a `z-index` value, it creates a **new stacking context**. Child elements' z-index values only work **within** that context, not globally.

### The Issue in Your Code:
```css
/* BEFORE - Created isolated stacking contexts */
.grid-item-1 {
    position: relative;
    z-index: 10;  /* ← Creates stacking context */
}

.grid-item-2 {
    position: relative;
    z-index: 1;   /* ← Creates stacking context */
}

.description h2 {
    position: absolute;
    z-index: 200; /* ← Only works WITHIN .grid-item-1's context */
}
```

### The Problem:
1. `.grid-item-1` has `z-index: 10` → creates stacking context A
2. `.grid-item-2` has `z-index: 1` → creates stacking context B
3. The h2 is inside `.grid-item-1`, so its `z-index: 200` only works within context A
4. Context A (z-index: 10) is above context B (z-index: 1)
5. BUT the h2 is positioned to span across both columns, trying to overlap context B
6. Since contexts are compared at the parent level, the h2 can't escape its parent's context

## Solution

### Remove z-index from Grid Items (Desktop)
```css
/* AFTER - No stacking contexts on grid items */
.grid-item-1 {
    position: relative;
    /* z-index removed */
}

.grid-item-2 {
    position: relative;
    /* z-index removed */
}

.description h2 {
    position: absolute;
    z-index: 200; /* ← Now works globally */
}
```

### Why This Works:
1. Without `z-index`, `.grid-item-1` and `.grid-item-2` don't create stacking contexts
2. The h2's `z-index: 200` now works in the **global** stacking context
3. The h2 can now properly layer above the images in `.grid-item-2`

## Mobile Consideration

On mobile, we **keep** `z-index: 2` on `.grid-item-1`:
```css
@media (max-width: 768px) {
    .grid-item-1 {
        z-index: 2; /* ← Needed to stay above background images */
    }
    
    .grid-item-1::before,
    .grid-item-1::after {
        z-index: -1; /* ← Background images behind content */
    }
}
```

This is fine because:
- The background images are **pseudo-elements** (::before, ::after)
- They have `z-index: -1` which places them behind their parent
- The parent needs `z-index: 2` to ensure content stays above backgrounds
- There's no conflict since mobile uses single-column layout

## Key Takeaway

**Z-index only matters within the same stacking context.**

To fix z-index issues:
1. Check if parent elements have `position` + `z-index` (creates stacking context)
2. Remove unnecessary z-index values from parents
3. Only use z-index where actually needed

## Files Modified
- `stylesss.css` - Removed z-index from `.grid-item-1` and `.grid-item-2` (desktop only)

## Result
✅ Heading now appears **over** the images as intended  
✅ Mobile layout unaffected  
✅ Cleaner, more maintainable code
