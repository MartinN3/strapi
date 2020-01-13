import React, { useImperativeHandle, useRef } from 'react';
import { FileLink, ActionButton, FileWrapper, File } from './components';
import { InputText } from 'strapi-helper-plugin';
import { DragSource, DropTarget } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  margin: '0.5rem 1rem',
  cursor: 'move',
};

// eslint-disable-next-line react/display-name
const FileCard = React.forwardRef(
  (
    {
      public_id,
      url,
      format,
      removeItem,
      clickItem,
      alt,
      caption,
      isDragging,
      connectDragSource,
      connectDropTarget,
      handleInputChange,
      index,
    },
    ref
  ) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    const opacity = isDragging ? 0 : 1;
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));

    return (
      <FileWrapper ref={elementRef} url={url} style={{ ...style, opacity }}>
        <FileLink href={url} target="_blank" rel="noopener noreferrer">
          <File {...{ format, url }} />
        </FileLink>
        <div
          style={{
            wordBreak: 'break-all',
            fontSize: '10px',
            lineHeight: 1,
            margin: '5px auto',
          }}
        >
          {public_id}
        </div>
        <label>
          Caption
          <InputText
            value={caption}
            id="caption"
            name="caption"
            onChange={e =>
              handleInputChange(e, index, 'context.custom.caption')
            }
          />
        </label>
        <label>
          Alt
          <InputText
            value={alt}
            id="alt"
            name="alt"
            onChange={e => handleInputChange(e, index, 'context.custom.alt')}
          />
        </label>
        <ActionButton secondary onClick={clickItem}>
          Editovat obrázek
        </ActionButton>
        <ActionButton secondary onClick={removeItem}>
          Odstranit
        </ActionButton>
      </FileWrapper>
    );
  }
);

//Copied from React DND simple example
export default DropTarget(
  'filecard',
  {
    hover(props, monitor, component) {
      if (!component) {
        return null;
      }
      // node = HTML Div element from imperative API
      const node = component.getNode();
      if (!node) {
        return null;
      }
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      props.moveItem(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
  },
  connect => ({
    connectDropTarget: connect.dropTarget(),
  })
)(
  DragSource(
    'filecard',
    {
      beginDrag: props => ({
        id: props.id,
        index: props.index,
      }),
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  )(FileCard)
);
