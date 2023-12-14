import { Node } from "../store/FoldersStore";
import { compareLowercase } from "./common";

export const toggleChildrenVisibility = (folders: Node[], targetId: number) => {
  const traverse = (node: Node) => {
    if (node.id === targetId) {
      if (node.children) {
        node.children.forEach(child => child.isShown = !child.isShown);
      }

      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        const found = traverse(child);
        if (found) {
          return true
        };
      }
    }

    return false;
  };

  for (const item of folders) {
    const found = traverse(item);
    if (found) {
      break;
    }
  }

  return folders;
};


export const removeNodeById = (data: Node[], targetId: number) => {
  const traverse = (node: Node) => {
    if (node.children) {
      node.children = node.children.filter(child => {
        const shouldKeep = traverse(child);
        return shouldKeep;
      });
    }

    return node.id !== targetId;
  };

  const filteredData = data.filter(item => {
    const shouldKeep = traverse(item);
    return shouldKeep;
  });

  return filteredData;
};


export const setVisibilityByTitle = (data: Node[], targetTitle: string) => {
  const traverse = (node: Node, isParentShown: boolean) => {
    if (compareLowercase(node.title, targetTitle)) {
      node.isShown = true;
      isParentShown = true;
    } else {
      node.isShown = isParentShown;
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child, child.isShown);
        if (
          (child.children && child.children.some(c => compareLowercase(c.title, targetTitle))) || 
          compareLowercase(child.title, targetTitle)
        ) {
          node.isShown = true;
          isParentShown = true;
        } else if (compareLowercase(node.title, targetTitle)) {
          node.isShown = false;
        }
      }
    }
  };

  data.forEach(item => {
    traverse(item, false);
  })

  return data;
};


