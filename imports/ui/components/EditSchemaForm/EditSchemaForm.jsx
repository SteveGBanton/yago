import React from 'react';
import PropTypes from 'prop-types';
import Loading from '../Loading/Loading';
import { Random } from 'meteor/random';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './EditSchemaForm.scss'

const styles = {

};

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `Form Field ${k}`,
  }));

const getItems2 = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item2-${k}`,
    content: `item2 ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// using some little inline style helpers to make the app look okay

const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  margin: 6,
  padding: 12,
  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'lightgrey',
  // styles we need to apply on draggables
  ...draggableStyle,
});

export default class EditSchemaForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      droppable: getItems(10),
      droppable2: getItems2(5),
      droppable3: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentWillMount() {

  }

  handleSubmit() {

  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    console.log(result);

    if (result.source.droppableId === result.destination.droppableId) {
      // reorder the same source.

      const items = reorder(
        this.state[result.source.droppableId],
        result.source.index,
        result.destination.index
      );

      this.setState({
        [result.source.droppableId]: [...items]
      });
    } else if (result.destination.droppableId === 'droppable3') {

      // Original Droppable state doesn't have item removed. Added to droppable 3.

      const getNewLists = () => {
        const removedResult = [...this.state[result.source.droppableId]]
        const addedResult = [...this.state[result.destination.droppableId]]

        const [removedItem] = removedResult.splice(result.source.index, 1)
        const newItem = { ...removedItem };
        newItem.id = `${newItem.id}-${Random.id(5)}`
        addedResult.splice(result.destination.index, 0, newItem)
        return {
          removedResult,
          addedResult
        }
      }

      this.setState({
        [result.destination.droppableId]: [...getNewLists().addedResult]
      });

    } else if (result.source.droppableId === 'droppable3') {

      // Cannot drag from droppable3 right now, no change.

    } else {
      const getNewLists = () => {
        const removedResult = [...this.state[result.source.droppableId]]
        const addedResult = [...this.state[result.destination.droppableId]]

        const [removedItem] = removedResult.splice(result.source.index, 1)
        addedResult.splice(result.destination.index, 0, removedItem)
        return {
          removedResult,
          addedResult
        }
      }

      this.setState({
        [result.source.droppableId]: [...getNewLists().removedResult],
        [result.destination.droppableId]: [...getNewLists().addedResult]
      });

    }

  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="edit-schema-form">

            <Droppable droppableId="droppable" className="edit-schema-form-left">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className="tableComponentsList"
                >
                  {this.state.droppable.map(item => (
                    <Draggable key={item.id} draggableId={item.id}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={getItemStyle(
                              provided.draggableStyle,
                              snapshot.isDragging
                            )}
                            className="draggableComponents"
                            {...provided.dragHandleProps}
                          >
                            {item.content}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId="droppable3" className="edit-schema-form-right">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={(snapshot.isDraggingOver) ? "innerDroppable-hover" : "innerDroppable"}
                >
                  {this.state.droppable3.map(item => (
                    <Draggable key={item.id} draggableId={item.id}>
                      {(provided, snapshot) => (
                        <div>
                          <div
                            ref={provided.innerRef}
                            style={getItemStyle(
                              provided.draggableStyle,
                              snapshot.isDragging,
                            )}
                            className="droppedComponents"
                            {...provided.dragHandleProps}
                          >
                            {item.content}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
      </div>
      </DragDropContext>
    );
  }
}

EditSchemaForm.defaultProps = {
  form: {},
};

EditSchemaForm.propTypes = {
  form: PropTypes.object,
};
