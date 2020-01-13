/**
 *
 * InputJSON
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { set } from 'lodash';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import FileCard from './FileCard';
import { Wrapper } from './components';
import { Button, request } from 'strapi-helper-plugin';

const settingsPluginId = 'envsettings';
const getRequestUrl = path => `/${settingsPluginId}/${path}`;

let outerExternalScriptLoaded = false;
const externalScriptLoadedEvent = new Event('loadExternalScript');
const head = document.getElementsByTagName('head')[0];
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://media-library.cloudinary.com/global/all.js';
script.onload = () => {
  document.dispatchEvent(externalScriptLoadedEvent);
};
head.appendChild(script);

document.addEventListener(
  'loadExternalScript',
  () => (outerExternalScriptLoaded = true)
);

const InputJSON = props => {
  const { onChange: propagateChangeToParent, name: inputLabel } = props;
  const [files, setFiles] = useState(props.value || []);
  const [externalScriptLoaded, setExternalScriptLoaded] = useState(
    outerExternalScriptLoaded
  );
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    button_class: 'open-btn',
    button_caption: 'Insert Images',
  });

  useEffect(() => {
    document.addEventListener(
      'loadExternalScript',
      setExternalScriptLoaded(true)
    );

    return document.removeEventListener(
      'loadExternalScript',
      setExternalScriptLoaded(true),
      true
    );
  }, []);

  useEffect(() => {
    getCloudinaryConfig();
  }, []);

  useEffect(() => {
    propagateChangeToParent({
      target: {
        name: inputLabel,
        value: JSON.stringify(files),
        type: 'json',
      },
    });
  }, [files, inputLabel, propagateChangeToParent]);

  const handleChange = newFiles =>
    setFiles(prevFiles => [...prevFiles, ...newFiles]);

  const handleCloudinaryInsert = async () => {
    try {
      window.cloudinary.openMediaLibrary(cloudinaryConfig, {
        insertHandler: data => handleChange(data.assets),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileClick = async currentImageConfig => {
    const { asset } = currentImageConfig;
    try {
      window.cloudinary.openMediaLibrary(
        { ...cloudinaryConfig, asset },
        {
          insertHandler: data => handleChange(data.assets),
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveAllFiles = e => {
    e.preventDefault();

    if (files.length === 0) {
      return;
    }

    const confirmed = window.confirm('Opravdu smazat všechny fotky?');
    if (confirmed === true) {
      setFiles([]);
    }
  };

  const handleInputChange = (e, changedIndex, propertyPath) => {
    const { value } = e.target;

    const changeObject = files[changedIndex];
    set(changeObject, propertyPath, value);

    setFiles(prevFiles => {
      const newState = Object.assign([...prevFiles], {
        [changedIndex]: { ...prevFiles[changedIndex], changeObject },
      });

      return newState;
    });
  };

  const handleFileMove = (dragIndex, dropIndex) => {
    setFiles(prevState => {
      let removedItem = prevState.splice(dragIndex, 1);
      prevState.splice(dropIndex, 0, removedItem[0]);
      return [...prevState];
    });
  };

  const handleFileRemove = removeIndex => {
    setFiles(prevState =>
      prevState.filter((item, index) => index !== removeIndex)
    );
  };

  const getCloudinaryConfig = async () => {
    const abortController = new AbortController();
    const { signal } = abortController;

    try {
      const data = await request(getRequestUrl(`cloudinary-config`), {
        method: 'GET',
        signal,
      });

      data &&
        data.body &&
        data.body.cloudinary &&
        setCloudinaryConfig(prevConfig => ({
          ...prevConfig,
          ...data.body.cloudinary,
        }));
    } catch (err) {
      if (err.code !== 20) {
        strapi.notification.error(`${settingsPluginId}.error.record.fetch`);
      }
    }
  };

  return (
    <Wrapper>
      <Button
        primary
        onClick={handleCloudinaryInsert}
        disabled={
          !externalScriptLoaded && cloudinaryConfig && !this.props.disabled
        }
      >
        {externalScriptLoaded && cloudinaryConfig
          ? 'Přidat soubor'
          : 'Načítám Cloudinary'}
      </Button>
      {files.length > 0 && (
        <Button primary onClick={handleRemoveAllFiles}>
          Odstranit vše
        </Button>
      )}
      <hr />

      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {Array.isArray(files) &&
            files.map((image, index) => {
              const {
                url,
                public_id,
                resource_type,
                type,
                format,
                context: { custom: { alt = '', caption = '' } = {} } = {},
              } = image;
              return (
                <FileCard
                  key={public_id}
                  removeItem={e => {
                    e.preventDefault();
                    handleFileRemove(index);
                  }}
                  moveItem={handleFileMove}
                  clickItem={e => {
                    e.preventDefault();
                    handleFileClick({
                      asset: {
                        resource_id: `${resource_type}/${type}/${public_id}`,
                      },
                    });
                  }}
                  {...{
                    url,
                    format,
                    public_id,
                    handleInputChange,
                    alt,
                    caption,
                    index,
                  }}
                />
              );
            })}
        </div>
      </DndProvider>
    </Wrapper>
  );
};

InputJSON.defaultProps = {
  disabled: false,
  onBlur: () => {},
  onChange: () => {},
  value: null,
};

InputJSON.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default InputJSON;
