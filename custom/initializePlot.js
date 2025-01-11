function hidePlot() {
    document.getElementById('plot').style.display = 'none';
    document.getElementById('buttonInfo').innerHTML = "";
    map.removeLayer(punkte_abtasten);
}

function hidePlotWS() {
    document.getElementById('plotWS').style.display = 'none';
    document.getElementById('buttonInfo').innerHTML = "";
}

function showPlot() {
    document.getElementById('plot').style.display = 'block'; // or 'inline', depending on your layout
    document.getElementById('buttonInfo').innerHTML = "";    
}

function showPlotWS() {
    document.getElementById('plotWS').style.display = 'block'; // or 'inline', depending on your layout   
    document.getElementById('buttonInfo').innerHTML = "";    
}

// Get the button and diagram elements
var button = document.getElementById("toggleButton");
var button2 = document.getElementById("toggleZoomButton");
var button3 = document.getElementById("toggleZoomButton2");
var diagram = document.getElementById("plot");
var diagramWS = document.getElementById("plotWS");

// Add an event listener to the button
button.addEventListener("click", function() {
    if (diagram.style.display === "none" && legendAdded) {
        document.getElementById('buttonInfo').innerHTML = "Bitte, klicken Sie ein Radolan-Pixel an.";
        map.addLayer(punkte_abtasten);
    } else {
        diagram.style.display = 'none';
        map.removeLayer(punkte_abtasten);
    }
    
    if (diagramWS.style.display === "none" && !legendAdded) {
        document.getElementById('buttonInfo').innerHTML = "Bitte, klicken Sie einen Pegelpunkt an.";
        map.removeLayer(punkte_abtasten);
        map.addLayer(punkte_pegel);
    } else{
        document.getElementById('plotWS').style.display = 'none';
    }

});
button2.addEventListener("click", function() {
    if (diagramWS.style.display === "none") {
        document.getElementById('buttonInfo').innerHTML = "Bitte, klicken Sie einen Pegelpunkt an.";
    }
    });
    
button3.addEventListener("click", function() {
    if (diagramWS.style.display === "none") {
        document.getElementById('buttonInfo').innerHTML = "Bitte, klicken Sie einen Pegelpunkt an.";
    }
    });

//Initialisation
hidePlot();
hidePlotWS();

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
function keepOpen() { 
    document.getElementById("mySidenav").style.width = "250px";
}
/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}


function hideElements() { 
    document.getElementById("rightOutputs").classList.add("invisible"); 
    document.getElementById("rangeRow").classList.add("invisible"); 
    document.getElementById("buttonRow").classList.add("invisible"); 
    document.getElementById("plot").classList.add("invisible"); 
    document.getElementById("plotWS").classList.add("invisible"); 
    hidePlot();
    legend.remove();
    legendAdded = false;
}

function showElements() { 
    document.getElementById("rightOutputs").classList.remove("invisible"); 
    document.getElementById("rangeRow").classList.remove("invisible"); 
    document.getElementById("buttonRow").classList.remove("invisible"); 
    document.getElementById("plot").classList.remove("invisible"); 
    document.getElementById("plotWS").classList.remove("invisible"); 
    legend.addTo(map); //this is small Niederschlagslegend to the bottom left
    legendAdded = true;
}

function showNiederschlag() { // Implement the functionality for Niederschlag 
    //alert("Showing Niederschlag information..."); 
    //window.location.href = "index.html";
    showElements();
    
    document.getElementById('toggleZoomButton').classList.add("invisible"); 
    document.getElementById('toggleZoomButton2').classList.add("invisible");
    lay.remove(); //this removes old, not collapsed layer legend
    lay = L.control.layers.tree(null, overlaysTree,{collapsed: true,}); //this collapses layer legend
    lay.addTo(map); //this executes legend collapse by adding new one
    if (map.hasLayer(punkte_abtasten)) {
    map.removeLayer(punkte_abtasten);
    };
    if (map.hasLayer(punkte_pegel)) {
        map.removeLayer(punkte_pegel);
    };
    hidePlot();
    hidePlotWS();
    document.getElementById('buttonInfo').innerHTML = "Bitte, bewegen Sie den Zeitschieber.";


}

function showWasserstand() { // Implement the functionality for Wasserstand 
    //alert("Showing Wasserstand information..."); 
    hideElements();
    document.getElementById("buttonRow").classList.remove("invisible");
    document.getElementById("plotWS").classList.remove("invisible"); 
    document.getElementById('toggleZoomButton').classList.remove("invisible");
    document.getElementById('toggleZoomButton2').classList.remove("invisible");
    lay.remove(); //this removes old, not collapsed layer legend
    lay = L.control.layers.tree(null, overlaysTree,{collapsed: true,}); //this collapses layer legend
    lay.addTo(map); //this executes legend collapse by adding new one
    layers.forEach(function(layer) { //remove all Niederschlagrasters, radolan and icon
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    }
    });
    map.removeLayer(punkte_abtasten);
    map.addLayer(punkte_pegel);
    hidePlot();
    hidePlotWS();
}

function showHome() {
    hideElements();     
    lay.remove(); //this removes old layer legend
    lay = L.control.layers.tree(null, overlaysTree,{collapsed: false,}); //this uncollapses layer legend to make more impression about all layers
    lay.addTo(map); //this executes legend by adding new one
    layers.forEach(function(layer) { //remove Niederschlagrasters
    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    }
    });
    map.removeLayer(punkte_abtasten); 
    map.removeLayer(punkte_pegel);
}

function refreshPage(){
    //alert("Work in progress...");
    //window.location.reload();
    history.go(0);
} 

showWasserstand()