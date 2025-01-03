import React from 'react';
import { Frame, List, Modal, TitleBar, Button,} from '@react95/core';
import { Star } from "@react95/icons";
import './wardrobe.css'; 
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import FilterDropdown from './FilterDropdown'
import EditClothesModal from './EditClothesModal';

export default function WardropeApp(props: { toggle: boolean; }) {
    const toggleShowWardrobe = props.toggle;
    const [isEditClothesModalOpen, setIsEditClothesModalOpen] = useState<boolean>(false);
   
    const closeEditClothesModal = () => {
      setIsEditClothesModalOpen(false);
    }

    const handleOpenEditClothesModal = () => {
      setIsEditClothesModalOpen(true);
    }

    const windowHeight = window.innerHeight;
    let windowSmall = true;
    if (windowHeight > 680) {
      windowSmall = false;
    }

    const screenW = window.innerWidth * 0.06;
    const screenH = -30;

    const handleCloseWardrobe = () => {
        toggleShowWardrobe(false);
    };

    // load wardrobe
    const [completeWardrobe, setCompleteWardrobe] = useState<string[]>([]);
    const [currentWardrobeSelection, setCurrentWardrobeSelection] = useState<string[]>(completeWardrobe);
    const [currentTops, setCurrentTops] = useState<string[]>([]);
    const [currentBottoms, setCurrentBottoms] = useState<string[]>([]);
    const [currentShoes, setCurrentShoes] = useState<string[]>([]);
    const [currentTopIndex, setCurrentTopIndex] = useState<number>(0);
    const [currentBottomIndex, setCurrentBottomIndex] = useState<number>(0);
    const [currentShoeIndex, setCurrentShoeIndex] = useState<number>(0);
    const [disableTopNextButton, setDisableTopNextButton] = useState<boolean>(true);
    const [disableTopPrevButton, setDisableTopPrevButton] = useState<boolean>(true);
    const [disableBottomNextButton, setDisableBottomNextButton] = useState<boolean>(true);
    const [disableBottomPrevButton, setDisableBottomPrevButton] = useState<boolean>(true);
    const [disableShoeNextButton, setDisableShoeNextButton] = useState<boolean>(true);
    const [disableShoePrevButton, setDisableShoePrevButton] = useState<boolean>(true);
    const [weatherDropdownOpen, setWeatherDropdownOpen] = useState(false);
    const [selectedWeatherFilters, setSelectedWeatherFilters] = useState<string[]>(["Show All"]);
    const [occasionDropdownOpen, setOccasionDropdownOpen] = useState(false);
    const [selectedOccasionFilters, setSelectedOccasionFilters] = useState<string[]>(["Show All"]);
    const weatherFilterOptions = ["Show All", "Hot", "Warm", "Windy", "Rainy"];
    const occasionFilterOptions = ["Show All", "Work", "Dinner", "Party", "Active", "Everyday", "Family"];

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const fetchWardrobe = async () => { 
        try {
          const response = await axios.get('http://localhost:5000/getExistingWardrobe')
    
          const allClothes = response.data;
          setCompleteWardrobe(allClothes);
          setCurrentWardrobeSelection(allClothes);
          const allTops = allClothes.filter(item => item.toLowerCase().includes("top"))
          const allBottoms = allClothes.filter(item => item.toLowerCase().includes("bottom"))
          const allShoes = allClothes.filter(item => item.toLowerCase().includes("shoe"))
          setCurrentBottoms(allBottoms);
          setCurrentTops(allTops);
          setCurrentShoes(allShoes);
          setCurrentTopIndex(0)
          setCurrentBottomIndex(0);
          setCurrentShoeIndex(0);
  
          if (allTops.length > 1){
            setDisableTopNextButton(false);
          };
          if (allBottoms.length > 1){
            setDisableBottomNextButton(false);
          };
          if (allShoes.length > 1){
            setDisableShoeNextButton(false);
          };
  
        }
        catch(error) {
          console.error(error.response);
          alert(error.response.data);
        }
      }

      fetchWardrobe();
    }, []);

    useEffect(() => {
      updateNextandPrevButtons('top', currentTopIndex);
      updateNextandPrevButtons('bottom', currentBottomIndex);
      updateNextandPrevButtons('shoe', currentShoeIndex);

    }, [currentTops, 
      currentBottoms, 
      currentShoes, 
      currentTopIndex, 
      currentBottomIndex, 
      currentShoeIndex,
      disableTopPrevButton,
      disableTopNextButton,
      disableBottomPrevButton,
      disableBottomNextButton,
      disableShoePrevButton,
      disableShoeNextButton
    ])

    const getNextPhoto = (clothingType: string) => {
      // based on clothing type edit different next states
      switch (clothingType) {
        case "top":
          const updatedTopIndex = currentTopIndex + 1;
          setCurrentTopIndex(updatedTopIndex)
          updateNextandPrevButtons('top', updatedTopIndex);
          break;

        case "bottom":
          const updatedBottomIndex = currentBottomIndex + 1;
          setCurrentBottomIndex(updatedBottomIndex)
          updateNextandPrevButtons('bottom', updatedBottomIndex);
          break;

        case "shoe":
          const updatedShoeIndex = currentShoeIndex + 1;
          setCurrentShoeIndex(updatedShoeIndex)
          updateNextandPrevButtons('shoe', updatedShoeIndex);
          break;
          
        default:
          break;
      }
    }

    const getPrevPhoto = (clothingType: string) => {
        switch (clothingType) {
        case "top":
          const updatedTopIndex = currentTopIndex - 1;
          setCurrentTopIndex(updatedTopIndex)
          updateNextandPrevButtons('top', updatedTopIndex);
          break;

        case "bottom":
          const updatedBottomIndex = currentBottomIndex - 1;
          setCurrentBottomIndex(updatedBottomIndex)
          updateNextandPrevButtons('bottom', updatedBottomIndex);
          break;

        case "shoe":
          const updatedShoeIndex = currentShoeIndex - 1;
          setCurrentShoeIndex(updatedShoeIndex)
          updateNextandPrevButtons('shoe', updatedShoeIndex);
          break;

        default:
          break;
      }
    }

    const updateNextandPrevButtons = (clothingType: string, currentIndex: number) => {
      switch (clothingType) {
        case "top":
          // if this is now the last image, disable the next button
          if (currentIndex == (currentTops.length - 1)){
            setDisableTopNextButton(true);
          }

          // if this is no longer the first image, enable the previous button
          if (currentIndex > 0){
            setDisableTopPrevButton(false);
          }

          // if this is now the first image, disable the prev button
          if (currentIndex == 0){
            setDisableTopPrevButton(true);
          }

          // if this is no longer the last image, enable the next button
          if (currentIndex < (currentTops.length - 1)){
            setDisableTopNextButton(false);
          }
          break;

        case "bottom":
          // if this is now the last image, disable the next button
          if (currentIndex == (currentBottoms.length - 1)){
            setDisableBottomNextButton(true);
          }

          // if this is no longer the first image, enable the previous button
          if (currentIndex > 0){
            setDisableBottomPrevButton(false);
          }

          // if this is now the first image, disable the prev button
          if (currentIndex == 0){
            setDisableBottomPrevButton(true);
          }

          // if this is no longer the last image, enable the next button
          if (currentIndex < (currentBottoms.length - 1)){
            setDisableBottomNextButton(false);
          }
          break;

        case "shoe":
          // if this is now the last image, disable the next button
          if (currentIndex == (currentShoes.length - 1)){
            setDisableShoeNextButton(true);
          }

          // if this is no longer the first image, enable the previous button
          if (currentIndex > 0){
            setDisableShoePrevButton(false);
          }

          // if this is now the first image, disable the prev button
          if (currentIndex == 0){
            setDisableShoePrevButton(true);
          }

          // if this is no longer the last image, enable the next button
          if (currentIndex < (currentShoes.length - 1)){
            setDisableShoeNextButton(false);
          }
          break;

        default:
          break;
      }
    }

    const getRandomOutfit = () => {
      // get a random index for the top and bottom
      const randomTopIndex = Math.floor(Math.random() * currentTops.length);
      const randomBottomIndex = Math.floor(Math.random() * currentBottoms.length);
      const randomShoeIndex = Math.floor(Math.random() * currentShoes.length);


      //save current indexes as the new random ones
      setCurrentTopIndex(randomTopIndex);
      setCurrentBottomIndex(randomBottomIndex);
      setCurrentShoeIndex(randomShoeIndex);

      // update the buttons
      updateNextandPrevButtons('top', randomTopIndex);
      updateNextandPrevButtons('bottom', randomBottomIndex);
      updateNextandPrevButtons('shoe', randomShoeIndex);
    }

    const toggleWeatherDropdown = () => {
      setWeatherDropdownOpen(!weatherDropdownOpen);
    };

    const toggleOccasionDropdown = () => {
      setOccasionDropdownOpen(!occasionDropdownOpen);
    };

    const handleWeatherSelectionChange = (newSelection: string[]) => {
      setSelectedWeatherFilters(newSelection);
      filterWardrobe('weather', newSelection);
    };

    const handleOccasionSelectionChange = (newSelection: string[]) => {
        setSelectedOccasionFilters(newSelection);
        filterWardrobe('occasion', newSelection);
    };

    const filterWardrobe = (category: string, newSelection: string[]) => {
      let combinedFilters = [""];
      switch (category) {
        case 'occasion':
          if (newSelection.includes("Show All") && selectedWeatherFilters.includes("Show All")){
            showEntireWardrobe()
            return;
          } else {
            combinedFilters = [...selectedWeatherFilters, ...newSelection];
          }
          break;
        case 'weather':
          if (newSelection.includes("Show All") && selectedOccasionFilters.includes("Show All")){
            showEntireWardrobe()
            return;
          } else {
            combinedFilters = [...newSelection, ...selectedOccasionFilters];
          }
          break;
      }
      // remove all show alls
      if (combinedFilters.includes("Show All")){
        combinedFilters = combinedFilters.filter(filter => filter != "Show All")
      }
      const filteredWardrobe = completeWardrobe.filter((clothingItem) => {
        return combinedFilters.every(filterSelection => clothingItem.toLowerCase().includes(filterSelection.toLowerCase()));
      });
            
      setCurrentWardrobeSelection(filteredWardrobe);
      setCurrentTops(filteredWardrobe.filter(item => item.toLowerCase().includes("top")));
      setCurrentBottoms(filteredWardrobe.filter(item => item.toLowerCase().includes("bottom")));
      setCurrentShoes(filteredWardrobe.filter(item => item.toLowerCase().includes("shoe")));
      setCurrentBottomIndex(0);
      setCurrentTopIndex(0);
      setCurrentShoeIndex(0);
    }

    const showEntireWardrobe = () => {
      console.log("showing entire wardrobe");
      
      setCurrentWardrobeSelection(completeWardrobe);
      setCurrentTops(completeWardrobe.filter(item => item.toLowerCase().includes("top")));
      setCurrentBottoms(completeWardrobe.filter(item => item.toLowerCase().includes("bottom")));
      setCurrentShoes(completeWardrobe.filter(item => item.toLowerCase().includes("shoe")));
      setCurrentBottomIndex(0);
      setCurrentTopIndex(0);
      setCurrentShoeIndex(0);
    }

    function saveClothingFilters(oldFileName: string, newFileName: string): void {
      const completeWardrobeIndex = completeWardrobe.findIndex(fileName => fileName === oldFileName);
      if (completeWardrobeIndex !== -1) {
        const updatedWardrobe = [...completeWardrobe];
        updatedWardrobe[completeWardrobeIndex] = newFileName;
        setCompleteWardrobe(updatedWardrobe);
      }

      const currentWardrobeSelectionIndex = currentWardrobeSelection.findIndex(fileName => fileName === oldFileName);
      if (currentWardrobeSelectionIndex !== -1) {
        const updatedWardrobe = [...completeWardrobe];
        updatedWardrobe[currentWardrobeSelectionIndex] = newFileName;
        setCurrentWardrobeSelection(updatedWardrobe);
      }
    }
    
    // TODO: FIX LATER  
    const handleDropdownSelect = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger file explorer
      }
    };
  
    // TODO: FIX LATER 
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      console.log(files)
      if (files) {
        const fileNames = Array.from(files).map((file) => file.name);
        console.log(fileNames);

        // Send file names to backend
        try {
          const response = await axios.post("http://localhost:5000/upload", {
            fileNames,
          });
          console.log("Fetched clothes: ", response)
          setCurrentTopIndex(response.data.firstTopPath);
        } catch (error) {
          console.error("Error uploading files:", error);
        }
      }
    };

    return(
        <>
        <Modal
        width="800px"
        height={windowSmall ? "470px" : "600px"}
        icon={<Star variant="16x16_4" />}
        title="Kombe's Wardrobe"
        dragOptions={{
          defaultPosition: {
            x: screenW,
            y: screenH,
          },
        }}
        titleBarOptions={[
          <TitleBar.Help key="help" onClick={() => alert("Help!")} />,
          <Modal.Minimize />,
          <TitleBar.Close key="close" onClick={handleCloseWardrobe} />,
        ]}
        menu={[
          {
            name: "File",
            list: (
              <List width="200px" className="dropdown-menu">
                {/* <List.Item key="exit-item">
                  Load Wardrobe
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    {...{ webkitdirectory: "true" } as any} // Allows folder selection
                    onChange={handleFileChange} />
                </List.Item> */}
                <List.Item key="exit-item" onClick={handleCloseWardrobe}>
                  Exit
                </List.Item>
              </List>
            ),
          },
          {
            name: "Edit",
            list: (
              <List width="200px" className="dropdown-menu">
                <List.Item key="edit-filters-item" onClick={handleOpenEditClothesModal}>Edit Clothes Filters</List.Item>
              </List>
            ),
          },
        ]}
      >
        <div
          style={windowSmall ? { height: "91.5%" } : { height: "93.8%", display: 'flex', flexDirection: 'row' }}
          className='wardrobe-window'
        >
          {/* Frame for the entire outfit*/}
          <Frame
            w="65%"
            h="100%"
            bgColor="$material"
            boxShadow="$out"
            padding="$4"
          >
            <Frame h="100%" bgColor="white" boxShadow="$in" overflow="auto" className='outfit-frame'>
              <div className='clothing-element-frame'>
                <Button disabled={disableTopPrevButton} onClick={() => getPrevPhoto('top')}>Prev</Button>
                <div className='tops-frame'>
                  <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                    <img className='clothing-image' src={`http://localhost:5000/wardrobe/${currentTops[currentTopIndex]}`} alt="top" />
                  </Frame>
                </div>
                <Button disabled={disableTopNextButton} onClick={() => getNextPhoto('top')}>Next</Button>

                {/* <div className='jackets-frame'>
        <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
            Jackets
        </Frame>
        
    </div> */}
              </div>
              <div className='clothing-element-frame'>
                <Button disabled={disableBottomPrevButton} onClick={() => getPrevPhoto('bottom')}>Prev</Button>
                <div className='bottoms-frame'>
                  <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                    <img className='clothing-image' src={`http://localhost:5000/wardrobe/${currentBottoms[currentBottomIndex]}`} alt="bottom" />
                  </Frame>
                </div>
                <Button disabled={disableBottomNextButton} onClick={() => getNextPhoto('bottom')}>Next</Button>
              </div>

              <div className='clothing-element-frame'>
                <Button disabled={disableShoePrevButton} onClick={() => getPrevPhoto('shoe')}>Prev</Button>
                <div className='shoes-frame'>
                  <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                    <img className='clothing-image' src={`http://localhost:5000/wardrobe/${currentShoes[currentShoeIndex]}`} alt="bottom" />  
                  </Frame>
                </div>
                <Button disabled={disableShoeNextButton} onClick={() => getNextPhoto('shoe')}>Next</Button>
              </div>
            </Frame>

          </Frame>
          {/*Frame for buttons*/}
          <Frame
            w="35%"
            h="100%"
            bgColor="$material"
            boxShadow="$out"
            padding="$4"
          >
            <div className='options-section'>
              <Button className='options-button' id='random-outfit-button' onClick={getRandomOutfit}>Random Outfit</Button>
              <Button className='options-button' id='weather-button' onClick={toggleWeatherDropdown}>Weather</Button>
              {weatherDropdownOpen && (<FilterDropdown
                label="Select Weather Filters"
                onSelectionChange={handleWeatherSelectionChange}
                options={weatherFilterOptions}
                currentSelections={selectedWeatherFilters} />
              )}
              <Button className='options-button' id='occasion-button' onClick={toggleOccasionDropdown}>Occasion</Button>
              {occasionDropdownOpen && (<FilterDropdown
                label="Select Occasion Filters"
                onSelectionChange={handleOccasionSelectionChange}
                options={occasionFilterOptions}
                currentSelections={selectedOccasionFilters} />
              )}
            </div>
          </Frame>

        </div>
      </Modal>

      {isEditClothesModalOpen && <EditClothesModal 
          onSave={saveClothingFilters}
          onClose={closeEditClothesModal}
          topFileName={`${currentTops[currentTopIndex]}`}
          bottomFileName={`${currentBottoms[currentBottomIndex]}`}
          shoeFileName={`${currentShoes[currentShoeIndex]}`}
          occasionFilterOptions={occasionFilterOptions.filter(option => option.toLowerCase() !== "show all")}
          weatherFilterOptions={weatherFilterOptions.filter(option => option.toLowerCase() !== "show all")}
        />}
      
      </>
    )
}