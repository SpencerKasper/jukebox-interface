import React, {useState} from "react";
import {useHistory} from "react-router";
import {Button, Divider, Drawer, List, ListItem, ListItemText} from "@material-ui/core";

export const Sidebar = () => {
    const [isSideBarOpen, updateIsSideBarOpen] = useState(false);
    const history = useHistory();

    return <React.Fragment key={'left'}>
        <Button onClick={() => updateIsSideBarOpen(true)}>{'MENU'}</Button>
        <Drawer anchor={'left'} open={isSideBarOpen} onClose={() => updateIsSideBarOpen(false)}>
            <div role="presentation"
                 onClick={() => updateIsSideBarOpen(false)}
                 onKeyDown={() => updateIsSideBarOpen(false)}
            >
                <List>
                    {['Home'].map((text, index) => (
                        <ListItem onClick={() => history.push('/')} button key={text}>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
                <List>
                    {['Ambient Mode Settings'].map((text, index) => (
                        <ListItem onClick={() => history.push('/ambientSetUp')} button key={text}>
                            <ListItemText primary={text}/>
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    </React.Fragment>;
}