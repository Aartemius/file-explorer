import { FC } from "react";
import foldersStore, { Node } from "../store/FoldersStore";
import { toJS } from "mobx";
import { toggleChildrenVisibility, removeNodeById } from "../utils/folders";
import styles from './TreeNode.module.scss';

interface TreeNodeProps {
  node: Node;
  depth: number;
}

const TreeNode: FC<TreeNodeProps> = ({
  node,
  depth
}) => {
  const { folders, setFolders } = toJS(foldersStore);
  const paddingLeft = `${1 + depth}rem`;
  const isChildrenVisible = (node: Node) => node.children?.some((child: Node) => child.isShown)
  
  return (
    <>
      { node.isShown &&
        <div className={ `${styles.treeNodeWrap} treeNodeWrap` }>
          <div 
            onClick={ () => {
              if (node.type !== 'file' && node.children) {
                setFolders(toggleChildrenVisibility(folders, node.id))
              }
            } }
            style={{
              display: 'flex',
              padding: '.25rem',
              fontWeight: node.type === 'folder' ? 500 : undefined,
              cursor: node.children ? 'pointer' : undefined,
              paddingLeft
            }}
          >
            <span>{ node.title }</span>
            {node.children && node.type === 'folder' &&
              <img
                src="images/expand-arrow.svg"
                alt="expand folders"
                style={{ transform: isChildrenVisible(node) ? 'rotate(180deg)' : undefined }}
              /> 
            }
            <img
              src="images/delete-icon.svg"
              alt="delete item"
              className={ styles.deleteIcon }
              onClick={ (e) => {
                e.stopPropagation();
                setFolders(removeNodeById(folders, node.id));
              } }
            /> 
          </div>
          {node.children?.map((child: Node, index: number) => {
            if (child.isShown) {

              return (
                <TreeNode
                  key={ index }
                  node={ child }
                  depth={ depth + 1 }
                />
              )
            }

            return null;
          })}

        </div>
      }
    </>
  );
}

export default TreeNode;


