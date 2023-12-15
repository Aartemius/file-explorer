import { useEffect, useState } from "react";
import TreeNode from "./TreeNode";
import { observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import foldersStore, { Node } from "../store/FoldersStore";
import { setVisibilityByTitle } from "../utils/folders";
import styles from './Tree.module.scss';

const Tree = observer(() => {
  const { folders, setFolders, isLoading, fetchInitialFolders } = toJS(foldersStore);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery) {
      setFolders(setVisibilityByTitle(folders, searchQuery));
    } else {
      fetchInitialFolders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

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
      { folders &&
        <div
          className={ styles.foldersContainer }
        >
          { folders.map((node: Node, index: number) => (
            <TreeNode
              key={ index + Date.now() }
              node={ node }
              depth={ 0 }
            />
          )) }
        </div>
      }
    </div>
  );
});

export default Tree;