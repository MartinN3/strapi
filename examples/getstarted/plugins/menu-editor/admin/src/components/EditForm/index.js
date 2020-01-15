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
import { Button, InputCheckbox } from 'strapi-helper-plugin';
import useAxios from 'axios-hooks';
import nanoid from 'nanoid/non-secure';
import { FormattedMessage } from 'react-intl';

const EditForm = props => {
  const {
    initialData,
    modifiedData,
    currentMenu,
    onChange,
    modifiedMenusList,
  } = props;
  const [checked, setChecked] = useState([]);

  return (
    <Wrapper>
      <div className="row">
        <div className="col-xs-12">
          <select
            disabled={modifiedData !== initialData}
            onChange={e => {
              if (modifiedData !== initialData) {
                return;
              }
              const { value } = e.target;
              onChange('currentMenu', value || null);
            }}
            value={currentMenu}
          >
            <FormattedMessage id={'menu-editor.EditForm.chooseMenu'}>
              {message => <option value={''}>{message}</option>}
            </FormattedMessage>
            {modifiedMenusList.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button
            kind="secondary"
            disabled={modifiedData !== initialData}
            onClick={e => {
              e.preventDefault();

              if (modifiedData !== initialData) {
                return;
              }

              const newMenuId = nanoid(6);
              onChange('modifiedMenusList', [...modifiedMenusList, newMenuId]);
              onChange('currentMenu', newMenuId);
            }}
          >
            <FormattedMessage id={'menu-editor.EditForm.addNewMenu'} />
          </Button>
        </div>
      </div>
      {currentMenu !== '' && currentMenu !== null && (
        <div className="row">
          <div className="col-xs-12 col-md-6">
            <SourceData {...{ checked, setChecked }} {...props} />
          </div>
          <div className="col-xs-12 col-md-6">
            <h2>{currentMenu}</h2>
            <DndProvider backend={HTML5Backend}>
              <ContextProvider>
                <MySortableTree {...{ currentMenu }} {...props} />
              </ContextProvider>
            </DndProvider>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

EditForm.defaultProps = {
  initialData: [],
  modifiedData: [],
  modifiedMenusList: [],
};

EditForm.propTypes = {
  didCheckErrors: PropTypes.bool.isRequired,
  formErrors: PropTypes.array.isRequired,
  initialData: PropTypes.array,
  modifiedData: PropTypes.array,
  modifiedMenusList: PropTypes.array,
  currentMenu: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default EditForm;

const SourceData = props => {
  const [{ data: sourceData, loading, error }] = useAxios(
    'http://localhost:1337/categories'
  );
  const { onChange, modifiedData, checked, setChecked, currentMenu } = props;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  const handleCheck = index => {
    const checkedItems = new Set(checked);

    if (checkedItems.has(index)) {
      checkedItems.delete(index);
    } else {
      checkedItems.add(index);
    }

    setChecked(Array.from(checkedItems));
  };

  const handleClickAdd = () => {
    const newItem = checked.map(itemIndex => ({
      id: nanoid(10),
      name: sourceData[itemIndex] && sourceData[itemIndex].name,
      menu_uuid: currentMenu,
    }));

    onChange('modifiedData', add(modifiedData, newItem));

    setChecked([]);
  };

  return (
    <>
      <div className="row">
        {sourceData.map((item, index) => (
          <InputCheckbox
            key={index}
            checked={checked.find(item => item === index)}
            value={checked.find(item => item === index)}
            onChange={() => handleCheck(index)}
            message={item.name}
            //message="Check me"
            //name="checkbox"
            //onChange={({ target }) => setValue(target.value)}
            //value={value}
          />
        ))}
      </div>
      <div className="row">
        <Button kind="secondary" onClick={handleClickAdd}>
          <FormattedMessage id={'menu-editor.EditForm.add'} />
        </Button>
      </div>
    </>
  );
};

SourceData.propTypes = {
  modifiedData: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  currentMenu: PropTypes.string.isRequired,
  checked: PropTypes.array.isRequired,
  setChecked: PropTypes.func.isRequired,
};

const MySortableTree = ({ onChange, currentMenu, modifiedData }) => {
  const handleChangeRow = (id, target) => {
    const index = modifiedData.findIndex(item => item.id === id);
    const { name, value } = target;
    onChange(
      'modifiedData',
      update(modifiedData, {
        [index]: { [name]: { $set: value } },
      })
    );
  };

  const handleDelete = id => {
    const index = modifiedData.findIndex(item => item.id === id);
    onChange('modifiedData', remove(modifiedData, index));
  };

  const handleClickAdd = () => {
    onChange(
      'modifiedData',
      add(modifiedData, {
        id: nanoid(8),
        name: '',
        menu_uuid: currentMenu,
      })
    );
  };

  return (
    <>
      <div className="row">
        <Sortly
          items={modifiedData}
          id={currentMenu}
          name={currentMenu}
          onChange={values => onChange('modifiedData', values)}
        >
          {props => (
            <ItemRenderer {...{ handleDelete, handleChangeRow }} {...props} />
          )}
        </Sortly>
      </div>
      <div className="row">
        <Button kind="secondary" onClick={handleClickAdd}>
          <FormattedMessage id={'menu-editor.EditForm.add'} />
        </Button>
      </div>
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
  currentMenu: PropTypes.string.isRequired,
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
      {/* InputText prop `name` sets ID and NAME without possibility to override it */}
      <input value={name} name="name" onChange={handleChangeInput} />
      <Button kind="secondary" onClick={() => handleDelete(id)}>
        {''}
        <FormattedMessage id={'menu-editor.EditForm.remove'} />
      </Button>
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
