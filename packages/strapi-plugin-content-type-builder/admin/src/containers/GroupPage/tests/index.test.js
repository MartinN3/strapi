import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { shallow } from 'enzyme';

import mountWithIntl from 'testUtils/mountWithIntl';
import formatMessagesWithPluginId from 'testUtils/formatMessages';

import { EmptyAttributesBlock } from 'strapi-helper-plugin';

import pluginId from '../../../pluginId';
import pluginTradsEn from '../../../translations/en.json';

import MenuContext from '../../MenuContext';

import { GroupPage, mapDispatchToProps } from '../index';

const messages = formatMessagesWithPluginId(pluginId, pluginTradsEn);

const context = { emitEvent: jest.fn() };
const renderComponent = (props = {}) => {
  const menuContext = {
    canOpenModal: true,
    groups: [],
    models: [],
    push: jest.fn(),
  };
  return mountWithIntl(
    <BrowserRouter>
      <MenuContext.Provider value={menuContext}>
        <GroupPage {...props} />
      </MenuContext.Provider>
    </BrowserRouter>,
    messages,
    context
  );
};

const basePath = '/plugins/content-type-builder/groups';
const props = {
  deleteGroupAttribute: jest.fn(),
  groups: [
    {
      icon: 'fa-cube',
      name: 'tests',
      description: '',
      fields: 2,
      source: 'users-permissions',
      isTemporary: false,
    },
  ],
  history: {
    push: jest.fn(),
  },
  initialDataGroup: {
    tests: {
      uid: 'tests',
      name: 'Tests',
      source: null,
      schema: {
        connection: 'default',
        collectionName: 'tests',
        description: 'tests description',
        attributes: [
          {
            name: 'name',
            type: 'string',
            required: true,
          },
          {
            name: 'quantity',
            type: 'float',
            required: true,
          },
        ],
      },
    },
  },
  location: {
    search: '',
    pathname: `${basePath}/tests`,
  },
  modifiedDataGroup: {
    tests: {
      uid: 'tests',
      name: 'Tests',
      source: null,
      schema: {
        connection: 'default',
        collectionName: 'tests',
        description: 'tests description',
        attributes: [
          {
            name: 'name',
            type: 'string',
            required: true,
          },
          {
            name: 'quantity',
            type: 'float',
            required: true,
          },
        ],
      },
    },
  },
  match: {
    params: {
      groupName: 'tests',
    },
  },
  newGroup: {
    collectionName: '',
    connection: '',
    description: '',
    name: '',
    attributes: [],
  },
};

describe('CTB <GroupPage />', () => {
  it('should not crash', () => {
    shallow(<GroupPage {...props} />);
  });

  describe('CTB <GroupPage /> render', () => {
    it("should display the EmptyAttributeBlock if the group's attributes are empty", () => {
      props.initialDataGroup.tests.schema.attributes = {};
      props.modifiedDataGroup.tests.schema.attributes = {};

      const wrapper = shallow(<GroupPage {...props} />);

      expect(wrapper.find(EmptyAttributesBlock)).toHaveLength(1);
    });
  });

  describe('GetFeatureHeaderDescription', () => {
    it("should return the group's description field", () => {
      const { getFeatureHeaderDescription } = shallow(
        <GroupPage {...props} />
      ).instance();

      expect(getFeatureHeaderDescription()).toEqual('tests description');
    });
  });

  describe('GetFeature', () => {
    it('should return the correct group', () => {
      const { getFeature } = shallow(<GroupPage {...props} />).instance();

      expect(getFeature()).toEqual(props.modifiedDataGroup.tests);
    });
    it('should return newGroup if isTemporary is true', () => {
      props.groups.find(item => item.name == 'tests').isTemporary = true;

      const { getFeature } = shallow(<GroupPage {...props} />).instance();

      expect(getFeature()).toEqual(props.newGroup);
    });
  });

  describe('GetFeatureName', () => {
    it("should return the group's name", () => {
      const { getFeatureName } = shallow(<GroupPage {...props} />).instance();

      expect(getFeatureName()).toEqual('tests');
    });
  });

  describe('HandleGoBack', () => {
    it('should go to previous page', () => {
      const { handleGoBack } = shallow(<GroupPage {...props} />).instance();
      handleGoBack();

      expect(props.history.push).toHaveBeenCalledWith(
        '/plugins/content-type-builder/groups'
      );
    });
  });
});

describe('CTB <GroupPage />, mapDispatchToProps', () => {
  it('should be injected', () => {
    const dispatch = jest.fn();
    const result = mapDispatchToProps(dispatch);

    expect(result.deleteGroupAttribute).toBeDefined();
  });

  describe('DeleteGroupAttribute', () => {
    let topCompo;

    afterEach(() => {
      topCompo.unmount();
    });

    describe('ToggleModalWarning', () => {
      topCompo = renderComponent(props);

      const wrapper = topCompo.find(GroupPage);

      expect(wrapper.state()).toEqual({
        showWarning: false,
        attrToDelete: null,
      });

      const { toggleModalWarning } = wrapper.instance();

      toggleModalWarning();

      expect(wrapper.state()).toEqual({
        showWarning: true,
        attrToDelete: null,
      });
    });

    describe('DeleteGroupAttribute', () => {
      it('should display a notification if thee modal cannot be opened', async () => {
        props.groups.find(item => item.name == 'tests').isTemporary = false;
        props.canOpenModal = false;

        topCompo = renderComponent(props);

        const wrapper = topCompo.find(GroupPage);
        const spyOnDisplayNotification = jest.spyOn(
          wrapper.instance(),
          'displayNotificationCTNotSaved'
        );
        const { handleClickOnTrashIcon } = wrapper.instance();

        handleClickOnTrashIcon(0);

        expect(context.emitEvent).not.toHaveBeenCalled();
        expect(spyOnDisplayNotification).toHaveBeenCalled();
      });

      it('should call deleteGroupAttribute with modifiedDataGroup path when isTemporary is false', () => {
        props.groups.find(item => item.name == 'tests').isTemporary = false;
        props.canOpenModal = true;

        topCompo = renderComponent(props);

        const wrapper = topCompo.find(GroupPage);
        const {
          handleClickOnTrashIcon,
          handleDeleteAttribute,
        } = wrapper.instance();

        handleClickOnTrashIcon(0);
        expect(wrapper.state()).toEqual({
          attrToDelete: 0,
          showWarning: true,
        });
        handleDeleteAttribute();

        const keys = ['modifiedDataGroup', 'tests', 'schema', 'attributes', 0];
        expect(props.deleteGroupAttribute).toHaveBeenCalledWith(keys);
        expect(context.emitEvent).toHaveBeenCalledWith(
          'willDeleteFieldOfContentType'
        );
      });
      it('should call deleteGroupAttribute with newGroup path when isTemporary is true', () => {
        props.groups.find(item => item.name == 'tests').isTemporary = true;
        props.canOpenModal = true;

        topCompo = renderComponent(props);

        const wrapper = topCompo.find(GroupPage);
        const {
          handleClickOnTrashIcon,
          handleDeleteAttribute,
        } = wrapper.instance();

        handleClickOnTrashIcon(0);
        handleDeleteAttribute();

        const keys = ['newGroup', 'schema', 'attributes', 0];
        expect(props.deleteGroupAttribute).toHaveBeenCalledWith(keys);
        expect(context.emitEvent).toHaveBeenCalledWith(
          'willDeleteFieldOfContentType'
        );
      });
    });
  });
});