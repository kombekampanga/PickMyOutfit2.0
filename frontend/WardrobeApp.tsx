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
    const [wardrobe, setWardrobe] = useState<string[]>([]);
    const [tops, setTops] = useState<string[]>([]);
    const [bottoms, setBottoms] = useState<string[]>([]);
    const [currentTop, setCurrentTop] = useState<string>("");
    const [currentBottom, setCurrentBottom] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const fetchWardrobe = async () => { 
        try {
          const response = await axios.get('http://localhost:5000/getExistingWardrobe')
  
          console.log('Response:', response.data);

          const allClothes = response.data;
          setWardrobe(allClothes);
          const allTops = allClothes.filter(item => item.toLowerCase().includes("top"))
          const allBottoms = allClothes.filter(item => item.toLowerCase().includes("bottom"))
          const firstTop = allTops[0]
          const firstBottom = allBottoms[0]
          setBottoms(allBottoms);
          setTops(allTops);
          setCurrentTop(firstTop)
          setCurrentBottom(firstBottom);
  
        }
        catch(error) {
          console.error(error.response);
          alert(error.response.data);
        }
      }
      fetchWardrobe();
    }, []);
    
      
    const handleDropdownSelect = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click(); // Trigger file explorer
      }
    };
  
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
          setCurrentTop(response.data.firstTopPath);
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
                  <List.Item key="exit-item" onClick={handleDropdownSelect}>
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
                    <Button>Prev</Button>
                    <div className='tops-frame'>
                        <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                            <img className='clothing-image' src={`http://localhost:5000/wardrobe/${currentTop}`} alt="top" />
                        </Frame>
                    </div>
                    <Button>Next</Button>

                    {/* <div className='jackets-frame'>
                        <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                            Jackets
                        </Frame>
                        
                    </div> */}
                </div>
                <div className='clothing-element-frame'>
                    <Button>Prev</Button>
                    <div className='bottoms-frame'>
                        <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                          <img className='clothing-image' src={`http://localhost:5000/wardrobe/${currentBottom}`} alt="top" />
                        </Frame>
                    </div>
                    <Button>Next</Button>
                </div>
                
                <div className='clothing-element-frame'>
                    <Button>Prev</Button>
                    <div className='shoes-frame'>
                    <Frame w="100%" h="100%" bgColor="$material" boxShadow="$out" padding="$4">
                        Shoes
                    </Frame>
                    </div>
                    <Button>Next</Button>
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