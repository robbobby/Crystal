export type MirMenuItemDefinition =
  | { label: string; children: MirMenuItemDefinition[] }
  | { label: string; action: () => void };

export namespace MirMenuItemDefinition {
  export function isParent(
    menu: MirMenuItemDefinition,
  ): menu is { label: string; children: MirMenuItemDefinition[] } {
    return "children" in menu && Array.isArray(menu.children);
  }
}
