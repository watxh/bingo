import styled from "styled-components";
import React, { Component, useState } from "react";
import axios from 'axios';

import Example from "../molecules/Example"
import Exmake from "../molecules/Exmake"
import Success from "../molecules/Success"

import download from "downloadjs"
import * as htmlToImage from 'html-to-image';
import moment from "moment"

import { storage } from '../../firebase'

const Makingsection = () => {

    const [title, setTitle] = useState("제목");
    const [subtitle, setSubtitle] = useState("부제목");

    const [backcolor, setBackcolor] = useState("#000000");
    const [titlecolor, setTitlecolor] = useState("#ffffff");
    const [subtitlecolor, setSubtitlecolor] = useState("#ffffff");

    const [bingoarray, setBingoarray] = useState([{word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}, {word:""}]);

    const [address, setAddress] = useState("");
    const [issuccess, setIssuccess] = useState(0);

    const [rownum, setRownum] = useState("1");
    const [columnnum, setColumnnum] = useState("1");

    const [image, setImage] = useState("");
    const [imageURL, setImageURL] = useState("");

    const [like, setLike] = useState(4);

    const changetitle = (name) => {
        setTitle(name);
    }

    const changesubtitle = (name) => {
        setSubtitle(name);
    }

    const changebackcolor = (color) => {
        setBackcolor(color);
    }

    const changetitlecolor = (color) => {
        setTitlecolor(color);
    }

    const changesubtitlecolor = (color) => {
        setSubtitlecolor(color);
    }

    const changecolnum = (e) => {
        setColumnnum(e);
    }

    const changerownum = (e) => {
        setRownum(e);
    }

    const changebingoarray = (con, num) => {
        setBingoarray(() => {
            let newarray = [...bingoarray];
            newarray[num] = { word: con };
            return newarray;
        });
    }

    const changesuccess = (e) =>{
        imageStorage(e);
    }

    function randomStr(m) {
        var m = m || 9; 
        var s = '';
        var r = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
        return s;
    };

    const imageStorage = async(e) => {
        var name = moment().format('YYYYMMDDHHmmss') + "_" + e.name;
        const uploadTask = storage.ref(`images/${name}`).put(e);
        uploadTask.on(
            "state_changed",
            snapshot=> {},
            error => {
                console.log(error);
            },
            ()=>{
                storage
                    .ref("images")
                    .child(name)
                    .getDownloadURL()
                    .then(url => {
                        postdata(url);
                    })
            }
        )
    }

    const postdata = async(url) =>{
        var id = "/" + randomStr(5);
        const params = new URLSearchParams({
            id,
            title,
            subtitle,
            backcolor: (Object.entries(backcolor)[1][1]),
            titlecolor: (Object.entries(titlecolor)[1][1]),
            subtitlecolor: (Object.entries(subtitlecolor)[1][1]),
            imageURL: url,
        });

        for(let i = 0; i < 25; i++){
            if(bingoarray[i].word != undefined){
                params.append('bingoarray', bingoarray[i].word);
            }
        }

        params.append('like', like);

        /*params.append('id', id);
        params.append('title', title);
        params.append('subtitle', subtitle);
        params.append('backcolor', (Object.entries(backcolor)[1][1]));
        params.append('titlecolor', (Object.entries(titlecolor)[1][1]));
        params.append('subtitlecolor', (Object.entries(subtitlecolor)[1][1]));*/

        const a = await axios.post('http://localhost:3001/users/b', params);
        console.log(a);
        setAddress(id);

        setIssuccess(1);
    }

    // const downloadimage = () => {
    //     htmlToImage.toPng(document.getElementById('all'))
    //         .then(function (dataUrl) {
    //             download(dataUrl, 'my-node.png');
    //         });
    // }

    // const downloadimageP = () => {
    //     downloadimage();
    // }

    return (
        <>
            <div>
                <Example
                    title={title}
                    subtitle={subtitle}
                    backcolor={backcolor}
                    titlecolor={titlecolor}
                    subtitlecolor={subtitlecolor}
                    bingoarray={bingoarray}
                    changerownum={changerownum}
                    changecolnum={changecolnum}
                    >
                </Example>
            </div>
            <Centerline></Centerline>
            <Exmake
                changetitle={changetitle}
                changesubtitle={changesubtitle}
                changebackcolor={changebackcolor}
                changetitlecolor={changetitlecolor}
                changesubtitlecolor={changesubtitlecolor}
                changebingoarray={changebingoarray}
                bingoarray={bingoarray}
                changesuccess={changesuccess}
                rownum={rownum}
                columnnum={columnnum}
            />
            {issuccess===1 ? <Success props = {address}/>:<></>}
        </>
    );
}

const Centerline = styled.div`
    position:fixed;
    width:2.5px;
    height:100%;
    background-color:black;
    left:50%;
`;

export default Makingsection;