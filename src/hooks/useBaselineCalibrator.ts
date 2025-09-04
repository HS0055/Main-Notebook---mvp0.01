"use client";
import { useEffect } from "react";

export function useBaselineCalibrator(pageSelector: string = ".note-page", editorSelector: string = ".note-editor") {
  useEffect(() => {
    const compute = () => {
      const pages = document.querySelectorAll<HTMLElement>(pageSelector);
      
      pages.forEach(page => {
        const editor = page.querySelector<HTMLElement>(editorSelector);
        if (!page || !editor) return;

        const lh = parseFloat(getComputedStyle(editor).lineHeight);
        if (!Number.isFinite(lh)) return;

        // Probe baseline with "Hg" (good ascent metrics)
        const span = document.createElement("span");
        span.textContent = "Hg";
        span.style.visibility = "hidden";
        span.style.position = "absolute";
        span.style.top = "0";
        span.style.left = "0";
        span.style.fontSize = getComputedStyle(editor).fontSize;
        span.style.fontFamily = getComputedStyle(editor).fontFamily;
        span.style.lineHeight = getComputedStyle(editor).lineHeight;
        
        editor.appendChild(span);

        const rect = span.getBoundingClientRect();
        const editorRect = editor.getBoundingClientRect();
        
        // Calculate actual baseline position relative to editor top
        const ascent = rect.height * 0.8; // Approximate ascent
        const baseline = ascent; // distance from top to baseline
        
        // Calculate offset needed to align baseline with grid
        const offset = (lh - (baseline % lh)) % lh;
        
        // Apply the offset
        page.style.setProperty("--baseline-offset", `${Math.round(offset)}px`);
        
        span.remove();
      });
    };

    // Initial computation
    compute();

    // Recompute on resize/DPR/style/spacing changes
    const onResize = () => {
      requestAnimationFrame(compute);
    };
    
    window.addEventListener("resize", onResize);

    // Observe attribute changes on pages (paper/spacing toggles)
    const pages = document.querySelectorAll<HTMLElement>(pageSelector);
    const observers: MutationObserver[] = [];
    
    pages.forEach(page => {
      const mo = new MutationObserver(() => {
        requestAnimationFrame(compute);
      });
      mo.observe(page, { 
        attributes: true, 
        attributeFilter: ["data-paper", "data-spacing", "style"] 
      });
      observers.push(mo);
    });

    // Also observe for new pages being added
    const bodyObserver = new MutationObserver(() => {
      requestAnimationFrame(compute);
    });
    bodyObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    observers.push(bodyObserver);

    // Trigger recalibration when paper style changes
    const handleStyleChange = () => {
      requestAnimationFrame(compute);
    };
    
    document.addEventListener('recalibrate-baseline', handleStyleChange);
    
    // Recalibrate after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(compute, 100);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener('recalibrate-baseline', handleStyleChange);
      observers.forEach(mo => mo.disconnect());
      clearTimeout(timeoutId);
    };
  }, [pageSelector, editorSelector]);
}