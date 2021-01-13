import React from 'react';

const procol = 'http';
// const address = 'gowtechno.com/akbar-app/web-API';
const address = '192.168.137.1/web-asisten';
const API =  address+'/public/api/';
const filePath = address + '/public';


export default {
    link : procol+'://'+API,
    img_url : procol+'://'+address,
    file_url : procol+'://'+filePath
}