/**
 *
 * EditForm
 *
 */

import React, {
  useState,
  //useEffect,
  //useMemo
} from 'react';
import PropTypes from 'prop-types';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Sortly, { ContextProvider, remove, add } from 'react-sortly';
import { Wrapper, Item } from './Wrapper';
import update from 'immutability-helper';
import { Button } from 'strapi-helper-plugin';
//import useAxios from 'axios-hooks'
import nanoid from 'nanoid';

const EditForm = props => {
  const { modifiedData } = props;
  console.group('EditForm');
  console.log('modifiedData:', modifiedData);
  console.groupEnd();
  const [selectedMenu] = useState('nb12jlb4');
  //const [sourceItems, setSourceItems] = React.useState([]);

  //const sourceSettings = useMemo(() => setSourceItems(convert(remapSortlyInput(modifiedData))), [])

  //useEffect(() => {
  //  const sortlyOutput = flatten(sourceItems)
  //
  //  const databaseInput = remapSortlyOutput(sortlyOutput, currentlyEditedMenu)
  //
  //  props.onChange(databaseInput);
  //
  //}, [sourceItems, props.onChange]);
  //const [configKeys, setConfigKeys] = React.useState([])
  //const [selectedMenuKey, setSelectedMenuKey] = React.useState()
  //
  //const [checked, setChecked] = useState([])
  //const [{ data: sourceData, loading, error }] = useAxios(
  //  'http://localhost:1337/categories'
  //)
  //
  //if (loading) return <p>Loading...</p>
  //if (error) return <p>Error!</p>
  //
  //const handleClone = (e) => {
  //  e.preventDefault()
  //  setSourceItems(prevItems => {
  //    return prevItems.concat(mapDepth(checked.map(item => sourceData[item])))
  //  })
  //  setChecked([])
  //}
  //
  //const handleCheck = (index) => {
  //  const checkedItems = new Set(checked)
  //
  //  if ( checkedItems.has(index) ) {
  //    checkedItems.delete(index)
  //  } else {
  //    checkedItems.add(index)
  //  }
  //
  //  setChecked(Array.from(checkedItems))
  //}

  return (
    <Wrapper>
      <div className="row">
        {/* <div className="col-xs-12" style={{ marginBottom: '30px' }}>
          <Input
            customBootstrapClass="col-md-6"
            inputDescription={{
              id: 'email.EditForm.Input.select.inputDescription',
            }}
            inputClassName="inputStyle"
            label={{ id: 'email.EditForm.Input.select.label' }}
            name="menus"
            onChange={this.props.onChange}
            selectOptions={this.generateSelectOptions()}
            type="select"
            value={get(this.props.modifiedData, 'menus')}
          />
        </div> */}
        {/* <div className="col-xs-12 col-md-6">
          {sourceData.map((item, index) => (
            <label key={index}>
              <input
                checked={checked.find(item => item === index)}
                value={checked.find(item => item === index)}
                onChange={() => handleCheck(index)} type="checkbox"
              />
              {item.name}
            </label>
          ))}
          <button onClick={handleClone}>Vložit do menu</button>
        </div> */}
        <div className="col-xs-12 col-md-6">
          {/* <select onChange={e => {
          const keyOfCurrentlySelectedMenu = e.target.value
          setSourceItems(props.settings[keyOfCurrentlySelectedMenu] || [])
          setSelectedMenuKey(keyOfCurrentlySelectedMenu)
        }}>
          {configKeys && configKeys > 0 && configKeys.map(item => <option key={item} value={item}>{item}</option>)}
        </select>
        <button onClick={e => {
          e.preventDefault()
          setConfigKeys(prevState => prevState.concat(`menu-${nanoid(6)}`))
        }}>Add menu</button> 
          <h2>{selectedMenuKey}</h2>*/}
          <DndProvider backend={HTML5Backend}>
            <ContextProvider>
              <MySortableTree
                // sourceItems={[sourceItems, setSourceItems]}
                {...{ selectedMenu }}
                {...props}
              />
            </ContextProvider>
          </DndProvider>
        </div>
      </div>
    </Wrapper>
  );
};

EditForm.defaultProps = {
  modifiedData: [],
};

EditForm.propTypes = {
  didCheckErrors: PropTypes.bool.isRequired,
  formErrors: PropTypes.array.isRequired,
  modifiedData: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default EditForm;

const MySortableTree = ({
  onChange,
  // sourceItems,
  selectedMenu,
  modifiedData,
}) => {
  //const [items, setItems] = sourceItems

  const handleChange = newItems => {
    //setItems(newItems);
    onChange(newItems);
  };

  const handleChangeRow = (id, target) => {
    //const index = items.findIndex(item => item.id === id);
    const index = modifiedData.findIndex(item => item.id === id);
    const { name, value } = target;
    //setItems(
    //  update(items, {
    //    [index]: { [name]: { $set: value } },
    //  })
    //);
    onChange(
      update(modifiedData, {
        [index]: { [name]: { $set: value } },
      })
    );
  };

  const handleDelete = id => {
    //const index = items.findIndex(item => item.id === id);
    const index = modifiedData.findIndex(item => item.id === id);
    //setItems(remove(items, index));
    onChange(remove(modifiedData, index));
  };

  const handleClickAdd = () => {
    //setItems(
    //  add(items, {
    //    id: nanoid(8),
    //    name: '',
    //  })
    //);
    onChange(
      add(modifiedData, {
        id: nanoid(8),
        name: '',
        menu_uuid: selectedMenu,
      })
    );
  };

  return (
    <>
      <Sortly
        items={modifiedData}
        id={selectedMenu}
        name={selectedMenu}
        onChange={handleChange}
      >
        {props => (
          <ItemRenderer {...{ handleDelete, handleChangeRow }} {...props} />
        )}
      </Sortly>
      <Button variant="outlined" onClick={handleClickAdd}>
        Add New Item
      </Button>
    </>
  );
};

MySortableTree.defaultProps = {
  modifiedData: [],
};

MySortableTree.propTypes = {
  didCheckErrors: PropTypes.bool.isRequired,
  formErrors: PropTypes.array.isRequired,
  modifiedData: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  selectedMenu: PropTypes.string.isRequired,
};

const ItemRenderer = props => {
  const {
    data: { id, name, depth },
    drag,
    drop,
    handleDelete,
    handleChangeRow,
  } = props;

  const ref = React.useRef(null);

  drag(drop(ref));

  const handleChangeInput = e => {
    e.preventDefault();
    const { target } = e;
    handleChangeRow(id, target);
  };

  return (
    <Item ref={ref} style={{ marginLeft: depth * 20 }} key={id}>
      <input value={name} name="name" onChange={handleChangeInput} />
      <Button onClick={() => handleDelete(id)}>X</Button>
    </Item>
  );
};

ItemRenderer.propTypes = {
  data: PropTypes.object.isRequired,
  drag: PropTypes.func.isRequired,
  drop: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleChangeRow: PropTypes.func.isRequired,
};
