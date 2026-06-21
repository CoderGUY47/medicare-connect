---
version: v1.0.0
name: medicare-connect-figma-dark
description: A pixel-perfect Figma workspace design system for the MediCare Connect healthcare portal. The interface is styled as a dark designer prototype canvas, featuring a void-black background, gridline backgrounds, electric neon cyan highlights, figma outline selectors on hover, and strict zero rounded corners (rounded-0) on all items.
colors:
  primary: "#00F0FF"            # Electric Neon Cyan
  primary-foreground: "#09090b" # Deep Zinc Dark Gray
  background: "#09090b"         # Deep Zinc Dark Gray
  foreground: "#fafafa"         # Crisp Off-White
  card: "#09090b"
  card-foreground: "#fafafa"
  secondary: "#27272a"          # Medium Gray Zinc
  border: "#27272a"
  muted-foreground: "#a1a1aa"   # Light Gray Zinc
  figma-blue: "#0c8ce9"         # Figma active selection outline blue

rounded:
  default: 0px                  # All components, inputs, buttons, and frames must have a 0px border-radius (rounded-none)
  avatar: 0px
  button: 0px
  card: 0px

spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px

typography:
  fontFamily: "Outfit, Inter, sans-serif"
  fontMono: "ui-monospace, JetBrains Mono, monospace"

components:
  workspace-header:
    backgroundColor: "#09090b"
    borderBottom: "1px solid #27272a"
    textColor: "#a1a1aa"
    typography: "fontMono"
  
  canvas-card:
    backgroundColor: "#09090b"
    border: "1px solid #27272a"
    hoverOutline: "1px solid #0c8ce9"
    hoverBadge: "fontMono uppercase text-[9px] bg-[#0c8ce9]"
    rounded: "0px"
    
  button-primary:
    backgroundColor: "#00F0FF"
    textColor: "#09090b"
    fontFamily: "fontMono"
    fontWeight: "bold"
    rounded: "0px"
    
  button-secondary:
    backgroundColor: "transparent"
    border: "1px solid #27272a"
    textColor: "#fafafa"
    hoverBg: "#27272a"
    rounded: "0px"
---

## Overview

MediCare Connect uses a custom **Figma Designer Prototype Canvas** design language. Unlike typical medical applications that rely on soft white/blue interfaces and rounded bubbles, this application is formatted like a designer's interactive workspace in dark mode.

### Visual Rules

1. **Background Grid**: A subtle 32px pixel gridline background (`.figma-grid`) must overlay the canvas background (`#09090b`), establishing a developer/designer workbench environment.
2. **Strict Corner Radii**: The border-radius property must be exactly `0px` globally (`rounded-none` or `rounded-0`). Standard pills, rounded cards, circular icons, or circular profile images are prohibited.
3. **Figma Selections**: Interactive cards and action items use the `.figma-hover-select` style. When hovered, the component receives a `1px solid #0c8ce9` outline with square resize dots at the corners and a small floating tag showing dimensions or coordinate indexes.
4. **Monospace Details**: Technical tags, stats counters, clinic search paths, and status badges run on a uppercase monospace typeface (`ui-monospace`) to resemble metadata logs.
