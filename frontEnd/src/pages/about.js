import React from 'react';
import data from "../assets/about.json"; 

export const About = () => {
    const aboutDate = data;

    console.log(aboutDate)

    return <div><pre>{ JSON.stringify(aboutDate, null, 2) }</pre></div>;
};
