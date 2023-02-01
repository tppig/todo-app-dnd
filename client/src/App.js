import 'font-awesome/css/font-awesome.min.css';
import './styles.css';

import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { StrictModeDroppable } from './StrictModeDroppable.tsx';

const backend_url = 'http://localhost:3001'

function App() {
  return (
    <Container>
      <Row>
        <Col md={{ offset: 3, span: 6 }}>
          <TodoListCard />
        </Col>
      </Row>
    </Container>
  );
}

const ItemList = styled.div``;

function TodoListCard() {

  const [items, setItems] = React.useState(null);

  React.useEffect(() => {
    fetch(backend_url + '/items')
      .then(r => r.json())
      .then(setItems);
  }, []);

  // 让子组件只有在items发生改变时才重新渲染
  const onNewItem = React.useCallback(
    newItem => {
      setItems([...items, newItem]);
    },
    [items],
  );

  const onItemUpdate = React.useCallback(
    // 函数：找到item，更新item
    item => {
      const index = items.findIndex(i => i.id === item.id);
      setItems([
        ...items.slice(0, index),
        item,
        ...items.slice(index + 1),
      ]);
    },
    [items],
  );

  const onItemRemoval = React.useCallback(
    // 函数：找到item，删除item
    item => {
      const index = items.findIndex(i => i.id === item.id);
      const newItems = [...items.slice(0, index), ...items.slice(index + 1)];
      setItems(newItems.map(i => Object.assign({}, i, {pos: (i.pos > item.pos ? i.pos - 1 : i.pos)})));
    },
    [items],
  );

  if (items === null) return 'Loading...';

  const onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    fetch(backend_url + '/itemsUpdateOrder', {
      method: 'POST',
      body: JSON.stringify({ itemId: draggableId, src: source.index, dest: destination.index }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(setItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <React.Fragment>
        <AddItemForm onNewItem={onNewItem} pos={items.length} />
        {items.length === 0 && (
          <p className="text-center">You have no todo items yet! Add one above!</p>
        )}
        <StrictModeDroppable droppableId='0'>
          {
            (provided) => (
              <ItemList
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {
                  [...Array(items.length).keys()].map((index) => {
                    const item = items[items.findIndex(i => i.pos === index)];
                    return (
                      <ItemDisplay
                        key={item.id}
                        item={item}
                        index={index}
                        onItemUpdate={onItemUpdate}
                        onItemRemoval={onItemRemoval}
                      />
                    );
                  })}
                {provided.placeholder}
              </ItemList>
            )
          }
        </StrictModeDroppable>
      </React.Fragment>
    </DragDropContext>
  );
}

function AddItemForm({ onNewItem, pos }) {

  const [newItem, setNewItem] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const submitNewItem = e => {
    e.preventDefault();
    setSubmitting(true);
    fetch(backend_url + '/items', {
      method: 'POST',
      body: JSON.stringify({ name: newItem, pos: pos }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(item => {
        onNewItem(item);
        setSubmitting(false);
        setNewItem('');
      });
  };

  return (
    <Form onSubmit={submitNewItem}>
      <InputGroup className="mb-3">
        <Form.Control
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          type="text"
          placeholder="New Item"
          aria-describedby="basic-addon1"
        />
        <Button
          type="submit"
          variant="success"
          disabled={!newItem.length}
          className={submitting ? 'disabled' : ''}
        >
          {submitting ? 'Adding...' : 'Add'}
        </Button>
      </InputGroup>
    </Form>
  );
}

function ItemDisplay({ item, index, onItemUpdate, onItemRemoval }) {

  const toggleCompletion = () => {
    fetch(backend_url + `/items/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: item.name,
        completed: !item.completed,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(onItemUpdate);
  };

  const removeItem = () => {
    fetch(backend_url + `/items/${item.id}`, { method: 'DELETE' }).then(() =>
      onItemRemoval(item),
    );
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {
        (provided) => (
          <Container fluid className={`item ${item.completed && 'completed'}`}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <Row>
              <Col xs={1} className="text-center">
                <Button
                  className="toggles"
                  size="sm"
                  variant="link"
                  onClick={toggleCompletion}
                  aria-label={
                    item.completed
                      ? 'Mark item as incomplete'
                      : 'Mark item as complete'
                  }
                >
                  <i
                    className={`fa ${item.completed ? 'fa-check-square-o' : 'fa-square-o'
                      }`}
                  />
                </Button>
              </Col>
              <Col xs={10} className="name">
                {item.name}
              </Col>
              <Col xs={1} className="text-center remove">
                <Button
                  size="sm"
                  variant="link"
                  onClick={removeItem}
                  aria-label="Remove Item"
                >
                  <i className="fa fa-trash text-danger" />
                </Button>
              </Col>
            </Row>
          </Container>
        )
      }
    </Draggable>

  );
}

export default App;
