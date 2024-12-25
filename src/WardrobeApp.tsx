import { Frame, List, Modal, TitleBar, Tree, Dropdown, Button,} from '@react95/core';
import { Winpopup3, Progman45 } from "@react95/icons";
import './wardrobe.css'; 

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
                            Tops
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
                            Bottoms
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