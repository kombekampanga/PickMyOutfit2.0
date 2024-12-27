import React, { useEffect, useState } from "react";
import { Frame, Modal, TitleBar, Button, Alert,} from '@react95/core';
import {Hourglass} from 'react95';
import { Winpopup3 } from "@react95/icons";
import FilterDropdown from "./FilterDropdown";
import './EditClothesModal.css';
import axios from "axios";

interface EditClothesModalProps {
    onSave: (oldFileName: string, newFileName: string) => void;
    onClose: () => void;
    topFileName: string;
    bottomFileName: string;
    shoeFileName: string;
    weatherFilterOptions: string[];
    occasionFilterOptions: string[];
}

export default function EditClothesModal(props: EditClothesModalProps) {
    const weatherFilterOptions = props.weatherFilterOptions;
    const occasionFilterOptions = props.occasionFilterOptions;

    const getExistingFilters = async (existingFileName: string, ) => {
      const indexOfFullStop = existingFileName.indexOf(".");
      const existingFilters = existingFileName.slice(0, indexOfFullStop).split(",");
      const existingWeatherFilters = weatherFilterOptions.filter((weatherOption) => 
        existingFilters.some(filter => filter.trim().toLowerCase() === weatherOption.trim().toLowerCase())
      );
      const existingOccasionFilters = occasionFilterOptions.filter((occasionOption) => 
        existingFilters.some(filter => filter.trim().toLowerCase() === occasionOption.trim().toLowerCase())
      );
  
      return [existingWeatherFilters, existingOccasionFilters]
    }

    const [selectedTopWeatherFilters, setSelectedTopWeatherFilters] = useState<string[]>([]);
    const [selectedTopOccasionFilters, setSelectedTopOccasionFilters] = useState<string[]>([]);
    const [selectedBottomWeatherFilters, setSelectedBottomWeatherFilters] = useState<string[]>([]);
    const [selectedBottomOccasionFilters, setSelectedBottomOccasionFilters] = useState<string[]>([]);
    const [selectedShoeWeatherFilters, setSelectedShoeWeatherFilters] = useState<string[]>([]);
    const [selectedShoeOccasionFilters, setSelectedShoeOccasionFilters] = useState<string[]>([]);
    const [newTopFileName, setNewTopFileName] = useState<string>("")
    const [newBottomFileName, setNewBottomFileName] = useState<string>("")
    const [newShoeFileName, setNewShoeFileName] = useState<string>("")
    const [showCloseConfirmation, setShowCloseConfirmation] = useState<boolean>(false);
    const [showSaveConfirmation, setShowSaveConfirmation] = useState<boolean>(false); 
    const [showLoading, setShowLoading] = useState<boolean>(false);

    const toggleCloseConfirmation = (isShowing: boolean) => {
      setShowCloseConfirmation(isShowing);
    }

    const toggleSaveConfirmation = (isShowing: boolean) => {
      setShowSaveConfirmation(isShowing);
    }

    const toggleLoading = (isShowing: boolean) => {
      setShowLoading(isShowing);
    }

    useEffect(() => {
      const fetchFilters = async () => {
        const [topWeatherFilters, topOccasionFilters] = await getExistingFilters(props.topFileName);
        const [bottomWeatherFilters, bottomOccasionFilters] = await getExistingFilters(props.bottomFileName);
        const [shoeWeatherFilters, shoeOccasionFilters] = await getExistingFilters(props.shoeFileName);
  
        setSelectedTopWeatherFilters(topWeatherFilters);
        setSelectedTopOccasionFilters(topOccasionFilters);
        setSelectedBottomWeatherFilters(bottomWeatherFilters);
        setSelectedBottomOccasionFilters(bottomOccasionFilters);
        setSelectedShoeWeatherFilters(shoeWeatherFilters);
        setSelectedShoeOccasionFilters(shoeOccasionFilters);
      };
  
      fetchFilters();
    }, [props.topFileName, props.bottomFileName, props.shoeFileName]);

    const windowHeight = window.innerHeight;
    let windowSmall = true;
    if (windowHeight > 680) {
      windowSmall = false;
    }

    const screenW = window.innerWidth * 0.06;
    const screenH = -30;

    const handleTopWeatherSelectionChange = (newSelection: string[]) => {
      setSelectedTopWeatherFilters(newSelection);
    };

    const handleTopOccasionSelectionChange = (newSelection: string[]) => {
      setSelectedTopOccasionFilters(newSelection);
    };

    const handleBottomWeatherSelectionChange = (newSelection: string[]) => {
      setSelectedBottomWeatherFilters(newSelection);
    };

    const handleBottomOccasionSelectionChange = (newSelection: string[]) => {
      setSelectedBottomOccasionFilters(newSelection);
    };

    const handleShoeWeatherSelectionChange = (newSelection: string[]) => {
      setSelectedShoeWeatherFilters(newSelection);
    };

    const handleShoeOccasionSelectionChange = (newSelection: string[]) => {
      setSelectedShoeOccasionFilters(newSelection);
    };

  const createNewFileName = (currentFileName: string, selectedFilters: string[]) => {
    const indexOfFullStop = currentFileName.indexOf(".")
    const fileSuffix = currentFileName.slice(indexOfFullStop).toLowerCase()
    const filePrefix = currentFileName.includes(",")
      ? currentFileName.slice(0, currentFileName.indexOf(",")).toLocaleLowerCase()
      : currentFileName.slice(0, indexOfFullStop).toLowerCase()
    const filtersString = selectedFilters.join(",").trim().toLowerCase();

    if (filtersString.length == 0){
      return filePrefix + fileSuffix;
    }

    return filePrefix + "," + filtersString + fileSuffix;
  }

  const getFileName = () => {
    const newTopName = createNewFileName(props.topFileName, [...selectedTopWeatherFilters, ...selectedTopOccasionFilters])
    const newBottomName = createNewFileName(props.bottomFileName, [...selectedBottomWeatherFilters, ...selectedBottomOccasionFilters])
    const newShoeName = createNewFileName(props.shoeFileName, [...selectedShoeWeatherFilters, ...selectedShoeOccasionFilters])

    setNewTopFileName(newTopName)
    setNewBottomFileName(newBottomName)
    setNewShoeFileName(newShoeName)

    console.log("new names: top - " + newTopFileName)
    console.log("new names: bottom - " + newBottomFileName)
    console.log("new names: shoe - " + newShoeFileName)
  }

  const saveFilters = async () => {

    const currentTopFileName = props.topFileName;
    const currentBottomFileName = props.bottomFileName;
    const currentShoeFileName = props.shoeFileName;
    const newTopFileName = createNewFileName(props.topFileName, [...selectedTopWeatherFilters, ...selectedTopOccasionFilters])
    const newBottomFileName = createNewFileName(props.bottomFileName, [...selectedBottomWeatherFilters, ...selectedBottomOccasionFilters])
    const newShoeFileName = createNewFileName(props.shoeFileName, [...selectedShoeWeatherFilters, ...selectedShoeOccasionFilters])
      
      try {
        toggleLoading(true);
      
        const renameFile = async (currentFileName: string, newFileName: string) => {
          console.log(`Renaming file from ${currentFileName} to ${newFileName}`);
          const response = await axios.post("http://localhost:5000/rename-file", {
            currentFileName,
            newFileName,
          });
          console.log(response.data); // File renamed successfully
        };
      
        const renameOperations = [
          renameFile(currentTopFileName, newTopFileName),
          renameFile(currentBottomFileName, newBottomFileName),
          renameFile(currentShoeFileName, newShoeFileName),
        ];
      
        await Promise.all(renameOperations);
      
        alert("All files renamed successfully");
        props.onSave(currentTopFileName, newTopFileName);
        props.onClose();
      } catch (error) {
        alert(error.message);
        console.error("Error renaming files:", error.response?.data || error.message);
      } finally {
        toggleLoading(false);
      }
    }
    

  function handleCloseAlert(): void {
    toggleCloseConfirmation(false);
    props.onClose();
    
  }

  const openSaveFiltersConfirmation = () => {
    toggleSaveConfirmation(true);
  }

    return(
        <div className="edit-clothes-view bring-to-front">
          <Modal
            width="700px"
            height={windowSmall ? "420px" : "550px"}
            icon={<Winpopup3 variant="16x16_4" />}
            title="Edit Clothing Filters"
            dragOptions={{
              defaultPosition: {
                x: screenW,
                y: screenH,
              },
            }}
            titleBarOptions={[
              <TitleBar.Help key="help" onClick={() => alert("Update the filters saved on these clothes so they show up correctly when you filter your wardrobe!")} />,
              <TitleBar.Close key="close" onClick={() => toggleCloseConfirmation(true)} />,
            ]}
        >
          <div
            style={windowSmall ? { height: "91.5%" } : { height: "96%", display: 'flex', flexDirection: 'row' }}
            className='edit-clothes-window'
          >
            {/* Frame for the entire outfit*/}
            <Frame
              w="40%"
              h="100%"
              bgColor="$material"
              boxShadow="$out"
              padding="$4"
            >
              <Frame h="100%" bgColor="white" boxShadow="$in" overflow="auto" className='outfit-frame'>
                <div className='clothing-element-frame'>
                  <div className='tops-frame'>
                    <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                      <img className='clothing-image' src={`http://localhost:5000/wardrobe/${props.topFileName}`} alt="top" />
                    </Frame>
                  </div>
                  {/* <div className='jackets-frame'>
          <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
              Jackets
          </Frame>
          
      </div> */}
                </div>
                <div className='clothing-element-frame'>
                  <div className='bottoms-frame'>
                    <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                      <img className='clothing-image' src={`http://localhost:5000/wardrobe/${props.bottomFileName}`} alt="bottom" />
                    </Frame>
                  </div>
                </div>

                <div className='clothing-element-frame'>
                  <div className='shoes-frame'>
                    <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                      <img className='clothing-image' src={`http://localhost:5000/wardrobe/${props.shoeFileName}`} alt="shoe" />
                    </Frame>
                  </div>
                </div>
              </Frame>

            </Frame>
            {/*Frame for options*/}
            <div className='settings-section'>
              <Frame
                w="100%"
                h="90%"
                bgColor="$material"
                boxShadow="$out"
                padding="$4"
              >
                <div className="filters-section scrollable-container">
                  <TitleBar width="75%" style={{ marginTop: "200px" }} title="Select Filters for Top"></TitleBar>
                  <div className='options'>
                    <FilterDropdown
                      label="Select Weather Filters"
                      onSelectionChange={handleTopWeatherSelectionChange}
                      options={weatherFilterOptions}
                      currentSelections={selectedTopWeatherFilters} />
                    <FilterDropdown
                      label="Select Occasion Filters"
                      onSelectionChange={handleTopOccasionSelectionChange}
                      options={occasionFilterOptions}
                      currentSelections={selectedTopOccasionFilters} />
                  </div>
                  <TitleBar width="75%" title="Select Filters for Bottom"></TitleBar>
                  <div className='options'>
                    <FilterDropdown
                      label="Select Weather Filters"
                      onSelectionChange={handleBottomWeatherSelectionChange}
                      options={weatherFilterOptions}
                      currentSelections={selectedBottomWeatherFilters} />
                    <FilterDropdown
                      label="Select Occasion Filters"
                      onSelectionChange={handleBottomOccasionSelectionChange}
                      options={occasionFilterOptions}
                      currentSelections={selectedBottomOccasionFilters} />
                  </div>
                  <TitleBar width="75%" title="Select Filters for Shoes"></TitleBar>
                  <div className='options'>
                    <FilterDropdown
                      label="Select Weather Filters"
                      onSelectionChange={handleShoeWeatherSelectionChange}
                      options={weatherFilterOptions}
                      currentSelections={selectedShoeWeatherFilters} />
                    <FilterDropdown
                      label="Select Occasion Filters"
                      onSelectionChange={handleShoeOccasionSelectionChange}
                      options={occasionFilterOptions}
                      currentSelections={selectedShoeOccasionFilters} />
                  </div>
                </div>

              </Frame>
              <Frame
                w="100%"
                h="100%"
                bgColor="$material"
                boxShadow="$out"
                padding="$4"
              >
                <div className="buttons">
                  <Button className="close-button"onClick={() => toggleCloseConfirmation(true)}>Close Without Saving</Button>
                  <Button className="save-button" onClick={openSaveFiltersConfirmation}>Save</Button>
                </div>
              </Frame>
            </div>
          </div>
          </Modal>
      
      {showCloseConfirmation && <Alert className="bring-to-front" title="Closing Edit Modal" type={'warning'} message="Are you sure you want to close?" hasSound={false} 
        buttons={[{
          value: 'OK',
          onClick: handleCloseAlert
        },
        {
          value: 'Go Back',
          onClick: () => toggleCloseConfirmation(false)
        }]} />}

      { showSaveConfirmation && <Alert className="bring-to-front" title="Saving Filters" type={'warning'} message={"Are you sure you want to save?"} hasSound={false} 
        buttons={[{
          value: 'Save',
          onClick: saveFilters
        },
        {
          value: 'Get File Name',
          onClick: getFileName
        },
        {
          value: 'Go Back',
          onClick: () => toggleSaveConfirmation(false)
        }]} />}

      {showLoading && <Hourglass className="hourglass" size={64} />}
      </div>
    )

}