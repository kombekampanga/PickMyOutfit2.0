import WardropeApp from "./WardrobeApp";
import { TaskBar, List } from '@react95/core';
import { ReaderClosed, WindowsExplorer } from '@react95/icons';
import './desktop.css'

function Desktop(){
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
            <WardropeApp toggle={true}/>

        </div>
    )
}

export default Desktop;