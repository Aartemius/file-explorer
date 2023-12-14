import { useEffect, useState } from "react";
import TreeNode from "./TreeNode";
import { observer } from "mobx-react-lite";
import { toJS } from 'mobx';
import foldersStore, { Node } from "../store/FoldersStore";
import { setVisibilityByTitle } from "../utils/folders";

const Tree = observer(() => {
  const { folders, setFolders, isLoading } = toJS(foldersStore);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery) {
      setFolders(setVisibilityByTitle(folders, searchQuery))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search folders"
        value={ searchQuery }
        onChange={ e => setSearchQuery(e.target.value) }
        style={{ marginBottom: '2rem' }}
      />
      { isLoading && <div>Loading...</div> }
      { folders && 
        <div
          style={{
            maxWidth: '350px',
            boxSizing: 'border-box',
            padding: '1rem',
            margin: '0 auto',
            border: '1px solid #000'
          }}
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