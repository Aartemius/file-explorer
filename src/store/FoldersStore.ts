import { makeAutoObservable } from 'mobx';

export interface Node {
  id: number;
  type: "folder" | "file";
  title: string;
  children?: Node[];
  isShown: boolean;
}

class FoldersStore {
  folders: Node[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    this.fetchInitialFolders();
  }

  private setShownRecursively(node: Node, isTopLevel: boolean) {
    node.isShown = isTopLevel;
    if (node.children) {
      node.children.forEach(child => this.setShownRecursively(child, false));
    }
  }

  setFolders = (folders: Node[]) => {
    this.folders = folders;
  }

  setInitialFolders = (folders: Node[]) => {
    folders.forEach(folder => this.setShownRecursively(folder, true));
    this.folders = folders;
  }

  fetchInitialFolders = async () => {
    try {
      this.isLoading = true;
      const response = await fetch('foldersData/foldersData.json');
      const result = await response.json();
      this.setInitialFolders(result);
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
}

const foldersStore = new FoldersStore();
export default foldersStore;
