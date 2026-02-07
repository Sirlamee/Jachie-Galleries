# Commission Page - Styling & Animation Documentation

## Overview
Complete styling and animation implementation for the Commission page with distinct desktop and mobile layouts.

---

## Desktop Layout (≥769px)

### **Grid Structure**
- **Two-column layout**: 50-50 split using CSS Grid
- **Grid Template**: `grid-template-columns: 1fr 1fr`
- Container starts immediately below the navbar (80px padding-top)

### **Main Heading (h2) - "HAVE A NEW PROJECT IN MIND?"**
- **Position**: Absolute positioning to span full width (100%)
- **Placement**: Top of the grid container, overlapping both columns
- **Z-index**: 20 (appears above images)
- **Typography**: Quantify font, clamp(2.5rem, 8vw, 6rem)
- **Animation**: Slides up from bottom with 0.2s delay

### **Grid Item 1 - Content Column**
- **Padding**: 3rem 4rem (left column)
- **Content spacing**: First paragraph has top margin to account for absolute heading
- **All text elements**: Slide up animation with staggered delays

### **Grid Item 2 - Image Column**
- **Layout**: Flexbox column, no gap
- **Image Heights**: 
  - **First image**: Starts after heading, fills remaining viewport
    - `margin-top: clamp(8rem, 15vh, 12rem)`
    - `height: calc(100vh - clamp(8rem, 15vh, 12rem) - 80px)`
  - **Second image**: 90vh height
- **Animation**: "Open down" effect (height expands from 0 to full)
  - First image: 0.3s delay
  - Second image: 0.6s delay
  - Duration: 1.2s with cubic-bezier easing

---

## Mobile Layout (≤768px)

### **Background Treatment**
- **Grid Item 2**: Fixed position, full viewport coverage
- **Images**: Serve as background with low opacity (0.15)
- **Filter**: Slight grayscale (20%) for subtle effect
- **Z-index**: 1 (behind content)
- **Pointer events**: None (non-interactive)

### **Content Overlay**
- **Grid Item 1**: 
  - Semi-transparent white background: `rgba(255, 255, 255, 0.85)`
  - Backdrop blur: 5px for glassmorphism effect
  - Border radius: 10px
  - Margin: 1rem (creates card-like appearance)
  - Z-index: 10 (above background)

### **Contact Links**
- **Layout**: Column layout (stacked)
- **Buttons**: Full width, centered text

---

## Typography

### **Headings**
- **h2 (Main)**: Quantify, clamp(2.5rem, 8vw, 6rem)
- **h3 (Subheading)**: Quantify, clamp(1.2rem, 2.5vw, 2rem)

### **Body Text**
- **Paragraphs**: Creato Display, clamp(0.95rem, 1.2vw, 1.1rem)
- **Line height**: 1.8 for readability
- **Color**: #333 for body, #000 for headings

### **List Styling**
- **Custom numbering**: Decimal-leading-zero (01, 02, 03...)
- **Number position**: Absolute, left of text
- **Bold labels**: Font-weight 600, black color
- **Spacing**: 2rem between items

---

## Animations

### **1. Slide Up Text (`slideUpText`)**
- **Effect**: Elements slide up 30px and fade in
- **Duration**: 1s
- **Easing**: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Applied to**: All text elements (h2, h3, p, list items, buttons)

### **Staggered Delays**
```
h2:          0.2s
p (intro):   0.4s
h3:          0.6s
List item 1: 0.8s
List item 2: 0.9s
List item 3: 1.0s
... (increments by 0.1s)
List item 10: 1.7s
Contact links: 1.8s
```

### **2. Open Down (`openDown`) - Desktop Only**
- **Effect**: Images expand from height 0 to full height
- **Duration**: 1.2s
- **Easing**: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- **Applied to**: Grid-item-2 images
- **Delays**:
  - First image: 0.3s
  - Second image: 0.6s

### **3. Fade In Background (`fadeInBackground`) - Mobile Only**
- **Effect**: Background images fade in
- **Duration**: 1.5s
- **Easing**: ease
- **Delays**:
  - First image: 0.2s
  - Second image: 0.5s

---

## Interactive Elements

### **Contact Buttons**
- **Default**: White background, black border (2px), black text
- **Hover**: 
  - Black background
  - White text
  - Slight lift effect: `translateY(-2px)`
- **Transition**: 0.3s ease for smooth interaction

### **Navigation Links** (from navbar.css)
- **Hover**: Opacity reduces to 0.6
- **Mobile**: Dropdown menu with hamburger icon

---

## Color Palette
- **Primary Text**: #000 (Black)
- **Body Text**: #333 (Dark Gray)
- **Background**: #ffffff (White)
- **Mobile Overlay**: rgba(255, 255, 255, 0.85)
- **Image Opacity (Mobile)**: 0.15

---

## Responsive Breakpoints
- **Desktop**: ≥769px
- **Mobile**: ≤768px

---

## Key Features Implemented

✅ **Desktop**: 
- Two-column grid layout
- Full-width heading spanning both columns
- Images extending to screen height
- Open-down animation for images
- Slide-up animation for text

✅ **Mobile**:
- Background images with low opacity
- Semi-transparent content card
- Glassmorphism effect with backdrop blur
- Stacked layout for easy reading

✅ **Animations**:
- Smooth, staggered text reveals
- Image expansion animations
- Hover effects on interactive elements

✅ **Typography**:
- Quantify for headings
- Creato Display for body
- Responsive font sizing with clamp()

---

## File Structure
```
COMMISION/
├── index.html          (HTML structure)
├── styles.css          (Main styling & animations)
├── carousel.js         (Future interactions)
├── ../navbar.css       (Navbar styling)
├── ../font-face.css    (Custom fonts)
└── ../hamburgerMenu.js (Mobile menu)
```

---

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid support required
- CSS Custom Properties (variables) support required
- Backdrop-filter support for glassmorphism effect

---

## Performance Considerations
- Animations use `transform` and `opacity` for GPU acceleration
- Images should be optimized for web
- Backdrop-filter may impact performance on older devices
- Fixed positioning on mobile for smooth scrolling

---

## Future Enhancements
- Add scroll-triggered animations for list items
- Implement intersection observer for lazy loading
- Add parallax effect to background images (mobile)
- Consider adding micro-interactions on hover
