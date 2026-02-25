import { useEffect } from "react";

const ToolTipPatcher = () => {
    useEffect(() => {
        const form = document.querySelector<HTMLFormElement>("form.rjsf");
        if(!form) {
            return;
        }

        const patchToolTips = () => {
            form.querySelectorAll<HTMLDivElement>("div.description-field").forEach((descField) => {
                if (descField.dataset.tooltip === "patched") {
                    return;
                }
                
                // descTextEl contains the description text
                const descTextEl = descField.querySelector<HTMLDivElement>("div");
                if(!descTextEl) {
                    throw new Error("Description parent missing child div");
                }
                
                const descriptionText = descTextEl.textContent;

                // find related label (or h2)
                let toolTipContainer:HTMLLabelElement|HTMLHeadingElement|null = descField.parentElement!.querySelector<HTMLLabelElement>("label");
                let containerIsLabel = true;
                
                if(!toolTipContainer) {
                    toolTipContainer = descField.parentElement!.querySelector<HTMLHeadingElement>("div h2");
                    containerIsLabel = false;
                    // throw new Error("Description Field does not have associated label");
                }
                
                // make tooltip icon
                const icon = document.createElement("span");
                icon.className = "tooltip tooltip-info tooltip-top text-info cursor-help";
                if(containerIsLabel) {
                    icon.className += " text-2xl";
                }
                icon.setAttribute("data-tip", descriptionText);
                icon.innerText = "ℹ️"; //information emoji
                
                toolTipContainer!.prepend(icon);
                
                descField.style.display = "none";
                descField.dataset.tooltip = "patched";
                
                
            });
        }
        
        // run once at first
        patchToolTips();
        
        const observer = new MutationObserver(patchToolTips);
        observer.observe(form, {
            childList: true,
            subtree: true
        });
        
        return () => observer.disconnect();
    }, []);
    
    return null;
}

export default ToolTipPatcher;