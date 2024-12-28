import React, {useState} from 'react';
import WardropeApp from "./WardrobeApp";
import { TaskBar, List } from '@react95/core';
import { ReaderClosed, WindowsExplorer, Explorer108, Pbrush1, MsawtAwtIcon, Awfxcg321304, Amovie2, CdMusic, Mshearts1, Star } from '@react95/icons';
import './desktop.css'

function Desktop(){

    const [showWardrobe, setIsWardrobeOpen] = useState(true);

    const toggleOpenWardrobe = () => {
        setIsWardrobeOpen(!showWardrobe);
    }
    return(
        <div className="desktop">
            <TaskBar
            list={
                <List> 
                    <List.Item icon={<ReaderClosed variant="32x32_4" />}>
                        Local Disk (C:)
                    </List.Item>
                    <List.Item icon={<WindowsExplorer variant="32x32_4" />}>
                        Windows Explorer
                    </List.Item>
                </List>
            }
            />
            {showWardrobe && <WardropeApp toggle={showWardrobe}/>}
            <div className="desktop-icons">
                <div className="inactive-icon">
                    <Explorer108 variant="32x32_4" />
                    <p>Recycle Bin</p>
                </div>
                <div className={"inactive-icon"}>
                    <Pbrush1 variant="32x32_4" />
                    <p>Paint</p>
                </div>
                <div
                    className="inactive-icon">
                    <Awfxcg321304 variant="32x32_4" />
                    <p>My Contacts</p>
                </div>
                <div
                    className="inactive-icon">
                    <Amovie2 variant="32x32_4" />
                    <p>Rom Coms</p>
                </div>
                <div
                    className="inactive-icon">
                    <CdMusic variant="32x32_4" />
                    <p>Music</p>
                </div>
                <div
                    className="inactive-icon">
                    <Mshearts1 variant="32x32_4" />
                    <p>Shhh...</p>
                </div>
                <div
                    className="active-icon" onDoubleClick={toggleOpenWardrobe}>
                    <Star variant="32x32_4" />
                    <p>Wardrobe</p>
                </div>
            </div>
        </div>
    )
}

export default Desktop;