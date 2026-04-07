import { useNavigate } from "react-router-dom";
import { Cpu, ScrollText, Search, BookmarkIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const CATEGORIES = [
  { name: "technology", label: "Technology", icon: Cpu },
  { name: "history", label: "History", icon: ScrollText },
  { name: "mystery", label: "Mystery", icon: Search },
];

const BrowseDropdownMenu = ({ buttonVariant = "outline", buttonSize = "sm", className = "" }) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={buttonVariant}
          size={buttonSize}
          className={className || "rounded-full px-3"}
        >
          Browse
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={6}>
        {CATEGORIES.map((category) => (
          <DropdownMenuItem
            key={category.name}
            onSelect={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
          >
            <category.icon />
            {category.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => navigate("/favorites")}>
          <BookmarkIcon />
          Bookmarks
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BrowseDropdownMenu;
