import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as utils from "./utils.js";

let poi;
let all = true;
let input, popinput, greatbtn, languages, zoomin, zoomout, results;

function loadPOI(url,name="",greater=true,pop=0,langChoice="All"){
    map.clearMarkers();
    results = document.querySelector("#results");
    statusBox(results, "loading");
    function poiLoaded(jsonString){
        poi = JSON.parse(jsonString);
        results.innerHTML = "";
    
        for (let i = 0; i < poi.length; i++){
            //if a country meets all the criteria, show it on screen and in the nav menu. This is a big big mighty mess.
            if(((poi[i].name.toLowerCase().includes(name.toLowerCase())) || (name == "")) &&
               (poi[i].latlng.length > 0) &&
               ((greater && poi[i].population > pop) || (!greater && poi[i].population < pop)) &&
               (poi[i].languages.findIndex(x => x.name === langChoice) > -1 || langChoice == "All")){
                
                map.addMarker(
                    [poi[i].latlng[1],poi[i].latlng[0]], poi[i].name, utils.generateInfoString(poi[i].population,poi[i].languages,poi[i].capital), "poi",poi[i].flag);
            
                
                utils.generateSideNavInfo(
                    [poi[i].latlng[1],poi[i].latlng[0]],
                    poi[i].name, 
                    poi[i].population,
                    poi[i].languages,
                    poi[i].capital, 
                    poi[i].flag
                );
            }
            else{
                poi.splice(i,1);
                i--;
            }
        }
        
        if(poi.length == 0 || ajax.error){
            statusBox(results, "noresults");
        }
        
        if(all){
            setupLangDropdown();
            searchbtn.click();
            all = false;
        }
        
        

    }
    
    ajax.downloadFile(url,poiLoaded);
}

//"Loading" or "No Results!"
function statusBox(resultsBox, which){
    let goToButton = document.createElement("button");
    let node;
    if(which == "loading"){
        let flagImg = document.createElement("img");
        flagImg.src = "images/spinner.gif";
        node = document.createTextNode("Loading...");
        goToButton.appendChild(flagImg);
    }
    else{
        node = document.createTextNode("No results!");
    }
    goToButton.setAttribute("class", "country");
    goToButton.appendChild(node);
    resultsBox.appendChild(goToButton);
}

//gets all languages from every country, and puts them in a list. I originally hard coded this but this way allows changes if the API is updated with new language information. This way is also less bad in general.
function setupLangDropdown(){
        languages = document.querySelector("#languages");
        let langList = [];
    
          for(let p of poi){
            if(p.languages.length > 0){
                for(let lang of p.languages){
                    if(!langList.includes(lang.name)){
                        langList.push(lang.name);
                    }
                }
            }
          }  
        langList.sort();
        
        for(let lang of langList){
            let option = document.createElement("option");
            option.text = lang;
            languages.add(option);
        }
}


//setup onclicks for buttons
function setupUI(){
  // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
  input = document.querySelector("#input");
  popinput = document.querySelector("#popinput");
  greatbtn = document.querySelector("#greater");
  languages = document.querySelector("#languages");
  zoomin = document.querySelector("#plus");
  zoomout = document.querySelector("#minus");
  results = document.querySelector("#results");

  btn1.onclick = () => {
      if(poi.length > 0){
            map.setZoomLevel(6);
            map.setPitchAndBearing(0,0);
            let randCountry = Math.floor(Math.random() * poi.length);
            map.flyTo([poi[randCountry].latlng[1],poi[randCountry].latlng[0]]);
            map.openPopup(poi[randCountry].name);
      }
  }
  
  btn2.onclick = () => {
      map.setZoomLevel();
      map.setPitchAndBearing(0,0);
      map.flyTo();
  }
  
  document.querySelector(".openbtn").onclick = utils.openNav;
    
  zoomin.onclick = () => {
      map.setZoomLevel(map.getZoomLevel()+1);
  }
  
  zoomout.onclick = () => {
      map.setZoomLevel(map.getZoomLevel()-1);
  }
    
  searchbtn.onclick = () => {
      results.innerHTML = "";
      let srch = input.value;
      localStorage.setItem("bxh9261country", srch);
      let nameURL = "https://restcountries.eu/rest/v2/all";
      let pop = Number(popinput.value);
      localStorage.setItem("bxh9261pop", popinput.value);
      let greatBool = greatbtn.checked;
      if(greatBool){
          localStorage.setItem("bxh9261greaterless", "greater");
      }
      else{
          localStorage.setItem("bxh9261greaterless", "less");
      }
      let langChoice = languages.options[languages.selectedIndex].text;
      localStorage.setItem("bxh9261lang", langChoice);
      
      loadPOI(nameURL,srch,greatBool,pop,langChoice);
  }
  
  resetbtn.onclick = () => {
      results.innerHTML = "";
      localStorage.setItem("bxh9261country", "");
      localStorage.setItem("bxh9261pop", "0");
      localStorage.setItem("bxh9261lang", "All");
      localStorage.setItem("bxh9261greaterless", "greater");
      let nameURL = "https://restcountries.eu/rest/v2/all";
      
      input.value = "";
      popinput.value = "0";
      languages.value = "All";
      greatbtn.checked = true;
      
      loadPOI(nameURL,"",true,0,"All");
  }
}

//store local data for search filters
function storeLocal(){
    if (typeof(Storage) !== "undefined") {
        if (!localStorage.bxh9261country) {
            localStorage.setItem("bxh9261country", "");
        }
        
        if (!localStorage.bxh9261pop) {
            localStorage.setItem("bxh9261pop", "0");
        }
        
        if (!localStorage.bxh9261lang) {
            localStorage.setItem("bxh9261lang", "All");
        }
        if (!localStorage.bxh9261greaterless) {
            localStorage.setItem("bxh9261greaterless", "greater");
        }
        
        // Retrieve
        input.value = localStorage.getItem("bxh9261country");
        popinput.value = localStorage.getItem("bxh9261pop");
        languages.value = localStorage.getItem("bxh9261lang");
        if(localStorage.getItem("bxh9261greaterless") == "greater"){
            greatbtn.checked = true;
        }
        else{
            document.querySelector("#less").checked = true;
        }
    }
}

function init(){
    map.initMap();
    setupUI();
    storeLocal();
    if(!poi){
        loadPOI("https://restcountries.eu/rest/v2/all","",true,0,"All");
    }
}

export {init};