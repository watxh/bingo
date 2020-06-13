import styled from "styled-components";
import React, { Component } from "react"
import axios from "axios"
import { useState } from "react";

import Board from "../organisms/Board"
import Topbar from "../organisms/Topbar"

const Main = () =>{

    return(
        <>
        <Topbar/>
        <Board/>
        </>
    )
} 

export default Main;