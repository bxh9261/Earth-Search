function downloadFile(url,callbackRef){
    const xhr = new XMLHttpRequest();
    //set onerror
    xhr.onerror = (e) => 
    {
        console.log("error");
    }
    
    
    //set onload
    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        callbackRef(jsonString);
    };
    
    xhr.onloadend = function() {
        if(xhr.status == 404) {
            throw new Error(url + ' replied 404');
        }  
    }   
    
    //oppen connect
    xhr.open("GET",url);
    
    xhr.send();
}

export {downloadFile};