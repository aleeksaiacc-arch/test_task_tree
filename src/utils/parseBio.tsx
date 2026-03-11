import { Link as ChakraLink } from "@chakra-ui/react";
import type { ReactNode } from "react";

const LINK_RE = /<<(.+?)\s*\|\|\s*(.+?)>>/g;

export function parseBio(text: string): ReactNode[] {
  const result: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, url] = match;
    const index = match.index!;

    if (index > lastIndex) {
      result.push(text.slice(lastIndex, index));
    }

    result.push(
      <ChakraLink
        key={index}
        href={url.trim()}
        target="_blank"
        rel="noopener noreferrer"
        color="blue.500"
        textDecoration="underline"
      >
        {label.trim()}
      </ChakraLink>,
    );

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}
