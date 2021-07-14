import * as map from "./map.js";

//generates popup text
function generateInfoString(population, languages, capital){
    let info = "";
    info += "Population: " + population.toLocaleString();
    
    info += "<br>";
    
    if(languages.length > 0){
        info += "Languages: ";
        for(let i = 0; i < languages.length-1; i++){
            info += languages[i].name + ", ";
        }
        info += languages[languages.length-1].name;
    }
    
    info += "<br>";
    
    if(capital !== ""){
        info += "Capital: " + capital;
    }
    
    return info;
}

//generaties flag and country name button in the results box
function generateSideNavInfo(coordinates, name, population, languages, capital, flag){
    let results = document.querySelector("#results");
    let goToButton = document.createElement("button");
    let flagImg = document.createElement("img");
    let node = document.createTextNode(name);
    
    flagImg.src = flag;
    
    goToButton.onclick = () => {
        map.setZoomLevel(6);
        map.setPitchAndBearing(0,0);
        map.flyTo(coordinates);
        map.openPopup(name);
    }
    
    goToButton.setAttribute("class", "country");
    goToButton.appendChild(flagImg);
    goToButton.appendChild(node);
    results.appendChild(goToButton);
}




/* Set the width of the side navigation to 250px */
//Some of this code comes from https://www.w3schools.com/howto/howto_js_collapse_sidepanel.asp
function openNav() {
  document.querySelector("#filterNav").style.width = "28%";
  let openbtn = document.querySelector(".openbtn");
  openbtn.onclick = closeNav;
  openbtn.style.left = "28%";
}

/* Set the width of the side navigation to 0 */
//Some of this code comes from https://www.w3schools.com/howto/howto_js_collapse_sidepanel.asp
function closeNav() {
  document.querySelector("#filterNav").style.width = "0";
  let openbtn = document.querySelector(".openbtn");
  openbtn.onclick = openNav;
  openbtn.style.left = "0px";
}


export{generateInfoString, openNav, closeNav, generateSideNavInfo};