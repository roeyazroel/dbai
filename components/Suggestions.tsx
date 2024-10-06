import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Lightbulb } from "lucide-react";
import React from "react";

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  toggleSuggestions: () => void;
  isInline?: boolean;
}

export const Suggestions: React.FC<SuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  toggleSuggestions,
  isInline = false,
}) => {
  if (isInline) {
    return (
      <div className="p-4 space-y-2">
        <p className="text-sm text-gray-500">
          Explore these suggested queries:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="mb-[1px]"
          onClick={toggleSuggestions}
        >
          <Lightbulb className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {suggestions.map((suggestion, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
