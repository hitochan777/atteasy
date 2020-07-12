import React from "react"
import {
    Link,
    useRouteMatch
} from "react-router-dom";
import { Menu } from 'semantic-ui-react'


type ItemType = "log" | "history"

function useActiveItem(): ItemType {
    const match = useRouteMatch()
    console.log(match)
    if (match.path === "/") {
        return "log"
    } else if (match.path === "/history") {
        return "history"
    }
    return "log"
}

export const Navbar = () => {
    const activeItem = useActiveItem()
    return <Menu>
        <Menu.Item header>Attcy</Menu.Item>
        <Link to="/">
            <Menu.Item
                name='log'
                active={activeItem === "log"}
            />
        </Link>
        <Link to="/history">
            <Menu.Item
                name='history'
                active={activeItem === "history"}
            />
        </Link>
    </Menu>
}