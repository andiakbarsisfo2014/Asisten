const protocol = 'https';
const address = 'gowtechno.com/akbar-app/web-API';
const API = address + '/public/api/';
const filePath = address + '/public';

export default {
    link: protocol + '://' + API,
    img_url: protocol + '://' + address,
    file_url: protocol + '://' + filePath
}