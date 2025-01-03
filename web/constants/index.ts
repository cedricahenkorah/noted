import {
  Home,
  Notebook,
  NotebookPen,
  LayoutTemplate,
  Tags,
  Users,
  Trash,
  Archive,
  Star,
} from "lucide-react";

export const sideMenuItems = [
  {
    title: "Home",
    url: "/dashboard/",
    icon: Home,
  },
  {
    title: "Notes",
    url: "/dashboard/notes/",
    icon: NotebookPen,
  },
  {
    title: "Notebooks",
    url: "#",
    icon: Notebook,
  },
  {
    title: "Templates",
    url: "#",
    icon: LayoutTemplate,
  },
  {
    title: "Tags",
    url: "#",
    icon: Tags,
  },
  {
    title: "Shared with Me",
    url: "#",
    icon: Users,
  },
  {
    title: "Trash",
    url: "#",
    icon: Trash,
  },
  {
    title: "Archive",
    url: "#",
    icon: Archive,
  },
  {
    title: "Starred",
    url: "#",
    icon: Star,
  },
];