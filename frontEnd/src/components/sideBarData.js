import React from 'react';
import * as IoIcons from 'react-icons/io';
import * as TyIcons from 'react-icons/ti';
import * as BsIcons from 'react-icons/bs';
import * as SiIcons from 'react-icons/si';

export const SidebarData = [
  {
    title: 'Weather',
    path: '/home/weather',
    icon: <TyIcons.TiWeatherPartlySunny />,
  },
  {
    title: 'LastFm',
    path: '/home/lastfm',
    icon: <BsIcons.BsMusicNoteList />,
  },
  {
    title: 'Nasa',
    path: '/home/nasa',
    icon: <IoIcons.IoMdPlanet />,
  },
  {
    title: 'Gmail',
    path: '/home/gmail',
    icon: <SiIcons.SiGmail />,
  }
];
