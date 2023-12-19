import { useEffect, useLayoutEffect, useState } from "react";
import TreeNode from "./TreeNode";
import { observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import foldersStore, { Node } from "../store/FoldersStore";
import { setVisibilityByTitle } from "../utils/folders";
import styles from './Tree.module.scss';

const Tree = observer(() => {
  const { 
    folders, 
    setFolders, 
    isLoading, 
    setInitialFolders 
  } = toJS(foldersStore);
  const [searchQuery, setSearchQuery] = useState("");
  const [areTreeNodesRendered, setAreTreeNodesRendered] = useState(false);

  useEffect(() => {
    if (searchQuery) {
      setFolders(setVisibilityByTitle(folders, searchQuery));
    } else {
      setInitialFolders(folders);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  useLayoutEffect(() => {
    const treeNodes = document.querySelectorAll(".treeNodeWrap");
    setAreTreeNodesRendered(treeNodes.length > 0);
  }, [folders]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search folders and files"
        value={ searchQuery }
        onChange={ e => setSearchQuery(e.target.value) }
        className={ styles.searchInput }
      />
      { isLoading && <div className={ styles.loader }>Loading...</div> }

      <div
        className={ styles.foldersContainer }
      >
      { !areTreeNodesRendered && <div>No items found</div> }
      { folders && folders.map((node: Node, index: number) => (
        <TreeNode
          key={ index + Date.now() }
          node={ node }
          depth={ 0 }
        />
      )) }
      
      </div>
    </div>
  );
});

export default Tree;