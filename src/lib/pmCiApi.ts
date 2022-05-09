
import { AxiosResponse } from 'axios';
//@ts-ignore
import {LocalFileData} from 'get-file-object-from-local-path';
//@ts-ignore
import axios from 'axios';
const API = {
    'root': `https://ci.pluginmachine.dev`,
    'sign': `/api/upload/sign`,
    'ack': `/api/upload/ack`
}

//Adapted from vapor-js
//https://github.com/laravel/vapor-js/blob/6d0d7f0dd957019c0cd493ee0569851f709208b6/src/index.js
const Vapor = {
    //@ts-ignore
    store: async (file, options: {
        contentType: string;
        fileName:string;
        bucket?: string;
        expires?:number;
        data?: any;
        headers?: any;
        options?: any;
        progress?: (progress: number) => void;
    } ) =>{
        const response = await axios.post(`${API.root}${API.sign}`, {
            'bucket': options.bucket || '',
            'content_type': options.contentType,
            'expires': options.expires || '',
            'visibility': 'private',
            ...options.data
        }, {
            headers: options.headers || {},
            ...options.options
        });
        let headers = response.data.headers;
        if ('Host' in headers) {
            delete headers.Host;
        }

        if (typeof options.progress === 'undefined') {
            options.progress = () => {};
        }

        await axios.put(response.data.url, file, {
            headers: headers,
            onUploadProgress: (progressEvent) => {
                //@ts-ignore
                options.progress(progressEvent.loaded / progressEvent.total);
            }
        })

        response.data.extension = options.fileName.split('.').pop()

        return response.data;
    }
}

function pmCiApi(token:string){
    const headers ={
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    return {
        uploadVersion(
            filePath:string,
            pluginId: number
        ):Promise<LocalFileData>{
            const file = new LocalFileData(filePath);
            let options = {
                contentType: file.type,
                fileName: file.name,
                //@ts-ignore
                progress: progress => {
                    console.log({progress});
                },
                headers
            };
            return new Promise( (resolve,reject) => {
                //Upload file
                Vapor.store(require('fs').readFileSync(filePath), options).catch(e => console.log({e}))
                    .then((response:void|AxiosResponse) => {
                        if( response && [400,401,403,500,501,502,503].includes(response.status)){
                            reject({message: response.statusText});
                        }
                        axios.post(`${API.root}${API.ack}`, {
                            //@ts-ignore
                            uuid: response.uuid,
                            //@ts-ignore
                            key: response.key,
                            name: file.name,
                            pluginId,
                        },{headers}).then( (r:void|AxiosResponse) => {
                            if(r && r.data.uuid){
                                //@ts-ignore
                                resolve({uuid:r.data.uuid,url:r.data.url});
                            }
                            reject(false);
                        })
                    });
            });

        }
    }
}




export default pmCiApi;
