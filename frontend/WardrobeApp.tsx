import React from 'react';
import { Frame, List, Modal, TitleBar, Tree, Dropdown, Button,} from '@react95/core';
import { Winpopup3 } from "@react95/icons";
import './wardrobe.css'; 
import { useEffect, useRef, useState } from 'react';
import axios from "axios";

export default function WardropeApp(props: { toggle: any; }) {
    const toggleShowWardrobe = props.toggle;

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

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const fetchWardrobe = async () => { 
        try {
          const response = await axios.get('http://localhost:5000/getExistingWardrobe')
  
          console.log('Response:', response.data);
  
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

    const getNextPhoto = (clothingType: string) => {
      // based on clothing type edit different next states
      switch (clothingType) {
        case "top":
          const updatedTopIndex = currentTopIndex + 1;
          setCurrentTopIndex(updatedTopIndex)
          // if this is now the last image, disable the next button
          if (updatedTopIndex == (currentBottoms.length - 1)){
            setDisableTopNextButton(true);
          }

          // if this is no longer the first image, enable the previous button
          if (updatedTopIndex > 0){
            setDisableTopPrevButton(false);
          }
          break;

        case "bottom":
          const updatedBottomIndex = currentBottomIndex + 1;
          setCurrentBottomIndex(updatedBottomIndex)

          // if this is now the last image, disable the next button
          if (updatedBottomIndex == (currentBottoms.length - 1)){
            setDisableBottomNextButton(true);
          }

          // if this is no longer the first image, enable the previous button
          if (updatedBottomIndex > 0){
            setDisableBottomPrevButton(false);
          }
          break;

        case "shoes":
          const updatedShoeIndex = currentShoeIndex + 1;
          setCurrentShoeIndex(updatedShoeIndex)
          // if this is now the last image, disable the next button
          if (updatedShoeIndex == (currentShoes.length - 1)){
            setDisableShoeNextButton(true);
          }

          // if this is no longer the first image, enable the previous button
          if (updatedShoeIndex > 0){
            setDisableShoePrevButton(false);
          }
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
          // if this is now the first image, disable the prev button
          if (updatedTopIndex == 0){
            setDisableTopPrevButton(true);
          }

          // if this is no longer the last image, enable the next button
          if (updatedTopIndex < (currentTops.length - 1)){
            setDisableTopNextButton(false);
          }
          break;

        case "bottom":
          const updatedBottomIndex = currentBottomIndex - 1;
          setCurrentBottomIndex(updatedBottomIndex)
          // if this is now the first image, disable the prev button
          if (updatedBottomIndex == 0){
            setDisableBottomPrevButton(true);
          }

          // if this is no longer the last image, enable the next button
          if (updatedBottomIndex < (currentBottoms.length - 1)){
            setDisableBottomNextButton(false);
          }
          break;

        case "shoes":
          const updatedShoeIndex = currentShoeIndex - 1;
          setCurrentShoeIndex(updatedShoeIndex)
          // if this is now the first image, disable the prev button
          if (currentShoeIndex == 0){
            setDisableShoePrevButton(true);
          }

          // if this is no longer the last image, enable the next button
          if (updatedShoeIndex < (currentShoes.length - 1)){
            setDisableShoeNextButton(false);
          }
          break;

        default:
          break;
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
        <Modal
          width="800px"
          height={windowSmall ? "470px" : "600px"}
          icon={<Winpopup3 variant="16x16_4" />}
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
                  <List.Item key="exit-item" >
                    Load Wardrobe
                      <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: "none" }}
                      {...{ webkitdirectory: "true" } as any} // Allows folder selection
                      onChange={handleFileChange}
                    />
                  </List.Item>
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
                  <List.Item key="copy-item">Copy</List.Item>
                </List>
              ),
            },
          ]}
        >
          <div
            style={windowSmall ? { height: "91.5%" } : { height: "93.8%", display: 'flex', flexDirection: 'row'}}
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
                          <img className='clothing-image' src={`http://localhost:5000/wardrobe/${currentBottoms[currentBottomIndex]}`} alt="top" />
                        </Frame>
                    </div>
                    <Button disabled={disableBottomNextButton} onClick={() => getNextPhoto('bottom')}>Next</Button>
                </div>
                
                <div className='clothing-element-frame'>
                    <Button disabled={disableShoePrevButton} onClick={() => getPrevPhoto('shoe')}>Prev</Button>
                    <div className='shoes-frame'>
                    <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                        Shoes
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
                <Button className='options-button' id='random-outfit-button'>Random Outfit</Button>
                <Button className='options-button' id='weather-button'>Weather</Button>           
                <Button className='options-button' id='occasion-button'>Occasion</Button>
             </div>
             </Frame>
            
            </div>
        </Modal>
    )
}