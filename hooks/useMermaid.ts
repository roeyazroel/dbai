import { useCallback, useRef } from 'react';

export function useMermaid() {
  const mermaidInitialized = useRef(false);

  const initializeMermaid = useCallback(() => {
    if (typeof window !== "undefined" && !mermaidInitialized.current) {
      import("mermaid").then((mermaid) => {
        mermaid.default.initialize({ startOnLoad: true });
        mermaidInitialized.current = true;
      });
    }
  }, []);

  const runMermaid = useCallback(() => {
    if (typeof window !== "undefined" && mermaidInitialized.current) {
      import("mermaid").then((mermaid) => {
        mermaid.default.run();
      });
    }
  }, []);

  return { initializeMermaid, runMermaid };
}
